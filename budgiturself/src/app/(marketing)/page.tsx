import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/dal";
import { Hero } from "./_components/hero";
import { Features } from "./_components/features";
import { InteractiveDemo } from "./_components/interactive-demo";
import { Categories } from "./_components/categories";
import { SiteFooter } from "./_components/site-footer";

export default async function MarketingPage() {
  if (await getSessionUser()) {
    redirect("/app/dashboard");
  }

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Features />
      <InteractiveDemo />
      <Categories />
      <SiteFooter />
    </main>
  );
}
