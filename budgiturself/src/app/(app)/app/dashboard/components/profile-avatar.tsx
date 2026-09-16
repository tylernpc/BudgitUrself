import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  className?: string;
}

function initials(firstName: string | null, lastName: string | null, email: string) {
  const letters = [firstName, lastName]
    .filter((part): part is string => Boolean(part))
    .map((part) => part.charAt(0));

  return (letters.length > 0 ? letters.join("") : email.charAt(0)).toUpperCase();
}

/**
 * The uploaded photo, or initials until there is one. The photo is an inline
 * data URL from the DAL, so there is nothing for the image optimizer to fetch.
 */
export function ProfileAvatar({
  avatarUrl,
  firstName,
  lastName,
  email,
  className,
}: ProfileAvatarProps) {
  const name = [firstName, lastName].filter(Boolean).join(" ") || email;

  return (
    <span
      className={cn(
        "grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border border-hairline bg-quiet text-sm font-semibold text-ink-muted shadow-[var(--panel-shadow)] sm:size-14",
        className,
      )}
      title={name}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          width={56}
          height={56}
          unoptimized
          className="size-full object-cover"
        />
      ) : (
        <span aria-label={name}>{initials(firstName, lastName, email)}</span>
      )}
    </span>
  );
}
