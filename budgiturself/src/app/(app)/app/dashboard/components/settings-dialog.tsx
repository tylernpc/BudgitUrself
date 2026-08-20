"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { nameSchema } from "@/lib/auth/schemas";
import { updateNameAction } from "../lib/actions";
import { BudgetDialog, DialogActions, FieldLabel, fieldClass } from "./dialog-shell";
import { FieldError } from "./field-error";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export function SettingsDialog({
  open,
  onOpenChange,
  firstName,
  lastName,
  email,
}: SettingsDialogProps) {
  const [error, setError] = useState<string>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = nameSchema.safeParse(Object.fromEntries(form));

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid name");
      return;
    }

    setError(undefined);
    updateNameAction(parsed.data).then((result) => {
      if (result.error) {
        setError(result.error);
        return;
      }
      onOpenChange(false);
    });
  };

  return (
    <BudgetDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Settings"
      description="Update the name shown on your account."
    >
      <form key={String(open)} onSubmit={handleSubmit}>
        <div className="grid gap-4 pt-6 sm:grid-cols-2">
          <div className="space-y-2.5">
            <FieldLabel htmlFor="firstName">First name</FieldLabel>
            <Input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              defaultValue={firstName ?? ""}
              required
              className={fieldClass}
            />
          </div>
          <div className="space-y-2.5">
            <FieldLabel htmlFor="lastName">Last name</FieldLabel>
            <Input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              defaultValue={lastName ?? ""}
              required
              className={fieldClass}
            />
          </div>
        </div>
        <div className="mt-4 space-y-2.5">
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" value={email} disabled className={fieldClass} />
        </div>
        <FieldError message={error} />
        <DialogActions onCancel={() => onOpenChange(false)} submitLabel="Save changes" />
      </form>
    </BudgetDialog>
  );
}
