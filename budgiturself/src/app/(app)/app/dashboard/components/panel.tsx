"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const accents = {
  cyan: "text-tone-cyan shadow-[0_0_24px_-6px_var(--tw-shadow-color)] shadow-tone-cyan/50",
  emerald: "text-tone-emerald shadow-[0_0_24px_-6px_var(--tw-shadow-color)] shadow-tone-emerald/50",
  violet: "text-tone-violet shadow-[0_0_24px_-6px_var(--tw-shadow-color)] shadow-tone-violet/50",
} as const;

export type Accent = keyof typeof accents;

/** Frosted card with a pointer-tracked highlight. */
export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  const trackPointer = (event: React.PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - box.top}px`);
  };

  return (
    <section onPointerMove={trackPointer} className={cn("surface spotlight lift", className)}>
      {children}
    </section>
  );
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
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline px-5 py-5 sm:px-7 sm:py-6">
      <div className="flex min-w-0 items-start gap-3.5">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-2xl bg-chip ring-1 ring-hairline [&_svg]:size-[18px]",
            accents[accent],
          )}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="text-[15px] font-medium tracking-tight text-ink">{title}</h2>
          {description && (
            <p className="mt-1 text-[13px] leading-relaxed text-ink-faint">{description}</p>
          )}
        </div>
      </div>
      {action}
    </header>
  );
}

export function PanelBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("px-5 py-6 sm:px-7", className)}>{children}</div>;
}

export function SectionLabel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "text-[10px] font-medium tracking-[0.18em] text-ink-ghost uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
