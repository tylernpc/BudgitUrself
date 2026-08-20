import {
  Baby,
  Car,
  Coffee,
  Dog,
  Dumbbell,
  Gamepad2,
  Gift,
  GraduationCap,
  Heart,
  Home,
  Plane,
  ShoppingBag,
  Smartphone,
  Tv,
  Utensils,
  Wifi,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { EXPENSE_ICON_KEYS, type ExpenseIconKey } from "@/lib/budget/types";
import { cn } from "@/lib/utils";

export const EXPENSE_ICON_MAP: Record<ExpenseIconKey, LucideIcon> = {
  home: Home,
  utensils: Utensils,
  car: Car,
  zap: Zap,
  heart: Heart,
  "shopping-bag": ShoppingBag,
  dumbbell: Dumbbell,
  "graduation-cap": GraduationCap,
  plane: Plane,
  smartphone: Smartphone,
  wifi: Wifi,
  tv: Tv,
  "gamepad-2": Gamepad2,
  dog: Dog,
  baby: Baby,
  wrench: Wrench,
  gift: Gift,
  coffee: Coffee,
};

export function ExpenseIcon({ icon, className }: { icon: ExpenseIconKey; className?: string }) {
  const Icon = EXPENSE_ICON_MAP[icon];
  return <Icon className={className} />;
}

interface IconPickerProps {
  id?: string;
  value: ExpenseIconKey;
  onChange: (icon: ExpenseIconKey) => void;
}

export function IconPicker({ id, value, onChange }: IconPickerProps) {
  return (
    <div id={id} className="flex flex-wrap gap-2" role="radiogroup" aria-label="Icon">
      {EXPENSE_ICON_KEYS.map((key) => {
        const Icon = EXPENSE_ICON_MAP[key];
        const selected = key === value;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={key}
            onClick={() => onChange(key)}
            className={cn(
              "grid size-9 place-items-center rounded-xl border transition-colors",
              selected
                ? "border-tone-cyan bg-tone-cyan/15 text-tone-cyan"
                : "border-hairline bg-quiet text-ink-ghost hover:border-hairline-strong hover:text-ink",
            )}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
