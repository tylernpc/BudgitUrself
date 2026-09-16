import { CalendarClock, CreditCard, Home, Users } from "lucide-react";
import { formatWholeCurrency } from "@/lib/format";

const digitalBills = [
  { name: "Netflix", category: "Entertainment", card: "Chase Sapphire", day: 1, amount: 15.49 },
  { name: "Spotify", category: "Entertainment", card: "Amex Gold", day: 5, amount: 11.99 },
  { name: "Adobe CC", category: "Software", card: "Chase Sapphire", day: 12, amount: 54.99 },
];

const recurringBills = [
  { name: "Rent", day: 1, amount: 1450 },
  { name: "Car insurance", day: 8, amount: 132 },
];

const personalBills = [
  { name: "YMCA Membership", owedTo: "Dad", day: 1, amount: 20 },
  { name: "Storage unit", owedTo: "Sam", day: 15, amount: 65 },
];

const digitalTotal = digitalBills.reduce((total, bill) => total + bill.amount, 0);
const recurringTotal = recurringBills.reduce((total, bill) => total + bill.amount, 0);
const personalTotal = personalBills.reduce((total, bill) => total + bill.amount, 0);

function PanelHead({ icon, tone, title }: { icon: React.ReactNode; tone: string; title: string }) {
  return (
    <header className="flex items-center gap-3 border-b border-hairline px-5 py-4 sm:px-6">
      <span
        className={`grid size-8 place-items-center rounded-md border border-hairline bg-quiet [&_svg]:size-4 ${tone}`}
      >
        {icon}
      </span>
      <h3 className="text-sm font-semibold tracking-tight text-ink">{title}</h3>
    </header>
  );
}

function DayChip({ day, tone }: { day: number; tone: string }) {
  return (
    <span
      className={`grid size-9 shrink-0 place-content-center justify-items-center rounded-md border ${tone}`}
    >
      <span className="text-[8px] font-semibold tracking-[0.04em] text-ink-ghost uppercase">
        day
      </span>
      <span className="num text-xs leading-tight font-semibold text-ink">{day}</span>
    </span>
  );
}

export function MonthlyBillsPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="reveal mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold text-brand">The detail</span>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Every bill, on its day
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink-faint">
          Subscriptions that charge a card automatically, fixed charges like rent, and the people
          you pay back yourself.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="surface reveal" style={{ animationDelay: "60ms" }}>
          <PanelHead icon={<Home />} tone="text-tone-violet" title="Recurring bills" />
          <div className="space-y-2.5 px-5 py-5 sm:px-6">
            {recurringBills.map((bill) => (
              <div key={bill.name} className="surface-quiet flex items-center gap-3 px-3 py-2.5">
                <DayChip day={bill.day} tone="border-tone-violet/25 bg-tone-violet/10" />
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-medium text-ink">{bill.name}</h4>
                  <p className="mt-0.5 text-xs text-ink-ghost">Fixed charge</p>
                </div>
                <p className="num shrink-0 text-sm font-medium text-ink">
                  {formatWholeCurrency(bill.amount)}
                </p>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-hairline pt-4">
              <span className="text-[11px] font-semibold tracking-[0.04em] text-ink-faint uppercase">
                Total recurring bills
              </span>
              <span className="num text-lg font-semibold text-ink">
                {formatWholeCurrency(recurringTotal)}
              </span>
            </div>
          </div>
        </section>

        <section className="surface reveal" style={{ animationDelay: "100ms" }}>
          <PanelHead icon={<CreditCard />} tone="text-tone-indigo" title="Subscriptions" />
          <div className="space-y-2.5 px-5 py-5 sm:px-6">
            {digitalBills.map((bill) => (
              <div key={bill.name} className="surface-quiet flex items-center gap-3 px-3 py-2.5">
                <DayChip day={bill.day} tone="border-tone-indigo/25 bg-tone-indigo/10" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h4 className="truncate text-sm font-medium text-ink">{bill.name}</h4>
                    <span className="rounded border border-hairline bg-panel px-1.5 py-px text-[10px] font-medium text-ink-faint">
                      {bill.category}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-ghost">{bill.card}</p>
                </div>
                <p className="num shrink-0 text-sm font-medium text-ink">
                  {formatWholeCurrency(bill.amount)}
                </p>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-hairline pt-4">
              <span className="text-[11px] font-semibold tracking-[0.04em] text-ink-faint uppercase">
                Total subscriptions
              </span>
              <span className="num text-lg font-semibold text-ink">
                {formatWholeCurrency(digitalTotal)}
              </span>
            </div>
          </div>
        </section>

        <section className="surface reveal" style={{ animationDelay: "140ms" }}>
          <PanelHead icon={<Users />} tone="text-tone-amber" title="Personal owed bills" />
          <div className="space-y-2.5 px-5 py-5 sm:px-6">
            {personalBills.map((bill) => (
              <div key={bill.name} className="surface-quiet flex items-center gap-3 px-3 py-2.5">
                <DayChip day={bill.day} tone="border-tone-amber/25 bg-tone-amber/10" />
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-medium text-ink">{bill.name}</h4>
                  <p className="mt-0.5 text-xs text-ink-ghost">Owed to {bill.owedTo}</p>
                </div>
                <p className="num shrink-0 text-sm font-medium text-ink">
                  {formatWholeCurrency(bill.amount)}
                </p>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-hairline pt-4">
              <span className="text-[11px] font-semibold tracking-[0.04em] text-ink-faint uppercase">
                Total personal bills
              </span>
              <span className="num text-lg font-semibold text-ink">
                {formatWholeCurrency(personalTotal)}
              </span>
            </div>
          </div>
        </section>
      </div>

      <p className="reveal mt-6 flex items-center justify-center gap-2 text-center text-[13px] text-ink-ghost">
        <CalendarClock className="size-3.5" />
        Sorted by the day of the month each one actually charges.
      </p>
    </section>
  );
}
