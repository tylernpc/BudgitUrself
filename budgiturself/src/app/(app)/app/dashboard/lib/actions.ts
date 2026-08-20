"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/auth/dal";
import { nameSchema } from "@/lib/auth/schemas";
import { db } from "@/lib/db";
import { budgetRepository } from "@/lib/budget/prisma-budget-repository";
import {
  bankBalanceSchema,
  billSchema,
  billUpdateSchema,
  creditCardSchema,
  creditCardUpdateSchema,
  monthlyExpenseSchema,
  monthlyIncomeSchema,
  oneOffExpenseSchema,
} from "@/lib/budget/schemas";

export interface ActionResult {
  error?: string;
}

const DASHBOARD_PATH = "/app/dashboard";

/**
 * Server Actions never trust a client-side `safeParse` alone. The action is
 * a public endpoint reachable by anything that can call it with the right
 * shape, not just the dialog that happens to render it, so every action
 * re-validates with the same Zod schema the dialog already used, then
 * resolves the current user via the DAL (establishing ownership) before it
 * ever reaches the repository.
 */

export async function updateNameAction(input: unknown): Promise<ActionResult> {
  const parsed = nameSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid name" };
  }

  const user = await requireCurrentUser();
  await db.user.update({
    where: { id: user.id },
    data: { firstName: parsed.data.firstName, lastName: parsed.data.lastName },
  });
  revalidatePath(DASHBOARD_PATH);
  return {};
}

export async function setBankBalanceAction(input: unknown): Promise<ActionResult> {
  const parsed = bankBalanceSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid amount" };
  }

  const user = await requireCurrentUser();
  await budgetRepository.setBankBalance(user.id, parsed.data.bankBalance);
  revalidatePath(DASHBOARD_PATH);
  return {};
}

export async function setMonthlyIncomeAction(input: unknown): Promise<ActionResult> {
  const parsed = monthlyIncomeSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid amount" };
  }

  const user = await requireCurrentUser();
  await budgetRepository.setMonthlyIncome(user.id, parsed.data.monthlyIncome);
  revalidatePath(DASHBOARD_PATH);
  return {};
}

export async function addCreditCardAction(input: unknown): Promise<ActionResult> {
  const parsed = creditCardSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the values above" };
  }

  const user = await requireCurrentUser();
  await budgetRepository.addCreditCard(user.id, parsed.data);
  revalidatePath(DASHBOARD_PATH);
  return {};
}

export async function updateCreditCardAction(input: unknown): Promise<ActionResult> {
  const parsed = creditCardUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the values above" };
  }

  const user = await requireCurrentUser();
  await budgetRepository.updateCreditCard(user.id, parsed.data);
  revalidatePath(DASHBOARD_PATH);
  return {};
}

export async function removeCreditCardAction(id: string): Promise<ActionResult> {
  const user = await requireCurrentUser();
  await budgetRepository.removeCreditCard(user.id, id);
  revalidatePath(DASHBOARD_PATH);
  return {};
}

export async function addOneOffExpenseAction(input: unknown): Promise<ActionResult> {
  const parsed = oneOffExpenseSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the values above" };
  }

  const user = await requireCurrentUser();
  await budgetRepository.addOneOffExpense(user.id, parsed.data);
  revalidatePath(DASHBOARD_PATH);
  return {};
}

export async function removeOneOffExpenseAction(id: string): Promise<ActionResult> {
  const user = await requireCurrentUser();
  await budgetRepository.removeOneOffExpense(user.id, id);
  revalidatePath(DASHBOARD_PATH);
  return {};
}

export async function addMonthlyExpenseAction(input: unknown): Promise<ActionResult> {
  const parsed = monthlyExpenseSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the values above" };
  }

  const user = await requireCurrentUser();
  await budgetRepository.addMonthlyExpense(user.id, parsed.data);
  revalidatePath(DASHBOARD_PATH);
  return {};
}

export async function removeMonthlyExpenseAction(id: string): Promise<ActionResult> {
  const user = await requireCurrentUser();
  await budgetRepository.removeMonthlyExpense(user.id, id);
  revalidatePath(DASHBOARD_PATH);
  return {};
}

export async function addBillAction(input: unknown): Promise<ActionResult> {
  const parsed = billSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the values above" };
  }

  const user = await requireCurrentUser();
  await budgetRepository.addBill(user.id, parsed.data);
  revalidatePath(DASHBOARD_PATH);
  return {};
}

export async function updateBillAction(input: unknown): Promise<ActionResult> {
  const parsed = billUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the values above" };
  }

  const user = await requireCurrentUser();
  await budgetRepository.updateBill(user.id, parsed.data);
  revalidatePath(DASHBOARD_PATH);
  return {};
}

export async function removeBillAction(id: string): Promise<ActionResult> {
  const user = await requireCurrentUser();
  await budgetRepository.removeBill(user.id, id);
  revalidatePath(DASHBOARD_PATH);
  return {};
}
