"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { formatCurrency } from "@/lib/format";
import { cn, prefersReducedMotion } from "@/lib/utils";

/** Layout effect on the client, plain effect during SSR, so the first paint never flashes. */
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

interface AnimatedCurrencyProps {
  value: number;
  className?: string;
  duration?: number;
  format?: (value: number) => string;
}

/**
 * Counts to `value` on mount and re-counts whenever it changes, easing out so
 * the last digits settle gently. Renders the final value during SSR.
 */
export function AnimatedCurrency({
  value,
  className,
  duration = 1100,
  format = formatCurrency,
}: AnimatedCurrencyProps) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(0);

  useBeforePaint(() => {
    if (prefersReducedMotion()) {
      fromRef.current = value;
      setDisplay(value);
      return;
    }

    const from = fromRef.current;
    const start = performance.now();
    let handle = 0;

    const tick = () => {
      const progress = Math.min((performance.now() - start) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const next = from + (value - from) * eased;

      fromRef.current = next;
      setDisplay(next);
      if (progress < 1) handle = requestAnimationFrame(tick);
    };

    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, [value, duration]);

  return (
    <span className={cn("num", className)}>
      <span className="sr-only">{format(value)}</span>
      <span aria-hidden>{format(display)}</span>
    </span>
  );
}
