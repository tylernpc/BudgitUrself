"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/auth/dal";
import { budgetRepository } from "@/lib/budget/prisma-budget-repository";
import { billSchema, monthlyIncomeSchema, oneOffExpenseSchema } from "@/lib/budget/schemas";

export interface ActionResult {
  error?: string;
}

/**
 * Server Actions never trust a client-side `safeParse` alone. The action is
 * a public endpoint reachable by anything that can POST the right shape, not
 * just the dialog that happens to render it, so every action re-validates
 * with the same Zod schema the dialog already used, then resolves the
 * current user via the DAL (establishing ownership) before it ever reaches
 * the repository.
 */
export async function addOneOffExpenseAction(formData: FormData): Promise<ActionResult> {
  const parsed = oneOffExpenseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the values above" };
  }

  const user = await requireCurrentUser();
  await budgetRepository.addOneOffExpense(user.id, parsed.data);
  revalidatePath("/app/dashboard");
  return {};
}

export async function removeOneOffExpenseAction(id: string): Promise<ActionResult> {
  const user = await requireCurrentUser();
  await budgetRepository.removeOneOffExpense(user.id, id);
  revalidatePath("/app/dashboard");
  return {};
}

export async function addBillAction(formData: FormData): Promise<ActionResult> {
  const parsed = billSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the values above" };
  }

  const user = await requireCurrentUser();
  await budgetRepository.addBill(user.id, parsed.data);
  revalidatePath("/app/dashboard");
  return {};
}

export async function setMonthlyIncomeAction(formData: FormData): Promise<ActionResult> {
  const parsed = monthlyIncomeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the values above" };
  }

  const user = await requireCurrentUser();
  await budgetRepository.setMonthlyIncome(user.id, parsed.data.monthlyIncome);
  revalidatePath("/app/dashboard");
  return {};
}
