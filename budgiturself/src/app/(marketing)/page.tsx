import { redirect } from "next/navigation";
import { AuroraBackdrop } from "@/components/ui/aurora-backdrop";
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
    <div className="relative min-h-screen bg-canvas text-ink selection:bg-tone-cyan/25">
      <AuroraBackdrop />

      <div className="relative z-10">
        <main>
          <Hero />
          <Features />
          <InteractiveDemo />
          <MonthlyBillsPreview />
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
