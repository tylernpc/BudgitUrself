import type { Metadata } from "next";
import { requireCurrentUser } from "@/lib/auth/dal";
import { BudgetWorkspace } from "./components/budget-workspace";
import { DashboardHeader } from "./components/dashboard-header";
import { sampleBudget } from "./lib/sample-budget";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12">
          <h1 className="mb-2 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-4xl font-bold text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-400">
            {user.name
              ? `${user.name}'s complete financial overview`
              : "Your complete financial overview"}
          </p>
        </div>

        <BudgetWorkspace initialBudget={sampleBudget} />
      </main>
    </div>
  );
}
