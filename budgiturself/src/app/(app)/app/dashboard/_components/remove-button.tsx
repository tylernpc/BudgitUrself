import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      size="icon"
      variant="outline"
      aria-label={label}
      onClick={onClick}
      className="size-8 rounded-lg border-gray-700 bg-slate-800 text-gray-400 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
    >
      <X className="size-3.5" />
    </Button>
  );
}
