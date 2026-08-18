"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditIncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIncome: number;
  onSave: (income: number) => void;
}

export function EditIncomeDialog({
  open,
  onOpenChange,
  currentIncome,
  onSave,
}: EditIncomeDialogProps) {
  const [income, setIncome] = useState(currentIncome.toString());

  // Re-sync the form field from props whenever the dialog is (re)opened,
  // without resetting on every keystroke while it's open.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setIncome(currentIncome.toString());
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (income) {
      onSave(parseFloat(income));
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Monthly Income</DialogTitle>
          <DialogDescription>
            Update your monthly take-home income.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2 py-4">
            <Label htmlFor="monthly-income">Monthly Income (After Tax)</Label>
            <Input
              id="monthly-income"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              required
            />
            <p className="text-sm text-gray-500">
              Enter your take-home pay after all taxes and deductions.
            </p>
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
