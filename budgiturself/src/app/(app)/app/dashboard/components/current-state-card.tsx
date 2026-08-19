import { CreditCard as CreditCardIcon, Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { creditUtilization } from "@/lib/budget/calculations";
import type { BudgetSummary } from "@/lib/budget/calculations";
import type { CreditCard, OneOffExpense } from "@/lib/budget/types";
import { formatCurrency, formatIsoDate, formatPercent, formatWholeCurrency } from "@/lib/format";
import { RemoveButton } from "./remove-button";

interface CurrentStateCardProps {
  bankBalance: number;
  creditCards: CreditCard[];
  oneOffExpenses: OneOffExpense[];
  summary: BudgetSummary;
  onEditBankBalance: () => void;
  onAddCreditCard: () => void;
  onRemoveCreditCard: (id: string) => void;
  onAddExpense: () => void;
  onRemoveExpense: (id: string) => void;
}

export function CurrentStateCard({
  bankBalance,
  creditCards,
  oneOffExpenses,
  summary,
  onEditBankBalance,
  onAddCreditCard,
  onRemoveCreditCard,
  onAddExpense,
  onRemoveExpense,
}: CurrentStateCardProps) {
  return (
    <Card className="border-0 bg-slate-900/50 shadow-xl backdrop-blur-xl">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="flex items-center gap-3 text-lg text-white">
          <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-2 shadow-lg shadow-purple-500/50">
            <Wallet className="size-5 text-white" />
          </div>
          Current Financial State
        </CardTitle>
        <CardDescription className="text-gray-400">
          Your liquid assets and current obligations
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="rounded-xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-xs font-medium tracking-wide text-green-400 uppercase">
              Bank Account Balance
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={onEditBankBalance}
              className="h-7 border-gray-600 text-xs text-gray-300 hover:border-green-500 hover:bg-slate-800 hover:text-white"
            >
              Edit
            </Button>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(bankBalance)}</p>
        </div>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">Credit Cards</h3>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1 text-sm font-medium text-white">
                {formatCurrency(summary.creditCardDebt)}
              </span>
              <Button
                size="sm"
                onClick={onAddCreditCard}
                className="h-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-xs shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-cyan-700"
              >
                <Plus className="mr-1 size-3" />
                Add
              </Button>
            </div>
          </div>
          {creditCards.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">No credit cards added yet</p>
          ) : (
            <ul className="space-y-3">
              {creditCards.map((card) => (
                <li key={card.id} className="rounded-xl border border-gray-700 bg-slate-800/50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-white">
                      <CreditCardIcon className="size-4 text-blue-400" />
                      {card.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-300">
                        {formatCurrency(card.balance)}
                      </span>
                      <RemoveButton
                        label={`Remove ${card.name}`}
                        onClick={() => onRemoveCreditCard(card.id)}
                      />
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                      style={{ width: formatPercent(creditUtilization(card)) }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    {formatPercent(creditUtilization(card))} of {formatWholeCurrency(card.limit)}{" "}
                    limit
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">One-Off Expenses</h3>
            <Button
              size="sm"
              onClick={onAddExpense}
              className="h-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-xs shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-cyan-700"
            >
              <Plus className="mr-1 size-3" />
              Add
            </Button>
          </div>
          {oneOffExpenses.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">No expenses</p>
          ) : (
            <ul className="space-y-2">
              {oneOffExpenses.map((expense) => (
                <li
                  key={expense.id}
                  className="flex items-center justify-between rounded-xl border border-gray-700 bg-slate-800/50 p-3"
                >
                  <div>
                    <p className="text-sm text-white">{expense.name}</p>
                    <p className="text-xs text-gray-400">{formatIsoDate(expense.date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-300">
                      {formatCurrency(expense.amount)}
                    </span>
                    <RemoveButton
                      label={`Remove ${expense.name}`}
                      onClick={() => onRemoveExpense(expense.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="rounded-xl border-2 border-red-500/30 bg-gradient-to-br from-red-500/10 to-orange-500/10 p-4">
          <p className="mb-1 text-xs font-medium tracking-wide text-red-400 uppercase">
            Total Current Obligations
          </p>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(summary.currentObligations)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
