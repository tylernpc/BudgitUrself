import type { ReactNode } from "react";

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-line px-4 py-5 text-center text-[13px] text-fg-subtle">
      {children}
    </p>
  );
}
