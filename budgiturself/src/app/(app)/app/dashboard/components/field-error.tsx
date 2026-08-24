import { CircleAlert } from "lucide-react";

export function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p role="alert" className="flex items-center gap-2 text-[13px] text-neg">
      <CircleAlert className="size-3.5 shrink-0" />
      {message}
    </p>
  );
}
