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
  icon: ExpenseIconKey;
  color: ExpenseColorKey;
}

export type BillType = "digital" | "personal";

interface BillBase {
  id: string;
  name: string;
  amount: number;
  chargeDate: number;
}

export interface DigitalBill extends BillBase {
  type: "digital";
  card: string;
  category: string;
}

export interface PersonalBill extends BillBase {
  type: "personal";
  owedTo: string;
}

export type Bill = DigitalBill | PersonalBill;

/** `Omit` collapses a union into its common members; this preserves each member. */
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export interface Budget {
  bankBalance: number;
  monthlyIncome: number;
  creditCards: CreditCard[];
  monthlyExpenses: MonthlyExpense[];
  bills: Bill[];
}
