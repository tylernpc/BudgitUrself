"use client";

import {ArrowRight, CheckCircle2} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from 'next/link'
import {useFeatureGate} from '@statsig/react-bindings';

const benefits = [
    "Start budgeting in under 2 minutes",
    "Connect unlimited cards and accounts",
    "Get insights into your spending habits",
    "No credit card required to start",
];

export function Footer() {
    const aboutGate = useFeatureGate("button_feature_flags");
    const privacyGate = useFeatureGate("button_feature_flags");
    const termsGate = useFeatureGate("button_feature_flags");
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

                    <Link href="/sign-up">
                        <Button size="lg" variant="secondary"
                                className="text-lg px-8 py-6 active:scale-[0.98] active:translate-y-px transition-transform cursor-pointer">
                            Get Started!
                            <ArrowRight className="ml-2 size-5"/>
                        </Button>
                    </Link>

                    <p className="mt-6 text-sm text-blue-200">
                        Free forever • No credit card required
                    </p>

                    <div className="mt-8 grid w-full grid-cols-3 place-items-center gap-6 text-white -mb-16">
                        {aboutGate.value && (
                            <Link href="/about" className="flex items-center gap-2">
                                <span>About</span>
                            </Link>
                        )}

                        {privacyGate.value && (
                            <Link href="/privacy" className="flex items-center gap-2">
                                <span>Privacy Policy</span>
                            </Link>
                        )}

                        {termsGate.value && (
                            <Link href="/terms" className="flex items-center gap-2">
                                <span>Terms</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
