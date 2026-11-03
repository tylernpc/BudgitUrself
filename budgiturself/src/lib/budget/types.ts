export interface CreditCard {
  id: string;
  name: string;
  balance: number;
  limit: number;
}

/** A curated set, not an open-ended icon library — keeps the picker a fixed grid. */
export const EXPENSE_ICON_KEYS = [
  "home",
  "utensils",
  "car",
  "zap",
  "heart",
  "shopping-bag",
  "dumbbell",
  "graduation-cap",
  "plane",
  "smartphone",
  "wifi",
  "tv",
  "gamepad-2",
  "dog",
  "baby",
  "wrench",
  "gift",
  "coffee",
  "briefcase",
  "book-open",
  "bus",
  "fuel",
  "umbrella",
  "shirt",
  "stethoscope",
  "pill",
  "film",
  "music",
  "camera",
  "laptop",
  "bike",
  "piggy-bank",
  "receipt",
  "shopping-cart",
  "pizza",
  "sofa",
] as const;

export type ExpenseIconKey = (typeof EXPENSE_ICON_KEYS)[number];

/** Matches the app's existing `tone-*` design tokens, so it never drifts from the palette used elsewhere. */
export const EXPENSE_COLOR_KEYS = [
  "violet",
  "sky",
  "emerald",
  "rose",
  "indigo",
  "amber",
  "cyan",
] as const;

export type ExpenseColorKey = (typeof EXPENSE_COLOR_KEYS)[number];

export interface MonthlyExpense {
  id: string;
  name: string;
  amount: number;
  spent: number;
  icon: ExpenseIconKey;
  color: ExpenseColorKey;
}

export type BillType = "digital" | "personal" | "recurring";

interface BillBase {
  id: string;
  name: string;
  amount: number;
  chargeDate: number;
}

export interface DigitalBill extends BillBase {
  type: "digital";
  cardId: string;
  category: string;
}

export interface PersonalBill extends BillBase {
  type: "personal";
  owedTo: string;
}

/** A fixed-amount recurring charge with no card or person attached — rent, insurance, and the like. */
export interface RecurringBill extends BillBase {
  type: "recurring";
}

export type Bill = DigitalBill | PersonalBill | RecurringBill;

/** `Omit` collapses a union into its common members; this preserves each member. */
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export interface Budget {
  bankBalance: number;
  monthlyIncome: number;
  creditCards: CreditCard[];
  monthlyExpenses: MonthlyExpense[];
  bills: Bill[];
}

/**
 * The kinds of money movement the app journals. Stored as a Postgres enum, so
 * adding a kind is a migration — deliberately, since each one needs a label
 * and a direction (see `lib/budget/transaction-log.ts`) to render at all.
 */
export const TRANSACTION_KINDS = [
  "cardCharge",
  "expenseSpend",
  "bankAdjust",
  "incomeAdjust",
  "billAdded",
  "billRemoved",
] as const;

export type TransactionKind = (typeof TRANSACTION_KINDS)[number];

/**
 * One journal entry. Not part of `Budget` on purpose: `summarizeBudget` must
 * never read these, so the budget math cannot drift from the log — and the log
 * can be cleared without touching a single balance.
 */
export interface Transaction {
  id: string;
  kind: TransactionKind;
  /** The name of whatever this entry hit, captured at write time so it survives that row's deletion. */
  label: string;
  amount: number;
  occurredAt: Date;
}
