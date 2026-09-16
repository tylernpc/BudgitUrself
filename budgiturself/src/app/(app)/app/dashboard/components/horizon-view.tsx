"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { BudgetSummary } from "@/lib/budget/calculations";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AnimatedCurrency } from "./animated-number";
import { SectionLabel } from "./panel";

interface HorizonViewProps {
  bankBalance: number;
  monthlyIncome: number;
  summary: BudgetSummary;
}

export function HorizonView({ bankBalance, monthlyIncome, summary }: HorizonViewProps) {
  const clear = summary.horizonView >= 0;
  const totalIncoming = bankBalance + monthlyIncome;

  // Allocation bar: the same figures the summary already computed, laid out
  // against whichever is larger — what comes in, or what is spoken for.
  const scale = Math.max(monthlyIncome, summary.fixedExpensesTotal + summary.creditCardDebt, 1);
  const segments = [
    {
      label: "Expenses",
      value: summary.monthlyExpensesTotal,
      bar: "ribbon wash-violet",
      dot: "bg-tone-violet",
    },
    {
      label: "Bills",
      value: summary.monthlyBillsTotal,
      bar: "ribbon wash-sky",
      dot: "bg-tone-sky",
    },
    {
      label: "Credit cards",
      value: summary.creditCardDebt,
      bar: "ribbon wash-amber",
      dot: "bg-tone-amber",
    },
    clear || summary.safeToSpend >= 0
      ? {
          label: "Left over",
          value: Math.max(summary.safeToSpend, 0),
          bar: "ribbon wash-emerald",
          dot: "bg-tone-emerald",
        }
      : {
          label: "Shortfall",
          value: Math.abs(summary.safeToSpend),
          bar: "ribbon wash-rose",
          dot: "bg-tone-rose",
        },
  ].filter((segment) => segment.value > 0);

  return (
    <section className="surface px-5 py-6 sm:px-8 sm:py-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <SectionLabel>The Horizon View</SectionLabel>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium",
                clear
                  ? "border-tone-emerald/30 bg-tone-emerald/10 text-tone-emerald"
                  : "border-tone-rose/30 bg-tone-rose/10 text-tone-rose",
              )}
            >
              {clear ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {clear ? "Leftover" : "Short this month"}
            </span>
          </div>

          <p
            className={cn(
              "mt-3 text-[2.5rem] leading-none font-semibold tracking-tight sm:text-5xl",
              clear ? "text-ink" : "text-tone-rose",
            )}
          >
            <AnimatedCurrency value={summary.horizonView} duration={1400} />
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-faint">
            This is what you&apos;re on track to have available at the beginning of the month, after
            all your bills and expenses are accounted for.
          </p>
        </div>

        {segments.length > 0 && (
          <div>
            <SectionLabel>Monthly income breakdown</SectionLabel>
            <p className="mt-1.5 text-xs text-ink-ghost">
              <span className="num font-medium text-ink-muted">
                {formatCurrency(totalIncoming)}
              </span>{" "}
              <span>
                ({formatCurrency(bankBalance)} liquid + {formatCurrency(monthlyIncome)} income)
              </span>
            </p>
            <div className="mt-3 flex h-2 gap-0.5 overflow-hidden rounded-sm bg-chip">
              {segments.map((segment) => (
                <div
                  key={segment.label}
                  className={cn("h-full transition-[width] duration-500", segment.bar)}
                  style={{ width: `${Math.min((segment.value / scale) * 100, 100)}%` }}
                />
              ))}
            </div>
            <ul className="mt-4 divide-y divide-hairline">
              {segments.map((segment) => (
                <li
                  key={segment.label}
                  className="flex items-center gap-2.5 py-2 text-sm text-ink-muted"
                >
                  <span className={cn("size-2 shrink-0 rounded-sm", segment.dot)} />
                  <span className="flex-1">{segment.label}</span>
                  <span className="num text-ink-ghost">
                    {Math.round((segment.value / scale) * 100)}%
                  </span>
                  <span className="num w-20 text-right font-medium text-ink">
                    {formatCurrency(segment.value)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
