import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Budgeting in under two minutes",
  "Unlimited cards and accounts",
  "One honest number, every month",
  "No credit card to start",
];

export function SiteFooter() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="surface reveal relative overflow-hidden px-6 py-10 text-center sm:px-10 sm:py-14">
          <div aria-hidden className="wash-surplus pointer-events-none absolute inset-0 -z-10" />

          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-[2.5rem]">
            Ready to see what is actually left?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-ink-faint">
            Enter your own numbers once and the month stops being a guess.
          </p>

          <ul className="mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2 text-sm text-ink-muted">
                <Check className="size-4 shrink-0 text-tone-emerald" />
                {benefit}
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            asChild
            className="mt-8 h-12 rounded-full bg-tone-sky px-7 text-base font-medium text-canvas shadow-lg shadow-tone-sky/25 transition-all hover:bg-tone-sky hover:opacity-90 active:translate-y-px"
          >
            <a href="/auth/login">
              Get started
              <ArrowRight className="ml-1 size-5" />
            </a>
          </Button>

          <p className="mt-5 text-sm text-ink-ghost">Free forever · No credit card required</p>
        </div>
      </section>

      <footer className="border-t border-hairline">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-2">
              <Link href="/" className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-chip ring-1 ring-hairline">
                  <Image src="/logo.png" alt="" width={24} height={24} className="size-6" />
                </span>
                <span className="text-[15px] font-medium tracking-tight text-ink">
                  BudgitUrself
                </span>
              </Link>
              <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-ink-faint">
                Manual-first budgeting. You enter the money, the app does the arithmetic you keep
                avoiding.
              </p>
            </div>

            <nav aria-labelledby="footer-company">
              <h2
                id="footer-company"
                className="text-[10px] font-medium tracking-[0.18em] text-ink-ghost uppercase"
              >
                Company
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link href="/about" className="text-ink-muted transition-colors hover:text-ink">
                    About us
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-labelledby="footer-legal">
              <h2
                id="footer-legal"
                className="text-[10px] font-medium tracking-[0.18em] text-ink-ghost uppercase"
              >
                Legal
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link href="/privacy" className="text-ink-muted transition-colors hover:text-ink">
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-ink-muted transition-colors hover:text-ink">
                    Terms of service
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-6 sm:flex-row">
            <p className="text-[13px] text-ink-ghost">
              © {new Date().getFullYear()} BudgitUrself. All rights reserved.
            </p>
            <div className="flex gap-6 text-[13px]">
              <Link href="/privacy" className="text-ink-ghost transition-colors hover:text-ink">
                Privacy
              </Link>
              <Link href="/terms" className="text-ink-ghost transition-colors hover:text-ink">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
