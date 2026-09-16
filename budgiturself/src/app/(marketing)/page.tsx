import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/dal";
import { Features } from "./components/features";
import { Hero } from "./components/hero";
import { InteractiveDemo } from "./components/interactive-demo";
import { MonthlyBillsPreview } from "./components/monthly-bills-preview";
import { SiteFooter } from "./components/site-footer";

export default async function MarketingPage() {
  if (await getSessionUser()) {
    redirect("/app/dashboard");
  }

  return (
    <div className="min-h-screen bg-canvas text-ink selection:bg-brand/20">
      <main>
        <Hero />
        <Features />
        <InteractiveDemo />
        <MonthlyBillsPreview />
      </main>
      <SiteFooter />
    </div>
  );
}
