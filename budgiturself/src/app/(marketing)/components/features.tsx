import { CalendarClock, CreditCard, TrendingUp, Wallet } from "lucide-react";

const features = [
  {
    icon: Wallet,
    tone: "text-tone-violet",
    title: "Track your paycheck",
    description: "Enter what you take home and let every dollar get a job before you spend it.",
  },
  {
    icon: TrendingUp,
    tone: "text-tone-emerald",
    title: "Subtract what is fixed",
    description: "Housing, groceries, the bills that arrive whether you think about them or not.",
  },
  {
    icon: CalendarClock,
    tone: "text-tone-cyan",
    title: "See when it leaves",
    description: "Every recurring charge, broken out by the day of the month it actually lands.",
  },
  {
    icon: CreditCard,
    tone: "text-tone-indigo",
    title: "Count what you owe",
    description:
      "Card balances come off the top of what's coming in, not out of next month's hope.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="reveal mx-auto max-w-2xl text-center">
        <span className="text-[11px] font-medium tracking-[0.2em] text-tone-cyan uppercase">
          How it works
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-[2.5rem]">
          Four numbers, honestly counted
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink-faint">
          Nothing here is estimated on your behalf. That is the whole point.
        </p>
      </div>

      <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, tone, title, description }, index) => (
          <article
            key={title}
            className="surface lift reveal p-6"
            style={{ animationDelay: `${100 + index * 80}ms` }}
          >
            <span
              className={`grid size-10 place-items-center rounded-2xl bg-chip ring-1 ring-hairline ${tone}`}
            >
              <Icon className="size-[18px]" />
            </span>
            <h3 className="mt-4 text-[15px] font-medium tracking-tight text-ink">{title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-faint">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
