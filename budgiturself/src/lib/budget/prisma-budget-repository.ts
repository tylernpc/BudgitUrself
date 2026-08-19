import "server-only";

import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import {
  toBillCreateData,
  toCreditCardCreateData,
  toDomainBill,
  toDomainBudget,
  toDomainCreditCard,
  toDomainMonthlyExpense,
  toDomainOneOffExpense,
  toMonthlyExpenseCreateData,
  toOneOffExpenseCreateData,
} from "@/lib/budget/mappers";
import type { BudgetRepository } from "@/lib/budget/repository";
import type {
  BillInput,
  CreditCardInput,
  MonthlyExpenseInput,
  OneOffExpenseInput,
} from "@/lib/budget/schemas";

const budgetSelect = {
  bankBalance: true,
  monthlyIncome: true,
  creditCards: { orderBy: { createdAt: "asc" } },
  oneOffExpenses: { orderBy: { date: "desc" } },
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

  async removeCreditCard(userId: string, id: string) {
    await db.creditCard.deleteMany({ where: { id, userId } });
  }

  async addOneOffExpense(userId: string, input: OneOffExpenseInput) {
    const row = await db.oneOffExpense.create({ data: toOneOffExpenseCreateData(userId, input) });
    return toDomainOneOffExpense(row);
  }

  async removeOneOffExpense(userId: string, id: string) {
    await db.oneOffExpense.deleteMany({ where: { id, userId } });
  }

  async addMonthlyExpense(userId: string, input: MonthlyExpenseInput) {
    const row = await db.monthlyExpense.create({ data: toMonthlyExpenseCreateData(userId, input) });
    return toDomainMonthlyExpense(row);
  }

  async removeMonthlyExpense(userId: string, id: string) {
    await db.monthlyExpense.deleteMany({ where: { id, userId } });
  }

  async addBill(userId: string, input: BillInput) {
    const row = await db.bill.create({ data: toBillCreateData(userId, input) });
    return toDomainBill(row);
  }

  async removeBill(userId: string, id: string) {
    await db.bill.deleteMany({ where: { id, userId } });
  }
}

/** Singleton instance, stateless aside from the shared `db` client, so one instance suffices. */
export const budgetRepository: BudgetRepository = new PrismaBudgetRepository();
