// app/api/health/db/route.ts
import { prisma } from "@/lib/db/prisma";

export async function GET() {
    try {
        // Connection sanity check
        await prisma.$queryRaw`SELECT 1`;

        // Fetch the row from your Users table
        const user = await prisma.user.findUnique({
            where: { id: 1 },
            select: { id: true, userName: true },
        });

        return Response.json({
            status: "ok",
            user,
        });
    } catch (error) {
        return Response.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
