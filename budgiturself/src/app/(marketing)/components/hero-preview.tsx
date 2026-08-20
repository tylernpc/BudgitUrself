import { ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/format";

/**
 * A still of the real dashboard panel, with figures that add up the way the
 * budget model says they should:
 *   4,820.55 balance + 5,400.00 income − 825.25 owed − 2,427.94 fixed = 6,967.36
 */
const BANK_BALANCE = 4820.55;
const MONTHLY_INCOME = 5400;
const OBLIGATIONS = 825.25;
const MONTHLY_EXPENSES = 2370;
const BILLS = 57.94;

const fixedTotal = MONTHLY_EXPENSES + BILLS;
const afterObligations = BANK_BALANCE - OBLIGATIONS;
const leftOver = MONTHLY_INCOME - fixedTotal;
const horizon = BANK_BALANCE + MONTHLY_INCOME - OBLIGATIONS - fixedTotal;

const segments = [
  { label: "Expenses", value: MONTHLY_EXPENSES, hue: "wash-violet", dot: "bg-tone-violet" },
  { label: "Bills", value: BILLS, hue: "wash-sky", dot: "bg-tone-sky" },
  { label: "Left over", value: leftOver, hue: "wash-emerald", dot: "bg-tone-emerald" },
];

function Tile({ label, value }: { label: string; value: number }) {
  return (
    <div className="surface-quiet px-4 py-3">
      <span className="text-[10px] font-medium tracking-[0.18em] text-ink-ghost uppercase">
        {label}
      </span>
      <p className="num mt-1.5 text-lg font-medium tracking-tight text-ink">
        {formatCurrency(value)}
      </p>
    </div>
  );
}

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
            Clear to spend
          </span>
        </div>

        <p className="num mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {formatCurrency(horizon)}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Tile label="Liquid cash" value={BANK_BALANCE} />
          <Tile label="After obligations" value={afterObligations} />
        </div>

        <div className="mt-5">
          <div className="flex h-2 gap-1 overflow-hidden rounded-full bg-chip">
            {segments.map((segment) => (
              <div
                key={segment.label}
                className={`ribbon meter h-full rounded-full ${segment.hue}`}
                style={{ width: `${(segment.value / MONTHLY_INCOME) * 100}%` }}
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
