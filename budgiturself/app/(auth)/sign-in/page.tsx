"use client"

import Link from "next/link";
import {Chrome, DollarSign, Lock, Mail} from "lucide-react";
import React from "react";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

export default function SignInPage() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-white">
            <section className="min-h-screen flex flex-col">
                <Link href="/" className="w-fit">
                    <button className="inline-flex items-center text-3xl pt-6 pl-6 cursor-pointer">
                        <DollarSign className="size-7 text-blue-700"></DollarSign>
                        <span className="text-blue-700">Budgit</span>Urself
                    </button>
                </Link>

                <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 drop-shadow-2xl">
                    <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl px-5 py-10 sm:px-10 sm:py-12">
                        <div className="text-center leading-10">
                            <h1 className="text-4xl font-semibold">Welcome Back!</h1>
                            <p className="text-gray-600">
                                Sign in to BudgitUrself to manage your finances!
                            </p>
                        </div>

                        <div className="mt-6">
                            <Button className="w-full cursor-pointer" variant="outline">
                                <Chrome className="mr-2 size-5"/>
                                Continue with Google
                            </Button>
                            <p className="my-6 flex items-center gap-3 text-center text-sm text-gray-500">
                                <span className="h-px flex-1 bg-gray-200"/>
                                Or continue with email
                                <span className="h-px flex-1 bg-gray-200"/>
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail
                                            className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400"
                                        />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <button
                                            type="button"
                                            className="text-sm text-blue-700 hover:text-blue-700 transition-colors cursor-pointer"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock
                                            className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400"/>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full cursor-pointer" size="lg">
                                    Sign In
                                </Button>

                                <p className="text-center text-sm text-gray-600 mt-6">
                                    Need an account?{" "}
                                    <Link href="/sign-up">
                                        <button
                                            type="button"
                                            className="text-blue-700 hover:text-blue-700 transition-colors cursor-pointer"
                                        >
                                            Sign Up
                                        </button>
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-6 max-w-sm">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </section>
        </div>
    );
}
