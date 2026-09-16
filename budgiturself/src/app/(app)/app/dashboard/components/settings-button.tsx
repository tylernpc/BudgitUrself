"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsDialog } from "./settings-dialog";

interface SettingsButtonProps {
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatarUrl: string | null;
}

export function SettingsButton({ firstName, lastName, email, avatarUrl }: SettingsButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="icon" onClick={() => setOpen(true)} className="size-8">
        <Settings className="size-4" />
        <span className="sr-only">Settings</span>
      </Button>

      <SettingsDialog
        open={open}
        onOpenChange={setOpen}
        firstName={firstName}
        lastName={lastName}
        email={email}
        avatarUrl={avatarUrl}
      />
    </>
  );
}
