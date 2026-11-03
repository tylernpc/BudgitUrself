import "server-only";

import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import {
  toBillCreateData,
  toBillUpdateData,
  toCreditCardCreateData,
  toCreditCardUpdateData,
  toDomainBill,
  toDomainBudget,
  toDomainCreditCard,
  toDomainMonthlyExpense,
  toDomainTransaction,
  toMonthlyExpenseCreateData,
  toMonthlyExpenseUpdateData,
  toTransactionCreateData,
} from "@/lib/budget/mappers";
import type { BudgetRepository } from "@/lib/budget/repository";
import type {
  BillInput,
  BillUpdateInput,
  CreditCardChargeInput,
  CreditCardInput,
  CreditCardUpdateInput,
  MonthlyExpenseContributionInput,
  MonthlyExpenseInput,
  MonthlyExpenseUpdateInput,
} from "@/lib/budget/schemas";

const budgetSelect = {
  bankBalance: true,
  monthlyIncome: true,
  creditCards: { orderBy: { createdAt: "asc" } },
  monthlyExpenses: { orderBy: { createdAt: "asc" } },
  bills: { orderBy: { chargeDate: "asc" } },
} satisfies Prisma.UserSelect;

/**
 * Prisma implementation of the `BudgetRepository` port. Every method takes
 * `userId` as its first argument and threads it into the `WHERE` clause:
 * for reads that means selecting through the `User` relation, for
 * mutations on child rows it means `updateMany`/`deleteMany` scoped by
 * `{ id, userId }` rather than `id` alone, so one user can never touch
 * another user's row even given its id (no ownership check would otherwise
 * exist between the Server Action boundary and the database).
 */
class PrismaBudgetRepository implements BudgetRepository {
  async getBudget(userId: string) {
    const user = await db.user.findUniqueOrThrow({
      where: { id: userId },
      select: budgetSelect,
    });

    return toDomainBudget(user);
  }

  async setBankBalance(userId: string, bankBalance: number) {
    await db.$transaction([
      db.user.update({ where: { id: userId }, data: { bankBalance } }),
      db.transaction.create({
        data: toTransactionCreateData(userId, {
          kind: "bankAdjust",
          label: "Bank balance",
          amount: bankBalance,
        }),
      }),
    ]);
  }

  async setMonthlyIncome(userId: string, monthlyIncome: number) {
    await db.$transaction([
      db.user.update({ where: { id: userId }, data: { monthlyIncome } }),
      db.transaction.create({
        data: toTransactionCreateData(userId, {
          kind: "incomeAdjust",
          label: "Monthly income",
          amount: monthlyIncome,
        }),
      }),
    ]);
  }

  async addCreditCard(userId: string, input: CreditCardInput) {
    const row = await db.creditCard.create({ data: toCreditCardCreateData(userId, input) });
    return toDomainCreditCard(row);
  }

  async updateCreditCard(userId: string, input: CreditCardUpdateInput) {
    await db.creditCard.updateMany({
      where: { id: input.id, userId },
      data: toCreditCardUpdateData(input),
    });
  }

  /**
   * Interactive rather than batched because the journal entry needs the card's
   * *name*, which `updateMany` does not hand back. Reading it inside the
   * transaction keeps ownership scoped by `userId` exactly as `updateMany`
   * did, and means the balance can never move without its entry, or vice
   * versa. A card that is not the caller's simply matches nothing, which is
   * what `updateMany` did too.
   */
  async addCreditCardCharge(userId: string, input: CreditCardChargeInput) {
    await db.$transaction(async (tx) => {
      const card = await tx.creditCard.findFirst({
        where: { id: input.id, userId },
        select: { name: true },
      });

      if (!card) {
        return;
      }

      await tx.creditCard.update({
        where: { id: input.id },
        data: { balance: { increment: input.amount } },
      });
      await tx.transaction.create({
        data: toTransactionCreateData(userId, {
          kind: "cardCharge",
          label: card.name,
          amount: input.amount,
        }),
      });
    });
  }

