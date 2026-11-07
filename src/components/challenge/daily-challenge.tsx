"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, CalendarDays, Check, CheckCircle2, CircleDashed, Flame, History, Map as MapIcon, PartyPopper, RefreshCw, Timer, Trophy, Zap } from "lucide-react";
import type { Exercise } from "@/content/types";
import { Hexy } from "@/components/brand/mascot";
import { FloatingHexes } from "@/components/brand/decor";
import { ExerciseCard } from "@/components/learn/exercise-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGame, useOutline } from "@/components/game/outline-context";
import { WorldChip } from "@/components/exercises/world-chip";
import { tutor } from "@/lib/ai/tutor-store";
import { progress, useProgress } from "@/lib/store/progress";
import { exerciseXp, XP } from "@/lib/game/xp";
import { cn, todayKey } from "@/lib/utils";
import { exerciseMeta, formatDay } from "./daily-meta";
import { MidnightCountdown } from "./countdown";
import { useMounted } from "./use-mounted";

function HeroPill({ icon, children, tone }: { icon: ReactNode; children: ReactNode; tone: "sun" | "sky" | "tangerine" }) {
  const tile = { sun: "bg-sun text-[#3b2600]", sky: "bg-sky text-white", tangerine: "bg-tangerine text-white" }[tone];
  return (
    <li className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card/85 py-1.5 pl-1.5 pr-3.5 font-display text-[15px] font-semibold shadow-[var(--shadow-card)] backdrop-blur">
      <span className={cn("grid size-8 place-items-center rounded-xl [&_svg]:size-4", tile)} aria-hidden>
        {icon}
      </span>
      {children}
    </li>
  );
}

function Panel({ title, icon, children, className }: { title: string; icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-3xl border-2 border-border bg-card p-5 shadow-[var(--shadow-card)]", className)} aria-label={title}>
      <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold [&_svg]:size-5 [&_svg]:text-primary">
        {icon} {title}
      </h2>
      {children}
    </section>
  );
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]" aria-busy="true" aria-label="Loading today's challenge">
      <div className="flex items-center gap-3 border-b-2 border-border bg-gradient-to-r from-grape-soft to-transparent px-5 py-4">
        <span className="size-11 rounded-2xl bg-surface-3" />
        <span className="h-6 w-56 animate-pulse rounded-full bg-surface-3" />
      </div>
      <div className="space-y-3 p-5">
        {[90, 75, 82, 40].map((w, i) => (
          <span key={i} className="block h-4 animate-pulse rounded-full bg-surface-2" style={{ width: `${w}%` }} />
        ))}
        <span className="mt-4 block h-40 animate-pulse rounded-2xl bg-surface-2" />
      </div>
    </div>
  );
}

/** The hex "stamp" for one day in the weekly strip. */
function DayHex({ state, today }: { state: "won" | "missed" | "none"; today: boolean }) {
  const fill = state === "won" ? "var(--sun)" : "var(--surface-2)";
  const stroke = state === "won" ? "var(--sun-shadow)" : today ? "var(--primary)" : "var(--border-strong)";
  return (
    <span className="relative grid size-8 place-items-center sm:size-9">
      <svg viewBox="0 0 40 44" className="absolute inset-0 size-full" aria-hidden>
        <path d="M20 3 L36 12 L36 32 L20 41 L4 32 L4 12 Z" fill={fill} stroke={stroke} strokeWidth={today ? 3 : 2.5} strokeLinejoin="round" strokeDasharray={state === "missed" ? "4 3" : undefined} />
      </svg>
      {state === "won" && <Check className="relative size-4 text-[#3b2600]" strokeWidth={3} aria-hidden />}
    </span>
  );
}

