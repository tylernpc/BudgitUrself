import { z } from "zod";

const namePart = z.string().trim().min(1, "Required").max(60);

export const nameSchema = z.object({
  firstName: namePart,
  lastName: namePart,
});

export type NameInput = z.infer<typeof nameSchema>;

/** The client crops and scales to this square before uploading. */
export const AVATAR_SIZE = 256;
export const AVATAR_MAX_BYTES = 512 * 1024;
export const AVATAR_TYPES = ["image/webp", "image/jpeg", "image/png"] as const;

export const avatarSchema = z
  .file()
  .mime([...AVATAR_TYPES], "Use a WebP, JPEG, or PNG image")
  .max(AVATAR_MAX_BYTES, "Image must be under 512 KB");
