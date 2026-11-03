import type { Transaction } from "@/lib/budget/types";

/**
 * Kept separate from `budgetReducer` because the journal is not part of the
 * `Budget` aggregate, and because only removals are optimistic here. New
 * entries are written server-side as a side effect of a mutation, so the
 * client has no id to render until `revalidatePath` brings the row back —
 * which lands while the "Saving changes" indicator is still up.
 */
export type OptimisticTransactionAction =
  { type: "removeTransaction"; id: string } | { type: "clearTransactions" };

export function transactionsReducer(
  transactions: Transaction[],
  action: OptimisticTransactionAction,
): Transaction[] {
  switch (action.type) {
    case "removeTransaction":
      return transactions.filter((transaction) => transaction.id !== action.id);

    case "clearTransactions":
      return [];
  }
}
