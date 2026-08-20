import { ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/format";

/**
 * A still of the real dashboard panel, with figures that add up the way the
 * budget model says they should:
 *   4,820.55 balance + 5,400.00 income − 825.25 owed − 2,427.94 fixed = 6,967.36
 */
const BANK_BALANCE = 4820.55;
const MONTHLY_INCOME = 5400;
const CREDIT_CARD_DEBT = 825.25;
const MONTHLY_EXPENSES = 2370;
const BILLS = 57.94;

const fixedTotal = MONTHLY_EXPENSES + BILLS;
const safeToSpend = MONTHLY_INCOME - fixedTotal;
const horizon = BANK_BALANCE + MONTHLY_INCOME - CREDIT_CARD_DEBT - fixedTotal;
const scale = Math.max(MONTHLY_INCOME, fixedTotal + CREDIT_CARD_DEBT, 1);

const segments = [
  { label: "Expenses", value: MONTHLY_EXPENSES, hue: "wash-violet", dot: "bg-tone-violet" },
  { label: "Bills", value: BILLS, hue: "wash-sky", dot: "bg-tone-sky" },
  { label: "Credit cards", value: CREDIT_CARD_DEBT, hue: "wash-amber", dot: "bg-tone-amber" },
  { label: "Left over", value: safeToSpend, hue: "wash-emerald", dot: "bg-tone-emerald" },
];

export function HeroPreview() {
  return (
    <div className="surface overflow-hidden">
      <div className="px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-medium tracking-[0.18em] text-ink-ghost uppercase">
            The Horizon View
          </span>
          <span className="wash wash-emerald inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-tone-emerald">
            <ArrowUpRight className="size-3" />
            Leftover
          </span>
        </div>

        <p className="num mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {formatCurrency(horizon)}
        </p>

        <div className="mt-5">
          <span className="text-[10px] font-medium tracking-[0.18em] text-ink-ghost uppercase">
            Monthly income breakdown
          </span>
          <p className="mt-1.5 text-xs text-ink-ghost">
            <span className="num text-ink-faint">
              {formatCurrency(BANK_BALANCE + MONTHLY_INCOME)}
            </span>{" "}
            <span className="text-[11px]">
              ({formatCurrency(BANK_BALANCE)} liquid + {formatCurrency(MONTHLY_INCOME)} income)
            </span>
          </p>
          <div className="mt-3 flex h-2 gap-1 overflow-hidden rounded-full bg-chip">
            {segments.map((segment) => (
              <div
                key={segment.label}
                className={`ribbon meter h-full rounded-full ${segment.hue}`}
                style={{ width: `${Math.min((segment.value / scale) * 100, 100)}%` }}
              />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {segments.map((segment) => (
              <li key={segment.label} className="flex items-center gap-2 text-xs text-ink-faint">
                <span className={`size-1.5 rounded-full ${segment.dot}`} />
                {segment.label}
                <span className="num text-ink-muted">{formatCurrency(segment.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
