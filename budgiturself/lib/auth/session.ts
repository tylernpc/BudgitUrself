import { auth0 } from "@/lib/auth/auth0";

export async function getCurrentUser() {
    const session = await auth0.getSession();
    return session?.user ?? null;
}
