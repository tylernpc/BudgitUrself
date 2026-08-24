import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The one card treatment in the app: a solid surface, a hairline edge, and a
 * shadow that only separates it from the page. Sections inside are divided by
 * rules rather than by nesting more cards.
 */
export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("app-card", className)}>{children}</section>;
}

interface PanelHeaderProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PanelHeader({ icon, title, description, action }: PanelHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 border-b border-line px-5 py-4 sm:px-6">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-fg">
          <span className="text-fg-subtle [&_svg]:size-[15px]">{icon}</span>
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 max-w-prose text-[13px] leading-relaxed text-fg-muted">
            {description}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}

export function PanelBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("px-5 py-5 sm:px-6", className)}>{children}</div>;
}

/** Totals live on a tinted strip at the foot of a card, never in a coloured tile. */
export function PanelFooter({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-auto flex items-baseline justify-between gap-4 rounded-b-[calc(0.75rem-1px)] border-t border-line bg-surface-2 px-5 py-4 sm:px-6",
        className,
      )}
    >
      <span className="eyebrow">{label}</span>
      {children}
    </div>
  );
}

export function SectionLabel({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={cn("eyebrow", className)}>{children}</span>;
}

/**
 * The heading for a list inside a card: name on the left, its running total on
 * the right, and whatever adds to it after that.
 */
export function SectionHeading({
  icon,
  title,
  total,
  action,
}: {
  icon?: ReactNode;
  title: string;
  total: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <h3 className="flex items-center gap-2 text-[13px] font-semibold text-fg">
        {icon && <span className="text-fg-subtle [&_svg]:size-[14px]">{icon}</span>}
        {title}
        <span className="tnum text-[13px] font-normal text-fg-muted">{total}</span>
      </h3>
      {action}
    </div>
  );
}
