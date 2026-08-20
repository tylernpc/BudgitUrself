"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { monthlyIncomeSchema } from "@/lib/budget/schemas";
import { BudgetDialog, DialogActions, FieldLabel, fieldClass } from "./dialog-shell";
import { FieldError } from "./field-error";

interface EditIncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIncome: number;
  onSave: (monthlyIncome: number) => void;
}

export function EditIncomeDialog({
  open,
  onOpenChange,
  currentIncome,
  onSave,
}: EditIncomeDialogProps) {
  const [error, setError] = useState<string>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = monthlyIncomeSchema.safeParse(Object.fromEntries(form));

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid amount");
      return;
    }

    setError(undefined);
    onSave(parsed.data.monthlyIncome);
    onOpenChange(false);
  };

  return (
    <BudgetDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit monthly income"
      description="Update your monthly take-home income."
    >
      <form key={String(open)} onSubmit={handleSubmit}>
        <div className="space-y-2.5 pt-6">
          <FieldLabel htmlFor="monthly-income">Monthly income (after tax)</FieldLabel>
          <Input
            id="monthly-income"
            name="monthlyIncome"
            type="number"
            step="0.01"
            min="0"
            defaultValue={currentIncome}
            required
            className={fieldClass}
          />
          <p className="text-[13px] text-ink-ghost">
            Your take-home pay after all taxes and deductions.
          </p>
          <FieldError message={error} />
        </div>
        <DialogActions onCancel={() => onOpenChange(false)} submitLabel="Save changes" />
      </form>
    </BudgetDialog>
  );
}
