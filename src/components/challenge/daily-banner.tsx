"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Sun, Timer } from "lucide-react";
import { Hexy } from "@/components/brand/mascot";
import { TopicArt } from "@/components/brand/topic-art";
import { FloatingHexes } from "@/components/brand/decor";
import { Button } from "@/components/ui/button";
import { DifficultyBadge, XpBadge } from "@/components/ui/badge";
import { useGame, useOutline } from "@/components/game/outline-context";
import { WorldChip } from "@/components/exercises/world-chip";
import { exerciseXp, XP } from "@/lib/game/xp";
import { exerciseMeta, formatDay } from "./daily-meta";
import { MidnightCountdown } from "./countdown";
import { useMounted } from "./use-mounted";

/** Big "Daily challenge" banner linking to /challenge. */
export function DailyBanner() {
  const g = useGame();
  const outline = useOutline();
  const mounted = useMounted();
  const meta = mounted && g.daily.exerciseId ? exerciseMeta(outline, g.daily.exerciseId) : null;
  const done = mounted && g.daily.completed;

  return (
    <section
      aria-labelledby="daily-banner-title"
      className="relative overflow-hidden rounded-3xl border-2 border-sun/60 shadow-[var(--shadow-card)]"
      style={{ background: "linear-gradient(115deg, var(--sun-soft) 0%, var(--tangerine-soft) 55%, var(--pink-soft) 100%)" }}
    >
      <div className="blob -left-10 -top-16 size-56" style={{ background: "var(--sun)" }} />
      <FloatingHexes count={5} className="opacity-60" />
      <div className="relative grid grid-cols-1 items-center gap-5 p-5 sm:p-6 md:grid-cols-[auto_minmax(0,1fr)_auto]">
        <div className="hidden md:block">
          <Hexy mood={done ? "celebrate" : "point"} size={104} animate />
        </div>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-sm font-semibold uppercase tracking-wider text-warning">
            <Sun className="size-4" aria-hidden /> Daily challenge
            {mounted && <span className="font-sans text-xs font-bold normal-case tracking-normal text-muted-foreground">· {formatDay(g.daily.day, { weekday: "long", day: "numeric", month: "long" })}</span>}
          </p>
          <h2 id="daily-banner-title" className="mt-1 font-display text-2xl font-bold leading-tight sm:text-3xl">
            {!mounted ? "Today's challenge" : done ? "Done for today – brilliant!" : (meta?.title ?? "Today's challenge")}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm font-semibold text-muted-foreground">
            {done
              ? `You solved “${meta?.title ?? "today's exercise"}” and earned the +${XP.daily} XP bonus. A fresh challenge unlocks at midnight.`
              : `One hand-picked exercise from the worlds you have reached. Solve it today for a +${XP.daily} XP bonus on top of the usual XP.`}
          </p>
          <div className="mt-3 flex min-h-6 flex-wrap items-center gap-2">
            {meta && <WorldChip world={meta.world} />}
            {meta && <DifficultyBadge difficulty={meta.difficulty} />}
            {meta && !done && <XpBadge xp={exerciseXp(meta.difficulty) + XP.daily} />}
            {done && (
              <span className="inline-flex items-center gap-1 rounded-full bg-mint-soft px-2.5 py-0.5 text-xs font-bold text-success">
                <CheckCircle2 className="size-3.5" /> Bonus earned
              </span>
            )}
            {mounted && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
                <Timer className="size-3.5" aria-hidden /> Next challenge in <MidnightCountdown className="font-display" />
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {meta && (
            <div className="hidden w-36 overflow-hidden rounded-2xl border-2 border-border bg-card shadow-[var(--shadow-card)] lg:block">
              <TopicArt kind={meta.art} bg={meta.world.color.soft} />
            </div>
          )}
          <Button asChild variant={done ? "outline" : "sun"} size="lg" className="w-full md:w-auto">
            <Link href="/challenge">
              {done ? "See today's challenge" : "Play now"} <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
