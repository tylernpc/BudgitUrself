import type { Metadata } from "next";
import { requireCurrentUser } from "@/lib/auth/dal";
import { budgetRepository } from "@/lib/budget/prisma-budget-repository";
import { AuroraBackdrop } from "@/components/ui/aurora-backdrop";
import { BudgetWorkspace } from "./components/budget-workspace";
import { DashboardHeader } from "./components/dashboard-header";
import { Reveal } from "./components/reveal";

export const metadata: Metadata = { title: "Dashboard" };

const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const budget = await budgetRepository.getBudget(user.id);
  const greetingName = user.firstName;

  return (
    <div className="relative min-h-screen bg-canvas text-ink selection:bg-tone-cyan/25">
      <AuroraBackdrop />

      <div className="relative z-10">
        <DashboardHeader firstName={user.firstName} lastName={user.lastName} email={user.email} />

        <main className="mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6 sm:pt-14 lg:px-8">
          <Reveal className="mb-9 sm:mb-12">
            <p className="text-[11px] font-medium tracking-[0.2em] text-tone-cyan uppercase">
              {monthLabel.format(new Date())}
            </p>
            <h1 className="mt-3 text-[2rem] leading-tight font-semibold tracking-tight text-ink sm:text-[2.75rem]">
              {greetingName ? `Welcome back, ${greetingName}` : "Welcome back"}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-faint sm:text-[15px]">
              Everything you owe and everything you keep, resolved into one honest number.
            </p>
          </Reveal>

          <BudgetWorkspace budget={budget} />
        </main>
      </div>
    </div>
  );
}
