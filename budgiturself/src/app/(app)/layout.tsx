import type { ReactNode } from "react";
import { requireSessionUser } from "@/lib/auth/dal";

/**
 * First gate only — every read still re-checks ownership in the DAL.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  await requireSessionUser();

  return <>{children}</>;
}
