import {Hero} from "@/components/marketing/hero";
import {Features} from "@/components/marketing/features";
import { InteractiveDemo } from "@/components/marketing/interactive-demo";
import {Categories} from "@/components/marketing/categories";

export default function MarketingPage() {
    return (
        <main className="min-h-screen bg-white">
            <Hero/>
            <Features/>
            <InteractiveDemo/>
            <Categories/>
        </main>
    );
}
