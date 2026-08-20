"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { creditCardChargeSchema, type CreditCardChargeInput } from "@/lib/budget/schemas";
import type { CreditCard } from "@/lib/budget/types";
import { BudgetDialog, DialogActions, FieldLabel, fieldClass } from "./dialog-shell";
import { FieldError } from "./field-error";

interface AddChargeDialogProps {
  /** The card being charged; `null` keeps the dialog closed. */
  card: CreditCard | null;
  onOpenChange: (open: boolean) => void;
  onSave: (input: CreditCardChargeInput) => void;
}

export function AddChargeDialog({ card, onOpenChange, onSave }: AddChargeDialogProps) {
  const [error, setError] = useState<string>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!card) return;

    const form = new FormData(event.currentTarget);
    const parsed = creditCardChargeSchema.safeParse({
      ...Object.fromEntries(form),
      id: card.id,
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
      open={card !== null}
      onOpenChange={onOpenChange}
      title={card ? `Add to ${card.name}` : "Add charge"}
      description="Add a charge to this card's current balance."
    >
      <form key={card?.id ?? "none"} onSubmit={handleSubmit}>
        <div className="space-y-2.5 pt-6">
          <FieldLabel htmlFor="charge-amount">Amount</FieldLabel>
          <Input
            id="charge-amount"
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
        <DialogActions onCancel={() => onOpenChange(false)} submitLabel="Add charge" />
      </form>
    </BudgetDialog>
  );
}
