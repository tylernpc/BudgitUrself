"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BILL_CATEGORIES,
  billSchema,
  billUpdateSchema,
  type BillInput,
  type BillUpdateInput,
} from "@/lib/budget/schemas";
import type { Bill, BillType, CreditCard } from "@/lib/budget/types";
import { BudgetDialog, DialogActions, FieldLabel, fieldClass } from "./dialog-shell";
import { FieldError } from "./field-error";

interface BillDialogProps {
  open: boolean;
  /** The bill being edited, or `null` to add a new one. */
  bill: Bill | null;
  onOpenChange: (open: boolean) => void;
  onAdd: (bill: BillInput) => void;
  onSave: (bill: BillUpdateInput) => void;
  creditCards: CreditCard[];
}

/**
 * One form for adding and editing, so the two can never drift apart. The
 * caller remounts it with a `key` when the target bill changes, which reseeds
 * the pieces of the form that live in state rather than in the DOM.
 */
export function BillDialog({
  open,
  bill,
  onOpenChange,
  onAdd,
  onSave,
  creditCards,
}: BillDialogProps) {
  const editing = bill !== null;
  const [type, setType] = useState<BillType>(bill?.type ?? "digital");
  const [cardId, setCardId] = useState(bill?.type === "digital" ? bill.cardId : "");
  const [category, setCategory] = useState(bill?.type === "digital" ? bill.category : "");
  const [error, setError] = useState<string>();

  const close = () => {
    setError(undefined);
    onOpenChange(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = {
      ...Object.fromEntries(new FormData(event.currentTarget)),
      type,
      cardId,
      category,
    };

    if (editing) {
      const parsed = billUpdateSchema.safeParse({ ...fields, id: bill.id });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Check the values above");
        return;
      }
      onSave(parsed.data);
    } else {
      const parsed = billSchema.safeParse(fields);
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Check the values above");
        return;
      }
      onAdd(parsed.data);
    }

    close();
  };

  return (
    <BudgetDialog
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : close())}
      title={editing ? "Edit monthly bill" : "Add monthly bill"}
      description="A recurring subscription, fixed charge, or a person you pay back each month."
    >
      <form key={String(open)} onSubmit={handleSubmit}>
        <Tabs value={type} onValueChange={(value) => setType(value as BillType)} className="pt-6">
          <TabsList className="grid h-10 w-full grid-cols-3 items-stretch">
            <TabsTrigger value="recurring" className="text-[13px]">
              Recurring bill
            </TabsTrigger>
            <TabsTrigger value="digital" className="text-[13px]">
              Subscription
            </TabsTrigger>
            <TabsTrigger value="personal" className="text-[13px]">
              Personal owed
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4 pt-5">
          <div className="space-y-2.5">
            <FieldLabel htmlFor="bill-name">
              {type === "digital" ? "Service name" : "What's it for"}
            </FieldLabel>
            <Input
              id="bill-name"
              name="name"
              placeholder={
                type === "digital"
                  ? "e.g., Netflix, Spotify"
                  : type === "recurring"
                    ? "e.g., Rent, Car insurance"
                    : "e.g., YMCA Membership"
              }
              defaultValue={bill?.name}
              required
              className={fieldClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2.5">
              <FieldLabel htmlFor="bill-amount">Monthly amount</FieldLabel>
              <Input
                id="bill-amount"
                name="amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                defaultValue={bill?.amount}
                required
                className={fieldClass}
              />
            </div>
            <div className="space-y-2.5">
              <FieldLabel htmlFor="bill-charge-date">Charge day</FieldLabel>
              <Input
                id="bill-charge-date"
                name="chargeDate"
                type="number"
                inputMode="numeric"
                min="1"
                max="31"
                defaultValue={bill?.chargeDate ?? 1}
                required
                className={fieldClass}
              />
            </div>
          </div>

          {type === "digital" ? (
            <>
              <div className="space-y-2.5">
                <FieldLabel htmlFor="bill-card">Charged to card</FieldLabel>
                <Select value={cardId} onValueChange={setCardId}>
                  <SelectTrigger id="bill-card" className={fieldClass}>
                    <SelectValue placeholder="Select a card" />
                  </SelectTrigger>
                  <SelectContent>
                    {creditCards.map((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <FieldLabel htmlFor="bill-category">Category</FieldLabel>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="bill-category" className={fieldClass}>
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
          ) : type === "personal" ? (
            <div className="space-y-2.5">
              <FieldLabel htmlFor="bill-owed-to">Who you owe</FieldLabel>
              <Input
                id="bill-owed-to"
                name="owedTo"
                placeholder="e.g., Dad"
                defaultValue={bill?.type === "personal" ? bill.owedTo : undefined}
                required
                className={fieldClass}
              />
            </div>
          ) : null}

          <FieldError message={error} />
        </div>

        <DialogActions onCancel={close} submitLabel={editing ? "Save changes" : "Add bill"} />
      </form>
    </BudgetDialog>
  );
}
