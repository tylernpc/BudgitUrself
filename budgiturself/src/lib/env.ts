import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.url(),
  DIRECT_URL: z.url(),
  AUTH0_DOMAIN: z.string().min(1),
  AUTH0_CLIENT_ID: z.string().min(1),
  AUTH0_CLIENT_SECRET: z.string().min(1),
  AUTH0_SECRET: z.string().min(32),
  APP_BASE_URL: z.url(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function parseServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const missing = parsed.error.issues.map(
      (issue) => `  - ${issue.path.join(".")}: ${issue.message}`,
    );
    throw new Error(`Invalid server environment:\n${missing.join("\n")}`);
  }

  return parsed.data;
}

let cached: ServerEnv | undefined;

/**
 * Server-only environment access. Lazily validated so that builds which never
 * touch a secret (static marketing pages) do not require the full set.
 */
export function env(): ServerEnv {
  cached ??= parseServerEnv();
  return cached;
}
