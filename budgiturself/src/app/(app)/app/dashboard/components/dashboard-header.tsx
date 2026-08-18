import Link from "next/link";
import { DollarSign, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-blue-900/50 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 p-2.5 shadow-lg shadow-blue-500/50">
            <DollarSign className="size-5 text-white" />
          </div>
          <span className="text-lg font-medium text-white">BudgitUrself</span>
        </div>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="text-gray-300 hover:bg-blue-900/30 hover:text-white">
              <Home className="mr-2 size-4" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="/auth/logout" className="text-gray-300 hover:bg-blue-900/30 hover:text-white">
              <LogOut className="mr-2 size-4" />
              Sign Out
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
