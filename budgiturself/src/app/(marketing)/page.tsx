import { redirect } from "next/navigation";
import { AuroraBackdrop } from "@/components/ui/aurora-backdrop";
import { getSessionUser } from "@/lib/auth/dal";
import { Categories } from "./components/categories";
import { Features } from "./components/features";
import { Hero } from "./components/hero";
import { InteractiveDemo } from "./components/interactive-demo";
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
          <Categories />
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
