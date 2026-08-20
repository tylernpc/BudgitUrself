"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  monthlyExpenseSchema,
  monthlyExpenseUpdateSchema,
  type MonthlyExpenseInput,
  type MonthlyExpenseUpdateInput,
} from "@/lib/budget/schemas";
import type { ExpenseIconKey, MonthlyExpense } from "@/lib/budget/types";
import { BudgetDialog, DialogActions, FieldLabel, fieldClass } from "./dialog-shell";
import { IconPicker } from "./expense-icon";
import { FieldError } from "./field-error";

interface MonthlyExpenseDialogProps {
  open: boolean;
  /** The expense being edited, or `null` to add a new one. */
  expense: MonthlyExpense | null;
  onOpenChange: (open: boolean) => void;
  onAdd: (expense: MonthlyExpenseInput) => void;
  onSave: (expense: MonthlyExpenseUpdateInput) => void;
}

/** One form for adding and editing, mirroring `BillDialog`. */
export function MonthlyExpenseDialog({
  open,
  expense,
  onOpenChange,
  onAdd,
  onSave,
}: MonthlyExpenseDialogProps) {
  const editing = expense !== null;
  const [icon, setIcon] = useState<ExpenseIconKey>(expense?.icon ?? "home");
  const [error, setError] = useState<string>();

  const close = () => {
    setError(undefined);
    onOpenChange(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = { ...Object.fromEntries(new FormData(event.currentTarget)), icon };

    if (editing) {
      const parsed = monthlyExpenseUpdateSchema.safeParse({ ...fields, id: expense.id });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Check the values above");
        return;
      }
      onSave(parsed.data);
    } else {
      const parsed = monthlyExpenseSchema.safeParse(fields);
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Check the values above");
        return;
      }
      onAdd(parsed.data);
    }

    close();
  };

  return (
    <BudgetDialog
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : close())}
      title={editing ? "Edit monthly expense" : "Add monthly expense"}
      description="A recurring cost like housing, utilities, or anything else you want counted."
    >
      <form key={expense?.id ?? String(open)} onSubmit={handleSubmit}>
        <div className="space-y-4 pt-6">
          <div className="space-y-2.5">
            <FieldLabel htmlFor="monthly-expense-name">Expense name</FieldLabel>
            <Input
              id="monthly-expense-name"
              name="name"
              placeholder="e.g., Housing, Groceries"
              defaultValue={expense?.name}
              required
              className={fieldClass}
            />
          </div>
          <div className="space-y-2.5">
            <FieldLabel htmlFor="monthly-expense-amount">Monthly amount</FieldLabel>
            <Input
              id="monthly-expense-amount"
              name="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              defaultValue={expense?.amount}
              required
              className={fieldClass}
            />
          </div>
          <div className="space-y-2.5">
            <FieldLabel htmlFor="monthly-expense-icon">Icon</FieldLabel>
            <IconPicker id="monthly-expense-icon" value={icon} onChange={setIcon} />
          </div>
          <FieldError message={error} />
        </div>
        <DialogActions onCancel={close} submitLabel={editing ? "Save changes" : "Add expense"} />
      </form>
    </BudgetDialog>
  );
}
