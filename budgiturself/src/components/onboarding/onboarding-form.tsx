"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { AvatarCropper } from "@/components/ui/avatar-cropper";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { AVATAR_TYPES, onboardingSchema } from "@/lib/profile/schemas";

export interface OnboardingSubmitResult {
  error?: string;
}

interface OnboardingFormProps {
  email: string;
  /** Prefilled for accounts that already have a profile. */
  defaultFirstName?: string | null;
  existingAvatarUrl?: string | null;
  /** Saves the profile. Omitted in the local preview, where Continue just advances. */
  onSubmit?: (formData: FormData) => Promise<OnboardingSubmitResult>;
  onComplete: () => void;
}

export function OnboardingForm({
  email,
  defaultFirstName,
  existingAvatarUrl,
  onSubmit,
  onComplete,
}: OnboardingFormProps) {
  const [firstName, setFirstName] = useState(defaultFirstName ?? "");
  // The cropped photo waits here until Continue sends it with the name.
  const [avatar, setAvatar] = useState<File | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pickedUrl = useMemo(() => (avatar ? URL.createObjectURL(avatar) : null), [avatar]);
  useEffect(() => {
    if (pickedUrl) {
      return () => URL.revokeObjectURL(pickedUrl);
    }
  }, [pickedUrl]);
  const avatarUrl = pickedUrl ?? existingAvatarUrl ?? null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      setCropFile(file);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = onboardingSchema.safeParse({ firstName, avatar });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter your first name");
      return;
    }

    setError(undefined);
    if (!onSubmit) {
      onComplete();
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("firstName", parsed.data.firstName);
      if (parsed.data.avatar) {
        formData.set("avatar", parsed.data.avatar);
      }

      const result = await onSubmit(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      onComplete();
    });
  };

  if (cropFile) {
    return (
      <AvatarCropper
        file={cropFile}
        pending={false}
        onCancel={() => setCropFile(null)}
        onSave={(cropped) => {
          setAvatar(cropped);
          setCropFile(null);
        }}
      />
    );
  }

  return (
    <>
      <p className="text-sm font-medium text-ink-faint">Welcome</p>
      <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-ink">
        Let&apos;s set up your account
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-faint">
        Tell us what to call you. You can change any of this later in Settings.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 pt-6">
        <div className="space-y-2.5">
          <Label htmlFor="firstName" className="text-[13px] font-medium text-ink-muted">
            First name
          </Label>
          <Input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            autoFocus
            required
            maxLength={60}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="What should we call you?"
            className="h-10"
          />
        </div>

        <div className="flex items-center gap-4 rounded-lg border border-hairline bg-quiet px-4 py-3.5">
          <ProfileAvatar
            avatarUrl={avatarUrl}
            firstName={firstName || null}
            lastName={null}
            email={email}
            className="size-14 sm:size-14"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-ink-muted">Profile photo</p>
            <p className="mt-0.5 text-xs text-ink-faint">Optional — you can add one later.</p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarUrl ? "Change photo" : "Add photo"}
              </Button>
              {avatar && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setAvatar(null)}>
                  Remove
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={AVATAR_TYPES.join(",")}
                onChange={handleFileChange}
                className="sr-only"
                aria-label="Choose a profile photo"
              />
            </div>
          </div>
        </div>

        <FieldError message={error} />

        <Button type="submit" disabled={isPending} className="h-10 w-full">
          {isPending ? <Loader2 className="animate-spin" /> : null}
          Continue
          {!isPending && <ArrowRight className="size-4" />}
        </Button>
      </form>
    </>
  );
}
