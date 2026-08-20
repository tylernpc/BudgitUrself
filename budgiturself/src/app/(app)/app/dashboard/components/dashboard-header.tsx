import Image from "next/image";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-chip ring-1 ring-hairline">
            <Image src="/logo.png" alt="" width={24} height={24} className="size-6" />
          </span>
          <span className="text-[15px] font-medium tracking-tight text-ink">BudgitUrself</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-9 rounded-full border border-hairline bg-quiet px-3.5 text-ink-muted transition-colors hover:bg-chip hover:text-ink"
        >
          <a href="/auth/logout">
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Log out</span>
            <span className="sr-only sm:hidden">Log out</span>
          </a>
        </Button>
      </div>
    </header>
  );
}
