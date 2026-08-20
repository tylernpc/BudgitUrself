"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { oneOffExpenseSchema, type OneOffExpenseInput } from "@/lib/budget/schemas";
import { todayIsoDate } from "@/lib/format";
import { BudgetDialog, DialogActions, FieldLabel, fieldClass } from "./dialog-shell";
import { FieldError } from "./field-error";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (expense: OneOffExpenseInput) => void;
}

export function AddExpenseDialog({ open, onOpenChange, onAdd }: AddExpenseDialogProps) {
  const [error, setError] = useState<string>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = oneOffExpenseSchema.safeParse(Object.fromEntries(form));

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
      title="Add one-off expense"
      description="A one-time cost — a medical bill, a car repair, anything unexpected."
    >
      <form key={String(open)} onSubmit={handleSubmit}>
        <div className="space-y-4 pt-6">
          <div className="space-y-2.5">
            <FieldLabel htmlFor="expense-name">Expense name</FieldLabel>
            <Input
              id="expense-name"
              name="name"
              placeholder="e.g., Medical Co-Pay"
              required
              className={fieldClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2.5">
              <FieldLabel htmlFor="expense-amount">Amount</FieldLabel>
              <Input
                id="expense-amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                required
                className={fieldClass}
              />
            </div>
            <div className="space-y-2.5">
              <FieldLabel htmlFor="expense-date">Date</FieldLabel>
              <Input
                id="expense-date"
                name="date"
                type="date"
                defaultValue={todayIsoDate()}
                required
                className={`${fieldClass} [&::-webkit-calendar-picker-indicator]:invert`}
              />
            </div>
          </div>
          <FieldError message={error} />
        </div>
        <DialogActions onCancel={() => onOpenChange(false)} submitLabel="Add expense" />
      </form>
    </BudgetDialog>
  );
}
