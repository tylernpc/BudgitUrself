"use client";

import { useState, useTransition } from "react";
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

type DialogName = "expense" | "monthlyExpense" | "bill" | "income" | "creditCard" | "bankBalance";

export function BudgetWorkspace({ budget }: { budget: Budget }) {
  const [openDialog, setOpenDialog] = useState<DialogName | null>(null);
  const [error, setError] = useState<string>();
  const [, startTransition] = useTransition();
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
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <HorizonView bankBalance={budget.bankBalance} summary={summary} />

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
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
        <ExpensesCard
          monthlyIncome={budget.monthlyIncome}
          monthlyExpenses={budget.monthlyExpenses}
          summary={summary}
          onEditIncome={() => setOpenDialog("income")}
          onAddExpense={() => setOpenDialog("monthlyExpense")}
          onRemoveExpense={(id) => run(() => removeMonthlyExpenseAction(id))}
        />
      </div>

      <MonthlyBillsCard
        summary={summary}
        onAddBill={() => setOpenDialog("bill")}
        onRemoveBill={(id) => run(() => removeBillAction(id))}
      />

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
