"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AVATAR_TYPES, nameSchema } from "@/lib/profile/schemas";
import { removeAvatarAction, updateAvatarAction, updateNameAction } from "../lib/actions";
import { AvatarCropper } from "@/components/ui/avatar-cropper";
import { BudgetDialog, DialogActions, FieldLabel, fieldClass } from "./dialog-shell";
import { FieldError } from "@/components/ui/field-error";
import { ProfileAvatar } from "@/components/ui/profile-avatar";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatarUrl: string | null;
}

export function SettingsDialog({
  open,
  onOpenChange,
  firstName,
  lastName,
  email,
  avatarUrl,
}: SettingsDialogProps) {
  const [error, setError] = useState<string>();
  const [avatarError, setAvatarError] = useState<string>();
  // The file waiting in the cropper; null shows the ordinary settings form.
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [isAvatarPending, startAvatarTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = nameSchema.safeParse(Object.fromEntries(form));

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid name");
      return;
    }

    setError(undefined);
    updateNameAction(parsed.data).then((result) => {
      if (result.error) {
        setError(result.error);
        return;
      }
      onOpenChange(false);
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      setAvatarError(undefined);
      setCropFile(file);
    }
  };

  // The avatar saves on its own, independent of the name form, so a photo
  // change never waits on (or gets lost behind) the Save button.
  const handleAvatarSave = (avatar: File) => {
    startAvatarTransition(async () => {
      const formData = new FormData();
      formData.set("avatar", avatar);
      const result = await updateAvatarAction(formData);
      if (result.error) {
        setAvatarError(result.error);
      }
      setCropFile(null);
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setCropFile(null);
    }
    onOpenChange(nextOpen);
  };

  const handleAvatarRemove = () => {
    setAvatarError(undefined);
    startAvatarTransition(async () => {
      const result = await removeAvatarAction();
      if (result.error) {
        setAvatarError(result.error);
      }
    });
  };

  return (
    <BudgetDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Settings"
      description="Update the name and photo shown on your account."
    >
      {cropFile ? (
        <AvatarCropper
          file={cropFile}
          pending={isAvatarPending}
          onCancel={() => setCropFile(null)}
          onSave={handleAvatarSave}
        />
      ) : (
        <>
          <div className="flex items-center gap-4 border-b border-hairline pt-6 pb-5">
            <ProfileAvatar
              avatarUrl={avatarUrl}
              firstName={firstName}
              lastName={lastName}
              email={email}
              className="size-14 sm:size-14"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-ink-muted">Profile photo</p>
              <p className="mt-0.5 text-xs text-ink-faint">
                Any size works — you can crop and zoom before saving.
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isAvatarPending}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isAvatarPending && <Loader2 className="animate-spin" />}
                  {avatarUrl ? "Change photo" : "Upload photo"}
                </Button>
                {avatarUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isAvatarPending}
                    onClick={handleAvatarRemove}
                  >
                    Remove
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={AVATAR_TYPES.join(",")}
                  onChange={handleAvatarChange}
                  className="sr-only"
                  aria-label="Choose a profile photo"
                />
              </div>
              {avatarError && (
                <div className="mt-2">
                  <FieldError message={avatarError} />
                </div>
              )}
            </div>
          </div>

          <form key={String(open)} onSubmit={handleSubmit}>
            <div className="grid gap-4 pt-5 sm:grid-cols-2">
              <div className="space-y-2.5">
                <FieldLabel htmlFor="firstName">First name</FieldLabel>
                <Input
                  id="firstName"
                  name="firstName"
                  autoComplete="given-name"
                  defaultValue={firstName ?? ""}
                  required
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2.5">
                <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                <Input
                  id="lastName"
                  name="lastName"
                  autoComplete="family-name"
                  defaultValue={lastName ?? ""}
                  required
                  className={fieldClass}
                />
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" value={email} disabled className={fieldClass} />
            </div>
            <FieldError message={error} />
            <DialogActions onCancel={() => onOpenChange(false)} submitLabel="Save changes" />
          </form>
        </>
      )}
    </BudgetDialog>
  );
}
