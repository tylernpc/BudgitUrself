import type {ReactNode} from "react";
import {SpeedInsights} from "@vercel/speed-insights/next"

export default function MarketingLayout({children,}: {
    children: ReactNode;
}) {
    return <main>{children}
        <SpeedInsights/>
    </main>;
}
