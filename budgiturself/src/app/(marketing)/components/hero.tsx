import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroPreview } from "./hero-preview";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 sm:pt-10 lg:px-8 lg:pt-14 lg:pb-16">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="reveal">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="" width={28} height={28} className="size-7" />
            <span className="text-sm font-semibold tracking-tight text-ink">BudgitUrself</span>
          </div>

          <h1 className="mt-8 text-[2.5rem] leading-[1.05] font-semibold tracking-tight text-balance text-ink sm:text-[3.25rem] lg:text-[3.5rem]">
            Know exactly what you can spend.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-faint sm:text-lg">
            You enter what you earn and what you owe — no sync engine guessing at your categories.
            Every bill and balance is counted, and what is left is genuinely yours.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild className="h-11 px-5 text-[15px]">
              <a href="/auth/login">
                Get started
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-11 px-5 text-[15px]">
              <a href="#try-it">See the math</a>
            </Button>
          </div>

          <p className="mt-5 text-sm text-ink-ghost">No credit card required · Free forever</p>
        </div>

        <div className="reveal" style={{ animationDelay: "80ms" }}>
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}
