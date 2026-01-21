// app/api/health/route.ts
import {NextResponse} from "next/server";

export function GET() {
    return NextResponse.json(
        {
            ok: true,
            service: "budgiturself",
            timestamp: new Date().toISOString(),
        },
        {status: 200}
    );
}