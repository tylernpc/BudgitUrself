"use client";

import { useState } from "react";
import type { Budget } from "@/lib/budget/types";
import { useBudget } from "../lib/use-budget";
import { AddBillDialog } from "./add-bill-dialog";
import { AddExpenseDialog } from "./add-expense-dialog";
import { AddMonthlyExpenseDialog } from "./add-monthly-expense-dialog";
import { CurrentStateCard } from "./current-state-card";
import { EditIncomeDialog } from "./edit-income-dialog";
import { ExpensesCard } from "./expenses-card";
import { HorizonView } from "./horizon-view";
import { MonthlyBillsCard } from "./monthly-bills-card";

type DialogName = "expense" | "monthlyExpense" | "bill" | "income";

export function BudgetWorkspace({ initialBudget }: { initialBudget: Budget }) {
  const { budget, summary, dispatch } = useBudget(initialBudget);
  const [openDialog, setOpenDialog] = useState<DialogName | null>(null);

  const close = () => setOpenDialog(null);

  return (
    <>
      <HorizonView bankBalance={budget.bankBalance} summary={summary} />

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <CurrentStateCard
          bankBalance={budget.bankBalance}
          creditCards={budget.creditCards}
          oneOffExpenses={budget.oneOffExpenses}
          summary={summary}
          onAddExpense={() => setOpenDialog("expense")}
          onRemoveExpense={(id) => dispatch({ type: "removeOneOffExpense", id })}
        />
        <ExpensesCard
          monthlyIncome={budget.monthlyIncome}
          monthlyExpenses={budget.monthlyExpenses}
          summary={summary}
          onEditIncome={() => setOpenDialog("income")}
          onAddExpense={() => setOpenDialog("monthlyExpense")}
          onRemoveExpense={(id) => dispatch({ type: "removeMonthlyExpense", id })}
        />
      </div>

      <MonthlyBillsCard
        summary={summary}
        onAddBill={() => setOpenDialog("bill")}
        onRemoveBill={(id) => dispatch({ type: "removeBill", id })}
      />

      <AddExpenseDialog
        open={openDialog === "expense"}
        onOpenChange={close}
        onAdd={(expense) => dispatch({ type: "addOneOffExpense", expense })}
      />
      <AddMonthlyExpenseDialog
        open={openDialog === "monthlyExpense"}
        onOpenChange={close}
        onAdd={(expense) => dispatch({ type: "addMonthlyExpense", expense })}
      />
      <AddBillDialog
        open={openDialog === "bill"}
        onOpenChange={close}
        onAdd={(bill) => dispatch({ type: "addBill", bill })}
        creditCards={budget.creditCards.map((card) => card.name)}
      />
      <EditIncomeDialog
        open={openDialog === "income"}
        onOpenChange={close}
        currentIncome={budget.monthlyIncome}
        onSave={(monthlyIncome) => dispatch({ type: "setMonthlyIncome", monthlyIncome })}
      />
    </>
  );
}
