import { Plus, X } from "lucide-react";
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

export function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      size="icon"
      variant="ghost"
      aria-label={label}
      onClick={onClick}
      className="size-8 shrink-0 rounded-full text-ink-ghost transition-colors hover:bg-tone-rose/15 hover:text-tone-rose focus-visible:ring-tone-rose/40"
    >
      <X className="size-3.5" />
    </Button>
  );
}
