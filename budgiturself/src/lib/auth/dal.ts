import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth/auth0";
import { db } from "@/lib/db";

export const LOGIN_PATH = "/auth/login";

export interface SessionUser {
  auth0Sub: string;
  email: string;
  name: string | null;
}

export interface AppUser {
  id: string;
  email: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
}

/**
 * The Auth0 session, narrowed to the claims this app actually uses.
 * Cached per request so repeated reads in one render do not re-decrypt.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user?.sub || typeof user.email !== "string") {
    return null;
  }

  return {
    auth0Sub: user.sub,
    email: user.email,
    name: typeof user.name === "string" ? user.name : null,
  };
});

export async function requireSessionUser(): Promise<SessionUser> {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect(LOGIN_PATH);
  }

  return sessionUser;
}

/**
 * The application record for the signed-in user, keyed by Auth0 subject.
 * Returns null when the caller is anonymous or has no provisioned record.
 */
export const getCurrentUser = cache(async (): Promise<AppUser | null> => {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return null;
  }

  return db.user.findUnique({
    where: { auth0Sub: sessionUser.auth0Sub },
    select: { id: true, email: true, name: true, firstName: true, lastName: true },
  });
});

/**
 * Resolves the signed-in user, provisioning the record on first login.
 * Every authenticated read should enter the domain through this function so
 * that ownership is established at the data-access boundary.
 */
export const requireCurrentUser = cache(async (): Promise<AppUser> => {
  const sessionUser = await requireSessionUser();

  return db.user.upsert({
    where: { auth0Sub: sessionUser.auth0Sub },
    create: {
      auth0Sub: sessionUser.auth0Sub,
      email: sessionUser.email,
      name: sessionUser.name,
    },
    update: { email: sessionUser.email, name: sessionUser.name },
    select: { id: true, email: true, name: true, firstName: true, lastName: true },
  });
});
