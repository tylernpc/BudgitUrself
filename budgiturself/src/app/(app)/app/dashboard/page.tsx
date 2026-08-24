import type { Metadata } from "next";
import { requireCurrentUser } from "@/lib/auth/dal";
import { budgetRepository } from "@/lib/budget/prisma-budget-repository";
import { BudgetWorkspace } from "./components/budget-workspace";
import { DashboardHeader } from "./components/dashboard-header";

export const metadata: Metadata = { title: "Dashboard" };

const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const budget = await budgetRepository.getBudget(user.id);
  const greetingName = user.firstName;

  return (
    <div className="min-h-screen bg-app font-ui text-fg selection:bg-brand/15">
      <DashboardHeader firstName={user.firstName} lastName={user.lastName} email={user.email} />

      <main className="mx-auto w-full max-w-[74rem] px-4 pt-8 pb-16 sm:px-6 sm:pt-10 lg:px-8">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h1 className="font-display text-[2rem] leading-none tracking-tight text-fg sm:text-[2.5rem]">
            {greetingName ? `Welcome back, ${greetingName}` : "Welcome back"}
          </h1>
          <p className="eyebrow">{monthLabel.format(new Date())}</p>
        </div>

        <BudgetWorkspace budget={budget} />
      </main>
    </div>
  );
}
