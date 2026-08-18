import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <SpeedInsights />
      <Analytics />
    </>
  );
}