export function DailyChallenge() {
  const g = useGame();
  const outline = useOutline();
  const s = useProgress();
  const mounted = useMounted();
  const router = useRouter();
  const daily = g.daily;
  const id = mounted ? daily.exerciseId : null;
  const meta = id ? exerciseMeta(outline, id) : null;
  const completed = mounted && daily.completed;
  const [data, setData] = useState<{ id: string; exercise?: Exercise; error?: string } | null>(null);
  const [reload, setReload] = useState(0);
  const [newDay, setNewDay] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Fix today's challenge the first time it is shown, so it stays the same all day.
  useEffect(() => {
    if (mounted && !daily.stored && daily.exerciseId) progress.setDailyChallenge(daily.day, daily.exerciseId);
  }, [mounted, daily.stored, daily.exerciseId, daily.day]);

  // Load the full exercise (tests, hints, solution) for today's challenge.
  useEffect(() => {
    if (!id) return;
    const ctrl = new AbortController();
    fetch(`/challenge/exercise/${encodeURIComponent(id)}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`The server answered ${r.status}.`))))
      .then((exercise: Exercise) => setData({ id, exercise }))
      .catch((e: unknown) => {
        if (!ctrl.signal.aborted) setData({ id, error: e instanceof Error ? e.message : String(e) });
      });
    return () => ctrl.abort();
  }, [id, reload]);

  const onMidnight = useCallback(() => setNewDay(true), []);
  const current = data && data.id === id ? data : null;
  const ep = id ? s.exercises[id] : undefined;
  const solvedBefore = Boolean(ep?.passedAt && mounted && todayKey(new Date(ep.passedAt)) !== daily.day && !completed);

  // Last 7 days, oldest first.
  const week = mounted
    ? Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const day = todayKey(d);
        const rec = s.daily?.[day];
        return { day, today: i === 6, state: rec?.completedAt ? ("won" as const) : rec && i < 6 ? ("missed" as const) : ("none" as const) };
      })
    : [];
  const past = mounted
    ? Object.entries(s.daily ?? {})
        .filter(([day]) => day < daily.day)
        .sort(([a], [b]) => b.localeCompare(a))
    : [];
  const wins = Object.values(s.daily ?? {}).filter((d) => d.completedAt).length;

  return (
    <>
      {/* festive hero */}
      <section
        className="relative overflow-hidden border-b-2 border-border"
        style={{ background: "linear-gradient(135deg, var(--sun-soft) 0%, var(--tangerine-soft) 48%, var(--pink-soft) 100%)" }}
      >
        <div className="blob -left-16 -top-24 size-72" style={{ background: "var(--sun)" }} />
        <div className="blob -right-10 top-10 size-56" style={{ background: "var(--pink)", opacity: 0.22 }} />
        <FloatingHexes count={9} />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 py-9 text-center sm:py-12 md:flex-row md:gap-8 md:text-left">
          <Hexy mood={completed ? "celebrate" : "wave"} size={150} animate className="h-auto w-24 shrink-0 sm:w-36" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center justify-center gap-1.5 font-display text-sm font-semibold uppercase tracking-wider text-warning md:justify-start">
              <CalendarDays className="size-4" aria-hidden /> {mounted ? formatDay(daily.day, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "Today"}
            </p>
            <h1 className="mt-1 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Daily <span className="text-gradient">challenge</span>
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-[15px] font-semibold text-muted-foreground md:mx-0">
              One exercise a day, picked from the worlds you have reached. Solve it before midnight to win a +{XP.daily} XP bonus – and keep your streak glowing.
            </p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2.5 md:justify-start">
              <HeroPill tone="sun" icon={<Zap className="fill-current" />}>
                {completed ? `+${XP.daily} XP bonus won` : `+${XP.daily} XP bonus`}
              </HeroPill>
              <HeroPill tone="sky" icon={<Timer />}>
                <span>
                  Next in <MidnightCountdown onZero={onMidnight} />
                </span>
              </HeroPill>
              <HeroPill tone="tangerine" icon={<Flame className="fill-current" />}>
                {mounted ? g.streak : 0}-day streak
              </HeroPill>
            </ul>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-5">
          {newDay && (
            <div role="status" className="flex flex-wrap items-center gap-3 rounded-3xl border-2 border-sky bg-sky-soft p-4 animate-pop-in">
              <Hexy mood="happy" size={48} />
              <p className="min-w-0 flex-1 font-display text-lg font-semibold">It&apos;s a new day – a fresh challenge is waiting!</p>
              <Button variant="accent" onClick={() => window.location.reload()}>
                <RefreshCw /> Load it
              </Button>
            </div>
          )}

          {completed && (
            <div
              role="status"
              className="relative overflow-hidden rounded-3xl border-2 border-mint bg-mint-soft p-5 animate-pop-in sm:p-6"
            >
              <FloatingHexes count={5} className="opacity-60" />
              <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                <Hexy mood="celebrate" size={96} className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center justify-center gap-1.5 font-display text-sm font-semibold uppercase tracking-wider text-success sm:justify-start">
                    <PartyPopper className="size-4" aria-hidden /> Challenge complete
                  </p>
                  <p className="mt-0.5 font-display text-2xl font-bold">You beat today&apos;s challenge!</p>
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">
                    The +{XP.daily} XP bonus is yours{g.streak > 1 ? ` and your streak is now ${g.streak} days` : ""}. A brand-new challenge unlocks at midnight – see you tomorrow.
                  </p>
                </div>
                <Button asChild variant="success">
                  <Link href="/exercises">
                    <Trophy /> Keep practising
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {mounted && !daily.exerciseId ? (
            <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-border bg-card px-6 py-12 text-center">
              <Hexy mood="sleep" size={110} />
              <h2 className="mt-3 font-display text-2xl font-semibold">No challenge available yet</h2>
              <p className="mt-1 max-w-md text-sm font-semibold text-muted-foreground">Daily challenges come from the lessons you have reached. Start your first lesson and a challenge will be waiting for you.</p>
              <Button asChild className="mt-5">
                <Link href="/learn">
                  <MapIcon /> Go to the learning map
                </Link>
              </Button>
            </div>
          ) : current?.error ? (
            <div role="alert" className="flex flex-col items-center rounded-3xl border-2 border-coral/50 bg-coral-soft px-6 py-10 text-center">
              <Hexy mood="oops" size={96} />
              <h2 className="mt-3 font-display text-xl font-semibold">Today&apos;s challenge didn&apos;t load</h2>
              <p className="mt-1 max-w-md text-sm font-semibold text-muted-foreground">{current.error} Check your connection and try again.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button onClick={() => setReload((n) => n + 1)}>
                  <RefreshCw /> Try again
                </Button>
                {id && (
                  <Button asChild variant="outline">
                    <Link href={`/exercises/${id}`}>Open it as an exercise</Link>
                  </Button>
                )}
              </div>
            </div>
          ) : current?.exercise ? (
            <>
              {meta && (
                <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-muted-foreground">
                  <WorldChip world={meta.world} />
                  {meta.lessonId && (
                    <Link href={`/learn/${meta.lessonId}`} className="inline-flex items-center gap-1 rounded-full px-1 hover:text-primary">
                      <BookOpen className="size-4" aria-hidden /> Practises: {meta.lessonTitle}
                    </Link>
                  )}
                </div>
              )}
              <ExerciseCard
                key={current.exercise.id}
                task={current.exercise}
                eyebrow="Daily challenge"
                xp={exerciseXp(current.exercise.difficulty) + XP.daily}
                onAskTutor={(code) => {
                  tutor.queue(`I'm working on today's daily challenge, "${current.exercise!.title}". Please give me a hint, not the solution.\n\nMy attempt:\n\`\`\`r\n${code}\n\`\`\``);
                  router.push("/tutor");
                }}
              />
            </>
          ) : (
            <CardSkeleton />
          )}
        </div>

        <aside className="space-y-5" aria-label="Rewards and history">
          <Panel title="Today's reward" icon={<Zap />}>
            <dl className="space-y-2 text-sm font-bold">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Exercise XP{meta ? ` (${meta.difficulty})` : ""}</dt>
                <dd className={cn("tabular-nums", solvedBefore && "text-muted-foreground line-through")}>{meta ? `+${exerciseXp(meta.difficulty)}` : "–"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Daily bonus</dt>
                <dd className="tabular-nums">+{XP.daily}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t-2 border-dashed border-border pt-2 font-display text-lg">
                <dt>Total</dt>
                <dd className="flex items-center gap-1 text-warning tabular-nums">
                  <Zap className="size-4 fill-current" aria-hidden /> +{(meta && !solvedBefore ? exerciseXp(meta.difficulty) : 0) + XP.daily} XP
                </dd>
              </div>
            </dl>
            {solvedBefore && <p className="mt-2 text-xs font-semibold text-muted-foreground">You solved this exercise before, so its XP is already yours – solve it again today to win the bonus.</p>}
            <p className={cn("mt-3 flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold", completed ? "bg-mint-soft text-success" : "bg-surface-2 text-muted-foreground")}>
              {completed ? <CheckCircle2 className="size-4" aria-hidden /> : <CircleDashed className="size-4" aria-hidden />}
              {completed ? "Bonus won – well done!" : "Not solved yet today"}
            </p>
          </Panel>

          <Panel title="This week" icon={<CalendarDays />}>
            <ol className="flex justify-between">
              {week.map((d) => (
                <li key={d.day} className="flex flex-col items-center gap-1">
                  <span className="sr-only">
                    {formatDay(d.day, { weekday: "long", day: "numeric", month: "long" })}: {d.state === "won" ? "challenge won" : d.today ? "today" : d.state === "missed" ? "not solved" : "no challenge"}
                  </span>
                  <DayHex state={d.state} today={d.today} />
                  <span aria-hidden className={cn("text-xs font-bold", d.today ? "text-primary" : "text-muted-foreground")}>
                    {formatDay(d.day, { weekday: "narrow" })}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-sm font-semibold text-muted-foreground">
              {mounted ? (
                <>
                  You have won <strong className="text-foreground">{wins}</strong> daily {wins === 1 ? "challenge" : "challenges"} so far.
                </>
              ) : (
                " "
              )}
            </p>
          </Panel>

          <Panel title="Past challenges" icon={<History />}>
            {past.length === 0 ? (
              <p className="text-sm font-semibold text-muted-foreground">Your challenge history starts today. Come back tomorrow for the next one!</p>
            ) : (
              <>
                <ul className="space-y-1.5">
                  {(showAll ? past : past.slice(0, 6)).map(([day, rec]) => {
                    const m = exerciseMeta(outline, rec.exerciseId);
                    return (
                      <li key={day}>
                        <Link href={`/exercises/${rec.exerciseId}`} className="group flex items-center gap-3 rounded-2xl px-2 py-1.5 hover:bg-surface-2">
                          <span className="w-16 shrink-0 text-xs font-bold text-muted-foreground">{formatDay(day, { day: "numeric", month: "short" })}</span>
                          <span className="min-w-0 flex-1 truncate text-sm font-bold group-hover:text-primary">{m?.title ?? rec.exerciseId}</span>
                          {rec.completedAt ? (
                            <Badge variant="success">
                              <Check strokeWidth={3} /> Won
                            </Badge>
                          ) : (
                            <Badge variant="outline">Missed</Badge>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {past.length > 6 && (
                  <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => setShowAll((v) => !v)} aria-expanded={showAll}>
                    {showAll ? "Show fewer" : `Show all ${past.length}`}
                  </Button>
                )}
              </>
            )}
          </Panel>
        </aside>
      </div>
    </>
  );
}
