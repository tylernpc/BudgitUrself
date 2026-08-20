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
import { cn } from "@/lib/utils";

/**
 * Dark-glass shell for every dashboard dialog. Radix portals the content to
 * `document.body`, outside any themed wrapper, so the treatment is applied with
 * explicit classes rather than a `dark:` variant.
 */
export const fieldClass =
  "h-10 rounded-xl border-hairline bg-quiet text-ink transition-colors placeholder:text-ink-ghost focus-visible:border-tone-cyan focus-visible:ring-tone-cyan/25";

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
        className={cn(
          "max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-3xl border-hairline sm:max-w-md",
          "bg-panel p-6 text-ink",
          "shadow-[0_50px_140px_-50px_var(--dash-modal-shadow)] backdrop-blur-2xl",
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-medium tracking-tight text-ink">{title}</DialogTitle>
          <DialogDescription className="text-[13px] leading-relaxed text-ink-faint">
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
    <DialogFooter className="mt-6 gap-2">
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        className="h-10 rounded-xl border border-hairline bg-quiet text-ink-muted hover:bg-chip hover:text-ink"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className="h-10 rounded-xl bg-tone-sky font-medium text-canvas shadow-lg shadow-tone-sky/30 transition-opacity hover:bg-tone-sky hover:opacity-90"
      >
        {submitLabel}
      </Button>
    </DialogFooter>
  );
}
