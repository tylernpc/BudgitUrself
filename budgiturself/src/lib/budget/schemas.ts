import { z } from "zod";
import type {
  Bill,
  CreditCard,
  DistributiveOmit,
  MonthlyExpense,
  OneOffExpense,
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

export const oneOffExpenseSchema = z.object({
  name,
  amount,
  date: z.iso.date(),
});

export const monthlyExpenseSchema = z.object({
  name,
  amount,
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
  balance: z.coerce.number().min(0).max(9_999_999),
  limit: z.coerce.number().positive("Enter a limit above zero").max(9_999_999),
});

export const billSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("digital"),
    name,
    amount,
    chargeDate,
    card: z.string().min(1, "Choose a card"),
    category: z.enum(BILL_CATEGORIES),
  }),
  z.object({
    type: z.literal("personal"),
    name,
    amount,
    chargeDate,
    owedTo: name,
  }),
]);

export type OneOffExpenseInput = Omit<OneOffExpense, "id">;
export type MonthlyExpenseInput = Omit<MonthlyExpense, "id">;
export type BillInput = DistributiveOmit<Bill, "id">;
export type CreditCardInput = Omit<CreditCard, "id">;
export type CreditCardUpdateInput = Pick<CreditCard, "id" | "balance" | "limit">;
