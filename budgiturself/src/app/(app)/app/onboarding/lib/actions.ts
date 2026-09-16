"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { onboardingSchema } from "@/lib/profile/schemas";

export interface ActionResult {
  error?: string;
}

const DASHBOARD_PATH = "/app/dashboard";

/**
 * Takes FormData because the optional photo is a File. Re-validates with the
 * same schema the form used. The client moves on to the tour afterwards, so
 * this only saves; the dashboard is revalidated for when the tour ends.
 */
export async function completeOnboardingAction(formData: FormData): Promise<ActionResult> {
  const avatar = formData.get("avatar");
  const parsed = onboardingSchema.safeParse({
    firstName: formData.get("firstName"),
    avatar: avatar instanceof File && avatar.size > 0 ? avatar : null,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter your first name" };
  }

  const user = await requireCurrentUser();
  await db.user.update({
    where: { id: user.id },
    data: {
      firstName: parsed.data.firstName,
      ...(parsed.data.avatar && {
        avatar: new Uint8Array(await parsed.data.avatar.arrayBuffer()),
        avatarType: parsed.data.avatar.type,
      }),
    },
  });

  revalidatePath(DASHBOARD_PATH);
  return {};
}

/** Stamps the tour as seen, whether it was finished or skipped, so it never shows again. */
export async function finishOnboardingAction(): Promise<ActionResult> {
  const user = await requireCurrentUser();
  await db.user.update({
    where: { id: user.id },
    data: { onboardedAt: new Date() },
  });

  revalidatePath(DASHBOARD_PATH);
  return {};
}
