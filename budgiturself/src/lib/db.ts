import "server-only";

import { PrismaClient } from "@prisma/client";
import { env } from "@/lib/env";

// Fail fast on a misconfigured deployment rather than at the first query.
const { NODE_ENV } = env();

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
