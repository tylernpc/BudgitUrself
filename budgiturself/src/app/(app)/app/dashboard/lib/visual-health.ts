import { summarizeBudget, type BudgetSummary } from "@/lib/budget/calculations";
import type { Budget } from "@/lib/budget/types";

/**
 * A 0–1 "how healthy does this month look" signal, used purely to tint the
 * WebGL scenes. It reads the summary the budget math already produced and
 * never feeds back into it.
 */
export function healthFromSummary(summary: BudgetSummary, monthlyIncome: number): number {
  const scale = Math.max(monthlyIncome, Math.abs(summary.horizonView), 1);
  const ratio = Math.min(Math.max(summary.horizonView / scale, -1), 1);
  return ratio * 0.5 + 0.5;
}

export function visualHealth(budget: Budget): number {
  return healthFromSummary(summarizeBudget(budget), budget.monthlyIncome);
}
