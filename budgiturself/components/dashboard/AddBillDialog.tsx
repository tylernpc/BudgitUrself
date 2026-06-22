"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Bill } from "@/components/dashboard/types";

interface AddBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (bill: Omit<Bill, "id">) => void;
  creditCards: string[];
}

const categories = [
  "Entertainment",
  "Software",
  "Health",
  "Shopping",
  "Food & Dining",
  "Transportation",
  "Utilities",
  "Education",
  "Other"
];

export function AddBillDialog({ open, onOpenChange, onAdd, creditCards }: AddBillDialogProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [chargeDate, setChargeDate] = useState("1");
  const [card, setCard] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && amount && card && category) {
      onAdd({
        name,
        amount: parseFloat(amount),
        chargeDate: parseInt(chargeDate),
        card,
        category,
      });
      // Reset form
      setName("");
      setAmount("");
      setChargeDate("1");
      setCard("");
      setCategory("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Monthly Bill</DialogTitle>
          <DialogDescription>
            Add a recurring subscription or service that charges monthly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bill-name">Service Name</Label>
              <Input
                id="bill-name"
                placeholder="e.g., Netflix, Spotify"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bill-amount">Monthly Amount</Label>
              <Input
                id="bill-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bill-date">Charge Date (Day of Month)</Label>
              <Input
                id="bill-date"
                type="number"
                min="1"
                max="31"
                placeholder="1-31"
                value={chargeDate}
                onChange={(e) => setChargeDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bill-card">Charged to Card</Label>
              <Select value={card} onValueChange={setCard}>
                <SelectTrigger id="bill-card">
                  <SelectValue placeholder="Select a card" />
                </SelectTrigger>
                <SelectContent>
                  {creditCards.map((cardName) => (
                    <SelectItem key={cardName} value={cardName}>
                      {cardName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bill-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="bill-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Bill</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
