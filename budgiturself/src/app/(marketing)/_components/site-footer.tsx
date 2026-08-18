import Link from "next/link";
import { ArrowRight, CheckCircle2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Start budgeting in under 2 minutes",
  "Connect unlimited cards and accounts",
  "Get insights into your spending habits",
  "No credit card required to start",
];

export function SiteFooter() {
  return (
    <>
      <section className="bg-linear-to-b from-blue-600 to-blue-700 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-6 text-4xl text-white sm:text-5xl">
              Ready to Take Control of Your Budget?
            </h2>
            <p className="mb-8 text-xl text-blue-100">
              Join thousands of people who are already managing their money smarter
            </p>

            <ul className="mb-8 space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center justify-center gap-3 text-blue-50">
                  <CheckCircle2 className="size-5 shrink-0 text-blue-200" />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" variant="secondary" asChild>
              <a
                href="/auth/login"
                className="px-8 py-6 text-lg transition-transform active:translate-y-px active:scale-[0.98]"
              >
                Get Started!
                <ArrowRight className="ml-2 size-5" />
              </a>
            </Button>

            <p className="mt-6 text-sm text-blue-200">Free forever • No credit card required</p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <Link
                href="/"
                className="mb-4 flex items-center gap-2 text-white transition-colors hover:text-gray-200"
              >
                <DollarSign className="size-8 text-blue-500" />
                <span className="text-xl">BudgitUrself</span>
              </Link>
              <p className="mb-4 text-sm text-gray-400">
                Take control of your finances with smart budgeting tools and insights.
              </p>
            </div>

            <nav aria-labelledby="footer-company">
              <h2 id="footer-company" className="mb-4 text-white">
                Company
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="transition-colors hover:text-white">
                    About Us
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-labelledby="footer-legal">
              <h2 id="footer-legal" className="mb-4 text-white">
                Legal
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="transition-colors hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition-colors hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} BudgitUrself. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="transition-colors hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
