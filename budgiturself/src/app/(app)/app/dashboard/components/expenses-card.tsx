import { Home, Receipt, TrendingUp, Users } from "lucide-react";
import { utilization } from "@/lib/budget/calculations";
import type { BudgetSummary } from "@/lib/budget/calculations";
import type { MonthlyExpense } from "@/lib/budget/types";
import { formatCurrency, formatPercent, formatWholeCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AddButton, ChargeButton, EditButton, RemoveBadge, SubtleButton } from "./actions";
import { AnimatedCurrency } from "./animated-number";
import { EmptyState } from "./empty-state";
import { EXPENSE_COLOR_MAP, ExpenseIcon } from "./expense-icon";
import { Panel, PanelBody, PanelHeader, SectionLabel } from "./panel";

interface ExpensesCardProps {
  monthlyIncome: number;
  monthlyExpenses: MonthlyExpense[];
  summary: BudgetSummary;
  onEditIncome: () => void;
  onAddExpense: () => void;
  onEditExpense: (expense: MonthlyExpense) => void;
  onAddContribution: (expense: MonthlyExpense) => void;
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
    <li className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-hairline-strong px-4 py-2.5">
      <span className="flex min-w-0 items-center gap-2.5">
        <span className={cn("grid size-7 shrink-0 place-items-center rounded-md", tint)}>
          {icon}
        </span>
        <span className="truncate text-sm font-medium text-ink">{label}</span>
        <span className="hidden shrink-0 rounded border border-hairline px-1.5 py-px text-[10px] font-medium text-ink-ghost sm:inline">
          Rolled up
        </span>
      </span>
      <span className="num shrink-0 pr-2 text-sm font-medium text-ink-muted">
        {formatCurrency(amount)}
      </span>
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
  onAddContribution,
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

      <PanelBody className="flex flex-1 flex-col gap-6">
        <div className="wash wash-sky flex items-center justify-between gap-4 rounded-lg px-4 py-3.5">
          <div className="min-w-0">
            <SectionLabel className="text-tone-sky">Monthly income · after tax</SectionLabel>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">
              <AnimatedCurrency value={monthlyIncome} />
            </p>
          </div>
          <SubtleButton onClick={onEditIncome}>Edit</SubtleButton>
        </div>

        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-ink">Fixed expenses</h3>
              <span className="num rounded-md border border-hairline bg-quiet px-2 py-0.5 text-xs font-medium text-ink-muted">
                {formatCurrency(summary.monthlyExpensesTotal)}
              </span>
            </div>
            <AddButton label="Add expense" onClick={onAddExpense} />
          </div>

          <ul className="space-y-2">
            {monthlyExpenses.length === 0 && <EmptyState>No fixed expenses yet</EmptyState>}

            {monthlyExpenses.map((expense) => {
              const used = utilization(expense.spent, expense.amount);
              return (
                <li
                  key={expense.id}
                  className="surface-quiet relative flex flex-col gap-3 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-md",
                          EXPENSE_COLOR_MAP[expense.color].bg,
                        )}
                      >
                        <ExpenseIcon
                          icon={expense.icon}
                          color={expense.color}
                          className="size-3.5"
                        />
                      </span>
                      <span className="truncate text-sm font-medium text-ink">{expense.name}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1">
                      <span className="num mr-1 text-sm font-medium text-ink">
                        {formatCurrency(expense.amount)}
                      </span>
                      <ChargeButton
                        label={`Add to ${expense.name}`}
                        onClick={() => onAddContribution(expense)}
                      />
                      <EditButton
                        label={`Edit ${expense.name}`}
                        onClick={() => onEditExpense(expense)}
                      />
                    </span>
                  </div>
                  {expense.spent > 0 && (
                    <div>
                      <div className="h-1.5 w-full overflow-hidden rounded-sm bg-chip">
                        <div
                          className={cn(
                            "meter h-full rounded-sm transition-[width] duration-500",
                            used > 0.7 ? "meter-fill-hot" : "meter-fill",
                          )}
                          style={{ width: formatPercent(used) }}
                        />
                      </div>
                      <p className="num mt-2 text-xs text-ink-ghost">
                        {formatWholeCurrency(expense.spent)} of{" "}
                        {formatWholeCurrency(expense.amount)} used ({formatPercent(used)})
                      </p>
                    </div>
                  )}
                  <RemoveBadge
                    label={`Remove ${expense.name}`}
                    onClick={() => onRemoveExpense(expense.id)}
                  />
                </li>
              );
            })}

            <RolledUpRow
              icon={<Home className="size-3.5 text-tone-violet" />}
              label="Recurring bills"
              amount={summary.recurringBillsTotal}
              tint="bg-tone-violet/12"
            />
            <RolledUpRow
              icon={<Receipt className="size-3.5 text-tone-cyan" />}
              label="Subscriptions"
              amount={summary.digitalBillsTotal}
              tint="bg-tone-cyan/12"
            />
            <RolledUpRow
              icon={<Users className="size-3.5 text-tone-amber" />}
              label="Personal owed bills"
              amount={summary.personalBillsTotal}
              tint="bg-tone-amber/12"
            />
          </ul>
        </section>

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-hairline bg-quiet px-4 py-3">
            <SectionLabel>Total expenses</SectionLabel>
            <p className="num text-base font-semibold tracking-tight text-ink">
              {formatCurrency(summary.fixedExpensesTotal)}
            </p>
          </div>

          <div
            className={cn("wash rounded-lg px-4 py-4", clear ? "wash-surplus" : "wash-shortfall")}
          >
            <SectionLabel className={clear ? "text-tone-emerald" : "text-tone-rose"}>
              Total after expenses
            </SectionLabel>
            <p
              className={cn(
                "mt-1.5 text-3xl font-semibold tracking-tight",
                clear ? "text-ink" : "text-tone-rose",
              )}
            >
              <AnimatedCurrency value={summary.safeToSpend} />
            </p>
            <p className="mt-1.5 text-xs text-ink-faint">Income − expenses</p>
          </div>
        </div>
      </PanelBody>
    </Panel>
  );
}
