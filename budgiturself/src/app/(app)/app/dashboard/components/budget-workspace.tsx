"use client";

import { useState, useTransition } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { summarizeBudget } from "@/lib/budget/calculations";
import type { Budget } from "@/lib/budget/types";
import {
  addBillAction,
  addCreditCardAction,
  addMonthlyExpenseAction,
  addOneOffExpenseAction,
  removeBillAction,
  removeCreditCardAction,
  removeMonthlyExpenseAction,
  removeOneOffExpenseAction,
  setBankBalanceAction,
  setMonthlyIncomeAction,
  type ActionResult,
} from "../lib/actions";
import { AddBillDialog } from "./add-bill-dialog";
import { AddCreditCardDialog } from "./add-credit-card-dialog";
import { AddExpenseDialog } from "./add-expense-dialog";
import { AddMonthlyExpenseDialog } from "./add-monthly-expense-dialog";
import { CurrentStateCard } from "./current-state-card";
import { EditBankBalanceDialog } from "./edit-bank-balance-dialog";
import { EditIncomeDialog } from "./edit-income-dialog";
import { ExpensesCard } from "./expenses-card";
import { HorizonView } from "./horizon-view";
import { MonthlyBillsCard } from "./monthly-bills-card";
import { Reveal } from "./reveal";

type DialogName = "expense" | "monthlyExpense" | "bill" | "income" | "creditCard" | "bankBalance";

export function BudgetWorkspace({ budget }: { budget: Budget }) {
  const [openDialog, setOpenDialog] = useState<DialogName | null>(null);
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const summary = summarizeBudget(budget);

  const close = () => setOpenDialog(null);

  const run = (action: () => Promise<ActionResult>) => {
    setError(undefined);
    startTransition(async () => {
      const result = await action();
      if (result.error) setError(result.error);
    });
  };

  return (
    <>
      {error && (
        <div
          role="alert"
          className="reveal mb-6 flex items-start gap-3 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3.5 text-sm text-tone-rose backdrop-blur"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        <Reveal delay={80}>
          <HorizonView
            bankBalance={budget.bankBalance}
            monthlyIncome={budget.monthlyIncome}
            summary={summary}
          />
        </Reveal>

        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <Reveal delay={180} className="h-full">
            <CurrentStateCard
              bankBalance={budget.bankBalance}
              creditCards={budget.creditCards}
              oneOffExpenses={budget.oneOffExpenses}
              summary={summary}
              onEditBankBalance={() => setOpenDialog("bankBalance")}
              onAddCreditCard={() => setOpenDialog("creditCard")}
              onRemoveCreditCard={(id) => run(() => removeCreditCardAction(id))}
              onAddExpense={() => setOpenDialog("expense")}
              onRemoveExpense={(id) => run(() => removeOneOffExpenseAction(id))}
            />
          </Reveal>

          <Reveal delay={260} className="h-full">
            <ExpensesCard
              monthlyIncome={budget.monthlyIncome}
              monthlyExpenses={budget.monthlyExpenses}
              summary={summary}
              onEditIncome={() => setOpenDialog("income")}
              onAddExpense={() => setOpenDialog("monthlyExpense")}
              onRemoveExpense={(id) => run(() => removeMonthlyExpenseAction(id))}
            />
          </Reveal>
        </div>

        <Reveal delay={340}>
          <MonthlyBillsCard
            summary={summary}
            onAddBill={() => setOpenDialog("bill")}
            onRemoveBill={(id) => run(() => removeBillAction(id))}
          />
        </Reveal>
      </div>

      <div
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center transition-all duration-300 ${
          isPending ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <span className="flex items-center gap-2 rounded-full border border-hairline bg-panel px-4 py-2 text-xs text-ink-muted shadow-2xl backdrop-blur-xl">
          <Loader2 className={`size-3.5 text-tone-cyan ${isPending ? "animate-spin" : ""}`} />
          {isPending ? "Saving changes" : ""}
        </span>
      </div>

      <AddExpenseDialog
        open={openDialog === "expense"}
        onOpenChange={close}
        onAdd={(expense) => run(() => addOneOffExpenseAction(expense))}
      />
      <AddMonthlyExpenseDialog
        open={openDialog === "monthlyExpense"}
        onOpenChange={close}
        onAdd={(expense) => run(() => addMonthlyExpenseAction(expense))}
      />
      <AddBillDialog
        open={openDialog === "bill"}
        onOpenChange={close}
        onAdd={(bill) => run(() => addBillAction(bill))}
        creditCards={budget.creditCards.map((card) => card.name)}
      />
      <AddCreditCardDialog
        open={openDialog === "creditCard"}
        onOpenChange={close}
        onAdd={(card) => run(() => addCreditCardAction(card))}
      />
      <EditIncomeDialog
        open={openDialog === "income"}
        onOpenChange={close}
        currentIncome={budget.monthlyIncome}
        onSave={(monthlyIncome) => run(() => setMonthlyIncomeAction({ monthlyIncome }))}
      />
      <EditBankBalanceDialog
        open={openDialog === "bankBalance"}
        onOpenChange={close}
        currentBalance={budget.bankBalance}
        onSave={(bankBalance) => run(() => setBankBalanceAction({ bankBalance }))}
      />
    </>
  );
}
