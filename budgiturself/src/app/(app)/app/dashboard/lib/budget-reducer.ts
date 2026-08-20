import type { Bill, Budget } from "@/lib/budget/types";
import type {
  BillInput,
  BillUpdateInput,
  CreditCardInput,
  CreditCardUpdateInput,
  MonthlyExpenseInput,
  MonthlyExpenseUpdateInput,
} from "@/lib/budget/schemas";

/**
 * The optimistic-UI counterpart to each Server Action in `actions.ts`. Applied
 * synchronously (via `useOptimistic`) the moment a mutation is fired, before
 * the network round-trip resolves. `id` fields on "add" variants are client-
 * generated placeholders — the real row gets its real id once the action
 * succeeds and `revalidatePath` brings the server's copy back down.
 */
export type OptimisticBudgetAction =
  | { type: "setBankBalance"; bankBalance: number }
  | { type: "setMonthlyIncome"; monthlyIncome: number }
  | { type: "addCreditCard"; id: string; input: CreditCardInput }
  | { type: "updateCreditCard"; input: CreditCardUpdateInput }
  | { type: "addCreditCardCharge"; id: string; amount: number }
  | { type: "removeCreditCard"; id: string }
  | { type: "addMonthlyExpense"; id: string; input: MonthlyExpenseInput }
  | { type: "updateMonthlyExpense"; input: MonthlyExpenseUpdateInput }
  | { type: "removeMonthlyExpense"; id: string }
  | { type: "addBill"; id: string; input: BillInput }
  | { type: "updateBill"; input: BillUpdateInput }
  | { type: "removeBill"; id: string };

export function budgetReducer(budget: Budget, action: OptimisticBudgetAction): Budget {
  switch (action.type) {
    case "setBankBalance":
      return { ...budget, bankBalance: action.bankBalance };

    case "setMonthlyIncome":
      return { ...budget, monthlyIncome: action.monthlyIncome };

    case "addCreditCard":
      return {
        ...budget,
        creditCards: [...budget.creditCards, { id: action.id, ...action.input }],
      };

    case "updateCreditCard":
      return {
        ...budget,
        creditCards: budget.creditCards.map((card) =>
          card.id === action.input.id ? { ...card, ...action.input } : card,
        ),
      };

    case "addCreditCardCharge":
      return {
        ...budget,
        creditCards: budget.creditCards.map((card) =>
          card.id === action.id ? { ...card, balance: card.balance + action.amount } : card,
        ),
      };

    case "removeCreditCard":
      return {
        ...budget,
        creditCards: budget.creditCards.filter((card) => card.id !== action.id),
      };

    case "addMonthlyExpense":
      return {
        ...budget,
        monthlyExpenses: [...budget.monthlyExpenses, { id: action.id, ...action.input }],
      };

    case "updateMonthlyExpense":
      return {
        ...budget,
        monthlyExpenses: budget.monthlyExpenses.map((expense) =>
          expense.id === action.input.id ? action.input : expense,
        ),
      };

    case "removeMonthlyExpense":
      return {
        ...budget,
        monthlyExpenses: budget.monthlyExpenses.filter((expense) => expense.id !== action.id),
      };

    case "addBill":
      return {
        ...budget,
        bills: [...budget.bills, { ...action.input, id: action.id } as Bill],
      };

    case "updateBill":
      return {
        ...budget,
        bills: budget.bills.map((bill) => (bill.id === action.input.id ? action.input : bill)),
      };

    case "removeBill":
      return {
        ...budget,
        bills: budget.bills.filter((bill) => bill.id !== action.id),
      };
  }
}
