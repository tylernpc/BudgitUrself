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
import { monthlyIncomeSchema } from "@/lib/budget/schemas";
import { FieldError } from "./field-error";

interface EditIncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIncome: number;
  onSave: (monthlyIncome: number) => void;
}

export function EditIncomeDialog({
  open,
  onOpenChange,
  currentIncome,
  onSave,
}: EditIncomeDialogProps) {
  const [error, setError] = useState<string>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = monthlyIncomeSchema.safeParse(Object.fromEntries(form));

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid amount");
      return;
    }

    setError(undefined);
    onSave(parsed.data.monthlyIncome);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Monthly Income</DialogTitle>
          <DialogDescription>Update your monthly take-home income.</DialogDescription>
        </DialogHeader>
        <form key={String(open)} onSubmit={handleSubmit}>
          <div className="space-y-2 py-4">
            <Label htmlFor="monthly-income">Monthly Income (After Tax)</Label>
            <Input
              id="monthly-income"
              name="monthlyIncome"
              type="number"
              step="0.01"
              min="0"
              defaultValue={currentIncome}
              required
            />
            <p className="text-sm text-muted-foreground">
              Enter your take-home pay after all taxes and deductions.
            </p>
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
