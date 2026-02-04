import Link from "next/link";
import {DollarSign} from "lucide-react";

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-white flex flex-col">
            <section className="min-h-screen flex flex-col">
                <Link href="/">
                    <button className="inline-flex items-center text-3xl pt-6 pl-6 cursor-pointer">
                        <DollarSign className="size-7 text-blue-700"></DollarSign>
                        <span className="text-blue-700">Budgit</span>Urself
                    </button>
                </Link>

                <div className="flex-1 flex items-center justify-center drop-shadow-2xl">
                    <div className="bg-white rounded-2xl px-12 py-70">
                        <div className="text-center leading-10">
                            <h1 className="text-2xl font-semibold">Welcome</h1>
                            <p className="text-gray-600">Sign up to BudgitUrself to manage your finances!</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    );
}