import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const controlClass =
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-line bg-surface text-[13px] font-medium text-fg-muted transition-colors outline-none hover:border-line-strong hover:bg-surface-2 hover:text-fg focus-visible:ring-2 focus-visible:ring-brand/40 disabled:pointer-events-none disabled:opacity-50";

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
    <button type="button" onClick={onClick} className={cn(controlClass, "h-8 px-2.5", className)}>
      <Plus className="size-3.5" />
      {label}
    </button>
  );
}

export function SubtleButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button type="button" onClick={onClick} className={cn(controlClass, "h-8 px-2.5", className)}>
      {children}
    </button>
  );
}

/** Holds a row's controls. The row itself needs `data-row` for the hover reveal. */
export function RowActions({ children }: { children: ReactNode }) {
  return <span className="row-actions flex shrink-0 items-center gap-0.5">{children}</span>;
}

export function IconAction({
  icon,
  label,
  onClick,
  destructive,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-md text-fg-subtle transition-colors outline-none hover:bg-surface-3 focus-visible:ring-2 focus-visible:ring-brand/40 [&_svg]:size-3.5",
        destructive ? "hover:text-neg" : "hover:text-fg",
      )}
    >
      {icon}
    </button>
  );
}
