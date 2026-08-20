"use client";

import { useCallback, useState } from "react";
import { ArrowRight, Car, Home, ShoppingBag, Wallet, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatWholeCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

const MAX_AMOUNT = 9_999_999;
const SHAKE_DURATION_MS = 450;

const fieldClass =
  "h-11 rounded-xl border-hairline bg-quiet text-ink transition-colors placeholder:text-ink-ghost focus-visible:border-tone-cyan focus-visible:ring-tone-cyan/25";

type FieldName = "paycheck" | "rent" | "utilities" | "car";

const EXPENSE_FIELDS = [
  { name: "rent", label: "Rent/Mortgage", icon: Home },
  { name: "utilities", label: "Utilities", icon: Zap },
  { name: "car", label: "Car Payment", icon: Car },
] as const satisfies readonly { name: FieldName; label: string; icon: typeof Home }[];

const isWithinLimit = (raw: string) => {
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 && value <= MAX_AMOUNT;
};

function PanelHead({ icon, tone, title }: { icon: React.ReactNode; tone: string; title: string }) {
  return (
    <header className="flex items-center gap-3 border-b border-hairline px-5 py-3.5 sm:px-6">
      <span
        className={cn(
          "grid size-9 place-items-center rounded-xl bg-chip ring-1 ring-hairline [&_svg]:size-[17px]",
          tone,
        )}
      >
        {icon}
      </span>
      <h3 className="text-[15px] font-medium tracking-tight text-ink">{title}</h3>
    </header>
  );
}

export function InteractiveDemo() {
  const [values, setValues] = useState<Record<FieldName, string>>({
    paycheck: "3500",
    rent: "1200",
    utilities: "200",
    car: "300",
  });
  const [rejectedField, setRejectedField] = useState<FieldName | null>(null);

  const handleChange = useCallback((field: FieldName, raw: string) => {
    if (raw !== "" && !isWithinLimit(raw)) {
      setRejectedField(field);
      window.setTimeout(() => setRejectedField(null), SHAKE_DURATION_MS);
      return;
    }

    setRejectedField(null);
    setValues((previous) => ({ ...previous, [field]: raw }));
  }, []);

  const amount = (field: FieldName) => Number(values[field]) || 0;
  const totalExpenses = amount("rent") + amount("utilities") + amount("car");
  const availableSpending = amount("paycheck") - totalExpenses;
  const clear = availableSpending > 0;

  return (
    <section id="try-it" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="reveal mx-auto max-w-2xl text-center">
        <span className="text-[11px] font-medium tracking-[0.2em] text-tone-cyan uppercase">
          Try it
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-[2.5rem]">
          The whole idea, in three boxes
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink-faint">
          Change any number. The answer moves with it.
        </p>
      </div>

      <div className="mt-9 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="surface reveal" style={{ animationDelay: "100ms" }}>
          <PanelHead icon={<Wallet />} tone="text-tone-emerald" title="What comes in" />
          <div className="px-5 py-5 sm:px-6">
            <Label htmlFor="paycheck" className="text-[13px] font-medium text-ink-muted">
              Monthly income
            </Label>
            <Input
              id="paycheck"
              type="number"
              inputMode="decimal"
              min={0}
              max={MAX_AMOUNT}
              value={values.paycheck}
              onChange={(event) => handleChange("paycheck", event.target.value)}
              aria-invalid={rejectedField === "paycheck"}
              className={cn(
                "num mt-2",
                fieldClass,
                rejectedField === "paycheck" && "animate-input-shake border-destructive",
              )}
            />
            <p className="mt-3 text-[13px] text-ink-ghost">Take-home pay, after tax.</p>
          </div>
        </section>

        <section className="surface reveal" style={{ animationDelay: "180ms" }}>
          <PanelHead icon={<ShoppingBag />} tone="text-tone-amber" title="What goes out" />
          <div className="space-y-4 px-5 py-5 sm:px-6">
            {EXPENSE_FIELDS.map(({ name, label, icon: Icon }) => (
              <div key={name}>
                <Label
                  htmlFor={name}
                  className="flex items-center gap-2 text-[13px] font-medium text-ink-muted"
                >
                  <Icon className="size-3.5 text-ink-ghost" />
                  {label}
                </Label>
                <Input
                  id={name}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={MAX_AMOUNT}
                  value={values[name]}
                  onChange={(event) => handleChange(name, event.target.value)}
                  aria-invalid={rejectedField === name}
                  className={cn(
                    "num mt-2",
                    fieldClass,
                    rejectedField === name && "animate-input-shake border-destructive",
                  )}
                />
              </div>
            ))}
            <div className="wash wash-amber flex items-center justify-between rounded-2xl px-4 py-3">
              <span className="text-[10px] font-medium tracking-[0.18em] text-tone-amber uppercase">
                Total expenses
              </span>
              <span className="num text-lg font-medium text-ink">
                {formatWholeCurrency(totalExpenses)}
              </span>
            </div>
          </div>
        </section>

        <section className="surface reveal" style={{ animationDelay: "260ms" }}>
          <PanelHead icon={<ArrowRight />} tone="text-tone-sky" title="What is left" />
          <div className="px-5 py-5 sm:px-6">
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl px-5 py-5 ring-1 ring-hairline",
                clear ? "wash-surplus" : "wash-shortfall",
              )}
            >
              <span className="text-[10px] font-medium tracking-[0.18em] text-ink-faint uppercase">
                Free to spend
              </span>
              <p
                className={cn(
                  "num mt-2 text-4xl font-semibold tracking-tight",
                  clear ? "text-ink" : "text-tone-rose",
                )}
              >
                {formatWholeCurrency(availableSpending)}
              </p>
              <span
                className={cn(
                  "wash mt-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium",
                  clear ? "wash-emerald text-tone-emerald" : "wash-rose text-tone-rose",
                )}
              >
                {clear ? "On track" : "Over budget"}
              </span>
            </div>

            <p className="mt-4 text-[13px] text-ink-faint">This is what can go toward:</p>
            <ul className="mt-3 space-y-2">
              {["Savings", "Entertainment", "Dining out"].map((label) => (
                <li
                  key={label}
                  className="surface-quiet flex items-center justify-between px-4 py-2.5 text-sm text-ink"
                >
                  {label}
                  <span className="text-ink-ghost">—</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </section>
  );
}
