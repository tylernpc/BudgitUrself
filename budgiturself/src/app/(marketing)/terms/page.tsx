import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-semibold text-gray-900">Terms of Service</h1>
      <p className="mt-6 text-lg leading-relaxed text-gray-600">
        These terms have not been published yet. BudgitUrself is provided as-is while in active
        development.
      </p>
    </main>
  );
}
