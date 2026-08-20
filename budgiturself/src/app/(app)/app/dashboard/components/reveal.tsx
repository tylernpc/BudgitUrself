import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Staggered entrance. Pure CSS, so it also works before hydration. */
export function Reveal({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("reveal", className)} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
