import type { TransactionKind } from "@/lib/budget/types";

/** The chip shown on a log row. Short enough to sit beside the label on a phone. */
export const TRANSACTION_KIND_LABELS: Record<TransactionKind, string> = {
  cardCharge: "Card charge",
  expenseSpend: "Expense",
  bankAdjust: "Bank balance",
  incomeAdjust: "Income",
  billAdded: "Bill added",
  billRemoved: "Bill removed",
};

/**
 * Which colour token the figure takes: `spend` reads as money leaving,
 * `credit` as money arriving, `neutral` as a restatement rather than a flow.
 */
export type AmountTone = "spend" | "credit" | "neutral";

export interface TransactionAmount {
  tone: AmountTone;
  /** Goes immediately before the formatted figure; "" when a sign would misread. */
  prefix: string;
}

/**
 * How a kind's stored `amount` should read on screen.
 *
 * The six kinds do not all mean the same thing. `cardCharge` and
 * `expenseSpend` store the size of a movement. `bankAdjust` and `incomeAdjust`
 * store the *new absolute value* the user typed, not a delta — the app never
 * knew the difference, so it cannot render one. `billAdded` / `billRemoved`
 * store a recurring obligation's amount, which is a commitment changing rather
 * than cash moving today.
 */
export function transactionAmount(kind: TransactionKind): TransactionAmount {
  // TODO(human): map each TransactionKind to its tone and prefix.
  // Placeholder: every figure currently renders plain and untinted, which is
  // visibly incomplete rather than quietly wrong.
  void kind;
  return { tone: "neutral", prefix: "" };
}
