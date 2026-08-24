import { CreditCard as CreditCardIcon, Pencil, Plus, Trash2, Wallet } from "lucide-react";
import { creditUtilization } from "@/lib/budget/calculations";
import type { BudgetSummary } from "@/lib/budget/calculations";
import type { CreditCard } from "@/lib/budget/types";
import { formatCurrency, formatPercent, formatWholeCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AddButton, IconAction, RowActions, SubtleButton } from "./actions";
import { EmptyState } from "./empty-state";
import { Panel, PanelBody, PanelFooter, PanelHeader, SectionHeading, SectionLabel } from "./panel";

interface CurrentStateCardProps {
  bankBalance: number;
  creditCards: CreditCard[];
  summary: BudgetSummary;
  onEditBankBalance: () => void;
  onAddCreditCard: () => void;
  onEditCreditCard: (card: CreditCard) => void;
  onAddCharge: (card: CreditCard) => void;
  onRemoveCreditCard: (id: string) => void;
}

export function CurrentStateCard({
  bankBalance,
  creditCards,
  summary,
  onEditBankBalance,
  onAddCreditCard,
  onEditCreditCard,
  onAddCharge,
  onRemoveCreditCard,
}: CurrentStateCardProps) {
  return (
    <Panel className="flex h-full flex-col">
      <PanelHeader
        icon={<Wallet />}
        title="Current position"
        description="What you hold today, and what is already owed against it."
      />

      <PanelBody className="flex flex-1 flex-col gap-6">
        <div className="flex items-end justify-between gap-4 border-b border-line pb-5">
          <div className="min-w-0">
            <SectionLabel>Bank account</SectionLabel>
            <p className="mt-2 font-display text-[2rem] leading-none tracking-tight text-fg">
              {formatCurrency(bankBalance)}
            </p>
          </div>
          <SubtleButton onClick={onEditBankBalance}>Edit</SubtleButton>
        </div>

        <section>
          <SectionHeading
            title="Credit cards"
            total={formatCurrency(summary.creditCardDebt)}
            action={<AddButton label="Add card" onClick={onAddCreditCard} />}
          />

          <div className="mt-3">
            {creditCards.length === 0 ? (
              <EmptyState>No credit cards yet</EmptyState>
            ) : (
              <ul>
                {creditCards.map((card) => {
                  const used = creditUtilization(card);
                  const hot = used > 0.7;
                  return (
                    <li
                      key={card.id}
                      data-row
                      className="border-t border-line py-3 first:border-t-0 first:pt-0"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCardIcon className="size-4 shrink-0 text-fg-subtle" />
                        <span className="min-w-0 flex-1 truncate text-[13px] text-fg">
                          {card.name}
                        </span>
                        <span className="tnum text-[13px] text-fg">
                          {formatCurrency(card.balance)}
                        </span>
                        <RowActions>
                          <IconAction
                            icon={<Plus />}
                            label={`Add a charge to ${card.name}`}
                            onClick={() => onAddCharge(card)}
                          />
                          <IconAction
                            icon={<Pencil />}
                            label={`Edit ${card.name}`}
                            onClick={() => onEditCreditCard(card)}
                          />
                          <IconAction
                            icon={<Trash2 />}
                            label={`Remove ${card.name}`}
                            onClick={() => onRemoveCreditCard(card.id)}
                            destructive
                          />
                        </RowActions>
                      </div>

                      <div className="mt-2.5 flex items-center gap-3">
                        <span className="h-[3px] flex-1 overflow-hidden rounded-[2px] bg-surface-3">
                          <span
                            className={cn(
                              "block h-full rounded-[2px]",
                              hot ? "bg-neg" : "bg-brand",
                            )}
                            style={{ width: formatPercent(used) }}
                          />
                        </span>
                        <span className="tnum text-[11px] whitespace-nowrap text-fg-subtle">
                          {formatPercent(used)} of {formatWholeCurrency(card.limit)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </PanelBody>

      <PanelFooter label="Total owed">
        <p className="font-display text-[1.5rem] leading-none tracking-tight text-fg">
          {formatCurrency(summary.creditCardDebt)}
        </p>
      </PanelFooter>
    </Panel>
  );
}
