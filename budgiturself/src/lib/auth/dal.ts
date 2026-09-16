import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth/auth0";
import { db } from "@/lib/db";

export const LOGIN_PATH = "/auth/login";
export const ONBOARDING_PATH = "/app/onboarding";

export interface SessionUser {
  auth0Sub: string;
  email: string;
}

export interface AppUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  /** The uploaded profile picture as a data URL, ready for an `<img>`. */
  avatarUrl: string | null;
  /** When they finished (or skipped) the onboarding tour; null until then. */
  onboardedAt: Date | null;
}

const userSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  avatar: true,
  avatarType: true,
  onboardedAt: true,
} as const;

interface UserRow {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatar: Uint8Array | null;
  avatarType: string | null;
  onboardedAt: Date | null;
}

/** Avatars are small (resized client-side before upload), so inlining beats a second request. */
function toAppUser({ avatar, avatarType, ...user }: UserRow): AppUser {
  return {
    ...user,
    avatarUrl:
      avatar && avatarType
        ? `data:${avatarType};base64,${Buffer.from(avatar).toString("base64")}`
        : null,
  };
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

  const user = await db.user.findUnique({
    where: { auth0Sub: sessionUser.auth0Sub },
    select: userSelect,
  });

  return user ? toAppUser(user) : null;
});

/**
 * Resolves the signed-in user, provisioning the record on first login.
 * Every authenticated read should enter the domain through this function so
 * that ownership is established at the data-access boundary.
 */
export const requireCurrentUser = cache(async (): Promise<AppUser> => {
  const sessionUser = await requireSessionUser();

  const user = await db.user.upsert({
    where: { auth0Sub: sessionUser.auth0Sub },
    create: {
      auth0Sub: sessionUser.auth0Sub,
      email: sessionUser.email,
    },
    update: { email: sessionUser.email },
    select: userSelect,
  });

  return toAppUser(user);
});

/**
 * The signed-in user once they have been through onboarding. Anyone who has
 * not — new accounts and accounts that predate the tour alike — is sent there
 * first; it stamps `onboardedAt` so this only ever happens once.
 */
export async function requireOnboardedUser(): Promise<AppUser> {
  const user = await requireCurrentUser();

  if (!user.onboardedAt) {
    redirect(ONBOARDING_PATH);
  }

  return user;
}
