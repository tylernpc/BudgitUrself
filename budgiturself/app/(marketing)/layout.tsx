import type {ReactNode} from "react";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {Analytics} from "@vercel/analytics/next";
import MyStatsig from "@/app/my-statsig";

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <MyStatsig>
            {children}
            <SpeedInsights/>
            <Analytics/>
        </MyStatsig>
        </body>
        </html>
    );
}