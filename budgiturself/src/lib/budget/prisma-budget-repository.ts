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
  toMonthlyExpenseCreateData,
  toMonthlyExpenseUpdateData,
} from "@/lib/budget/mappers";
import type { BudgetRepository } from "@/lib/budget/repository";
import type {
  BillInput,
  BillUpdateInput,
  CreditCardChargeInput,
  CreditCardInput,
  CreditCardUpdateInput,
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
    await db.user.update({ where: { id: userId }, data: { bankBalance } });
  }

  async setMonthlyIncome(userId: string, monthlyIncome: number) {
    await db.user.update({ where: { id: userId }, data: { monthlyIncome } });
  }

  async addCreditCard(userId: string, input: CreditCardInput) {
    const row = await db.creditCard.create({ data: toCreditCardCreateData(userId, input) });
    return toDomainCreditCard(row);
  }

  /**
   * Digital bills reference their card by name, not id (Prisma has no
   * discriminated-union column type to hang a real relation off). A rename
   * must cascade into every bill that pointed at the old name, or those
   * bills silently orphan from the card they were charged to.
   */
  async updateCreditCard(userId: string, input: CreditCardUpdateInput) {
    await db.$transaction(async (tx) => {
      const existing = await tx.creditCard.findFirst({
        where: { id: input.id, userId },
        select: { name: true },
      });
      if (!existing) return;

      await tx.creditCard.updateMany({
        where: { id: input.id, userId },
        data: toCreditCardUpdateData(input),
      });

      if (existing.name !== input.name) {
        await tx.bill.updateMany({
          where: { userId, card: existing.name },
          data: { card: input.name },
        });
      }
    });
  }

  async addCreditCardCharge(userId: string, input: CreditCardChargeInput) {
    await db.creditCard.updateMany({
      where: { id: input.id, userId },
      data: { balance: { increment: input.amount } },
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

  async removeMonthlyExpense(userId: string, id: string) {
    await db.monthlyExpense.deleteMany({ where: { id, userId } });
  }

  async addBill(userId: string, input: BillInput) {
    const row = await db.bill.create({ data: toBillCreateData(userId, input) });
    return toDomainBill(row);
  }

  async updateBill(userId: string, input: BillUpdateInput) {
    await db.bill.updateMany({
      where: { id: input.id, userId },
      data: toBillUpdateData(input),
    });
  }

  async removeBill(userId: string, id: string) {
    await db.bill.deleteMany({ where: { id, userId } });
  }
}

/** Singleton instance, stateless aside from the shared `db` client, so one instance suffices. */
export const budgetRepository: BudgetRepository = new PrismaBudgetRepository();
