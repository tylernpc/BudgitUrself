"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { nameSchema } from "@/lib/auth/schemas";

export interface ActionResult {
  error?: string;
}

export async function updateNameAction(input: unknown): Promise<ActionResult> {
  const parsed = nameSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid name" };
  }

  const user = await requireCurrentUser();
  await db.user.update({
    where: { id: user.id },
    data: { firstName: parsed.data.firstName, lastName: parsed.data.lastName },
  });
  revalidatePath("/app/settings");
  return {};
}
