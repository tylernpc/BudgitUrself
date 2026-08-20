"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsDialog } from "./settings-dialog";

interface SettingsButtonProps {
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export function SettingsButton({ firstName, lastName, email }: SettingsButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="size-9 rounded-full border border-hairline bg-quiet text-ink-muted transition-colors hover:bg-chip hover:text-ink"
      >
        <Settings className="size-4" />
        <span className="sr-only">Settings</span>
      </Button>

      <SettingsDialog
        open={open}
        onOpenChange={setOpen}
        firstName={firstName}
        lastName={lastName}
        email={email}
      />
    </>
  );
}
