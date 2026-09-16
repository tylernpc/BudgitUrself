"use client";

import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Compass,
  CreditCard,
  Fuel,
  Loader2,
  ShoppingCart,
  TrendingUp,
  Utensils,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Illustrations: static, token-built stills of the panels they describe */
/* ------------------------------------------------------------------ */

function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "text-[10px] font-semibold tracking-[0.04em] text-ink-faint uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Row({
  icon,
  name,
  amount,
  meter,
}: {
  icon: ReactNode;
  name: string;
  amount: string;
  meter?: number;
}) {
  return (
    <div className="surface-quiet px-3 py-2">
      <div className="flex items-center gap-2 text-xs">
        <span className="text-ink-ghost [&_svg]:size-3.5">{icon}</span>
        <span className="flex-1 truncate font-medium text-ink">{name}</span>
        <span className="num font-medium text-ink">{amount}</span>
      </div>
      {meter !== undefined && (
        <div className="mt-2 h-1 overflow-hidden rounded-sm bg-chip">
          <div className="meter-fill h-full rounded-sm" style={{ width: `${meter}%` }} />
        </div>
      )}
    </div>
  );
}

function HorizonIllustration() {
  return (
    <div className="rounded-lg border border-hairline bg-panel p-4">
      <div className="flex items-center gap-2">
        <Label>The Horizon View</Label>
        <span className="inline-flex items-center gap-1 rounded-md border border-tone-emerald/30 bg-tone-emerald/10 px-1.5 py-px text-[10px] font-medium text-tone-emerald">
          <ArrowUpRight className="size-2.5" />
          Leftover
        </span>
      </div>
      <p className="num mt-2 text-3xl font-semibold tracking-tight text-ink">$1,246.50</p>
      <div className="mt-3 flex h-1.5 gap-0.5 overflow-hidden rounded-sm bg-chip">
        <div className="ribbon wash-violet" style={{ width: "38%" }} />
        <div className="ribbon wash-sky" style={{ width: "6%" }} />
        <div className="ribbon wash-amber" style={{ width: "16%" }} />
        <div className="ribbon wash-emerald" style={{ width: "40%" }} />
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-ink-faint">
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-sm bg-tone-violet" /> Expenses
        </span>
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-sm bg-tone-sky" /> Bills
        </span>
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-sm bg-tone-amber" /> Cards
        </span>
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-sm bg-tone-emerald" /> Left over
        </span>
      </div>
    </div>
  );
}

function PositionIllustration() {
  return (
    <div className="space-y-2">
      <div className="wash wash-emerald flex items-center justify-between rounded-lg px-3 py-2.5">
        <div>
          <Label className="text-tone-emerald">Bank account</Label>
          <p className="num text-lg font-semibold tracking-tight text-ink">$2,410.00</p>
        </div>
      </div>
      <Row icon={<CreditCard />} name="Chase Sapphire" amount="$340.00" meter={7} />
      <div className="wash wash-rose flex items-center justify-between rounded-lg px-3 py-2">
        <Label className="text-tone-rose">Total owed</Label>
        <span className="num text-sm font-semibold text-ink">$340.00</span>
      </div>
    </div>
  );
}

function FlowIllustration() {
  return (
    <div className="space-y-2">
      <div className="wash wash-sky flex items-center justify-between rounded-lg px-3 py-2.5">
        <div>
          <Label className="text-tone-sky">Monthly income · after tax</Label>
          <p className="num text-lg font-semibold tracking-tight text-ink">$3,500.00</p>
        </div>
      </div>
      <Row icon={<ShoppingCart />} name="Groceries" amount="$400.00" meter={55} />
      <Row icon={<Fuel />} name="Gas" amount="$120.00" meter={30} />
      <Row icon={<Utensils />} name="Eating out" amount="$150.00" meter={80} />
    </div>
  );
}

function DayChip({ day, tint }: { day: number; tint: string }) {
  return (
    <span
      className={cn(
        "grid size-8 shrink-0 place-content-center justify-items-center rounded-md border",
        tint,
      )}
    >
      <span className="text-[7px] font-semibold tracking-[0.04em] text-ink-ghost uppercase">
        day
      </span>
      <span className="num text-[11px] leading-tight font-semibold text-ink">{day}</span>
    </span>
  );
}

