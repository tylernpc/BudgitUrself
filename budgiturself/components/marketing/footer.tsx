import {ArrowRight, CheckCircle2} from "lucide-react";
import {Button} from "@/components/ui/button";

const benefits = [
    "Start budgeting in under 2 minutes",
    "Connect unlimited cards and accounts",
    "Get insights into your spending habits",
    "No credit card required to start",
];

export function Footer() {
    return (
        <section className="py-20 bg-linear-to-b from-blue-600 to-blue-700">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-4xl sm:text-5xl text-white mb-6">
                        Ready to Take Control of Your Budget?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of people who are already managing their money smarter
                    </p>

                    <div className="mb-8 space-y-3">
                        {benefits.map((benefit) => (
                            <div key={benefit} className="flex items-center gap-3 justify-center text-blue-50">
                                <CheckCircle2 className="size-5 text-blue-200 shrink-0"/>
                                <p className="text-lg">{benefit}</p>
                            </div>
                        ))}
                    </div>

                    <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                        Get Started!
                        <ArrowRight className="ml-2 size-5"/>
                    </Button>

                    <p className="mt-6 text-sm text-blue-200">
                        Free forever • No credit card required • Cancel anytime
                    </p>
                </div>
            </div>
        </section>
    );
}
