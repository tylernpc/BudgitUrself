import type { ReactNode } from "react";

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-hairline-strong py-6 text-center text-[13px] text-ink-ghost">
      {children}
    </p>
  );
}
