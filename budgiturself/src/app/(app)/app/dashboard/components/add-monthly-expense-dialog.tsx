"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { monthlyExpenseSchema, type MonthlyExpenseInput } from "@/lib/budget/schemas";
import { BudgetDialog, DialogActions, FieldLabel, fieldClass } from "./dialog-shell";
import { FieldError } from "./field-error";

interface AddMonthlyExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (expense: MonthlyExpenseInput) => void;
}

export function AddMonthlyExpenseDialog({
  open,
  onOpenChange,
  onAdd,
}: AddMonthlyExpenseDialogProps) {
  const [error, setError] = useState<string>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = monthlyExpenseSchema.safeParse(Object.fromEntries(form));

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the values above");
      return;
    }

    setError(undefined);
    onAdd(parsed.data);
    onOpenChange(false);
  };

  return (
    <BudgetDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add monthly expense"
      description="A recurring cost like housing, utilities, or anything else you want counted."
    >
      <form key={String(open)} onSubmit={handleSubmit}>
        <div className="space-y-4 pt-6">
          <div className="space-y-2.5">
            <FieldLabel htmlFor="monthly-expense-name">Expense name</FieldLabel>
            <Input
              id="monthly-expense-name"
              name="name"
              placeholder="e.g., Housing, Groceries"
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
              required
              className={fieldClass}
            />
          </div>
          <FieldError message={error} />
        </div>
        <DialogActions onCancel={() => onOpenChange(false)} submitLabel="Add expense" />
      </form>
    </BudgetDialog>
  );
}
