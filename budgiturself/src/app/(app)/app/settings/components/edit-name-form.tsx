"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { nameSchema } from "@/lib/auth/schemas";
import { updateNameAction } from "../lib/actions";

interface EditNameFormProps {
  firstName: string | null;
  lastName: string | null;
}

export function EditNameForm({ firstName, lastName }: EditNameFormProps) {
  const [error, setError] = useState<string>();
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = nameSchema.safeParse(Object.fromEntries(form));

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid name");
      setSaved(false);
      return;
    }

    setError(undefined);
    startTransition(async () => {
      const result = await updateNameAction(parsed.data);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSaved(true);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 px-4 py-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="firstName">First name</Label>
        <Input id="firstName" name="firstName" defaultValue={firstName ?? ""} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="lastName">Last name</Label>
        <Input id="lastName" name="lastName" defaultValue={lastName ?? ""} required />
      </div>
      <div className="flex items-center gap-3 sm:col-span-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
        {saved && !error && <p className="text-sm text-muted-foreground">Saved</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </form>
  );
}
