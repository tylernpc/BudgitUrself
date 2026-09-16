import { CalendarClock, CreditCard as CreditCardIcon, Home, Receipt, Users } from "lucide-react";
import type { BudgetSummary } from "@/lib/budget/calculations";
import type {
  Bill,
  CreditCard,
  DigitalBill,
  PersonalBill,
  RecurringBill,
} from "@/lib/budget/types";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AddButton, EditButton, RemoveBadge } from "./actions";
import { AnimatedCurrency } from "./animated-number";
import { EmptyState } from "./empty-state";
import { Panel, PanelBody, PanelHeader, SectionLabel } from "./panel";

interface MonthlyBillsCardProps {
  summary: BudgetSummary;
  creditCards: CreditCard[];
  onAddBill: () => void;
  onEditBill: (bill: Bill) => void;
  onRemoveBill: (id: string) => void;
}

/** The charge-day chip that anchors each row — bills arrive already date-sorted. */
function DayChip({ day, tint }: { day: number; tint: string }) {
  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-content-center justify-items-center rounded-md border",
        tint,
      )}
    >
      <span className="text-[9px] font-semibold tracking-[0.04em] text-ink-ghost uppercase">
        day
      </span>
      <span className="num text-sm leading-tight font-semibold text-ink">{day}</span>
    </span>
  );
}

