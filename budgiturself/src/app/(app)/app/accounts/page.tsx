import type { Metadata } from "next";

export const metadata: Metadata = { title: "Accounts" };

export default function AccountsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Accounts</h1>
      <p className="mt-2 text-ink-faint">Account management is not built yet.</p>
    </main>
  );
}
