import { Pencil, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Primary "add a thing" affordance — 36px tall so it stays thumb-friendly. */
export function AddButton({
  label,
  onClick,
  className,
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={onClick}
      className={cn("h-9 px-3 text-[13px] font-medium", className)}
    >
      <Plus className="size-3.5" />
      {label}
    </Button>
  );
}

export function SubtleButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={onClick}
      className={cn("h-8 px-3 text-[13px] font-medium", className)}
    >
      {children}
    </Button>
  );
}

const iconButton =
  "size-8 shrink-0 rounded-md text-ink-ghost transition-colors hover:bg-chip hover:text-ink";

export function ChargeButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button size="icon" variant="ghost" aria-label={label} onClick={onClick} className={iconButton}>
      <Plus className="size-3.5" />
    </Button>
  );
}

export function EditButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button size="icon" variant="ghost" aria-label={label} onClick={onClick} className={iconButton}>
      <Pencil className="size-3.5" />
    </Button>
  );
}

/** Sits in a row's top-right corner instead of crowding its trailing content — the row needs `relative`. */
export function RemoveBadge({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="absolute -top-2 -right-2 z-10 grid size-5 place-items-center rounded-full border border-hairline-strong bg-panel text-ink-ghost shadow-[var(--panel-shadow)] transition-colors hover:border-tone-rose hover:bg-tone-rose hover:text-white focus-visible:ring-2 focus-visible:ring-tone-rose/40 focus-visible:outline-none"
    >
      <X className="size-3" />
    </button>
  );
}
