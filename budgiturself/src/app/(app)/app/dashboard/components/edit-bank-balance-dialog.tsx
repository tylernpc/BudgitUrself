"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bankBalanceSchema } from "@/lib/budget/schemas";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Bank Balance</DialogTitle>
          <DialogDescription>Update what&apos;s currently in your bank account.</DialogDescription>
        </DialogHeader>
        <form key={String(open)} onSubmit={handleSubmit}>
          <div className="space-y-2 py-4">
            <Label htmlFor="bank-balance">Bank Account Balance</Label>
            <Input
              id="bank-balance"
              name="bankBalance"
              type="number"
              step="0.01"
              min="0"
              defaultValue={currentBalance}
              required
            />
            <FieldError message={error} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