function BillRow({
  day,
  tint,
  name,
  badge,
  meta,
  amount,
  onEdit,
  onRemove,
  actionLabel,
}: {
  day: number;
  tint: string;
  name: string;
  badge?: string;
  meta: React.ReactNode;
  amount: number;
  onEdit: () => void;
  onRemove: () => void;
  actionLabel: string;
}) {
  return (
    <li className="surface-quiet relative flex items-center gap-3 px-3 py-2.5">
      <DayChip day={day} tint={tint} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h4 className="truncate text-sm font-medium text-ink">{name}</h4>
          {badge && (
            <span className="rounded border border-hairline bg-panel px-1.5 py-px text-[10px] font-medium text-ink-faint">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-ghost">{meta}</p>
      </div>
      <span className="flex shrink-0 items-center gap-1">
        <span className="num mr-1 text-sm font-medium text-ink">{formatCurrency(amount)}</span>
        <EditButton label={`Edit ${actionLabel}`} onClick={onEdit} />
      </span>
      <RemoveBadge label={`Remove ${actionLabel}`} onClick={onRemove} />
    </li>
  );
}

function DigitalBillRow({
  bill,
  cardName,
  onEdit,
  onRemove,
}: {
  bill: DigitalBill;
  cardName: string;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <BillRow
      day={bill.chargeDate}
      tint="border-tone-indigo/25 bg-tone-indigo/10"
      name={bill.name}
      badge={bill.category}
      meta={
        <>
          <CreditCardIcon className="size-3" />
          {cardName}
        </>
      }
      amount={bill.amount}
      onEdit={onEdit}
      onRemove={onRemove}
      actionLabel={bill.name}
    />
  );
}

function RecurringBillRow({
  bill,
  onEdit,
  onRemove,
}: {
  bill: RecurringBill;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <BillRow
      day={bill.chargeDate}
      tint="border-tone-violet/25 bg-tone-violet/10"
      name={bill.name}
      meta={
        <>
          <Home className="size-3" />
          Fixed charge
        </>
      }
      amount={bill.amount}
      onEdit={onEdit}
      onRemove={onRemove}
      actionLabel={bill.name}
    />
  );
}

function PersonalBillRow({
  bill,
  onEdit,
  onRemove,
}: {
  bill: PersonalBill;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <BillRow
      day={bill.chargeDate}
      tint="border-tone-amber/25 bg-tone-amber/10"
      name={bill.name}
      meta={
        <>
          <Users className="size-3" />
          Owed to {bill.owedTo}
        </>
      }
      amount={bill.amount}
      onEdit={onEdit}
      onRemove={onRemove}
      actionLabel={bill.name}
    />
  );
}

export function MonthlyBillsCard({
  summary,
  creditCards,
  onAddBill,
  onEditBill,
  onRemoveBill,
}: MonthlyBillsCardProps) {
  const cardNames = new Map(creditCards.map((card) => [card.id, card.name]));

  return (
    <Panel>
      <PanelHeader
        icon={<CalendarClock />}
        accent="cyan"
        title="Monthly bills"
        description="The recurring charges behind your expenses — what leaves, and on which day."
        action={<AddButton label="Add bill" onClick={onAddBill} />}
      />

      <PanelBody className="space-y-6">
        <div className="grid gap-8 lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-10 lg:gap-y-0">
          <section className="lg:row-span-3 lg:grid lg:grid-rows-subgrid">
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Home className="size-4 text-tone-violet" />
                Recurring bills
              </h3>
              <span className="num rounded-md border border-hairline bg-quiet px-2 py-0.5 text-xs font-medium text-ink-muted">
                {formatCurrency(summary.recurringBillsTotal)}
              </span>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-ink-faint">
              Fixed charges with no card or person attached — rent, insurance, anything that bills
              the same amount every month.
            </p>
            {summary.recurringBills.length === 0 ? (
              <EmptyState>No fixed bills tracked yet</EmptyState>
            ) : (
              <ul className="space-y-2.5">
                {summary.recurringBills.map((bill) => (
                  <RecurringBillRow
                    key={bill.id}
                    bill={bill}
                    onEdit={() => onEditBill(bill)}
                    onRemove={() => onRemoveBill(bill.id)}
                  />
                ))}
              </ul>
            )}
          </section>

          <section className="lg:row-span-3 lg:grid lg:grid-rows-subgrid">
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Receipt className="size-4 text-tone-indigo" />
                Subscriptions
              </h3>
              <span className="num rounded-md border border-hairline bg-quiet px-2 py-0.5 text-xs font-medium text-ink-muted">
                {formatCurrency(summary.digitalBillsTotal)}
              </span>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-ink-faint">
              Subscriptions and services that charge a card on their own schedule — streaming,
              software, the gym app.
            </p>
            {summary.digitalBills.length === 0 ? (
              <EmptyState>No subscriptions tracked yet</EmptyState>
            ) : (
              <ul className="space-y-2.5">
                {summary.digitalBills.map((bill) => (
                  <DigitalBillRow
                    key={bill.id}
                    bill={bill}
                    cardName={cardNames.get(bill.cardId) ?? ""}
                    onEdit={() => onEditBill(bill)}
                    onRemove={() => onRemoveBill(bill.id)}
                  />
                ))}
              </ul>
            )}
          </section>

          <section className="lg:row-span-3 lg:grid lg:grid-rows-subgrid">
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Users className="size-4 text-tone-amber" />
                Personal owed bills
              </h3>
              <span className="num rounded-md border border-hairline bg-quiet px-2 py-0.5 text-xs font-medium text-ink-muted">
                {formatCurrency(summary.personalBillsTotal)}
              </span>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-ink-faint">
              Money you owe a person each month — paying a family member back for a shared
              membership, say.
            </p>
            {summary.personalBills.length === 0 ? (
              <EmptyState>Nobody to pay back right now</EmptyState>
            ) : (
              <ul className="space-y-2.5">
                {summary.personalBills.map((bill) => (
                  <PersonalBillRow
                    key={bill.id}
                    bill={bill}
                    onEdit={() => onEditBill(bill)}
                    onRemove={() => onRemoveBill(bill.id)}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="wash wash-indigo flex items-center justify-between gap-4 rounded-lg px-4 py-3.5">
          <SectionLabel className="text-tone-indigo">Total monthly bills</SectionLabel>
          <p className="text-lg font-semibold tracking-tight text-ink">
            <AnimatedCurrency value={summary.monthlyBillsTotal} />
          </p>
        </div>
      </PanelBody>
    </Panel>
  );
}
