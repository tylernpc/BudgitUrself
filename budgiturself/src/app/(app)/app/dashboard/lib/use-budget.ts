"use client";

import { useMemo, useReducer } from "react";
import { summarizeBudget, type BudgetSummary } from "@/lib/budget/calculations";
import type { BillInput, MonthlyExpenseInput, OneOffExpenseInput } from "@/lib/budget/schemas";
import type { Budget } from "@/lib/budget/types";

export type BudgetAction =
  | { type: "setMonthlyIncome"; monthlyIncome: number }
  | { type: "addOneOffExpense"; expense: OneOffExpenseInput }
  | { type: "removeOneOffExpense"; id: string }
  | { type: "addMonthlyExpense"; expense: MonthlyExpenseInput }
  | { type: "removeMonthlyExpense"; id: string }
  | { type: "addBill"; bill: BillInput }
  | { type: "removeBill"; id: string };

const withId = <T>(value: T) => ({ ...value, id: crypto.randomUUID() });

export function budgetReducer(budget: Budget, action: BudgetAction): Budget {
  switch (action.type) {
    case "setMonthlyIncome":
      return { ...budget, monthlyIncome: action.monthlyIncome };
    case "addOneOffExpense":
      return { ...budget, oneOffExpenses: [...budget.oneOffExpenses, withId(action.expense)] };
    case "removeOneOffExpense":
      return {
        ...budget,
        oneOffExpenses: budget.oneOffExpenses.filter((expense) => expense.id !== action.id),
      };
    case "addMonthlyExpense":
      return { ...budget, monthlyExpenses: [...budget.monthlyExpenses, withId(action.expense)] };
    case "removeMonthlyExpense":
      return {
        ...budget,
        monthlyExpenses: budget.monthlyExpenses.filter((expense) => expense.id !== action.id),
      };
    case "addBill":
      return { ...budget, bills: [...budget.bills, withId(action.bill)] };
    case "removeBill":
      return { ...budget, bills: budget.bills.filter((bill) => bill.id !== action.id) };
  }
}

export function useBudget(initialBudget: Budget): {
  budget: Budget;
  summary: BudgetSummary;
  dispatch: React.Dispatch<BudgetAction>;
} {
  const [budget, dispatch] = useReducer(budgetReducer, initialBudget);
  const summary = useMemo(() => summarizeBudget(budget), [budget]);

  return { budget, summary, dispatch };
}
