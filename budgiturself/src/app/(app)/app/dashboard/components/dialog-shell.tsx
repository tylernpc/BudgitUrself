"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

/**
 * Shell for every dashboard dialog. Radix portals the content to
 * `document.body`, outside any themed wrapper, so the palette is applied with
 * explicit classes rather than a `dark:` variant.
 */
export const fieldClass = "h-10";

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <Label htmlFor={htmlFor} className="text-[13px] font-medium text-ink-muted">
      {children}
    </Label>
  );
}

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}

export function BudgetDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: BudgetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="max-w-[calc(100%-2rem)] gap-0 overflow-hidden sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export function DialogActions({
  onCancel,
  submitLabel,
}: {
  onCancel: () => void;
  submitLabel: string;
}) {
  return (
    <DialogFooter className="mt-6 gap-2">
      <Button type="button" variant="outline" onClick={onCancel} className="h-10">
        Cancel
      </Button>
      <Button type="submit" className="h-10">
        {submitLabel}
      </Button>
    </DialogFooter>
  );
}
