"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { controlClass } from "./actions";
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${controlClass} size-8`}
        aria-label="Settings"
      >
        <Settings className="size-3.5" />
      </button>

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
