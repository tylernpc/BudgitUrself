"use client";

import { useState } from "react";
import { ReceiptText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TRANSACTION_KIND_LABELS, transactionAmount } from "@/lib/budget/transaction-log";
import type { Transaction } from "@/lib/budget/types";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EmptyState } from "./empty-state";
import { Panel, PanelBody, PanelHeader } from "./panel";

const amountTone = {
  spend: "text-tone-rose",
  credit: "text-tone-emerald",
  neutral: "text-ink",
} as const;

interface TransactionsCardProps {
  transactions: Transaction[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function TransactionsCard({ transactions, onRemove, onClear }: TransactionsCardProps) {
  // Clearing the whole log is one click away and irreversible, so the button
  // arms itself first. Resets whenever the list changes out from under it.
  const [armed, setArmed] = useState(false);

  const handleClear = () => {
    if (!armed) {
      setArmed(true);
      return;
    }
    setArmed(false);
    onClear();
  };

  return (
    <Panel className="flex h-full flex-col">
      <PanelHeader
        icon={<ReceiptText />}
        accent="cyan"
        title="Transactions"
        description="Every change you have recorded. Deleting an entry clears the record, not the money."
        action={
          transactions.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleClear}
              onBlur={() => setArmed(false)}
              className={cn(
                "h-8 px-3 text-[13px] font-medium",
                armed && "border-tone-rose text-tone-rose",
              )}
            >
              {armed ? `Clear all ${transactions.length}?` : "Clear all"}
            </Button>
          )
        }
      />

      <PanelBody className="flex-1">
        {transactions.length === 0 ? (
          <EmptyState>
            Nothing recorded yet — add a charge to a card and it shows up here.
          </EmptyState>
        ) : (
          <ul className="divide-y divide-hairline">
            {transactions.map((transaction) => {
              const { tone, prefix } = transactionAmount(transaction.kind);

              return (
                <li key={transaction.id} className="flex items-center gap-3 py-3 first:pt-0">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{transaction.label}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[12px] text-ink-faint">
                      <span>{TRANSACTION_KIND_LABELS[transaction.kind]}</span>
                      <span aria-hidden>·</span>
                      <time dateTime={transaction.occurredAt.toISOString()}>
                        {formatDateTime(transaction.occurredAt)}
                      </time>
                    </p>
                  </div>

                  <span
                    className={cn("num shrink-0 text-sm font-semibold", amountTone[tone])}
                  >{`${prefix}${formatCurrency(transaction.amount)}`}</span>

                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Delete ${transaction.label} entry`}
                    onClick={() => onRemove(transaction.id)}
                    className="size-8 shrink-0 rounded-md text-ink-ghost transition-colors hover:bg-tone-rose/10 hover:text-tone-rose"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </PanelBody>
    </Panel>
  );
}
