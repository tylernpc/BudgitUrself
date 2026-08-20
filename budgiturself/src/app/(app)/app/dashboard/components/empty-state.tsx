import type { ReactNode } from "react";

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-hairline py-6 text-center text-[13px] text-ink-ghost">
      {children}
    </p>
  );
}
