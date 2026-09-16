import type { ReactNode } from "react";
import Image from "next/image";

/** The full-page frame around onboarding: logo up top, one card in the middle. */
export function OnboardingShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink selection:bg-brand/20">
      <header className="mx-auto flex h-14 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="" width={24} height={24} className="size-6" />
          <span className="text-sm font-semibold tracking-tight text-ink">BudgitUrself</span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <section className="surface reveal w-full max-w-md px-6 py-7 sm:px-8 sm:py-8">
          {children}
        </section>
      </main>
    </div>
  );
}
