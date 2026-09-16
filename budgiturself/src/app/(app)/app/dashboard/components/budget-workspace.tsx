"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { summarizeBudget } from "@/lib/budget/calculations";
import type { Bill, Budget, CreditCard, MonthlyExpense } from "@/lib/budget/types";
import {
  addBillAction,
  addCreditCardAction,
  addCreditCardChargeAction,
  addMonthlyExpenseAction,
  addMonthlyExpenseContributionAction,
  removeBillAction,
  removeCreditCardAction,
  removeMonthlyExpenseAction,
  setBankBalanceAction,
  setMonthlyIncomeAction,
  updateBillAction,
  updateCreditCardAction,
  updateMonthlyExpenseAction,
  type ActionResult,
} from "../lib/actions";
import { budgetReducer, type OptimisticBudgetAction } from "../lib/budget-reducer";
import { BillDialog } from "./bill-dialog";
import { AddChargeDialog } from "./add-charge-dialog";
import { AddCreditCardDialog } from "./add-credit-card-dialog";
import { AddExpenseContributionDialog } from "./add-expense-contribution-dialog";
import { MonthlyExpenseDialog } from "./monthly-expense-dialog";
import { CurrentStateCard } from "./current-state-card";
import { EditBankBalanceDialog } from "./edit-bank-balance-dialog";
import { EditCreditCardDialog } from "./edit-credit-card-dialog";
import { EditIncomeDialog } from "./edit-income-dialog";
import { ExpensesCard } from "./expenses-card";
import { HorizonView } from "./horizon-view";
import { MobileDashboardNav, type DashboardPage } from "./mobile-dashboard-nav";
import { MonthlyBillsCard } from "./monthly-bills-card";
import { Reveal } from "./reveal";

type DialogName = "monthlyExpense" | "bill" | "income" | "creditCard" | "bankBalance";

