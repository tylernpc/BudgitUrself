import { CircleAlert } from "lucide-react";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="flex items-center gap-2 text-sm text-tone-rose">
      <CircleAlert className="size-4 shrink-0" />
      {message}
    </p>
  );
}
