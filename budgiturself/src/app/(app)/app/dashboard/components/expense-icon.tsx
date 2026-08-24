"use client";

import { useRef, useState } from "react";
import {
  Baby,
  Bike,
  BookOpen,
  Briefcase,
  Bus,
  Camera,
  Car,
  Coffee,
  Dog,
  Dumbbell,
  Film,
  Fuel,
  Gamepad2,
  Gift,
  GraduationCap,
  Heart,
  Home,
  Laptop,
  Music,
  Pill,
  Pizza,
  PiggyBank,
  Plane,
  Receipt,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sofa,
  Stethoscope,
  Tv,
  Umbrella,
  Utensils,
  Wifi,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { EXPENSE_COLOR_KEYS, EXPENSE_ICON_KEYS } from "@/lib/budget/types";
import type { ExpenseColorKey, ExpenseIconKey } from "@/lib/budget/types";
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
  briefcase: Briefcase,
  "book-open": BookOpen,
  bus: Bus,
  fuel: Fuel,
  umbrella: Umbrella,
  shirt: Shirt,
  stethoscope: Stethoscope,
  pill: Pill,
  film: Film,
  music: Music,
  camera: Camera,
  laptop: Laptop,
  bike: Bike,
  "piggy-bank": PiggyBank,
  receipt: Receipt,
  "shopping-cart": ShoppingCart,
  pizza: Pizza,
  sofa: Sofa,
};

/** Matches the app's `cat-*` design tokens — every class is a literal string so Tailwind's scanner picks it up. */
export const EXPENSE_COLOR_MAP: Record<
  ExpenseColorKey,
  { text: string; solid: string; ring: string }
> = {
  violet: { text: "text-cat-violet", solid: "bg-cat-violet", ring: "ring-cat-violet" },
  sky: { text: "text-cat-sky", solid: "bg-cat-sky", ring: "ring-cat-sky" },
  emerald: { text: "text-cat-emerald", solid: "bg-cat-emerald", ring: "ring-cat-emerald" },
  rose: { text: "text-cat-rose", solid: "bg-cat-rose", ring: "ring-cat-rose" },
  indigo: { text: "text-cat-indigo", solid: "bg-cat-indigo", ring: "ring-cat-indigo" },
  amber: { text: "text-cat-amber", solid: "bg-cat-amber", ring: "ring-cat-amber" },
  cyan: { text: "text-cat-cyan", solid: "bg-cat-cyan", ring: "ring-cat-cyan" },
};

export function ExpenseIcon({
  icon,
  color,
  className,
}: {
  icon: ExpenseIconKey;
  color: ExpenseColorKey;
  className?: string;
}) {
  const Icon = EXPENSE_ICON_MAP[icon];
  return <Icon className={cn(EXPENSE_COLOR_MAP[color].text, className)} />;
}

interface ColorPickerProps {
  id?: string;
  value: ExpenseColorKey;
  onChange: (color: ExpenseColorKey) => void;
}

export function ColorPicker({ id, value, onChange }: ColorPickerProps) {
  return (
    <div id={id} className="flex flex-wrap gap-2" role="radiogroup" aria-label="Color">
      {EXPENSE_COLOR_KEYS.map((key) => {
        const selected = key === value;
        const tone = EXPENSE_COLOR_MAP[key];
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={key}
            onClick={() => onChange(key)}
            className={cn(
              "size-7 shrink-0 rounded-md ring-offset-2 ring-offset-surface transition-shadow outline-none",
              tone.solid,
              selected ? cn("ring-2", tone.ring) : "hover:ring-1 hover:ring-line-strong",
            )}
          />
        );
      })}
    </div>
  );
}

/** Icons are paginated so a growing set doesn't grow the dialog — swipe (or drag) between pages. */
const ICONS_PER_PAGE = 12;

function chunk<T>(items: readonly T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages;
}

const ICON_PAGES = chunk(EXPENSE_ICON_KEYS, ICONS_PER_PAGE);

interface IconPickerProps {
  id?: string;
  value: ExpenseIconKey;
  color: ExpenseColorKey;
  onChange: (icon: ExpenseIconKey) => void;
}

export function IconPicker({ id, value, color, onChange }: IconPickerProps) {
  const [page, setPage] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tone = EXPENSE_COLOR_MAP[color];

  const goToPage = (index: number) => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }

    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) {
      return;
    }

    setPage(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div id={id}>
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        role="radiogroup"
        aria-label="Icon"
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {ICON_PAGES.map((pageIcons, pageIndex) => (
          <div
            key={pageIndex}
            className="grid w-full shrink-0 snap-start grid-cols-6 gap-2 sm:grid-cols-6"
          >
            {pageIcons.map((key) => {
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
                    "grid h-9 place-items-center rounded-md border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                    selected
                      ? cn("border-line-strong bg-surface-3", tone.text)
                      : "border-line text-fg-subtle hover:border-line-strong hover:text-fg",
                  )}
                >
                  <Icon className="size-4" />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {ICON_PAGES.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {ICON_PAGES.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Icons page ${index + 1}`}
              onClick={() => goToPage(index)}
              className={cn(
                "h-1 rounded-full transition-all",
                index === page ? "w-5 bg-fg-muted" : "w-3 bg-line-strong",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
