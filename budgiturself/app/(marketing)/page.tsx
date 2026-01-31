import {Hero} from "@/components/marketing/hero";
import {Features} from "@/components/marketing/features";
import { InteractiveDemo } from "@/components/marketing/interactive-demo";
import {Categories} from "@/components/marketing/categories";
import {Footer} from "@/components/marketing/footer";

export default function MarketingPage() {
    return (
        <main className="min-h-screen bg-white">
            <Hero/>
            <Features/>
            <InteractiveDemo/>
            <Categories/>
            <Footer/>
        </main>
    );
}
