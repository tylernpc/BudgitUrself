import Link from "next/link";
import {DollarSign} from "lucide-react";
import React from "react";

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-white">
            <section className="min-h-screen flex flex-col">
                <Link href="/" className="w-fit">
                    <button className="inline-flex items-center text-3xl pt-6 pl-6 cursor-pointer">
                        <DollarSign className="size-7 text-blue-700"></DollarSign>
                        <span className="text-blue-700">Budgit</span>Urself
                    </button>
                </Link>
            </section>
        </div>
    );
}
