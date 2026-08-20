import { CalendarClock, CreditCard as CreditCardIcon, Receipt, Users } from "lucide-react";
import type { BudgetSummary } from "@/lib/budget/calculations";
import type { Bill, DigitalBill, PersonalBill } from "@/lib/budget/types";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AddButton, EditButton, RemoveBadge } from "./actions";
import { AnimatedCurrency } from "./animated-number";
import { EmptyState } from "./empty-state";
import { Panel, PanelBody, PanelHeader, SectionLabel } from "./panel";

interface MonthlyBillsCardProps {
  summary: BudgetSummary;
  onAddBill: () => void;
  onEditBill: (bill: Bill) => void;
  onRemoveBill: (id: string) => void;
}

/** The charge-day chip that anchors each row — bills arrive already date-sorted. */
function DayChip({ day, tint }: { day: number; tint: string }) {
  return (
    <span
      className={cn(
        "grid size-11 shrink-0 place-content-center justify-items-center rounded-xl ring-1",
        tint,
      )}
    >
      <span className="text-[9px] tracking-[0.14em] text-ink-ghost uppercase">day</span>
      <span className="num text-sm leading-tight font-medium text-ink">{day}</span>
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
    <li className="surface-quiet relative flex items-center gap-3 px-3 py-3 sm:px-3.5">
      <DayChip day={day} tint={tint} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h4 className="truncate text-sm font-medium text-ink">{name}</h4>
          {badge && (
            <span className="rounded-full bg-chip px-2 py-0.5 text-[10px] text-ink-faint ring-1 ring-hairline">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-ink-ghost">{meta}</p>
      </div>
      <span className="flex shrink-0 items-center gap-1.5">
        <span className="num text-sm text-ink-muted">{formatCurrency(amount)}</span>
        <EditButton label={`Edit ${actionLabel}`} onClick={onEdit} />
      </span>
      <RemoveBadge label={`Remove ${actionLabel}`} onClick={onRemove} />
    </li>
  );
}

function DigitalBillRow({
  bill,
  onEdit,
  onRemove,
}: {
  bill: DigitalBill;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <BillRow
      day={bill.chargeDate}
      tint="bg-tone-indigo/12 ring-tone-indigo/25"
      name={bill.name}
      badge={bill.category}
      meta={
        <>
          <CreditCardIcon className="size-3" />
          {bill.card}
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
      tint="bg-tone-amber/12 ring-tone-amber/25"
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
  onAddBill,
  onEditBill,
  onRemoveBill,
}: MonthlyBillsCardProps) {
  return (
    <Panel>
      <PanelHeader
        icon={<CalendarClock />}
        accent="cyan"
        title="Monthly bills"
        description="The recurring charges behind your expenses — what leaves, and on which day."
        action={<AddButton label="Add bill" onClick={onAddBill} />}
      />

      <PanelBody className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:grid-rows-[auto_auto_1fr] lg:gap-x-10 lg:gap-y-0">
          <section className="lg:row-span-3 lg:grid lg:grid-rows-subgrid">
            <div className="mb-3.5 flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-medium text-ink">
                <Receipt className="size-4 text-tone-indigo" />
                Digital bills
              </h3>
              <span className="num rounded-full bg-chip px-2.5 py-1 text-xs text-ink-muted ring-1 ring-hairline">
                {formatCurrency(summary.digitalBillsTotal)}
              </span>
            </div>
            <p className="mb-3.5 text-[12px] leading-relaxed text-ink-ghost">
              Subscriptions and services that charge a card on their own schedule — streaming,
              software, the gym app.
            </p>
            {summary.digitalBills.length === 0 ? (
              <EmptyState>No subscriptions tracked yet</EmptyState>
            ) : (
              <ul className="space-y-3.5">
                {summary.digitalBills.map((bill) => (
                  <DigitalBillRow
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
            <div className="mb-3.5 flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-medium text-ink">
                <Users className="size-4 text-tone-amber" />
                Personal owed bills
              </h3>
              <span className="num rounded-full bg-chip px-2.5 py-1 text-xs text-ink-muted ring-1 ring-hairline">
                {formatCurrency(summary.personalBillsTotal)}
              </span>
            </div>
            <p className="mb-3.5 text-[12px] leading-relaxed text-ink-ghost">
              Money you owe a person each month — paying a family member back for a shared
              membership, say.
            </p>
            {summary.personalBills.length === 0 ? (
              <EmptyState>Nobody to pay back right now</EmptyState>
            ) : (
              <ul className="space-y-3.5">
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

        <div className="wash wash-indigo flex items-center justify-between gap-4 rounded-2xl px-4 py-4">
          <SectionLabel className="text-tone-indigo">Total monthly bills</SectionLabel>
          <p className="text-xl font-medium tracking-tight text-ink">
            <AnimatedCurrency value={summary.monthlyBillsTotal} />
          </p>
        </div>
      </PanelBody>
    </Panel>
  );
}
