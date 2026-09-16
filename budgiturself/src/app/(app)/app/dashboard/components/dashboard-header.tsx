import Image from "next/image";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsButton } from "./settings-button";

interface DashboardHeaderProps {
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export function DashboardHeader({ firstName, lastName, email }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-panel">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="" width={24} height={24} className="size-6" />
          <span className="text-sm font-semibold tracking-tight text-ink">BudgitUrself</span>
        </div>

        <div className="flex items-center gap-2">
          <SettingsButton firstName={firstName} lastName={lastName} email={email} />

          <Button variant="outline" size="sm" asChild className="h-8 px-2.5 sm:px-3">
            <a href="/auth/logout">
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Log out</span>
              <span className="sr-only sm:hidden">Log out</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
