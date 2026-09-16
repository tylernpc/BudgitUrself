import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const accents = {
  cyan: "text-tone-cyan",
  emerald: "text-tone-emerald",
  violet: "text-tone-violet",
} as const;

export type Accent = keyof typeof accents;

/**
 * Opaque card. `isolation: isolate` on .surface is load-bearing — it gives the
 * negative-z overlays inside some panels a stacking context to sit in.
 */
export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("surface", className)}>{children}</section>;
}

interface PanelHeaderProps {
  icon: ReactNode;
  accent: Accent;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PanelHeader({ icon, accent, title, description, action }: PanelHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline px-5 py-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-md border border-hairline bg-quiet [&_svg]:size-4",
            accents[accent],
          )}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-[13px] text-ink-faint">{description}</p>}
        </div>
      </div>
      {action}
    </header>
  );
}

export function PanelBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("px-5 py-5 sm:px-6", className)}>{children}</div>;
}

export function SectionLabel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "text-[11px] font-semibold tracking-[0.04em] text-ink-faint uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
