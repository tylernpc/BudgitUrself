import Link from "next/link";
import { DollarSign } from "lucide-react";

export default function SignUpPage() {
    return (
        <section className="min-h-screen flex flex-col">
            <Link href="/">
                <button className="inline-flex items-center text-3xl pt-6 pl-6 cursor-pointer">
                    <DollarSign className="size-7 text-blue-700"></DollarSign>
                    <span className="text-blue-700">Budgit</span>Urself
                </button>
            </Link>

            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <h1>Login Section</h1>
                </div>
            </div>
        </section>
    );
}