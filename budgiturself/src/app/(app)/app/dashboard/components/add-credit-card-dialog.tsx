"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { creditCardSchema, type CreditCardInput } from "@/lib/budget/schemas";
import { BudgetDialog, DialogActions, FieldLabel, fieldClass } from "./dialog-shell";
import { FieldError } from "./field-error";

interface AddCreditCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (card: CreditCardInput) => void;
}

export function AddCreditCardDialog({ open, onOpenChange, onAdd }: AddCreditCardDialogProps) {
  const [error, setError] = useState<string>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = creditCardSchema.safeParse(Object.fromEntries(form));

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
      title="Add credit card"
      description="Track a card's balance and limit."
    >
      <form key={String(open)} onSubmit={handleSubmit}>
        <div className="space-y-4 pt-6">
          <div className="space-y-2.5">
            <FieldLabel htmlFor="card-name">Card name</FieldLabel>
            <Input
              id="card-name"
              name="name"
              placeholder="e.g., Chase Sapphire"
              required
              className={fieldClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2.5">
              <FieldLabel htmlFor="card-balance">Current balance</FieldLabel>
              <Input
                id="card-balance"
                name="balance"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                required
                className={fieldClass}
              />
            </div>
            <div className="space-y-2.5">
              <FieldLabel htmlFor="card-limit">Credit limit</FieldLabel>
              <Input
                id="card-limit"
                name="limit"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                required
                className={fieldClass}
              />
            </div>
          </div>
          <FieldError message={error} />
        </div>
        <DialogActions onCancel={() => onOpenChange(false)} submitLabel="Add card" />
      </form>
    </BudgetDialog>
  );
}
