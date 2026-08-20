import { redirect } from "next/navigation";
import { AuroraCanvas } from "@/components/ui/aurora-canvas";
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
      <AuroraCanvas />

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
