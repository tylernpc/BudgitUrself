import "server-only";

import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { env } from "@/lib/env";

const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET, APP_BASE_URL } = env();

export const auth0 = new Auth0Client({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  clientSecret: AUTH0_CLIENT_SECRET,
  secret: AUTH0_SECRET,
  appBaseUrl: APP_BASE_URL,
});
