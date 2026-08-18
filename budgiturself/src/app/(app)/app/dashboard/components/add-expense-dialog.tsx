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
import { oneOffExpenseSchema, type OneOffExpenseInput } from "@/lib/budget/schemas";
import { todayIsoDate } from "@/lib/format";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add One-Off Expense</DialogTitle>
          <DialogDescription>
            Add a one-time expense like a medical bill, car repair, or any unexpected cost.
          </DialogDescription>
        </DialogHeader>
        <form key={String(open)} onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="expense-name">Expense Name</Label>
              <Input id="expense-name" name="name" placeholder="e.g., Medical Co-Pay" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-amount">Amount</Label>
              <Input
                id="expense-amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-date">Date</Label>
              <Input
                id="expense-date"
                name="date"
                type="date"
                defaultValue={todayIsoDate()}
                required
              />
            </div>
            <FieldError message={error} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