export function BudgetWorkspace({ budget }: { budget: Budget }) {
  const [openDialog, setOpenDialog] = useState<DialogName | null>(null);
  // Held separately from `openDialog`: these dialogs need to know *which* card.
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [chargingCard, setChargingCard] = useState<CreditCard | null>(null);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [editingExpense, setEditingExpense] = useState<MonthlyExpense | null>(null);
  const [chargingExpense, setChargingExpense] = useState<MonthlyExpense | null>(null);
  const [error, setError] = useState<string>();
  // Below `lg`, the dashboard pages between sections via `MobileDashboardNav`
  // instead of one long scroll; at `lg` and up everything renders together.
  const [activePage, setActivePage] = useState<DashboardPage>("overview");
  const [isPending, startTransition] = useTransition();
  // Reflects the mutation immediately; if the action below fails, revalidatePath
  // never runs, `budget` never changes, and this reverts on its own once the
  // transition settles — no manual rollback needed.
  const [optimisticBudget, applyOptimistic] = useOptimistic(budget, budgetReducer);
  const summary = summarizeBudget(optimisticBudget);

  const close = () => {
    setOpenDialog(null);
    setEditingBill(null);
    setEditingExpense(null);
  };

  const run = (optimisticAction: OptimisticBudgetAction, action: () => Promise<ActionResult>) => {
    setError(undefined);
    startTransition(async () => {
      applyOptimistic(optimisticAction);
      const result = await action();
      if (result.error) {
        setError(result.error);
      }
    });
  };

  const horizonView = (
    <HorizonView
      bankBalance={optimisticBudget.bankBalance}
      monthlyIncome={optimisticBudget.monthlyIncome}
      summary={summary}
    />
  );

  const currentStateCard = (
    <CurrentStateCard
      bankBalance={optimisticBudget.bankBalance}
      creditCards={optimisticBudget.creditCards}
      summary={summary}
      onEditBankBalance={() => setOpenDialog("bankBalance")}
      onAddCreditCard={() => setOpenDialog("creditCard")}
      onEditCreditCard={setEditingCard}
      onAddCharge={setChargingCard}
      onRemoveCreditCard={(id) =>
        run({ type: "removeCreditCard", id }, () => removeCreditCardAction(id))
      }
    />
  );

  const expensesCard = (
    <ExpensesCard
      monthlyIncome={optimisticBudget.monthlyIncome}
      monthlyExpenses={optimisticBudget.monthlyExpenses}
      summary={summary}
      onEditIncome={() => setOpenDialog("income")}
      onAddExpense={() => setOpenDialog("monthlyExpense")}
      onEditExpense={setEditingExpense}
      onAddContribution={setChargingExpense}
      onRemoveExpense={(id) =>
        run({ type: "removeMonthlyExpense", id }, () => removeMonthlyExpenseAction(id))
      }
    />
  );

  const monthlyBillsCard = (
    <MonthlyBillsCard
      summary={summary}
      creditCards={optimisticBudget.creditCards}
      onAddBill={() => setOpenDialog("bill")}
      onEditBill={setEditingBill}
      onRemoveBill={(id) => run({ type: "removeBill", id }, () => removeBillAction(id))}
    />
  );

  return (
    <>
      {error && (
        <div
          role="alert"
          className="reveal mb-6 flex items-start gap-3 rounded-lg border border-tone-rose/30 bg-tone-rose/10 px-4 py-3 text-sm font-medium text-tone-rose"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {error}
        </div>
      )}

      {/* `lg` and up: everything on one continuous page, unchanged. */}
      <div className="hidden space-y-6 lg:block">
        <Reveal delay={80}>{horizonView}</Reveal>

        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <Reveal delay={180} className="h-full">
            {currentStateCard}
          </Reveal>
          <Reveal delay={260} className="h-full">
            {expensesCard}
          </Reveal>
        </div>

        <Reveal delay={340}>{monthlyBillsCard}</Reveal>
      </div>

      {/* Below `lg`: one section at a time, paged by `MobileDashboardNav`. */}
      <div className="space-y-6 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:hidden">
        {activePage === "overview" && (
          <>
            <Reveal>{horizonView}</Reveal>
            <Reveal delay={80}>{currentStateCard}</Reveal>
          </>
        )}
        {activePage === "flow" && <Reveal>{expensesCard}</Reveal>}
        {activePage === "bills" && <Reveal>{monthlyBillsCard}</Reveal>}
      </div>

      <MobileDashboardNav active={activePage} onChange={setActivePage} />

      <div
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 bottom-32 z-50 flex justify-center transition-all duration-300 lg:bottom-6 ${
          isPending ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <span className="flex items-center gap-2 rounded-md border border-hairline bg-panel px-3 py-2 text-xs font-medium text-ink-muted shadow-[var(--modal-shadow)]">
          <Loader2 className={`size-3.5 text-brand ${isPending ? "animate-spin" : ""}`} />
          {isPending ? "Saving changes" : ""}
        </span>
      </div>

      <MonthlyExpenseDialog
        key={editingExpense?.id ?? "new-expense"}
        open={openDialog === "monthlyExpense" || editingExpense !== null}
        expense={editingExpense}
        onOpenChange={close}
        onAdd={(expense) =>
          run({ type: "addMonthlyExpense", id: crypto.randomUUID(), input: expense }, () =>
            addMonthlyExpenseAction(expense),
          )
        }
        onSave={(expense) =>
          run({ type: "updateMonthlyExpense", input: expense }, () =>
            updateMonthlyExpenseAction(expense),
          )
        }
      />
      <BillDialog
        key={editingBill?.id ?? "new-bill"}
        open={openDialog === "bill" || editingBill !== null}
        bill={editingBill}
        onOpenChange={close}
        onAdd={(bill) =>
          run({ type: "addBill", id: crypto.randomUUID(), input: bill }, () => addBillAction(bill))
        }
        onSave={(bill) => run({ type: "updateBill", input: bill }, () => updateBillAction(bill))}
        creditCards={optimisticBudget.creditCards}
      />
      <AddCreditCardDialog
        open={openDialog === "creditCard"}
        onOpenChange={close}
        onAdd={(card) =>
          run({ type: "addCreditCard", id: crypto.randomUUID(), input: card }, () =>
            addCreditCardAction(card),
          )
        }
      />
      <EditIncomeDialog
        open={openDialog === "income"}
        onOpenChange={close}
        currentIncome={optimisticBudget.monthlyIncome}
        onSave={(monthlyIncome) =>
          run({ type: "setMonthlyIncome", monthlyIncome }, () =>
            setMonthlyIncomeAction({ monthlyIncome }),
          )
        }
      />
      <EditCreditCardDialog
        card={editingCard}
        onOpenChange={() => setEditingCard(null)}
        onSave={(input) =>
          run({ type: "updateCreditCard", input }, () => updateCreditCardAction(input))
        }
      />
      <AddChargeDialog
        card={chargingCard}
        onOpenChange={() => setChargingCard(null)}
        onSave={(input) =>
          run({ type: "addCreditCardCharge", id: input.id, amount: input.amount }, () =>
            addCreditCardChargeAction(input),
          )
        }
      />
      <AddExpenseContributionDialog
        expense={chargingExpense}
        onOpenChange={() => setChargingExpense(null)}
        onSave={(input) =>
          run({ type: "addMonthlyExpenseContribution", id: input.id, amount: input.amount }, () =>
            addMonthlyExpenseContributionAction(input),
          )
        }
      />
      <EditBankBalanceDialog
        open={openDialog === "bankBalance"}
        onOpenChange={close}
        currentBalance={optimisticBudget.bankBalance}
        onSave={(bankBalance) =>
          run({ type: "setBankBalance", bankBalance }, () => setBankBalanceAction({ bankBalance }))
        }
      />
    </>
  );
}
