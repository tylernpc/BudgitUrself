import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/dal";
import { Hero } from "./components/hero";
import { Features } from "./components/features";
import { InteractiveDemo } from "./components/interactive-demo";
import { Categories } from "./components/categories";
import { SiteFooter } from "./components/site-footer";

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
