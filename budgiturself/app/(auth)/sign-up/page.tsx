import Link from "next/link";
import {DollarSign} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-white">
            <section className="min-h-screen flex flex-col">
                <Link href="/" className="w-fit">
                    <button className="inline-flex items-center text-3xl pt-6 pl-6 cursor-pointer">
                        <DollarSign className="size-7 text-blue-700"></DollarSign>
                        <span className="text-blue-700">Budgit</span>Urself
                    </button>
                </Link>

                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 drop-shadow-2xl">
                    <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl px-5 py-10 sm:px-10 sm:py-12">
                        <div className="text-center leading-10">
                            <h1 className="text-2xl font-semibold">Welcome</h1>
                            <p className="text-gray-600">
                                Sign up to BudgitUrself to manage your finances!
                            </p>
                        </div>

                        <div className="mt-6">
                            <Button className="w-full">Continue with Google</Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}