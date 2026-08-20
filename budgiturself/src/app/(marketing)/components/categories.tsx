import { CreditCard, Tag } from "lucide-react";
import { formatWholeCurrency } from "@/lib/format";

const cards = [
  { name: "Chase Sapphire", type: "Credit", amount: 432, dot: "bg-tone-sky" },
  { name: "Bank of America", type: "Debit", amount: 289, dot: "bg-tone-emerald" },
  { name: "Amex Gold", type: "Credit", amount: 156, dot: "bg-tone-amber" },
];

const categories = [
  { name: "Groceries", amount: 340, hue: "wash-emerald" },
  { name: "Dining", amount: 220, hue: "wash-amber" },
  { name: "Entertainment", amount: 180, hue: "wash-violet" },
  { name: "Shopping", amount: 137, hue: "wash-rose" },
];

const cardsTotal = cards.reduce((total, card) => total + card.amount, 0);
const categoriesTotal = categories.reduce((total, category) => total + category.amount, 0);

function PanelHead({ icon, tone, title }: { icon: React.ReactNode; tone: string; title: string }) {
  return (
    <header className="flex items-center gap-3 border-b border-hairline px-5 py-4 sm:px-7">
      <span
        className={`grid size-10 place-items-center rounded-2xl bg-chip ring-1 ring-hairline [&_svg]:size-[18px] ${tone}`}
      >
        {icon}
      </span>
      <h3 className="text-[15px] font-medium tracking-tight text-ink">{title}</h3>
    </header>
  );
}

export function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="reveal mx-auto max-w-2xl text-center">
        <span className="text-[11px] font-medium tracking-[0.2em] text-tone-cyan uppercase">
          The detail
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-[2.5rem]">
          Track every dollar
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink-faint">
          Organised by card and by category, so the total is never a mystery.
        </p>
      </div>

      <div className="mt-9 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="surface lift reveal" style={{ animationDelay: "100ms" }}>
          <PanelHead icon={<CreditCard />} tone="text-tone-indigo" title="Spending by card" />
          <div className="space-y-2.5 px-5 py-5 sm:px-7">
            {cards.map((card) => (
              <div
                key={card.name}
                className="surface-quiet flex items-center justify-between gap-3 px-4 py-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`${card.dot} size-2.5 shrink-0 rounded-full`} />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">{card.name}</p>
                    <p className="mt-0.5 text-[11px] tracking-wide text-ink-ghost uppercase">
                      {card.type}
                    </p>
                  </div>
                </div>
                <p className="num shrink-0 text-sm text-ink-muted">
                  {formatWholeCurrency(card.amount)}
                </p>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-hairline pt-4">
              <span className="text-[10px] font-medium tracking-[0.18em] text-ink-faint uppercase">
                Total spending
              </span>
              <span className="num text-xl font-medium text-ink">
                {formatWholeCurrency(cardsTotal)}
              </span>
            </div>
          </div>
        </section>

        <section className="surface lift reveal" style={{ animationDelay: "180ms" }}>
          <PanelHead icon={<Tag />} tone="text-tone-violet" title="Spending by category" />
          <div className="space-y-4 px-5 py-5 sm:px-7">
            {categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-ink">{category.name}</p>
                  <p className="num text-sm text-ink-muted">
                    {formatWholeCurrency(category.amount)}
                  </p>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-chip">
                  <div
                    className={`ribbon meter h-full rounded-full ${category.hue}`}
                    style={{
                      width: `${Math.round((category.amount / categoriesTotal) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-hairline pt-4">
              <span className="text-[10px] font-medium tracking-[0.18em] text-ink-faint uppercase">
                Total categorised
              </span>
              <span className="num text-xl font-medium text-ink">
                {formatWholeCurrency(categoriesTotal)}
              </span>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
