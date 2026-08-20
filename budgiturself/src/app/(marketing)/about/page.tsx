import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">About</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-faint">
        BudgitUrself is built on a simple idea: you understand your money better when you enter it
        yourself. Instead of syncing accounts and guessing at categories, you log what you earn and
        what you owe, and the app shows you exactly what is left.
      </p>
    </main>
  );
}
