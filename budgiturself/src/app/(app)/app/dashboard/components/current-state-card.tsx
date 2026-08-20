import { CreditCard as CreditCardIcon, Wallet } from "lucide-react";
import { creditUtilization } from "@/lib/budget/calculations";
import type { BudgetSummary } from "@/lib/budget/calculations";
import type { CreditCard } from "@/lib/budget/types";
import { formatCurrency, formatPercent, formatWholeCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AddButton, ChargeButton, EditButton, RemoveButton, SubtleButton } from "./actions";
import { AnimatedCurrency } from "./animated-number";
import { EmptyState } from "./empty-state";
import { Panel, PanelBody, PanelHeader, SectionLabel } from "./panel";

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
        accent="violet"
        title="Current position"
        description="What you hold today, and what is already owed against it."
      />

      <PanelBody className="flex flex-1 flex-col gap-7">
        <div className="wash wash-emerald flex items-center justify-between gap-4 rounded-2xl px-4 py-4">
          <div className="min-w-0">
            <SectionLabel className="text-tone-emerald">Bank account</SectionLabel>
            <p className="mt-1.5 text-2xl font-medium tracking-tight text-ink sm:text-[28px]">
              <AnimatedCurrency value={bankBalance} />
            </p>
          </div>
          <SubtleButton onClick={onEditBankBalance}>Edit</SubtleButton>
        </div>

        <section>
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-medium text-ink">Credit cards</h3>
              <span className="num rounded-full bg-chip px-2.5 py-1 text-xs text-ink-muted ring-1 ring-hairline">
                {formatCurrency(summary.creditCardDebt)}
              </span>
            </div>
            <AddButton label="Add card" onClick={onAddCreditCard} />
          </div>

          {creditCards.length === 0 ? (
            <EmptyState>No credit cards yet</EmptyState>
          ) : (
            <ul className="space-y-2.5">
              {creditCards.map((card) => {
                const used = creditUtilization(card);
                return (
                  <li key={card.id} className="surface-quiet px-4 py-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-2.5 text-sm text-ink">
                        <CreditCardIcon className="size-4 shrink-0 text-ink-ghost" />
                        <span className="truncate">{card.name}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        <span className="num text-sm text-ink-muted">
                          {formatCurrency(card.balance)}
                        </span>
                        <ChargeButton
                          label={`Add to ${card.name}`}
                          onClick={() => onAddCharge(card)}
                        />
                        <EditButton
                          label={`Edit ${card.name}`}
                          onClick={() => onEditCreditCard(card)}
                        />
                        <RemoveButton
                          label={`Remove ${card.name}`}
                          onClick={() => onRemoveCreditCard(card.id)}
                        />
                      </span>
                    </div>
                    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-chip">
                      <div
                        className={cn(
                          "meter h-full rounded-full transition-[width] duration-700",
                          used > 0.7 ? "meter-fill-hot" : "meter-fill",
                        )}
                        style={{ width: formatPercent(used) }}
                      />
                    </div>
                    <p className="num mt-2 text-[11px] text-ink-ghost">
                      {formatPercent(used)} of {formatWholeCurrency(card.limit)} limit
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div
          className={cn(
            "mt-auto flex items-center justify-between gap-4 rounded-2xl px-4 py-4",
            "wash wash-rose",
          )}
        >
          <SectionLabel className="text-tone-rose">Total owed</SectionLabel>
          <p className="text-xl font-medium tracking-tight text-ink">
            <AnimatedCurrency value={summary.creditCardDebt} />
          </p>
        </div>
      </PanelBody>
    </Panel>
  );
}
