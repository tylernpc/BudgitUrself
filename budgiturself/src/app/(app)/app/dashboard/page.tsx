import type { Metadata } from "next";
import { requireCurrentUser } from "@/lib/auth/dal";
import { budgetRepository } from "@/lib/budget/prisma-budget-repository";
import { BudgetWorkspace } from "./components/budget-workspace";
import { DashboardHeader } from "./components/dashboard-header";
import { ProfileAvatar } from "./components/profile-avatar";
import { Reveal } from "./components/reveal";

export const metadata: Metadata = { title: "Dashboard" };

const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const budget = await budgetRepository.getBudget(user.id);
  const greetingName = user.firstName;

  return (
    <div className="min-h-screen bg-canvas text-ink selection:bg-brand/20">
      <DashboardHeader
        firstName={user.firstName}
        lastName={user.lastName}
        email={user.email}
        avatarUrl={user.avatarUrl}
      />

      <main className="mx-auto max-w-7xl px-4 pt-8 pb-4 sm:px-6 sm:pt-12 lg:px-8 lg:pb-16">
        <Reveal className="mb-8 flex items-center justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-sm font-medium text-ink-faint">{monthLabel.format(new Date())}</p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {greetingName ? `Welcome back, ${greetingName}` : "Welcome back"}
            </h1>
          </div>
          <ProfileAvatar
            avatarUrl={user.avatarUrl}
            firstName={user.firstName}
            lastName={user.lastName}
            email={user.email}
          />
        </Reveal>

        <BudgetWorkspace budget={budget} />
      </main>
    </div>
  );
}
