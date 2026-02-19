import {Hero} from "@/components/marketing/hero";
import {Features} from "@/components/marketing/features";
import {InteractiveDemo} from "@/components/marketing/interactive-demo";
import {Categories} from "@/components/marketing/categories";
import {Footer} from "@/components/marketing/footer";
import {auth0} from "@/lib/auth/auth0";

export default async function MarketingPage() {
    const session = await auth0.getSession();

    if (!session) {
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

    // todo: tyler, implement a return here that redirects the user to their homepage
}
