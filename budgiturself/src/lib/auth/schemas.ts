import { z } from "zod";

const namePart = z.string().trim().min(1, "Required").max(60);

export const nameSchema = z.object({
  firstName: namePart,
  lastName: namePart,
});

export type NameInput = z.infer<typeof nameSchema>;
