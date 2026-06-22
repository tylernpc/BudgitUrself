import {NextResponse} from "next/server";
import {prisma} from "@/lib/db/prisma";
import {getCurrentUser} from "@/lib/auth/session";

// GET Operations
export async function GET() {
    const authUser = await getCurrentUser();

    if (!authUser?.sub) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    try {
        const user = await prisma.user.findUnique({
            where: {auth0Sub: authUser.sub},
            select: {id: true, email: true, name: true}
        });

        return NextResponse.json({user});
    } catch (error) {
        return NextResponse.json(
            {error: error instanceof Error ? error.message : "Unknown error"},
            {status: 500}
        );
    }
}

// POST Operations
// export async function POST(req: Request) {
//     const userRequest = 1;
//
//     try {
//
//     }
//
//     const body = await req.json();
//     return NextResponse.json({user: body});
// }