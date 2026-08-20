import type {
  BillInput,
  BillUpdateInput,
  CreditCardChargeInput,
  CreditCardInput,
  CreditCardUpdateInput,
  MonthlyExpenseInput,
  MonthlyExpenseUpdateInput,
} from "@/lib/budget/schemas";
import type { Bill, Budget, CreditCard, MonthlyExpense } from "@/lib/budget/types";

/**
 * Port for the Budget aggregate. Every method is scoped by `userId`; this
 * is the ownership boundary, and callers must resolve the current user (see
 * `requireCurrentUser` in `@/lib/auth/dal`) before reaching this interface.
 *
 * Signatures are expressed purely in domain types (`@/lib/budget/types`,
 * `@/lib/budget/schemas`). No Prisma-generated type may appear here. That
 * keeps this file safe to import from Server Components, Server Actions, or
 * a future non-Prisma implementation (e.g. an in-memory fake for tests)
 * without dragging `@prisma/client` into the bundle.
 */
export interface BudgetRepository {
  getBudget(userId: string): Promise<Budget>;

  setBankBalance(userId: string, bankBalance: number): Promise<void>;
  setMonthlyIncome(userId: string, monthlyIncome: number): Promise<void>;

  addCreditCard(userId: string, input: CreditCardInput): Promise<CreditCard>;
  updateCreditCard(userId: string, input: CreditCardUpdateInput): Promise<void>;
  addCreditCardCharge(userId: string, input: CreditCardChargeInput): Promise<void>;
  removeCreditCard(userId: string, id: string): Promise<void>;

  addMonthlyExpense(userId: string, input: MonthlyExpenseInput): Promise<MonthlyExpense>;
  updateMonthlyExpense(userId: string, input: MonthlyExpenseUpdateInput): Promise<void>;
  removeMonthlyExpense(userId: string, id: string): Promise<void>;

  addBill(userId: string, input: BillInput): Promise<Bill>;
  updateBill(userId: string, input: BillUpdateInput): Promise<void>;
  removeBill(userId: string, id: string): Promise<void>;
}
