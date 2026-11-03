import { redirect } from "next/navigation";

/**
 * The journal lives as a tab inside the dashboard workspace, not on its own
 * route — it shares the optimistic state the dashboard already holds. This
 * stub stays only so an old link still lands somewhere useful.
 */
export default function TransactionsPage() {
  redirect("/app/dashboard");
}
