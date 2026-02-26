import {ArrowRight, CheckCircle2, DollarSign} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from 'next/link'

const benefits = [
    "Start budgeting in under 2 minutes",
    "Connect unlimited cards and accounts",
    "Get insights into your spending habits",
    "No credit card required to start",
];

export function Footer() {
    return (
        <section>
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

                        <a href="/auth/login">
                            <Button size="lg" variant="secondary"
                                    className="text-lg px-8 py-6 active:scale-[0.98] active:translate-y-px transition-transform cursor-pointer">
                                Get Started!
                                <ArrowRight className="ml-2 size-5"/>
                            </Button>
                        </a>

                        <p className="mt-6 text-sm text-blue-200">
                            Free forever • No credit card required
                        </p>
                    </div>
                </div>
            </section>

            <footer className="bg-gray-900 text-gray-300">
                <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Brand Section */}
                        <div className="md:col-span-1">
                            <Link href="/"
                                  className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors mb-4">
                                <DollarSign className="size-8 text-blue-500"/>
                                <span className="text-xl">BudgitUrself</span>
                            </Link>
                            <p className="text-sm text-gray-400 mb-4">
                                Take control of your finances with smart budgeting tools and insights.
                            </p>
                            {/* Commenting this out for now, just in case I ever want to do social medias */}
                            {/*<div className="flex gap-4">*/}
                            {/*    <a href="#" className="text-gray-400 hover:text-white transition-colors">*/}
                            {/*        <Twitter className="size-5" />*/}
                            {/*    </a>*/}
                            {/*    <a href="#" className="text-gray-400 hover:text-white transition-colors">*/}
                            {/*        <Linkedin className="size-5" />*/}
                            {/*    </a>*/}
                            {/*    <a href="#" className="text-gray-400 hover:text-white transition-colors">*/}
                            {/*        <Github className="size-5" />*/}
                            {/*    </a>*/}
                            {/*</div>*/}
                        </div>

                        {/* Company Links */}
                        <div>
                            <h3 className="text-white mb-4">Company</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/about" className="hover:text-white transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                {/* TODO: Tyler, implement this bit here */}
                                {/*<li>*/}
                                {/*    <Link href="/privacy" className="hover:text-white transition-colors">*/}
                                {/*        Blog*/}
                                {/*    </Link>*/}
                                {/*</li>*/}
                                {/*<li>*/}
                                {/*    <a href="mailto:contact@budgetmaster.com" className="hover:text-white transition-colors">*/}
                                {/*        Contact*/}
                                {/*    </a>*/}
                                {/*</li>*/}
                            </ul>
                        </div>

                        {/* Legal Links */}
                        <div>
                            <h3 className="text-white mb-4">Legal</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/privacy" className="hover:text-white transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="hover:text-white transition-colors">
                                        Terms of Service
                                    </Link>
                                </li>
                                {/* TODO: Tyler, Implement this */}
                                {/*<li>*/}
                                {/*    <Link href="/policy" className="hover:text-white transition-colors">*/}
                                {/*        Cookie Policy*/}
                                {/*    </Link>*/}
                                {/*</li>*/}
                                {/*<li>*/}
                                {/*    <Link href="/security" className="hover:text-white transition-colors">*/}
                                {/*        Security*/}
                                {/*    </Link>*/}
                                {/*</li>*/}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div
                        className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-400">
                            © 2026 BudgetMaster. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link href="/privacy" className="hover:text-white transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-white transition-colors">
                                Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </section>
    );
}
