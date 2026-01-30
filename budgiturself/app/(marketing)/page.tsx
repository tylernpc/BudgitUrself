import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function MarketingPage() {
    return (
        <main className="min-h-screen bg-white">
            <section className="relative overflow-hidden bg-linear-to-b from-blue-50 to-white py-20 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight text-gray-900 mb-6">
                            Take Control of Your Money
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            A simple, powerful budgeting app that shows you exactly what you can spend.
                            Track your paycheck, expenses, and categorize every dollar with ease.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="text-lg px-8 py-6">
                                Get Started
                                <ArrowRight className="ml-2 size-5" />
                            </Button>
                        </div>
                        <p className="mt-6 text-sm text-gray-500">
                            No credit card required • Free forever
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
