"use client";

import { useCallback, useState } from "react";
import { ArrowRight, Car, Home, ShoppingBag, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatWholeCurrency } from "@/lib/format";

const MAX_AMOUNT = 9_999_999;
const SHAKE_DURATION_MS = 450;

type FieldName = "paycheck" | "rent" | "utilities" | "car";

const EXPENSE_FIELDS = [
  { name: "rent", label: "Rent/Mortgage", icon: Home },
  { name: "utilities", label: "Utilities", icon: null },
  { name: "car", label: "Car Payment", icon: Car },
] as const satisfies readonly { name: FieldName; label: string; icon: typeof Home | null }[];

const isWithinLimit = (raw: string) => {
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 && value <= MAX_AMOUNT;
};

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

  return (
    <section className="bg-linear-to-b from-gray-50 to-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl text-gray-900 sm:text-5xl">See It In Action</h2>
          <p className="text-xl text-gray-600">
            Try our interactive calculator to see how budgeting becomes effortless
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
          <Card className="border-2 border-green-200 bg-green-50/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-green-500">
                  <Wallet className="size-5 text-white" />
                </div>
                <CardTitle className="text-green-900">Your Paycheck</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Label htmlFor="paycheck" className="text-green-900">
                Monthly Income
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
                className={`mt-1 bg-white ${
                  rejectedField === "paycheck"
                    ? "animate-input-shake border-destructive"
                    : "border-green-300"
                }`}
              />
              <p className="mt-3 text-sm text-green-700">This is what you earn each month</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-orange-50/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-orange-500">
                  <ShoppingBag className="size-5 text-white" />
                </div>
                <CardTitle className="text-orange-900">Your Expenses</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {EXPENSE_FIELDS.map(({ name, label, icon: Icon }) => (
                <div key={name}>
                  <Label htmlFor={name} className="flex items-center gap-2 text-orange-900">
                    {Icon ? <Icon className="size-4" /> : null}
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
                    className="mt-1 border-orange-300 bg-white"
                  />
                </div>
              ))}
              <div className="border-t border-orange-300 pt-2">
                <p className="text-sm text-orange-700">Total Expenses</p>
                <p className="text-2xl text-orange-900">{formatWholeCurrency(totalExpenses)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-500">
                  <ArrowRight className="size-5 text-white" />
                </div>
                <CardTitle className="text-blue-900">Available to Spend</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="mb-2 text-sm text-blue-700">Your Extra Money</p>
                <p className="mb-2 text-5xl text-blue-900">
                  {formatWholeCurrency(availableSpending)}
                </p>
                <Badge
                  variant={availableSpending > 0 ? "default" : "destructive"}
                  className="text-sm"
                >
                  {availableSpending > 0 ? "On Track" : "Over Budget"}
                </Badge>
              </div>
              <div className="border-t border-blue-300 pt-4">
                <p className="mb-3 text-sm text-blue-700">This can be allocated to:</p>
                <ul className="space-y-2">
                  {[
                    { label: "Savings", emoji: "💰" },
                    { label: "Entertainment", emoji: "🎬" },
                    { label: "Dining Out", emoji: "🍽️" },
                  ].map(({ label, emoji }) => (
                    <li key={label} className="flex items-center justify-between text-sm">
                      <span className="text-blue-900">{label}</span>
                      <Badge variant="outline" className="bg-white">
                        {emoji}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
