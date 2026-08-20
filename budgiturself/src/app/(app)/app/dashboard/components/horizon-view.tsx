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

function Figure({ label, value, positive }: { label: string; value: number; positive: boolean }) {
  return (
    <div className="surface-quiet px-4 py-3.5">
      <SectionLabel>{label}</SectionLabel>
      <p
        className={cn(
          "mt-1.5 text-xl font-medium tracking-tight sm:text-2xl",
          positive ? "text-ink" : "text-tone-rose",
        )}
      >
        <AnimatedCurrency value={value} />
      </p>
    </div>
  );
}

export function HorizonView({ bankBalance, monthlyIncome, summary }: HorizonViewProps) {
  const clear = summary.horizonView >= 0;

  // Allocation ribbon: the same figures the summary already computed, laid out
  // against whichever is larger — what comes in, or what is spoken for.
  const scale = Math.max(monthlyIncome, summary.fixedExpensesTotal, 1);
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
    <section className="surface px-5 py-8 sm:px-8 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <SectionLabel>The Horizon View</SectionLabel>
            <span
              className={cn(
                "wash inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
                clear ? "wash-emerald text-tone-emerald" : "wash-rose text-tone-rose",
              )}
            >
              {clear ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {clear ? "Clear to spend" : "Short this month"}
            </span>
          </div>

          <p
            className={cn(
              "mt-4 text-[2.75rem] leading-[1.05] font-semibold tracking-tight sm:text-6xl",
              clear ? "text-ink" : "text-tone-rose",
            )}
          >
            <AnimatedCurrency value={summary.horizonView} duration={1400} />
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-faint">
            This is what you&apos;re on track to have available at the end of the month, after all
            your bills and expenses are accounted for.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Figure label="Liquid cash" value={bankBalance} positive={bankBalance >= 0} />
            <Figure
              label="After obligations"
              value={summary.trueLiquidWealth}
              positive={summary.trueLiquidWealth >= 0}
            />
          </div>

          {segments.length > 0 && (
            <div>
              <div className="flex h-2 gap-1 overflow-hidden rounded-full bg-chip">
                {segments.map((segment) => (
                  <div
                    key={segment.label}
                    className={cn(
                      "h-full rounded-full transition-[width] duration-700",
                      segment.bar,
                    )}
                    style={{ width: `${Math.min((segment.value / scale) * 100, 100)}%` }}
                  />
                ))}
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {segments.map((segment) => (
                  <li
                    key={segment.label}
                    className="flex items-center gap-2 text-xs text-ink-faint"
                  >
                    <span className={cn("size-1.5 rounded-full", segment.dot)} />
                    {segment.label}
                    <span className="num text-ink">{formatCurrency(segment.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
