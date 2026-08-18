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
import { monthlyExpenseSchema, type MonthlyExpenseInput } from "@/lib/budget/schemas";
import { FieldError } from "./field-error";

interface AddMonthlyExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (expense: MonthlyExpenseInput) => void;
}

export function AddMonthlyExpenseDialog({
  open,
  onOpenChange,
  onAdd,
}: AddMonthlyExpenseDialogProps) {
  const [error, setError] = useState<string>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = monthlyExpenseSchema.safeParse(Object.fromEntries(form));

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
          <DialogTitle>Add Monthly Expense</DialogTitle>
          <DialogDescription>
            Add a recurring monthly cost like housing, utilities, or anything else you&apos;d like
            to track.
          </DialogDescription>
        </DialogHeader>
        <form key={String(open)} onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="monthly-expense-name">Expense Name</Label>
              <Input
                id="monthly-expense-name"
                name="name"
                placeholder="e.g., Housing, Groceries"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-expense-amount">Monthly Amount</Label>
              <Input
                id="monthly-expense-amount"
                name="amount"
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
            <Button type="submit">Add Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
