"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Bill, BillType } from "@/components/dashboard/types";

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
  const [type, setType] = useState<BillType>("digital");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [chargeDate, setChargeDate] = useState("1");
  const [card, setCard] = useState("");
  const [category, setCategory] = useState("");
  const [owedTo, setOwedTo] = useState("");

  const resetForm = () => {
    setType("digital");
    setName("");
    setAmount("");
    setChargeDate("1");
    setCard("");
    setCategory("");
    setOwedTo("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    if (type === "digital") {
      if (!card || !category) return;
      onAdd({
        name,
        amount: parseFloat(amount),
        chargeDate: parseInt(chargeDate),
        type,
        card,
        category,
      });
    } else {
      if (!owedTo) return;
      onAdd({
        name,
        amount: parseFloat(amount),
        chargeDate: parseInt(chargeDate),
        type,
        owedTo,
      });
    }
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Monthly Bill</DialogTitle>
          <DialogDescription>
            Add a recurring subscription, service, or personal debt you pay monthly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs value={type} onValueChange={(v) => setType(v as BillType)} className="py-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="digital">Digital Bill</TabsTrigger>
              <TabsTrigger value="personal">Personal Owed</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bill-name">{type === "digital" ? "Service Name" : "What's it for"}</Label>
              <Input
                id="bill-name"
                placeholder={type === "digital" ? "e.g., Netflix, Spotify" : "e.g., YMCA Membership"}
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

            {type === "digital" ? (
              <>
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
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="bill-owed-to">Who You Owe</Label>
                <Input
                  id="bill-owed-to"
                  placeholder="e.g., Dad"
                  value={owedTo}
                  onChange={(e) => setOwedTo(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
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
