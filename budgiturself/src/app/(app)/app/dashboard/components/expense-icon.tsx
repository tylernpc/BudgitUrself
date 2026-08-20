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

/** Matches the app's `tone-*`/`wash-*` design tokens — every class here is a literal string so Tailwind's scanner picks it up. */
export const EXPENSE_COLOR_MAP: Record<
  ExpenseColorKey,
  { text: string; bg: string; solid: string; ring: string }
> = {
  violet: {
    text: "text-tone-violet",
    bg: "bg-tone-violet/15",
    solid: "bg-tone-violet",
    ring: "ring-tone-violet",
  },
  sky: { text: "text-tone-sky", bg: "bg-tone-sky/15", solid: "bg-tone-sky", ring: "ring-tone-sky" },
  emerald: {
    text: "text-tone-emerald",
    bg: "bg-tone-emerald/15",
    solid: "bg-tone-emerald",
    ring: "ring-tone-emerald",
  },
  rose: {
    text: "text-tone-rose",
    bg: "bg-tone-rose/15",
    solid: "bg-tone-rose",
    ring: "ring-tone-rose",
  },
  indigo: {
    text: "text-tone-indigo",
    bg: "bg-tone-indigo/15",
    solid: "bg-tone-indigo",
    ring: "ring-tone-indigo",
  },
  amber: {
    text: "text-tone-amber",
    bg: "bg-tone-amber/15",
    solid: "bg-tone-amber",
    ring: "ring-tone-amber",
  },
  cyan: {
    text: "text-tone-cyan",
    bg: "bg-tone-cyan/15",
    solid: "bg-tone-cyan",
    ring: "ring-tone-cyan",
  },
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
    <div
      id={id}
      className="flex flex-wrap justify-center gap-2.5"
      role="radiogroup"
      aria-label="Color"
    >
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
              "size-8 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-panel transition-transform",
              tone.solid,
              selected ? cn(tone.ring, "scale-110") : "ring-transparent hover:scale-105",
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
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
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
            className="grid w-full shrink-0 snap-start grid-cols-4 justify-items-center gap-2.5"
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
                    "grid size-9 place-items-center rounded-xl border transition-colors",
                    selected
                      ? cn(tone.bg, tone.text, "border-transparent")
                      : "border-hairline bg-quiet text-ink-ghost hover:border-hairline-strong hover:text-ink",
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
        <div className="mt-2.5 flex justify-center gap-1.5">
          {ICON_PAGES.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Icons page ${index + 1}`}
              onClick={() => goToPage(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === page ? cn("w-4", tone.solid) : "w-1.5 bg-chip",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
