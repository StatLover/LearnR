import { Crown, Mountain, Sprout } from "lucide-react";
import type { Project } from "@/content/types";
import { XP } from "@/lib/game/xp";
import { cn } from "@/lib/utils";

type Level = Project["level"];

export const LEVELS: Record<Level, { label: string; color: string; title: string; blurb: string }> = {
  beginner: { label: "Beginner", color: "mint", title: "Beginner quests", blurb: "One dataset, clear steps – the perfect first data adventure." },
  intermediate: { label: "Intermediate", color: "sky", title: "Intermediate quests", blurb: "Combine cleaning, summaries, charts and statistics on richer data." },
  capstone: { label: "Capstone", color: "sun", title: "Boss level", blurb: "A complete exploratory data analysis from raw data to a written report." },
};

export const levelColor = (level: Level) => {
  const c = LEVELS[level].color;
  return { name: c, main: `var(--${c})`, soft: `var(--${c}-soft)`, shadow: `var(--${c}-shadow)` };
};

/** All the XP a project can give: every step plus the completion bonus. */
export const projectXp = (steps: number) => steps * XP.projectStep + XP.projectComplete;

/** Solid level pill (Beginner / Intermediate / Capstone boss). */
export function LevelBadge({ level, className }: { level: Level; className?: string }) {
  const c = levelColor(level);
  const Icon = level === "capstone" ? Crown : level === "intermediate" ? Mountain : Sprout;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-display text-xs font-semibold uppercase tracking-wider [&_svg]:size-3.5",
        level === "capstone" ? "text-[#3b2600]" : "text-white",
        className,
      )}
      style={{ background: c.main, boxShadow: `0 2px 0 ${c.shadow}` }}
    >
      <Icon aria-hidden /> {level === "capstone" ? "Capstone · Boss" : LEVELS[level].label}
    </span>
  );
}
