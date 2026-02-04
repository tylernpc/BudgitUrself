import type {ReactNode} from "react";
import {SpeedInsights} from "@vercel/speed-insights/next"
import {Analytics} from "@vercel/analytics/next"

export default function MarketingLayout({children,}: {
    children: ReactNode;
}) {
    return <main>{children}
        <SpeedInsights/>
        <Analytics/>
    </main>;
}
