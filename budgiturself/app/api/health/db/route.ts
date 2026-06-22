// app/api/health/db/route.ts
import {prisma} from "@/lib/db/prisma";

export async function GET() {
    try {
        // Connection sanity check
        await prisma.$queryRaw`SELECT 1`;

        return Response.json({
            status: "ok",
        });
    } catch (error) {
        return Response.json(
            {error: error instanceof Error ? error.message : "Unknown error"},
            {status: 500}
        );
    }
}
