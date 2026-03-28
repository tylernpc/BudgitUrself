import {NextResponse} from "next/server";
import {prisma} from "@/lib/db/prisma";

// GET Operations
export async function GET() {
    const userRequest = 1;

    try {
        const user = await prisma.user.findUnique({
            where: {id: userRequest},
            select: {id: true, userName: true}
        });

        return Response.json({
            status: 200,
            user,
        });
    } catch (error) {
        return Response.json(
            {error: error instanceof Error ? error.message : "Unknown error"},
            {status: 500}
        );
    }
}

// POST Operations
export async function POST(req: Request) {
    const body = await req.json();
    return NextResponse.json({user: body});
}