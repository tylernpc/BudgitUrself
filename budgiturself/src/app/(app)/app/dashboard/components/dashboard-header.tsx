import Image from "next/image";
import { LogOut } from "lucide-react";
import { controlClass } from "./actions";
import { SettingsButton } from "./settings-button";

interface DashboardHeaderProps {
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export function DashboardHeader({ firstName, lastName, email }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="mx-auto flex w-full max-w-[74rem] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-md border border-line bg-surface-2">
            <Image src="/logo.png" alt="" width={18} height={18} className="size-[18px]" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-fg">BudgitUrself</span>
        </div>

        <div className="flex items-center gap-2">
          <SettingsButton firstName={firstName} lastName={lastName} email={email} />

          <a href="/auth/logout" className={`${controlClass} h-8 px-2.5`}>
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Log out</span>
            <span className="sr-only sm:hidden">Log out</span>
          </a>
        </div>
      </div>
    </header>
  );
}
