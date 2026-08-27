"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  monthlyExpenseContributionSchema,
  type MonthlyExpenseContributionInput,
} from "@/lib/budget/schemas";
import type { MonthlyExpense } from "@/lib/budget/types";
import { BudgetDialog, DialogActions, FieldLabel, fieldClass } from "./dialog-shell";
import { FieldError } from "./field-error";

interface AddExpenseContributionDialogProps {
  /** The expense being contributed to; `null` keeps the dialog closed. */
  expense: MonthlyExpense | null;
  onOpenChange: (open: boolean) => void;
  onSave: (input: MonthlyExpenseContributionInput) => void;
}

export function AddExpenseContributionDialog({
  expense,
  onOpenChange,
  onSave,
}: AddExpenseContributionDialogProps) {
  const [error, setError] = useState<string>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!expense) {
      return;
    }

    const form = new FormData(event.currentTarget);
    const parsed = monthlyExpenseContributionSchema.safeParse({
      ...Object.fromEntries(form),
      id: expense.id,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid amount");
      return;
    }

    setError(undefined);
    onSave(parsed.data);
    onOpenChange(false);
  };

  return (
    <BudgetDialog
      open={expense !== null}
      onOpenChange={onOpenChange}
      title={expense ? `Add to ${expense.name}` : "Add contribution"}
      description="Add how much of this budgeted amount you've put toward it so far."
    >
      <form key={expense?.id ?? "none"} onSubmit={handleSubmit}>
        <div className="space-y-2.5 pt-6">
          <FieldLabel htmlFor="expense-contribution-amount">Amount</FieldLabel>
          <Input
            id="expense-contribution-amount"
            name="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            required
            className={fieldClass}
          />
          <FieldError message={error} />
        </div>
        <DialogActions onCancel={() => onOpenChange(false)} submitLabel="Add" />
      </form>
    </BudgetDialog>
  );
}