  async removeCreditCard(userId: string, id: string) {
    await db.creditCard.deleteMany({ where: { id, userId } });
  }

  async addMonthlyExpense(userId: string, input: MonthlyExpenseInput) {
    const row = await db.monthlyExpense.create({ data: toMonthlyExpenseCreateData(userId, input) });
    return toDomainMonthlyExpense(row);
  }

  async updateMonthlyExpense(userId: string, input: MonthlyExpenseUpdateInput) {
    await db.monthlyExpense.updateMany({
      where: { id: input.id, userId },
      data: toMonthlyExpenseUpdateData(input),
    });
  }

  /** Same shape as `addCreditCardCharge` — see the note there. */
  async addMonthlyExpenseContribution(userId: string, input: MonthlyExpenseContributionInput) {
    await db.$transaction(async (tx) => {
      const expense = await tx.monthlyExpense.findFirst({
        where: { id: input.id, userId },
        select: { name: true },
      });

      if (!expense) {
        return;
      }

      await tx.monthlyExpense.update({
        where: { id: input.id },
        data: { spent: { increment: input.amount } },
      });
      await tx.transaction.create({
        data: toTransactionCreateData(userId, {
          kind: "expenseSpend",
          label: expense.name,
          amount: input.amount,
        }),
      });
    });
  }

  async removeMonthlyExpense(userId: string, id: string) {
    await db.monthlyExpense.deleteMany({ where: { id, userId } });
  }

  /**
   * The `Bill_cardId_fkey` foreign key guarantees `cardId` names a card that
   * exists; it cannot say whose. Bills are only ever written from a picker
   * listing the caller's own cards, so a foreign id is not a user mistake and
   * gets no friendly message — it fails here rather than filing one user's
   * bill against another user's card.
   */
  private async assertOwnsCard(userId: string, input: BillInput) {
    if (input.type !== "digital") {
      return;
    }

    const card = await db.creditCard.findFirst({
      where: { id: input.cardId, userId },
      select: { id: true },
    });

    if (!card) {
      throw new Error(`Credit card ${input.cardId} does not belong to user ${userId}`);
    }
  }

  async addBill(userId: string, input: BillInput) {
    await this.assertOwnsCard(userId, input);

    const row = await db.$transaction(async (tx) => {
      const bill = await tx.bill.create({ data: toBillCreateData(userId, input) });
      await tx.transaction.create({
        data: toTransactionCreateData(userId, {
          kind: "billAdded",
          label: bill.name,
          amount: input.amount,
        }),
      });
      return bill;
    });

    return toDomainBill(row);
  }

  async updateBill(userId: string, input: BillUpdateInput) {
    await this.assertOwnsCard(userId, input);

    await db.bill.updateMany({
      where: { id: input.id, userId },
      data: toBillUpdateData(input),
    });
  }

  async removeBill(userId: string, id: string) {
    await db.$transaction(async (tx) => {
      const bill = await tx.bill.findFirst({
        where: { id, userId },
        select: { name: true, amount: true },
      });

      if (!bill) {
        return;
      }

      await tx.bill.delete({ where: { id } });
      await tx.transaction.create({
        data: toTransactionCreateData(userId, {
          kind: "billRemoved",
          label: bill.name,
          amount: bill.amount.toNumber(),
        }),
      });
    });
  }

  async listTransactions(userId: string) {
    const rows = await db.transaction.findMany({
      where: { userId },
      orderBy: { occurredAt: "desc" },
    });

    return rows.map(toDomainTransaction);
  }

  async removeTransaction(userId: string, id: string) {
    await db.transaction.deleteMany({ where: { id, userId } });
  }

  async clearTransactions(userId: string) {
    await db.transaction.deleteMany({ where: { userId } });
  }
}

/** Singleton instance, stateless aside from the shared `db` client, so one instance suffices. */
export const budgetRepository: BudgetRepository = new PrismaBudgetRepository();
