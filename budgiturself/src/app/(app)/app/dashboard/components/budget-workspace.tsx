"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { summarizeBudget } from "@/lib/budget/calculations";
import type { Bill, Budget, CreditCard } from "@/lib/budget/types";
import {
  addBillAction,
  addCreditCardAction,
  addCreditCardChargeAction,
  addMonthlyExpenseAction,
  removeBillAction,
  removeCreditCardAction,
  removeMonthlyExpenseAction,
  setBankBalanceAction,
  setMonthlyIncomeAction,
  updateBillAction,
  updateCreditCardAction,
  type ActionResult,
} from "../lib/actions";
import { budgetReducer, type OptimisticBudgetAction } from "../lib/budget-reducer";
import { BillDialog } from "./bill-dialog";
import { AddChargeDialog } from "./add-charge-dialog";
import { AddCreditCardDialog } from "./add-credit-card-dialog";
import { AddMonthlyExpenseDialog } from "./add-monthly-expense-dialog";
import { CurrentStateCard } from "./current-state-card";
import { EditBankBalanceDialog } from "./edit-bank-balance-dialog";
import { EditCreditCardDialog } from "./edit-credit-card-dialog";
import { EditIncomeDialog } from "./edit-income-dialog";
import { ExpensesCard } from "./expenses-card";
import { HorizonView } from "./horizon-view";
import { MonthlyBillsCard } from "./monthly-bills-card";
import { Reveal } from "./reveal";

type DialogName = "monthlyExpense" | "bill" | "income" | "creditCard" | "bankBalance";

export function BudgetWorkspace({ budget }: { budget: Budget }) {
  const [openDialog, setOpenDialog] = useState<DialogName | null>(null);
  // Held separately from `openDialog`: these dialogs need to know *which* card.
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [chargingCard, setChargingCard] = useState<CreditCard | null>(null);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  // Reflects the mutation immediately; if the action below fails, revalidatePath
  // never runs, `budget` never changes, and this reverts on its own once the
  // transition settles — no manual rollback needed.
  const [optimisticBudget, applyOptimistic] = useOptimistic(budget, budgetReducer);
  const summary = summarizeBudget(optimisticBudget);

  const close = () => {
    setOpenDialog(null);
    setEditingBill(null);
  };

  const run = (optimisticAction: OptimisticBudgetAction, action: () => Promise<ActionResult>) => {
    setError(undefined);
    startTransition(async () => {
      applyOptimistic(optimisticAction);
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
            bankBalance={optimisticBudget.bankBalance}
            monthlyIncome={optimisticBudget.monthlyIncome}
            summary={summary}
          />
        </Reveal>

        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <Reveal delay={180} className="h-full">
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
          </Reveal>

          <Reveal delay={260} className="h-full">
            <ExpensesCard
              monthlyIncome={optimisticBudget.monthlyIncome}
              monthlyExpenses={optimisticBudget.monthlyExpenses}
              summary={summary}
              onEditIncome={() => setOpenDialog("income")}
              onAddExpense={() => setOpenDialog("monthlyExpense")}
              onRemoveExpense={(id) =>
                run({ type: "removeMonthlyExpense", id }, () => removeMonthlyExpenseAction(id))
              }
            />
          </Reveal>
        </div>

        <Reveal delay={340}>
          <MonthlyBillsCard
            summary={summary}
            onAddBill={() => setOpenDialog("bill")}
            onEditBill={setEditingBill}
            onRemoveBill={(id) => run({ type: "removeBill", id }, () => removeBillAction(id))}
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

      <AddMonthlyExpenseDialog
        open={openDialog === "monthlyExpense"}
        onOpenChange={close}
        onAdd={(expense) =>
          run({ type: "addMonthlyExpense", id: crypto.randomUUID(), input: expense }, () =>
            addMonthlyExpenseAction(expense),
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
        creditCards={optimisticBudget.creditCards.map((card) => card.name)}
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
