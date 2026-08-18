"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MonthlyExpense } from "@/components/dashboard/types";

interface AddMonthlyExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (expense: Omit<MonthlyExpense, "id">) => void;
}

export function AddMonthlyExpenseDialog({ open, onOpenChange, onAdd }: AddMonthlyExpenseDialogProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && amount) {
      onAdd({
        name,
        amount: parseFloat(amount),
      });
      // Reset form
      setName("");
      setAmount("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Monthly Expense</DialogTitle>
          <DialogDescription>
            Add a recurring monthly cost like housing, utilities, or anything else you'd like to track.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="monthly-expense-name">Expense Name</Label>
              <Input
                id="monthly-expense-name"
                placeholder="e.g., Housing, Groceries"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-expense-amount">Monthly Amount</Label>
              <Input
                id="monthly-expense-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
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
