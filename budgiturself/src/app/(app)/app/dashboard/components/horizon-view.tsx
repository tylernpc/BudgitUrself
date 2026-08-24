import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { BudgetSummary } from "@/lib/budget/calculations";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./panel";

interface HorizonViewProps {
  bankBalance: number;
  monthlyIncome: number;
  summary: BudgetSummary;
}

export function HorizonView({ bankBalance, monthlyIncome, summary }: HorizonViewProps) {
  const clear = summary.horizonView >= 0;

  /**
   * Everything is measured against what you actually have coming in, so the
   * four rows are the Horizon View equation itself and add up to 100%. When
   * the outgoings overrun it the bar simply fills — the leftover row goes red
   * and reports the same shortfall as the headline.
   */
  const totalIncoming = Math.max(bankBalance + monthlyIncome, 1);
  const segments = [
    { label: "Expenses", value: summary.monthlyExpensesTotal, color: "var(--cat-violet)" },
    { label: "Bills", value: summary.monthlyBillsTotal, color: "var(--cat-sky)" },
    { label: "Credit cards", value: summary.creditCardDebt, color: "var(--cat-amber)" },
    {
      label: clear ? "Left over" : "Shortfall",
      value: summary.horizonView,
      color: clear ? "var(--app-pos)" : "var(--app-neg)",
    },
  ].filter((segment) => segment.value !== 0);

  return (
    <section className="app-card grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="px-5 py-6 sm:px-8 sm:py-8">
        <SectionLabel>The Horizon View</SectionLabel>

        <p
          className={cn(
            "mt-4 font-display text-[3.25rem] leading-none tracking-tight sm:text-[4rem]",
            clear ? "text-fg" : "text-neg",
          )}
        >
          {formatCurrency(summary.horizonView)}
        </p>

        <p
          className={cn(
            "mt-3 flex items-center gap-1.5 text-[13px] font-medium",
            clear ? "text-pos" : "text-neg",
          )}
        >
          {clear ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
          {clear ? "Projected leftover" : "Projected shortfall"}
        </p>

        <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-fg-muted">
          What you&apos;re on track to have available at the beginning of the month, once every bill
          and expense has been accounted for.
        </p>
      </div>

      <div className="border-t border-line px-5 py-6 sm:px-8 sm:py-8 lg:border-t-0 lg:border-l">
        <SectionLabel>Where the month goes</SectionLabel>

        <div className="mt-4 flex h-2 gap-px overflow-hidden rounded-[3px] bg-surface-3">
          {segments
            .filter((segment) => segment.value > 0)
            .map((segment) => (
              <div
                key={segment.label}
                className="h-full shrink-0 first:rounded-l-[3px] last:rounded-r-[3px]"
                style={{
                  width: `${(segment.value / totalIncoming) * 100}%`,
                  backgroundColor: segment.color,
                }}
              />
            ))}
        </div>

        <ul className="mt-4">
          {segments.map((segment) => (
            <li
              key={segment.label}
              className="flex items-center gap-3 border-t border-line py-2.5 text-[13px] first:border-t-0 first:pt-0"
            >
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: segment.color }}
              />
              <span className="flex-1 text-fg">{segment.label}</span>
              <span className="tnum w-10 text-right text-fg-subtle">
                {Math.round((Math.abs(segment.value) / totalIncoming) * 100)}%
              </span>
              <span className={cn("tnum w-24 text-right", clear ? "text-fg" : "text-fg")}>
                {formatCurrency(Math.abs(segment.value))}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-4 border-t border-line pt-3 text-[12px] leading-relaxed text-fg-subtle">
          Measured against{" "}
          <span className="tnum text-fg-muted">{formatCurrency(bankBalance + monthlyIncome)}</span>{" "}
          in play — {formatCurrency(bankBalance)} liquid plus {formatCurrency(monthlyIncome)}{" "}
          income.
        </p>
      </div>
    </section>
  );
}
