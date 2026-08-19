import Image from "next/image";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-blue-900/50 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="" width={32} height={32} className="size-8" />
          <span className="text-lg font-medium text-white">BudgitUrself</span>
        </div>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a href="/auth/logout" className="text-gray-300 hover:bg-blue-900/30 hover:text-white">
              <LogOut className="mr-2 size-4" />
              Log Out
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
