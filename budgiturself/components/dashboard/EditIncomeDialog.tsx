"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EditIncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIncome: number;
  onSave: (income: number) => void;
  currentRent: number;
  onSaveRent: (rent: number) => void;
  currentUtilities: number;
  onSaveUtilities: (utilities: number) => void;
}

export function EditIncomeDialog({
  open,
  onOpenChange,
  currentIncome,
  onSave,
  currentRent,
  onSaveRent,
  currentUtilities,
  onSaveUtilities
}: EditIncomeDialogProps) {
  const [income, setIncome] = useState(currentIncome.toString());
  const [rent, setRent] = useState(currentRent.toString());
  const [utilities, setUtilities] = useState(currentUtilities.toString());

  // Re-sync the form fields from props whenever the dialog is (re)opened,
  // without resetting on every keystroke while it's open.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setIncome(currentIncome.toString());
      setRent(currentRent.toString());
      setUtilities(currentUtilities.toString());
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (income) {
      onSave(parseFloat(income));
    }
    if (rent) {
      onSaveRent(parseFloat(rent));
    }
    if (utilities) {
      onSaveUtilities(parseFloat(utilities));
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Income & Fixed Expenses</DialogTitle>
          <DialogDescription>
            Update your monthly income and fixed costs.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="income" className="py-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="rent">Rent</TabsTrigger>
              <TabsTrigger value="utilities">Utilities</TabsTrigger>
            </TabsList>

            <TabsContent value="income" className="space-y-4 mt-4">
              <div className="space-y-2">
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
            </TabsContent>

            <TabsContent value="rent" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="base-rent">Base Rent</Label>
                <Input
                  id="base-rent"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  Your monthly rent or mortgage payment.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="utilities" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="utilities">Utilities</Label>
                <Input
                  id="utilities"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={utilities}
                  onChange={(e) => setUtilities(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  Average monthly utilities (electricity, water, gas, internet).
                </p>
              </div>
            </TabsContent>
          </Tabs>

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
