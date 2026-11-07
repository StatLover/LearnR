import { BookOpen, Bug, Calendar, CalendarCheck, CheckCircle2, Crown, Dumbbell, Flag, Flame, Map, MessageCircle, Mountain, Play, Search, Star, Trophy, Zap, Lock, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  play: Play,
  "book-open": BookOpen,
  "check-circle": CheckCircle2,
  bug: Bug,
  "message-circle": MessageCircle,
  map: Map,
  flame: Flame,
  dumbbell: Dumbbell,
  mountain: Mountain,
  star: Star,
  flag: Flag,
  search: Search,
  calendar: Calendar,
  "calendar-check": CalendarCheck,
  zap: Zap,
  trophy: Trophy,
  crown: Crown,
};

/** A hexagonal medal used for achievements and world emblems. */
export function HexBadge({ icon, color = "primary", size = 64, locked = false, className, label }: { icon: string; color?: string; size?: number; locked?: boolean; className?: string; label?: string }) {
  const Icon = locked ? Lock : (ICONS[icon] ?? Star);
  const main = locked ? "var(--surface-3)" : `var(--${color})`;
  const shadow = locked ? "var(--border-strong)" : `var(--${color}-shadow, var(--primary-shadow))`;
  return (
    <span className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size * 1.08 }} role={label ? "img" : undefined} aria-label={label}>
      <svg viewBox="0 0 100 108" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d="M50 8 L90 31 L90 79 L50 102 L10 79 L10 31 Z" fill={shadow} transform="translate(0 4)" strokeLinejoin="round" stroke={shadow} strokeWidth="8" />
        <path d="M50 8 L90 31 L90 79 L50 102 L10 79 L10 31 Z" fill={main} strokeLinejoin="round" stroke={main} strokeWidth="8" />
        <path d="M50 16 L83 35 L83 50 Q50 40 17 50 L17 35 Z" fill="#ffffff" opacity={locked ? 0.15 : 0.25} />
      </svg>
      <Icon className={cn("relative", locked ? "text-muted-foreground" : "text-white")} style={{ width: size * 0.38, height: size * 0.38 }} strokeWidth={2.4} aria-hidden />
    </span>
  );
}
