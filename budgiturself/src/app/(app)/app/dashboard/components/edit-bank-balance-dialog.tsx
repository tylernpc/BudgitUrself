"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { bankBalanceSchema } from "@/lib/budget/schemas";
import { BudgetDialog, DialogActions, FieldLabel, fieldClass } from "./dialog-shell";
import { FieldError } from "./field-error";

interface EditBankBalanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
  onSave: (bankBalance: number) => void;
}

export function EditBankBalanceDialog({
  open,
  onOpenChange,
  currentBalance,
  onSave,
}: EditBankBalanceDialogProps) {
  const [error, setError] = useState<string>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = bankBalanceSchema.safeParse(Object.fromEntries(form));

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid amount");
      return;
    }

    setError(undefined);
    onSave(parsed.data.bankBalance);
    onOpenChange(false);
  };

  return (
    <BudgetDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit bank balance"
      description="Update what's currently in your bank account."
    >
      <form key={String(open)} onSubmit={handleSubmit}>
        <div className="space-y-2.5 pt-6">
          <FieldLabel htmlFor="bank-balance">Bank account balance</FieldLabel>
          <Input
            id="bank-balance"
            name="bankBalance"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            defaultValue={currentBalance}
            required
            className={fieldClass}
          />
          <FieldError message={error} />
        </div>
        <DialogActions onCancel={() => onOpenChange(false)} submitLabel="Save changes" />
      </form>
    </BudgetDialog>
  );
}
