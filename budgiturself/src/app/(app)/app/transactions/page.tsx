import type { Metadata } from "next";

export const metadata: Metadata = { title: "Transactions" };

export default function TransactionsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Transactions</h1>
      <p className="mt-2 text-muted-foreground">Transaction history is not built yet.</p>
    </main>
  );
}
