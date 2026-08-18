import { auth0 } from "@/lib/auth/auth0";

/**
 * Auth0 mounts its `/auth/*` routes here and refreshes the session cookie on
 * every request. It is not the authorization boundary — pages and the DAL are.
 */
export async function proxy(request: Request) {
  return auth0.middleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
