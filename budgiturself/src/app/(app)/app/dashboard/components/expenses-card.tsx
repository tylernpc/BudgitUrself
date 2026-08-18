import { Home, Plus, Receipt, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BudgetSummary } from "@/lib/budget/calculations";
import type { MonthlyExpense } from "@/lib/budget/types";
import { formatCurrency } from "@/lib/format";
import { RemoveButton } from "./remove-button";

interface ExpensesCardProps {
  monthlyIncome: number;
  monthlyExpenses: MonthlyExpense[];
  summary: BudgetSummary;
  onEditIncome: () => void;
  onAddExpense: () => void;
  onRemoveExpense: (id: string) => void;
}

export function ExpensesCard({
  monthlyIncome,
  monthlyExpenses,
  summary,
  onEditIncome,
  onAddExpense,
  onRemoveExpense,
}: ExpensesCardProps) {
  return (
    <Card className="border-0 bg-slate-900/50 shadow-xl backdrop-blur-xl">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="flex items-center gap-3 text-lg text-white">
          <div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 p-2 shadow-lg shadow-green-500/50">
            <TrendingUp className="size-5 text-white" />
          </div>
          Expenses
        </CardTitle>
        <CardDescription className="text-gray-400">
          Your monthly income and where it goes
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">Monthly Income (After Tax)</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={onEditIncome}
              className="h-8 border-gray-600 text-xs text-gray-300 hover:border-blue-500 hover:bg-slate-800 hover:text-white"
            >
              Edit
            </Button>
          </div>
          <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4">
            <p className="text-2xl font-bold text-white">{formatCurrency(monthlyIncome)}</p>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">Expenses</h3>
            <Button
              size="sm"
              onClick={onAddExpense}
              className="h-8 bg-gradient-to-r from-green-600 to-emerald-600 text-xs shadow-lg shadow-green-500/30 hover:from-green-700 hover:to-emerald-700"
            >
              <Plus className="mr-1 size-3" />
              Add
            </Button>
          </div>
          <ul className="space-y-2">
            {monthlyExpenses.map((expense) => (
              <li
                key={expense.id}
                className="flex items-center justify-between rounded-xl border border-gray-700 bg-slate-800/50 p-3"
              >
                <span className="flex items-center gap-2">
                  <span className="rounded-lg bg-purple-500/20 p-1.5">
                    <Home className="size-4 text-purple-400" />
                  </span>
                  <span className="text-sm text-white">{expense.name}</span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-300">
                    {formatCurrency(expense.amount)}
                  </span>
                  <RemoveButton
                    label={`Remove ${expense.name}`}
                    onClick={() => onRemoveExpense(expense.id)}
                  />
                </span>
              </li>
            ))}
            <li className="flex items-center justify-between rounded-xl border border-gray-700 bg-slate-800/50 p-3">
              <span className="flex items-center gap-2">
                <span className="rounded-lg bg-cyan-500/20 p-1.5">
                  <Receipt className="size-4 text-cyan-400" />
                </span>
                <span className="text-sm text-white">Digital Bills</span>
              </span>
              <span className="text-sm font-medium text-gray-300">
                {formatCurrency(summary.digitalBillsTotal)}
              </span>
            </li>
            <li className="flex items-center justify-between rounded-xl border border-gray-700 bg-slate-800/50 p-3">
              <span className="flex items-center gap-2">
                <span className="rounded-lg bg-orange-500/20 p-1.5">
                  <Users className="size-4 text-orange-400" />
                </span>
                <span className="text-sm text-white">Personal Owed Bills</span>
              </span>
              <span className="text-sm font-medium text-gray-300">
                {formatCurrency(summary.personalBillsTotal)}
              </span>
            </li>
          </ul>
        </section>

        <div className="rounded-xl border border-gray-700 bg-slate-800/50 p-4">
          <p className="mb-1 text-xs font-medium tracking-wide text-gray-400 uppercase">
            Total Expenses
          </p>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(summary.fixedExpensesTotal)}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-4 shadow-xl shadow-blue-500/30">
          <div className="absolute -top-10 -right-10 size-40 rounded-full bg-white/10 blur-3xl" />
          <p className="relative z-10 mb-1 text-xs font-bold tracking-wide text-blue-100 uppercase">
            Total After Expenses
          </p>
          <p
            className={`relative z-10 text-2xl font-bold ${
              summary.safeToSpend >= 0 ? "text-white" : "text-red-200"
            }`}
          >
            {formatCurrency(summary.safeToSpend)}
          </p>
          <p className="relative z-10 mt-2 text-xs text-blue-100">Income − Expenses</p>
        </div>
      </CardContent>
    </Card>
  );
}
