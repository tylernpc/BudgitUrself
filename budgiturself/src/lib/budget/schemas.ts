import { z } from "zod";
import {
  EXPENSE_COLOR_KEYS,
  EXPENSE_ICON_KEYS,
  type Bill,
  type CreditCard,
  type DistributiveOmit,
  type MonthlyExpense,
} from "@/lib/budget/types";

export const BILL_CATEGORIES = [
  "Entertainment",
  "Software",
  "Health",
  "Shopping",
  "Food & Dining",
  "Transportation",
  "Utilities",
  "Education",
  "Other",
] as const;

const name = z.string().trim().min(1, "Required").max(80);
const amount = z.coerce.number().positive("Enter an amount above zero").max(9_999_999);
const chargeDate = z.coerce.number().int().min(1, "Day must be 1-31").max(31, "Day must be 1-31");

export const monthlyExpenseSchema = z.object({
  name,
  amount,
  icon: z.enum(EXPENSE_ICON_KEYS),
  color: z.enum(EXPENSE_COLOR_KEYS),
});

export const monthlyExpenseUpdateSchema = monthlyExpenseSchema.extend({
  id: z.string().min(1),
});

export const monthlyIncomeSchema = z.object({
  monthlyIncome: z.coerce.number().min(0).max(9_999_999),
});

export const bankBalanceSchema = z.object({
  bankBalance: z.coerce.number().min(0).max(9_999_999),
});

export const creditCardSchema = z.object({
  name,
  balance: z.coerce.number().min(0).max(9_999_999),
  limit: z.coerce.number().positive("Enter a limit above zero").max(9_999_999),
});

export const creditCardUpdateSchema = z.object({
  id: z.string().min(1),
  name,
  balance: z.coerce.number().min(0).max(9_999_999),
  limit: z.coerce.number().positive("Enter a limit above zero").max(9_999_999),
});

export const creditCardChargeSchema = z.object({
  id: z.string().min(1),
  amount,
});

const digitalBill = z.object({
  type: z.literal("digital"),
  name,
  amount,
  chargeDate,
  card: z.string().min(1, "Choose a card"),
  category: z.enum(BILL_CATEGORIES),
});

const personalBill = z.object({
  type: z.literal("personal"),
  name,
  amount,
  chargeDate,
  owedTo: name,
});

const billId = z.string().min(1);

export const billSchema = z.discriminatedUnion("type", [digitalBill, personalBill]);

/** The same union, addressed to an existing row. Editing may switch the type. */
export const billUpdateSchema = z.discriminatedUnion("type", [
  digitalBill.extend({ id: billId }),
  personalBill.extend({ id: billId }),
]);

export type MonthlyExpenseInput = Omit<MonthlyExpense, "id">;
export type MonthlyExpenseUpdateInput = MonthlyExpense;
export type BillInput = DistributiveOmit<Bill, "id">;
export type BillUpdateInput = Bill;
export type CreditCardInput = Omit<CreditCard, "id">;
export type CreditCardUpdateInput = Pick<CreditCard, "id" | "name" | "balance" | "limit">;
export type CreditCardChargeInput = { id: string; amount: number };
