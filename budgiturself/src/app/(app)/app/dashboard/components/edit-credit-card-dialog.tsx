"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { creditCardUpdateSchema, type CreditCardUpdateInput } from "@/lib/budget/schemas";
import type { CreditCard } from "@/lib/budget/types";
import { BudgetDialog, DialogActions, FieldLabel, fieldClass } from "./dialog-shell";
import { FieldError } from "./field-error";

interface EditCreditCardDialogProps {
  /** The card being edited; `null` keeps the dialog closed. */
  card: CreditCard | null;
  onOpenChange: (open: boolean) => void;
  onSave: (input: CreditCardUpdateInput) => void;
}

export function EditCreditCardDialog({ card, onOpenChange, onSave }: EditCreditCardDialogProps) {
  const [error, setError] = useState<string>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!card) return;

    const form = new FormData(event.currentTarget);
    const parsed = creditCardUpdateSchema.safeParse({
      ...Object.fromEntries(form),
      id: card.id,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the values above");
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
      title={card ? `Edit ${card.name}` : "Edit card"}
      description="Update what this card currently carries, and the limit it carries it against."
    >
      <form key={card?.id ?? "none"} onSubmit={handleSubmit}>
        <div className="space-y-4 pt-6">
          <div className="space-y-2.5">
            <FieldLabel htmlFor="edit-card-name">Card name</FieldLabel>
            <Input
              id="edit-card-name"
              name="name"
              defaultValue={card?.name ?? ""}
              required
              className={fieldClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2.5">
              <FieldLabel htmlFor="edit-card-balance">Current balance</FieldLabel>
              <Input
                id="edit-card-balance"
                name="balance"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                defaultValue={card?.balance ?? 0}
                required
                className={fieldClass}
              />
            </div>
            <div className="space-y-2.5">
              <FieldLabel htmlFor="edit-card-limit">Credit limit</FieldLabel>
              <Input
                id="edit-card-limit"
                name="limit"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                defaultValue={card?.limit ?? 0}
                required
                className={fieldClass}
              />
            </div>
          </div>
        </div>
        <div className="pt-4">
          <FieldError message={error} />
        </div>
        <DialogActions onCancel={() => onOpenChange(false)} submitLabel="Save changes" />
      </form>
    </BudgetDialog>
  );
}
