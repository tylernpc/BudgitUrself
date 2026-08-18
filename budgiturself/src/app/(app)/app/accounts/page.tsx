import type { Metadata } from "next";

export const metadata: Metadata = { title: "Accounts" };

export default function AccountsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Accounts</h1>
      <p className="mt-2 text-muted-foreground">Account management is not built yet.</p>
    </main>
  );
}
