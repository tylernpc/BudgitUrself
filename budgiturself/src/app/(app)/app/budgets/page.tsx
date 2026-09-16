import type { Metadata } from "next";

export const metadata: Metadata = { title: "Budgets" };

export default function BudgetsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Budgets</h1>
      <p className="mt-2 text-ink-faint">Budget planning is not built yet.</p>
    </main>
  );
}
