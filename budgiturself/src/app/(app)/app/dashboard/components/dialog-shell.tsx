"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { controlClass } from "./actions";

/**
 * Shell for every dashboard dialog. Radix portals the content to
 * `document.body`, outside the app shell, so the type and surface tokens are
 * applied here explicitly rather than inherited.
 */
export const fieldClass =
  "h-9 rounded-md border-line bg-surface px-3 text-[13px] text-fg shadow-none md:text-[13px] transition-colors placeholder:text-fg-subtle focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/30";

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <Label htmlFor={htmlFor} className="text-[12px] font-medium text-fg-muted">
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
        className={cn(
          "gap-0 overflow-hidden rounded-xl border-line bg-surface p-6 font-ui text-fg sm:max-w-md",
          "shadow-[var(--app-modal-shadow)]",
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold tracking-tight text-fg">
            {title}
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-relaxed text-fg-muted">
            {description}
          </DialogDescription>
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
    <DialogFooter className="-mx-6 mt-6 -mb-6 gap-2 border-t border-line bg-surface-2 px-6 py-4">
      <button type="button" onClick={onCancel} className={`${controlClass} h-9 px-3.5`}>
        Cancel
      </button>
      <button
        type="submit"
        className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-fg px-3.5 text-[13px] font-medium text-app transition-opacity outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        {submitLabel}
      </button>
    </DialogFooter>
  );
}
