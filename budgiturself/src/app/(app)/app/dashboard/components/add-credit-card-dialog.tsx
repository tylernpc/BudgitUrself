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
import { creditCardSchema, type CreditCardInput } from "@/lib/budget/schemas";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Credit Card</DialogTitle>
          <DialogDescription>Track a card&apos;s balance and limit.</DialogDescription>
        </DialogHeader>
        <form key={String(open)} onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="card-name">Card Name</Label>
              <Input id="card-name" name="name" placeholder="e.g., Chase Sapphire" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-balance">Current Balance</Label>
              <Input
                id="card-balance"
                name="balance"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-limit">Credit Limit</Label>
              <Input
                id="card-limit"
                name="limit"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                required
              />
            </div>
            <FieldError message={error} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Card</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
