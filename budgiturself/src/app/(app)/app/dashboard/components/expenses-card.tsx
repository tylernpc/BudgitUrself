import { Receipt, TrendingUp, Users } from "lucide-react";
import type { BudgetSummary } from "@/lib/budget/calculations";
import type { MonthlyExpense } from "@/lib/budget/types";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AddButton, EditButton, RemoveBadge, SubtleButton } from "./actions";
import { AnimatedCurrency } from "./animated-number";
import { EmptyState } from "./empty-state";
import { ExpenseIcon } from "./expense-icon";
import { Panel, PanelBody, PanelHeader, SectionLabel } from "./panel";

interface ExpensesCardProps {
  monthlyIncome: number;
  monthlyExpenses: MonthlyExpense[];
  summary: BudgetSummary;
  onEditIncome: () => void;
  onAddExpense: () => void;
  onEditExpense: (expense: MonthlyExpense) => void;
  onRemoveExpense: (id: string) => void;
}

/** Rows the user cannot delete here — they are totals rolled up from the bills panel. */
function RolledUpRow({
  icon,
  label,
  amount,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  amount: number;
  tint: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-hairline px-4 py-3">
      <span className="flex min-w-0 items-center gap-2.5">
        <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg", tint)}>
          {icon}
        </span>
        <span className="truncate text-sm text-ink">{label}</span>
        <span className="hidden shrink-0 text-[10px] tracking-[0.16em] text-ink-ghost uppercase sm:inline">
          rolled up
        </span>
      </span>
      <span className="num shrink-0 pr-2 text-sm text-ink-muted">{formatCurrency(amount)}</span>
    </li>
  );
}

export function ExpensesCard({
  monthlyIncome,
  monthlyExpenses,
  summary,
  onEditIncome,
  onAddExpense,
  onEditExpense,
  onRemoveExpense,
}: ExpensesCardProps) {
  const clear = summary.safeToSpend >= 0;

  return (
    <Panel className="flex h-full flex-col">
      <PanelHeader
        icon={<TrendingUp />}
        accent="emerald"
        title="Monthly flow"
        description="What comes in each month, and everything it is spoken for."
      />

      <PanelBody className="flex flex-1 flex-col gap-7">
        <div className="wash wash-sky flex items-center justify-between gap-4 rounded-2xl px-4 py-4">
          <div className="min-w-0">
            <SectionLabel className="text-tone-sky">Monthly income · after tax</SectionLabel>
            <p className="mt-1.5 text-2xl font-medium tracking-tight text-ink sm:text-[28px]">
              <AnimatedCurrency value={monthlyIncome} />
            </p>
          </div>
          <SubtleButton onClick={onEditIncome}>Edit</SubtleButton>
        </div>

        <section>
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-medium text-ink">Fixed expenses</h3>
              <span className="num rounded-full bg-chip px-2.5 py-1 text-xs text-ink-muted ring-1 ring-hairline">
                {formatCurrency(summary.monthlyExpensesTotal)}
              </span>
            </div>
            <AddButton label="Add expense" onClick={onAddExpense} />
          </div>

          <ul className="space-y-2">
            {monthlyExpenses.length === 0 && <EmptyState>No fixed expenses yet</EmptyState>}

            {monthlyExpenses.map((expense) => (
              <li
                key={expense.id}
                className="surface-quiet relative flex items-center justify-between gap-3 px-4 py-3"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-tone-violet/15">
                    <ExpenseIcon icon={expense.icon} className="size-3.5 text-tone-violet" />
                  </span>
                  <span className="truncate text-sm text-ink">{expense.name}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5">
                  <span className="num text-sm text-ink-muted">
                    {formatCurrency(expense.amount)}
                  </span>
                  <EditButton
                    label={`Edit ${expense.name}`}
                    onClick={() => onEditExpense(expense)}
                  />
                </span>
                <RemoveBadge
                  label={`Remove ${expense.name}`}
                  onClick={() => onRemoveExpense(expense.id)}
                />
              </li>
            ))}

            <RolledUpRow
              icon={<Receipt className="size-3.5 text-tone-cyan" />}
              label="Digital bills"
              amount={summary.digitalBillsTotal}
              tint="bg-tone-cyan/15"
            />
            <RolledUpRow
              icon={<Users className="size-3.5 text-tone-amber" />}
              label="Personal owed bills"
              amount={summary.personalBillsTotal}
              tint="bg-tone-amber/15"
            />
          </ul>
        </section>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-quiet px-4 py-3.5 ring-1 ring-hairline">
            <SectionLabel>Total expenses</SectionLabel>
            <p className="num text-lg font-medium tracking-tight text-ink">
              {formatCurrency(summary.fixedExpensesTotal)}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl px-5 py-5 ring-1 ring-hairline">
            <div
              className={cn("absolute inset-0 -z-10", clear ? "wash-surplus" : "wash-shortfall")}
            />
            <SectionLabel className="text-ink-faint">Total after expenses</SectionLabel>
            <p
              className={cn(
                "mt-2 text-3xl font-semibold tracking-tight",
                clear ? "text-ink" : "text-tone-rose",
              )}
            >
              <AnimatedCurrency value={summary.safeToSpend} />
            </p>
            <p className="mt-2 text-[11px] tracking-wide text-ink-ghost">Income − expenses</p>
          </div>
        </div>
      </PanelBody>
    </Panel>
  );
}
