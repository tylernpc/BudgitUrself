import { Pencil, Receipt, Trash2, TrendingUp, Users } from "lucide-react";
import type { BudgetSummary } from "@/lib/budget/calculations";
import type { MonthlyExpense } from "@/lib/budget/types";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AddButton, IconAction, RowActions, SubtleButton } from "./actions";
import { EmptyState } from "./empty-state";
import { ExpenseIcon } from "./expense-icon";
import { Panel, PanelBody, PanelFooter, PanelHeader, SectionHeading, SectionLabel } from "./panel";

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
}: {
  icon: React.ReactNode;
  label: string;
  amount: number;
}) {
  return (
    <li className="flex items-center gap-3 border-t border-line py-2.5">
      <span className="shrink-0 [&_svg]:size-4">{icon}</span>
      <span className="min-w-0 flex-1 truncate text-[13px] text-fg-muted">{label}</span>
      <span className="text-[10px] font-medium tracking-[0.08em] text-fg-subtle uppercase">
        rolled up
      </span>
      <span className="tnum text-[13px] text-fg-muted">{formatCurrency(amount)}</span>
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
        title="Monthly flow"
        description="What comes in each month, and everything it is spoken for."
      />

      <PanelBody className="flex flex-1 flex-col gap-6">
        <div className="flex items-end justify-between gap-4 border-b border-line pb-5">
          <div className="min-w-0">
            <SectionLabel>Monthly income · after tax</SectionLabel>
            <p className="mt-2 font-display text-[2rem] leading-none tracking-tight text-fg">
              {formatCurrency(monthlyIncome)}
            </p>
          </div>
          <SubtleButton onClick={onEditIncome}>Edit</SubtleButton>
        </div>

        <section className="flex flex-1 flex-col">
          <SectionHeading
            title="Fixed expenses"
            total={formatCurrency(summary.monthlyExpensesTotal)}
            action={<AddButton label="Add expense" onClick={onAddExpense} />}
          />

          <ul className="mt-3">
            {monthlyExpenses.length === 0 && (
              <li className="pb-3">
                <EmptyState>No fixed expenses yet</EmptyState>
              </li>
            )}

            {monthlyExpenses.map((expense) => (
              <li
                key={expense.id}
                data-row
                className="flex items-center gap-3 border-t border-line py-2.5 first:border-t-0 first:pt-0"
              >
                <ExpenseIcon
                  icon={expense.icon}
                  color={expense.color}
                  className="size-4 shrink-0"
                />
                <span className="min-w-0 flex-1 truncate text-[13px] text-fg">{expense.name}</span>
                <span className="tnum text-[13px] text-fg">{formatCurrency(expense.amount)}</span>
                <RowActions>
                  <IconAction
                    icon={<Pencil />}
                    label={`Edit ${expense.name}`}
                    onClick={() => onEditExpense(expense)}
                  />
                  <IconAction
                    icon={<Trash2 />}
                    label={`Remove ${expense.name}`}
                    onClick={() => onRemoveExpense(expense.id)}
                    destructive
                  />
                </RowActions>
              </li>
            ))}

            <RolledUpRow
              icon={<Receipt className="text-cat-cyan" />}
              label="Digital bills"
              amount={summary.digitalBillsTotal}
            />
            <RolledUpRow
              icon={<Users className="text-cat-amber" />}
              label="Personal owed bills"
              amount={summary.personalBillsTotal}
            />
          </ul>

          <div className="mt-auto flex items-baseline justify-between gap-4 border-t border-line pt-4">
            <SectionLabel>Total expenses</SectionLabel>
            <p className="tnum text-[15px] font-medium text-fg">
              {formatCurrency(summary.fixedExpensesTotal)}
            </p>
          </div>
        </section>
      </PanelBody>

      <PanelFooter label="Total after expenses">
        <p
          className={cn(
            "font-display text-[1.5rem] leading-none tracking-tight",
            clear ? "text-fg" : "text-neg",
          )}
        >
          {formatCurrency(summary.safeToSpend)}
        </p>
      </PanelFooter>
    </Panel>
  );
}
