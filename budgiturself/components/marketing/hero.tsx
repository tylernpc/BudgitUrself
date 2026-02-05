import {ArrowRight} from "lucide-react"
import Link from 'next/link'
import {Button} from "@/components/ui/button"

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-linear-to-b from-blue-50 to-white py-20 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="mb-6 text-5xl tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                        Take Control of Your Money
                    </h1>
                    <p className="mb-8 text-xl leading-relaxed text-gray-600">
                        A simple, powerful budgeting app that shows you exactly what you can spend.
                        Track your paycheck, expenses, and categorize every dollar with ease.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link href="/sign-up">
                            <Button size="lg"
                                    className="px-8 py-6 text-lg active:scale-[0.98] active:translate-y-px transition-transform cursor-pointer">
                                Get Started
                                <ArrowRight className="ml-2 size-5"/>
                            </Button>
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-gray-500">No credit card required • Free forever</p>
                </div>
            </div>
        </section>
    )
}
