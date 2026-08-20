import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Privacy Policy</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-faint">
        This policy has not been published yet. BudgitUrself stores the account details supplied by
        your identity provider and the budget figures you enter, and does not sell or share them.
      </p>
    </main>
  );
}
