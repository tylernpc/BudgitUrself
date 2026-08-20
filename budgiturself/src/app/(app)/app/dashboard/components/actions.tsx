import { Pencil, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const glass =
  "border border-hairline bg-quiet text-ink-muted backdrop-blur transition-colors hover:border-hairline-strong hover:bg-chip hover:text-ink focus-visible:ring-hairline-strong";

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
      variant="ghost"
      onClick={onClick}
      className={cn(glass, "h-9 rounded-full px-3.5 text-xs font-medium", className)}
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
      variant="ghost"
      onClick={onClick}
      className={cn(glass, "h-8 rounded-full px-3 text-xs font-medium", className)}
    >
      {children}
    </Button>
  );
}

export function ChargeButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      size="icon"
      variant="ghost"
      aria-label={label}
      onClick={onClick}
      className="size-8 shrink-0 rounded-full text-ink-ghost transition-colors hover:bg-chip hover:text-ink"
    >
      <Plus className="size-3.5" />
    </Button>
  );
}

export function EditButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      size="icon"
      variant="ghost"
      aria-label={label}
      onClick={onClick}
      className="size-8 shrink-0 rounded-full text-ink-ghost transition-colors hover:bg-chip hover:text-ink"
    >
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
      className="absolute -top-2 -right-2 z-10 grid size-5 place-items-center rounded-full bg-tone-rose text-canvas shadow-md shadow-tone-rose/30 transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-tone-rose/50 focus-visible:outline-none"
    >
      <X className="size-3.5" />
    </button>
  );
}
