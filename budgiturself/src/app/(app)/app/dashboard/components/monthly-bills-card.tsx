import {
  CalendarClock,
  CreditCard as CreditCardIcon,
  Pencil,
  Receipt,
  Trash2,
  Users,
} from "lucide-react";
import type { BudgetSummary } from "@/lib/budget/calculations";
import type { Bill, CreditCard, DigitalBill, PersonalBill } from "@/lib/budget/types";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AddButton, IconAction, RowActions } from "./actions";
import { EmptyState } from "./empty-state";
import { Panel, PanelFooter, PanelHeader, SectionHeading } from "./panel";

interface MonthlyBillsCardProps {
  summary: BudgetSummary;
  creditCards: CreditCard[];
  onAddBill: () => void;
  onEditBill: (bill: Bill) => void;
  onRemoveBill: (id: string) => void;
}

/** The charge-day tile that anchors each row — bills arrive already date-sorted. */
function DayTile({ day }: { day: number }) {
  return (
    <span className="grid size-10 shrink-0 place-content-center justify-items-center rounded-md border border-line bg-surface-2">
      <span className="text-[9px] leading-none tracking-[0.1em] text-fg-subtle uppercase">day</span>
      <span className="tnum mt-0.5 text-[13px] leading-none font-medium text-fg">{day}</span>
    </span>
  );
}

function BillRow({
  day,
  name,
  qualifier,
  meta,
  amount,
  onEdit,
  onRemove,
  actionLabel,
}: {
  day: number;
  name: string;
  qualifier?: string;
  meta: React.ReactNode;
  amount: number;
  onEdit: () => void;
  onRemove: () => void;
  actionLabel: string;
}) {
  return (
    <li data-row className="flex items-center gap-3 border-t border-line py-3 first:border-t-0">
      <DayTile day={day} />
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-[13px] font-medium text-fg">
          {name}
          {qualifier && <span className="font-normal text-fg-subtle"> · {qualifier}</span>}
        </h4>
        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-fg-subtle [&_svg]:size-3">
          {meta}
        </p>
      </div>
      <span className="tnum text-[13px] text-fg">{formatCurrency(amount)}</span>
      <RowActions>
        <IconAction icon={<Pencil />} label={`Edit ${actionLabel}`} onClick={onEdit} />
        <IconAction
          icon={<Trash2 />}
          label={`Remove ${actionLabel}`}
          onClick={onRemove}
          destructive
        />
      </RowActions>
    </li>
  );
}

function BillColumn({
  className,
  icon,
  title,
  total,
  blurb,
  children,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  total: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("px-5 py-5 sm:px-6", className)}>
      <SectionHeading icon={icon} title={title} total={total} />
      <p className="mt-2 max-w-prose text-[12px] leading-relaxed text-fg-subtle">{blurb}</p>
      <div className="mt-3">{children}</div>
    </section>
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
    <Panel className="flex flex-col">
      <PanelHeader
        icon={<CalendarClock />}
        title="Monthly bills"
        description="The recurring charges behind your expenses — what leaves, and on which day."
        action={<AddButton label="Add bill" onClick={onAddBill} />}
      />

      <div className="grid lg:grid-cols-2">
        <BillColumn
          icon={<Receipt />}
          title="Digital bills"
          total={formatCurrency(summary.digitalBillsTotal)}
          blurb="Subscriptions and services that charge a card on their own schedule — streaming, software, the gym app."
        >
          {summary.digitalBills.length === 0 ? (
            <EmptyState>No subscriptions tracked yet</EmptyState>
          ) : (
            <ul>
              {summary.digitalBills.map((bill: DigitalBill) => (
                <BillRow
                  key={bill.id}
                  day={bill.chargeDate}
                  name={bill.name}
                  qualifier={bill.category}
                  meta={
                    <>
                      <CreditCardIcon />
                      {cardNames.get(bill.cardId) ?? ""}
                    </>
                  }
                  amount={bill.amount}
                  onEdit={() => onEditBill(bill)}
                  onRemove={() => onRemoveBill(bill.id)}
                  actionLabel={bill.name}
                />
              ))}
            </ul>
          )}
        </BillColumn>

        <BillColumn
          className="border-t border-line lg:border-t-0 lg:border-l"
          icon={<Users />}
          title="Personal owed bills"
          total={formatCurrency(summary.personalBillsTotal)}
          blurb="Money you owe a person each month — paying a family member back for a shared membership, say."
        >
          {summary.personalBills.length === 0 ? (
            <EmptyState>Nobody to pay back right now</EmptyState>
          ) : (
            <ul>
              {summary.personalBills.map((bill: PersonalBill) => (
                <BillRow
                  key={bill.id}
                  day={bill.chargeDate}
                  name={bill.name}
                  meta={
                    <>
                      <Users />
                      Owed to {bill.owedTo}
                    </>
                  }
                  amount={bill.amount}
                  onEdit={() => onEditBill(bill)}
                  onRemove={() => onRemoveBill(bill.id)}
                  actionLabel={bill.name}
                />
              ))}
            </ul>
          )}
        </BillColumn>
      </div>

      <PanelFooter label="Total monthly bills">
        <p className="font-display text-[1.5rem] leading-none tracking-tight text-fg">
          {formatCurrency(summary.monthlyBillsTotal)}
        </p>
      </PanelFooter>
    </Panel>
  );
}
