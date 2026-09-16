"use client";

import { CalendarClock, Compass, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type DashboardPage = "overview" | "flow" | "bills";

const PAGES: { id: DashboardPage; label: string; icon: typeof Compass }[] = [
  { id: "overview", label: "Overview", icon: Compass },
  { id: "flow", label: "Monthly flow", icon: TrendingUp },
  { id: "bills", label: "Monthly bills", icon: CalendarClock },
];

/** Floating pill that pages the dashboard on small screens — hidden at `lg` and up, where everything lives on one continuous page. */
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
      <div className="flex w-4/5 max-w-sm items-stretch justify-around rounded-full border border-hairline bg-panel p-1 shadow-[var(--modal-shadow)]">
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
                isActive ? "bg-quiet-hover text-ink" : "text-ink-ghost",
              )}
            >
              <Icon className={cn("size-5", isActive && "text-brand")} />
              {page.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
