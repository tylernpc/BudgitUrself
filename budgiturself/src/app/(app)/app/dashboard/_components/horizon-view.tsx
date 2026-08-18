import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { BudgetSummary } from "@/lib/budget/calculations";

interface HorizonViewProps {
  bankBalance: number;
  summary: BudgetSummary;
}

export function HorizonView({ bankBalance, summary }: HorizonViewProps) {
  return (
    <Card className="mb-8 border-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 shadow-2xl shadow-blue-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl text-white">
          <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur">
            <TrendingUp className="size-6 text-white" />
          </div>
          The Horizon View
        </CardTitle>
        <CardDescription className="text-blue-50">
          Your true financial position after all obligations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white/95 p-6 backdrop-blur">
            <p className="mb-2 text-xs font-medium tracking-wide text-blue-600 uppercase">
              Current Liquid Cash
            </p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(bankBalance)}</p>
            <div className="mt-3 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
          </div>

          <div className="rounded-xl bg-white/95 p-6 backdrop-blur">
            <p className="mb-2 text-xs font-medium tracking-wide text-blue-600 uppercase">
              After Current Obligations
            </p>
            <p
              className={`text-3xl font-bold ${
                summary.trueLiquidWealth >= 0 ? "text-gray-900" : "text-red-600"
              }`}
            >
              {formatCurrency(summary.trueLiquidWealth)}
            </p>
            <div
              className={`mt-3 h-1 rounded-full ${
                summary.trueLiquidWealth >= 0
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-red-500 to-rose-500"
              }`}
            />
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 p-6">
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-white/10 blur-3xl" />
            <p className="relative z-10 mb-2 text-xs font-bold tracking-wide text-yellow-950 uppercase">
              True Leftover (This Month)
            </p>
            <p
              className={`relative z-10 text-3xl font-bold ${
                summary.horizonView >= 0 ? "text-white" : "text-red-900"
              }`}
            >
              {formatCurrency(summary.horizonView)}
            </p>
            <p className="relative z-10 mt-2 text-xs text-yellow-950/80">
              Balance + Income − All Obligations
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