function BillsIllustration() {
  const violet = "border-tone-violet/25 bg-tone-violet/10";
  const indigo = "border-tone-indigo/25 bg-tone-indigo/10";
  const amber = "border-tone-amber/25 bg-tone-amber/10";
  const bills = [
    { day: 1, name: "Rent", meta: "Fixed charge", amount: "$1,200.00", tint: violet },
    { day: 5, name: "Spotify", meta: "Chase Sapphire", amount: "$11.99", tint: indigo },
    { day: 15, name: "YMCA", meta: "Owed to Dad", amount: "$20.00", tint: amber },
  ];

  return (
    <div className="space-y-2">
      {bills.map((bill) => (
        <div key={bill.name} className="surface-quiet flex items-center gap-2.5 px-3 py-2">
          <DayChip day={bill.day} tint={bill.tint} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-ink">{bill.name}</p>
            <p className="text-[10px] text-ink-ghost">{bill.meta}</p>
          </div>
          <span className="num text-xs font-medium text-ink">{bill.amount}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */

interface Slide {
  icon: typeof Compass;
  accent: string;
  eyebrow: string;
  title: string;
  body: string;
  illustration: ReactNode;
}

const SLIDES: [Slide, ...Slide[]] = [
  {
    icon: Compass,
    accent: "text-brand",
    eyebrow: "The one number",
    title: "Know what's actually free to spend",
    body: "Everything you enter rolls up into the Horizon View: what's in the bank, plus this month's income, minus every bill, expense, and card balance. That's what's genuinely yours.",
    illustration: <HorizonIllustration />,
  },
  {
    icon: Wallet,
    accent: "text-tone-violet",
    eyebrow: "Current position",
    title: "Start with what you hold today",
    body: "Enter your bank balance and each credit card's balance and limit. Card balances count against you right away, not out of next month's paycheck.",
    illustration: <PositionIllustration />,
  },
  {
    icon: TrendingUp,
    accent: "text-tone-emerald",
    eyebrow: "Monthly flow",
    title: "Then what moves each month",
    body: "Add your after-tax income, then the budgets you spend down over the month — groceries, gas, eating out. Log what you spend against each one and watch it fill up; the amount is yours to adjust anytime.",
    illustration: <FlowIllustration />,
  },
  {
    icon: CalendarClock,
    accent: "text-tone-cyan",
    eyebrow: "Monthly bills",
    title: "See each bill on the day it lands",
    body: "Fixed charges go here, not in your budgets: rent and insurance as recurring bills, subscriptions on a card, and money you owe someone. Sorted by charge day and rolled into your totals automatically.",
    illustration: <BillsIllustration />,
  },
];

interface OnboardingTourProps {
  pending: boolean;
  onFinish: () => void;
}

/** A short walkthrough of the four panels; every slide is skippable. */
export function OnboardingTour({ pending, onFinish }: OnboardingTourProps) {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index] ?? SLIDES[0];
  const isLast = index === SLIDES.length - 1;
  const Icon = slide.icon;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5" aria-hidden>
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-5 bg-brand" : "w-1.5 bg-hairline-strong",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={onFinish}
          disabled={pending}
          className="text-xs font-medium text-ink-faint transition-colors hover:text-ink disabled:opacity-50"
        >
          Skip tour
        </button>
      </div>

      <div key={index} className="reveal mt-6">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "grid size-8 place-items-center rounded-md border border-hairline bg-quiet [&_svg]:size-4",
              slide.accent,
            )}
          >
            <Icon />
          </span>
          <span className="text-sm font-medium text-ink-faint">{slide.eyebrow}</span>
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink">{slide.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-faint">{slide.body}</p>

        <div className="mt-6 rounded-lg border border-hairline bg-quiet p-3">
          {slide.illustration}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIndex((i) => i - 1)}
          disabled={index === 0}
          className="h-10"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <p className="num text-xs text-ink-ghost">
          {index + 1} of {SLIDES.length}
        </p>
        {isLast ? (
          <Button type="button" onClick={onFinish} disabled={pending} className="h-10">
            Go to dashboard
            {pending ? <Loader2 className="animate-spin" /> : <ArrowRight className="size-4" />}
          </Button>
        ) : (
          <Button type="button" onClick={() => setIndex((i) => i + 1)} className="h-10">
            Next
            <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
