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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BILL_CATEGORIES, billSchema, type BillInput } from "@/lib/budget/schemas";
import type { BillType } from "@/lib/budget/types";
import { FieldError } from "./field-error";

interface AddBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (bill: BillInput) => void;
  creditCards: string[];
}

export function AddBillDialog({ open, onOpenChange, onAdd, creditCards }: AddBillDialogProps) {
  const [type, setType] = useState<BillType>("digital");
  const [card, setCard] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string>();

  const close = () => {
    setType("digital");
    setCard("");
    setCategory("");
    setError(undefined);
    onOpenChange(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = billSchema.safeParse({ ...Object.fromEntries(form), type, card, category });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the values above");
      return;
    }

    onAdd(parsed.data);
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Monthly Bill</DialogTitle>
          <DialogDescription>
            Add a recurring subscription, service, or personal debt you pay monthly.
          </DialogDescription>
        </DialogHeader>
        <form key={String(open)} onSubmit={handleSubmit}>
          <Tabs value={type} onValueChange={(value) => setType(value as BillType)} className="py-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="digital">Digital Bill</TabsTrigger>
              <TabsTrigger value="personal">Personal Owed</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bill-name">
                {type === "digital" ? "Service Name" : "What's it for"}
              </Label>
              <Input
                id="bill-name"
                name="name"
                placeholder={
                  type === "digital" ? "e.g., Netflix, Spotify" : "e.g., YMCA Membership"
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bill-amount">Monthly Amount</Label>
              <Input
                id="bill-amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bill-charge-date">Charge Date (Day of Month)</Label>
              <Input
                id="bill-charge-date"
                name="chargeDate"
                type="number"
                min="1"
                max="31"
                defaultValue={1}
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
                      {BILL_CATEGORIES.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="bill-owed-to">Who You Owe</Label>
                <Input id="bill-owed-to" name="owedTo" placeholder="e.g., Dad" required />
              </div>
            )}

            <FieldError message={error} />
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button type="submit">Add Bill</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
