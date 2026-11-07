"use client";

import type { ReactNode } from "react";
import { CalendarCheck, CheckCircle2, Flame, Zap } from "lucide-react";
import { useGame } from "@/components/game/outline-context";
import { useProgress } from "@/lib/store/progress";
import { exerciseXp } from "@/lib/game/xp";
import { cn } from "@/lib/utils";

function Stat({ icon, value, label, tone }: { icon: ReactNode; value: ReactNode; label: string; tone: "mint" | "sun" | "tangerine" | "grape" }) {
  const tile = { mint: "bg-mint text-white", sun: "bg-sun text-[#3b2600]", tangerine: "bg-tangerine text-white", grape: "bg-grape text-white" }[tone];
  const edge = { mint: "[--edge:var(--mint-shadow)]", sun: "[--edge:var(--sun-shadow)]", tangerine: "[--edge:var(--tangerine-shadow)]", grape: "[--edge:var(--grape-shadow)]" }[tone];
  return (
    <li className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-3 py-3 shadow-[var(--shadow-card)] sm:px-4">
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl shadow-[0_3px_0_var(--edge)] [&_svg]:size-5", tile, edge)} aria-hidden>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-xl font-bold leading-tight tabular-nums">{value}</span>
        <span className="block text-xs font-bold leading-tight text-muted-foreground">
          {label}
        </span>
      </span>
    </li>
  );
}

/** A compact strip of practice statistics: solved exercises, XP from practice, daily challenges and streak. */
export function PracticeStats({ exercises }: { exercises: { id: string; difficulty: string }[] }) {
  const s = useProgress();
  const g = useGame();
  const solved = exercises.filter((e) => s.exercises[e.id]?.passedAt);
  const xp = solved.reduce((a, e) => a + exerciseXp(e.difficulty, s.exercises[e.id]?.solutionViewed), 0);
  const dailyDone = Object.values(s.daily ?? {}).filter((d) => d.completedAt).length;
  return (
    <section aria-label="Your practice stats">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat tone="mint" icon={<CheckCircle2 />} value={`${solved.length}/${exercises.length}`} label="Exercises solved" />
        <Stat tone="sun" icon={<Zap className="fill-current" />} value={xp.toLocaleString()} label="XP from practice" />
        <Stat tone="grape" icon={<CalendarCheck />} value={dailyDone} label="Daily challenges won" />
        <Stat tone="tangerine" icon={<Flame className="fill-current" />} value={g.streak} label={g.streak === 1 ? "Day streak" : "Days streak"} />
      </ul>
    </section>
  );
}
