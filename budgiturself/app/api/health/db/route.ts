// app/api/health/db/route.ts
import {prisma} from "@/lib/db/prisma";

export async function GET() {
    try {
        // Connection sanity check
        await prisma.$queryRaw`SELECT 1`;

        // Fetch a representative user (if any)
        const user = await prisma.user.findFirst({
            select: {id: true, email: true},
        });

        return Response.json({
            status: "ok",
            user,
        });
    } catch (error) {
        return Response.json(
            {error: error instanceof Error ? error.message : "Unknown error"},
            {status: 500}
        );
    }
}
