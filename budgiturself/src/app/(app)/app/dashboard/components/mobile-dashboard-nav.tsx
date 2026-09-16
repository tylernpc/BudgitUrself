"use client";

import { CalendarClock, Compass, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type DashboardPage = "overview" | "flow" | "bills";

const PAGES: { id: DashboardPage; label: string; icon: typeof Compass; accent: string }[] = [
  { id: "overview", label: "Overview", icon: Compass, accent: "text-tone-violet" },
  { id: "flow", label: "Monthly flow", icon: TrendingUp, accent: "text-tone-emerald" },
  { id: "bills", label: "Monthly bills", icon: CalendarClock, accent: "text-tone-cyan" },
];

/** Floating glass pill that pages the dashboard on small screens — hidden at `lg` and up, where everything lives on one continuous page. */
export function MobileDashboardNav({
  active,
  onChange,
}: {
  active: DashboardPage;
  onChange: (page: DashboardPage) => void;
}) {
  return (
    <nav
      aria-label="Dashboard sections"
      className="fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-4 lg:hidden"
    >
      <div className="glass-pill flex w-4/5 max-w-sm items-stretch justify-around px-2 py-1.5">
        {PAGES.map((page) => {
          const Icon = page.icon;
          const isActive = page.id === active;

          return (
            <button
              key={page.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onChange(page.id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-full py-2 text-[10px] font-medium transition-colors",
                isActive ? "bg-chip text-ink" : "text-ink-ghost",
              )}
            >
              <Icon className={cn("size-5", isActive && page.accent)} />
              {page.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
