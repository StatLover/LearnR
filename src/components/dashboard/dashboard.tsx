"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  Bookmark,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Code2,
  Dumbbell,
  Flag,
  Flame,
  FolderKanban,
  FolderOpen,
  History,
  Map as MapIcon,
  NotebookPen,
  PlayCircle,
  RefreshCw,
  Target,
  Terminal,
  Trash2,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { Badge, DifficultyBadge, XpBadge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hexy } from "@/components/brand/mascot";
import { FloatingHexes } from "@/components/brand/decor";
import { TopicArt } from "@/components/brand/topic-art";
import { HexBadge } from "@/components/game/hex-badge";
import { useGame, useOutline } from "@/components/game/outline-context";
import { StaticCode } from "@/components/code/static-code";
import { openInPlayground } from "@/components/code/code-block";
import { allOutlineLessons, courseCompletion, longestStreak, moduleCompletion, progress, suggestedNextLesson, useProgress, weakConcepts } from "@/lib/store/progress";
import { badges, type BadgeDef } from "@/lib/game/badges";
import { LESSON_ART, worldOfModule, worlds } from "@/lib/game/worlds";
import { XP } from "@/lib/game/xp";
import { cn, plural, timeAgo } from "@/lib/utils";
import { ActivityCalendar, DashCard, LevelHex, StatTile, WeekChart, useHydrated } from "./parts";

const BADGE_GROUPS: BadgeDef["group"][] = ["Getting started", "Worlds", "Practice", "Consistency", "Milestones"];

export interface DashboardProps {
  /** The first lesson that teaches each concept (for revision links). */
  conceptLessons: Record<string, { id: string; title: string }>;
  lessonTitles: Record<string, string>;
}

/** Shown while progress is read from this browser. */
function DashboardSkeleton() {
  return (
    <>
      <div className="relative overflow-hidden border-b-2 border-border" style={{ background: "linear-gradient(135deg, var(--primary-soft) 0%, var(--background) 70%)" }}>
        <div className="relative mx-auto flex max-w-7xl items-center gap-5 px-5 py-10">
          <Hexy mood="think" size={96} animate />
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-primary">My adventure</p>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Your dashboard</h1>
            <p className="mt-2 text-[15px] font-semibold text-muted-foreground" role="status">
              Loading your progress…
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-3" aria-hidden>
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn("h-56 animate-pulse rounded-3xl border-2 border-border bg-card", i === 0 && "lg:col-span-2")} />
        ))}
      </div>
    </>
  );
}

export function Dashboard(props: DashboardProps) {
  const hydrated = useHydrated();
  if (!hydrated) return <DashboardSkeleton />;
  return <DashboardBody {...props} />;
}

function DashboardBody({ conceptLessons, lessonTitles }: DashboardProps) {
  const outline = useOutline();
  const s = useProgress();
  const g = useGame();
  const router = useRouter();
  const [openSnippet, setOpenSnippet] = useState<string | null>(null);

  const completion = courseCompletion(outline, s);
  const next = suggestedNextLesson(outline, s);
  const lessons = allOutlineLessons(outline);
  const nextWorld = next ? worldOfModule(next.module) : worlds[worlds.length - 1];
  const nextModule = next ? outline.modules.find((m) => m.number === next.module) : undefined;
  const exercisesPassed = Object.values(s.exercises).filter((e) => e.passedAt).length;
  const totalExercises = outline.modules.reduce((a, m) => a + m.exercises.length, 0);
  const quizScores = lessons.filter((l) => s.lessons[l.id]?.quizBest !== undefined).map((l) => ({ l, best: s.lessons[l.id]!.quizBest! }));
  const avgQuiz = quizScores.length ? Math.round((quizScores.reduce((a, q) => a + q.best, 0) / quizScores.length) * 100) : null;
  const checkpointsPassed = outline.modules.filter((m) => s.checkpoints[String(m.number)]?.passedAt).length;
  const projectsDone = outline.projects.filter((p) => p.stepIds.length > 0 && p.stepIds.every((st) => s.projects[p.id]?.steps[st]?.passedAt)).length;
  const weak = weakConcepts(s).filter((w) => conceptLessons[w.concept]).slice(0, 4);
  const earned = badges.filter((b) => s.achievements[b.id]);
  const notes = Object.entries(s.notes).sort((a, b) => b[1].updatedAt - a[1].updatedAt);
  const longest = longestStreak(s.activityDays);
  const goalDone = g.todayXp >= g.goalXp;
  const greeting = s.profile.name ? `Welcome back, ${s.profile.name}!` : completion.done ? "Welcome back, explorer!" : "Welcome to R Academy!";
  const nudge = goalDone
    ? `Daily goal reached – brilliant! You earned ${g.todayXp} XP today.`
    : g.todayXp > 0
      ? `Only ${g.goalXp - g.todayXp} XP to go for today's goal. You've got this!`
      : g.streak > 0
        ? `Keep your ${g.streak}-day streak alive – one lesson or challenge is enough.`
        : "Earn a little XP today to start a learning streak.";

  const dailyEx = g.daily.exerciseId ? outline.modules.flatMap((m) => m.exercises).find((e) => e.id === g.daily.exerciseId) : undefined;
  const xpLog = [...g.events].sort((a, b) => b.at - a.at).slice(0, 8);

  return (
    <>
      {/* ------------------------------ hero ------------------------------ */}
      <div className="relative overflow-hidden border-b-2 border-border" style={{ background: "linear-gradient(135deg, var(--primary-soft) 0%, var(--grape-soft) 40%, var(--background) 80%)" }}>
        <FloatingHexes count={6} className="max-md:hidden" />
        <div className="blob -left-16 -top-24 size-72" style={{ background: "var(--primary)" }} />
        <div className="blob -right-10 top-10 size-56" style={{ background: "var(--sun)", opacity: 0.25 }} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-5 py-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
          <div className="flex items-center gap-4 sm:gap-5">
            <Hexy mood={goalDone ? "celebrate" : "wave"} size={104} animate className="max-sm:w-20 shrink-0" />
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold uppercase tracking-wider text-primary">My adventure</p>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{greeting}</h1>
              <p className="mt-1.5 text-[15px] font-semibold text-muted-foreground">{nudge}</p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                {completion.done} of {completion.total} lessons completed
                {next && nextModule ? (
                  <>
                    {" "}· you are in <strong className="text-foreground">World {nextWorld.number}: {nextWorld.name}</strong>
                  </>
                ) : null}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
            <div className="col-span-2 flex items-center gap-3 rounded-3xl border-2 border-border bg-card/90 p-4 shadow-[var(--shadow-card)] backdrop-blur sm:col-span-1">
              <LevelHex level={g.level.level} size={56} />
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-semibold leading-tight">Level {g.level.level}</p>
                <p className="truncate text-xs font-bold text-muted-foreground">{g.level.title}</p>
                <ProgressBar value={g.level.pct} tone="sun" size="md" className="mt-2" label={`${g.level.pct}% of the way to level ${g.level.level + 1}`} />
                <p className="mt-1 flex items-center gap-1 text-xs font-bold text-muted-foreground">
                  <Zap className="size-3.5 fill-sun text-sun" aria-hidden />
                  {g.xp.toLocaleString()} / {g.level.next.toLocaleString()} XP · {(g.level.next - g.xp).toLocaleString()} to level {g.level.level + 1}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-border bg-card/90 px-4 py-3 text-center shadow-[var(--shadow-card)] backdrop-blur">
              <Flame className={cn("size-9", g.streak ? "fill-tangerine text-tangerine animate-wiggle" : "text-muted-foreground")} aria-hidden />
              <p className="font-display text-2xl font-bold leading-none">{g.streak}</p>
              <p className="mt-0.5 text-xs font-bold text-muted-foreground">{g.streak === 1 ? "day streak" : "day streak"}</p>
              <span className="sr-only">{`Current learning streak: ${plural(g.streak, "day")}. Longest: ${plural(longest, "day")}.`}</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-border bg-card/90 px-4 py-3 text-center shadow-[var(--shadow-card)] backdrop-blur">
              <ProgressRing value={g.goalPct} size={64} stroke={8} color={goalDone ? "var(--mint)" : "var(--sun)"} label={`Daily goal: ${g.todayXp} of ${g.goalXp} XP`}>
                {goalDone ? <CheckCircle2 className="size-6 text-success" aria-hidden /> : <span className="text-sm">{g.todayXp}</span>}
              </ProgressRing>
              <p className="mt-1 text-xs font-bold text-muted-foreground">
                Goal {g.todayXp}/{g.goalXp} XP
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-5 py-8">
        {/* ----------------------- continue + daily ----------------------- */}
        <div className="grid gap-6 lg:grid-cols-3">
          <section aria-labelledby="continue-title" className="flex flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)] lg:col-span-2">
            {next ? (
              <div className="grid flex-1 sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
                <div className="relative grid place-items-center border-b-2 border-border sm:border-b-0 sm:border-r-2" style={{ background: nextWorld.color.soft }}>
                  <TopicArt kind={LESSON_ART[next.id] ?? nextWorld.art} bg={nextWorld.color.soft} className="block max-h-56 w-full" />
                  <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 font-display text-xs font-semibold text-white shadow-sm" style={{ background: nextWorld.color.main, color: nextWorld.id === "r-pro" ? "#3b2600" : undefined }}>
                    World {nextWorld.number} · {nextWorld.name}
                  </span>
                </div>
                <div className="flex flex-col gap-2 p-5 sm:p-6">
                  <p className="font-display text-sm font-semibold uppercase tracking-wider text-primary">Continue learning</p>
                  <h2 id="continue-title" className="font-display text-2xl font-bold leading-tight">
                    {next.title}
                  </h2>
                  <p className="text-sm font-semibold text-muted-foreground">{next.summary}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground">
                    {nextModule && (
                      <span>
                        Module {nextModule.number}: {nextModule.title}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" aria-hidden /> about {next.minutes} min
                    </span>
                    <XpBadge xp={XP.lesson} />
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-4 pt-3">
                    <Button asChild size="lg" variant="success">
                      <Link href={`/learn/${next.id}`}>
                        <PlayCircle /> {s.lessons[next.id]?.visitedAt ? "Continue lesson" : "Start lesson"}
                      </Link>
                    </Button>
                    <div className="flex min-w-40 flex-1 items-center gap-3">
                      <ProgressRing value={completion.pct} size={52} stroke={6} label={`Course ${completion.pct}% complete`} />
                      <span className="text-xs font-bold text-muted-foreground">of the whole course complete</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-5 p-6">
                <Hexy mood="celebrate" size={96} />
                <div className="min-w-0 flex-1">
                  <h2 id="continue-title" className="font-display text-2xl font-bold">You have completed every lesson!</h2>
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">Amazing work. Put your skills to the test with the capstone project.</p>
                </div>
                <Button asChild size="lg">
                  <Link href="/projects">
                    <FolderKanban /> Explore projects
                  </Link>
                </Button>
              </div>
            )}
          </section>

          <section aria-labelledby="daily-title" className="flex flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]">
            <div className="relative flex items-center gap-3 border-b-2 border-border px-5 py-4" style={{ background: "linear-gradient(120deg, var(--sun-soft), var(--tangerine-soft))" }}>
              <span className="grid size-11 place-items-center rounded-2xl bg-sun text-[#3b2600] shadow-[0_3px_0_var(--sun-shadow)]">
                <Target className="size-6" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="daily-title" className="font-display text-lg font-semibold leading-tight">
                  Daily challenge
                </h2>
                <p className="text-xs font-bold text-muted-foreground">A new one every day</p>
              </div>
              {g.daily.completed ? (
                <Badge variant="success">
                  <CheckCircle2 /> Done
                </Badge>
              ) : (
                <XpBadge xp={XP.daily} />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              {dailyEx ? (
                <>
                  <p className="font-display text-lg font-semibold leading-tight">{dailyEx.title}</p>
                  <DifficultyBadge difficulty={dailyEx.difficulty as "easy" | "medium" | "challenge"} />
                </>
              ) : (
                <p className="text-sm font-semibold text-muted-foreground">Today&apos;s challenge is waiting for you.</p>
              )}
              <p className="text-sm font-semibold text-muted-foreground">
                {g.daily.completed ? "Solved today – brilliant! A fresh challenge appears tomorrow." : `Solve it today for a bonus +${XP.daily} XP and keep your streak glowing.`}
              </p>
              <Button asChild variant={g.daily.completed ? "outline" : "sun"} className="mt-auto w-full">
                <Link href="/challenge">
                  {g.daily.completed ? (
                    <>
                      <CalendarCheck /> Review today&apos;s challenge
                    </>
                  ) : (
                    <>
                      <Zap className="fill-current" /> Take the challenge
                    </>
                  )}
                </Link>
              </Button>
            </div>
          </section>
        </div>

        {/* ----------------------- week chart + stats ----------------------- */}
        <div className="grid gap-6 lg:grid-cols-3">
          <DashCard id="week-title" title="Your week in XP" icon={<TrendingUp />} color="primary" className="lg:col-span-2">
            <WeekChart week={g.week} goal={g.goalXp} />
          </DashCard>
          <DashCard id="stats-title" title="Your stats" icon={<Trophy />} color="grape">
            <div className="grid grid-cols-2 gap-2.5">
              <StatTile icon={<BookOpen />} color="sky" label="Lessons" value={completion.done} sub={`of ${completion.total}`} />
              <StatTile icon={<Dumbbell />} color="grape" label="Exercises passed" value={exercisesPassed} sub={`of ${totalExercises}`} />
              <StatTile icon={<Target />} color="pink" label="Quiz average" value={avgQuiz === null ? "–" : `${avgQuiz}%`} sub={plural(quizScores.length, "quiz", "quizzes")} />
              <StatTile icon={<Flag />} color="teal" label="Checkpoints" value={checkpointsPassed} sub={`of ${outline.modules.length}`} />
              <StatTile icon={<FolderKanban />} color="tangerine" label="Projects" value={projectsDone} sub={`of ${outline.projects.length}`} />
              <StatTile icon={<Flame />} color="coral" label="Longest streak" value={longest} sub={longest === 1 ? "day" : "days"} />
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
              <Terminal className="size-3.5" aria-hidden /> You have run R code {plural(s.stats.codeRuns, "time")}.
            </p>
          </DashCard>
        </div>

        {/* ----------------------------- worlds ----------------------------- */}
        <DashCard
          id="worlds-title"
          title="World progress"
          icon={<MapIcon />}
          color="mint"
          action={
            <Link href="/learn" className="flex items-center gap-1 font-display text-sm font-semibold text-primary hover:underline">
              Open the map <ArrowRight className="size-4" />
            </Link>
          }
        >
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {worlds.map((w) => {
              const mods = outline.modules.filter((m) => w.modules.includes(m.number)).sort((a, b) => w.modules.indexOf(a.number) - w.modules.indexOf(b.number));
              const ls = mods.flatMap((m) => m.lessons);
              const done = ls.filter((l) => s.lessons[l.id]?.completedAt).length;
              const pct = ls.length ? Math.round((done / ls.length) * 100) : 0;
              const current = next && w.modules.includes(next.module);
              return (
                <li key={w.id} className={cn("flex flex-col overflow-hidden rounded-2xl border-2 bg-surface", current ? "border-[var(--w)] shadow-[0_0_0_3px_var(--w-soft)]" : "border-border")} style={{ ["--w" as string]: w.color.main, ["--w-soft" as string]: w.color.soft }}>
                  <div className="relative flex justify-center" style={{ background: w.color.soft }}>
                    <TopicArt kind={w.art} bg={w.color.soft} className="block max-h-28 w-full" />
                    {pct === 100 && (
                      <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-mint text-white shadow" aria-label="World complete">
                        <CheckCircle2 className="size-4" />
                      </span>
                    )}
                    {current && <span className="absolute left-2 top-2 rounded-full bg-card px-2 py-0.5 text-[11px] font-bold shadow-sm">You are here</span>}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-3.5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: w.color.main }}>
                        World {w.number}
                      </p>
                      <h3 className="font-display text-base font-semibold leading-tight">
                        <Link href={`/learn#world-${w.id}`} className="hover:underline">
                          {w.name}
                        </Link>
                      </h3>
                    </div>
                    <ProgressBar value={pct} color={w.color.main} size="sm" label={`${w.name}: ${pct}% of lessons complete`} />
                    <p className="text-xs font-bold text-muted-foreground">
                      {done}/{ls.length} lessons · {pct}%
                    </p>
                    <ul className="mt-auto space-y-1 border-t-2 border-border pt-2">
                      {mods.map((m) => {
                        const c = moduleCompletion(m, s);
                        const cp = s.checkpoints[String(m.number)]?.passedAt;
                        return (
                          <li key={m.number} className="flex items-center gap-1.5 text-xs font-semibold">
                            <Link href={`/learn/module/${m.id}`} className="min-w-0 flex-1 truncate text-muted-foreground hover:text-foreground">
                              {m.number}. {m.title}
                            </Link>
                            <span className="shrink-0 text-muted-foreground">
                              {c.done}/{c.total}
                            </span>
                            {cp && <Flag className="size-3.5 shrink-0 fill-teal text-teal" aria-label="Checkpoint passed" />}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </DashCard>

        {/* ------------------------- revision ------------------------- */}
        {weak.length > 0 && (
          <DashCard id="revision-title" title="Suggested revision" icon={<RefreshCw />} color="sun" className="border-sun/60 bg-gradient-to-br from-sun-soft/70 to-card">
            <p className="-mt-2 mb-3 text-sm font-semibold text-muted-foreground">Based on your quiz answers, these topics could use another look. Everyone needs a second pass sometimes!</p>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {weak.map((w) => (
                <li key={w.concept}>
                  <Link href={`/learn/${conceptLessons[w.concept].id}`} className="press flex items-center justify-between gap-2 rounded-2xl border-2 border-border bg-card p-3 text-sm [--press-shadow:var(--border)] hover:bg-surface-2">
                    <span className="min-w-0">
                      <span className="block font-bold capitalize">{w.concept.replace(/-/g, " ")}</span>
                      <span className="block truncate text-xs font-semibold text-muted-foreground">Review: {conceptLessons[w.concept].title}</span>
                    </span>
                    <Badge variant="warning">{w.wrong} missed</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </DashCard>
        )}

        {/* --------------------- activity, quizzes, calendar --------------------- */}
        <div className="grid gap-6 lg:grid-cols-3">
          <DashCard id="recent-title" title="Recent activity" icon={<History />} color="sky">
            <Tabs defaultValue="visited">
              <TabsList className="mb-3 w-full">
                <TabsTrigger value="visited" className="flex-1 justify-center">
                  Visited
                </TabsTrigger>
                <TabsTrigger value="xp" className="flex-1 justify-center">
                  XP earned
                </TabsTrigger>
              </TabsList>
              <TabsContent value="visited">
                {s.recent.length === 0 ? (
                  <p className="text-sm font-semibold text-muted-foreground">
                    Nothing yet –{" "}
                    <Link href="/learn" className="font-bold text-primary underline">
                      start your first lesson
                    </Link>
                    .
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {s.recent.slice(0, 8).map((r) => (
                      <li key={`${r.kind}-${r.id}`}>
                        <Link href={r.href} className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-semibold hover:bg-surface-2">
                          {r.kind === "lesson" ? <BookOpen className="size-4 shrink-0 text-sky" /> : r.kind === "exercise" ? <Dumbbell className="size-4 shrink-0 text-grape" /> : <FolderKanban className="size-4 shrink-0 text-tangerine" />}
                          <span className="min-w-0 flex-1 truncate">{r.title}</span>
                          <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(r.at)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
              <TabsContent value="xp">
                {xpLog.length === 0 ? (
                  <p className="text-sm font-semibold text-muted-foreground">Complete lessons, answer questions and pass challenges to earn XP.</p>
                ) : (
                  <ul className="space-y-1">
                    {xpLog.map((e, i) => (
                      <li key={`${e.at}-${i}`} className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold">
                        <span className="min-w-0 flex-1 truncate">{e.reason}</span>
                        <span className="shrink-0 font-display text-xs font-bold text-warning">+{e.amount} XP</span>
                        <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">{timeAgo(e.at)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
            </Tabs>
          </DashCard>

          <DashCard id="quiz-title" title="Quiz scores" icon={<Target />} color="pink">
            {quizScores.length === 0 ? (
              <p className="text-sm font-semibold text-muted-foreground">Take the quiz at the end of a lesson to see your scores here.</p>
            ) : (
              <ul className="space-y-2.5">
                {quizScores.slice(-8).map(({ l, best }) => (
                  <li key={l.id} className="grid grid-cols-[minmax(0,1fr)_80px_40px] items-center gap-2 text-sm font-semibold">
                    <Link href={`/learn/${l.id}#quiz`} className="truncate hover:text-primary">
                      {l.title}
                    </Link>
                    <ProgressBar value={best * 100} size="sm" tone={best >= 0.7 ? "mint" : "sun"} label={`${l.title} quiz: ${Math.round(best * 100)}%`} />
                    <span className="text-right text-xs font-bold text-muted-foreground">{Math.round(best * 100)}%</span>
                  </li>
                ))}
              </ul>
            )}
          </DashCard>

          <DashCard id="activity-title" title="Activity" icon={<CalendarDays />} color="mint">
            <ActivityCalendar days={s.activityDays} />
            <p className="mt-4 text-sm font-semibold">
              Daily goal: <strong>{g.goalXp} XP</strong>.{" "}
              <Link href="/settings" className="font-bold text-primary underline-offset-4 hover:underline">
                Change it
              </Link>
              . {g.streak > 0 ? "Keep your streak going!" : "Study today to start a streak."}
            </p>
          </DashCard>
        </div>

        {/* ----------------------------- badges ----------------------------- */}
        <DashCard
          id="badges-title"
          title={
            <>
              Badges <span className="font-sans text-sm font-bold text-muted-foreground">({earned.length} of {badges.length})</span>
            </>
          }
          icon={<Award />}
          color="sun"
        >
          <div className="space-y-6">
            {BADGE_GROUPS.map((group) => {
              const list = badges.filter((b) => b.group === group);
              const got = list.filter((b) => s.achievements[b.id]).length;
              return (
                <div key={group}>
                  <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {group}
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] normal-case tracking-normal">
                      {got}/{list.length}
                    </span>
                  </h3>
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
                    {list.map((b) => {
                      const at = s.achievements[b.id];
                      return (
                        <li key={b.id} className={cn("flex flex-col items-center rounded-2xl border-2 p-3 text-center", at ? "border-border bg-surface" : "border-dashed border-border bg-transparent")}>
                          <HexBadge icon={b.icon} color={b.color} size={52} locked={!at} className={cn(!at && "opacity-70")} />
                          <p className={cn("mt-2 font-display text-sm font-semibold leading-tight", !at && "text-muted-foreground")}>{b.title}</p>
                          <p className="mt-0.5 text-[11px] font-semibold leading-snug text-muted-foreground">{b.description}</p>
                          <p className={cn("mt-auto pt-1.5 text-[11px] font-bold", at ? "text-success" : "text-muted-foreground")}>{at ? `Earned ${new Date(at).toLocaleDateString()}` : "Not earned yet"}</p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </DashCard>

        {/* --------------------- saved code, bookmarks, notes --------------------- */}
        <div className="grid gap-6 lg:grid-cols-3">
          <DashCard id="saved-title" title={`Saved code (${s.snippets.length})`} icon={<Code2 />} color="primary">
            {s.snippets.length === 0 ? (
              <p className="text-sm font-semibold text-muted-foreground">Use the save button (or Ctrl+S) in any code editor to keep code here.</p>
            ) : (
              <ul className="space-y-2">
                {s.snippets.slice(0, 10).map((sn) => (
                  <li key={sn.id} className="overflow-hidden rounded-2xl border-2 border-border bg-surface">
                    <div className="flex items-center gap-1 px-3 py-2">
                      <button className="min-w-0 flex-1 cursor-pointer truncate text-left text-sm font-bold hover:text-primary" onClick={() => setOpenSnippet(openSnippet === sn.id ? null : sn.id)} aria-expanded={openSnippet === sn.id}>
                        {sn.title}
                        <span className="block text-[11px] font-semibold text-muted-foreground">{timeAgo(sn.updatedAt)}</span>
                      </button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Open ${sn.title} in the playground`}
                        onClick={() => {
                          openInPlayground(sn.code);
                          router.push("/playground");
                        }}
                      >
                        <FolderOpen />
                      </Button>
                      <Button size="icon-sm" variant="ghost" aria-label={`Delete ${sn.title}`} onClick={() => progress.deleteSnippet(sn.id)}>
                        <Trash2 />
                      </Button>
                    </div>
                    {openSnippet === sn.id && <StaticCode code={sn.code} className="max-h-60 border-t-2 border-border text-[13px]" />}
                  </li>
                ))}
              </ul>
            )}
          </DashCard>

          <DashCard id="bookmarks-title" title={`Bookmarks (${s.bookmarks.length})`} icon={<Bookmark />} color="coral">
            {s.bookmarks.length === 0 ? (
              <p className="text-sm font-semibold text-muted-foreground">Bookmark lessons, examples, projects and functions to find them here.</p>
            ) : (
              <ul className="space-y-1">
                {s.bookmarks.map((b) => (
                  <li key={b.id} className="flex items-center gap-2">
                    <Link href={b.href} className="min-w-0 flex-1 truncate rounded-xl px-2 py-1.5 text-sm font-semibold hover:bg-surface-2">
                      {b.title}
                    </Link>
                    <Badge variant="outline" className="capitalize">
                      {b.kind}
                    </Badge>
                    <Button size="icon-sm" variant="ghost" aria-label={`Remove bookmark ${b.title}`} onClick={() => progress.toggleBookmark(b)}>
                      <Trash2 />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </DashCard>

          <DashCard id="notes-title" title={`My notes (${notes.length})`} icon={<NotebookPen />} color="teal">
            {notes.length === 0 ? (
              <p className="text-sm font-semibold text-muted-foreground">Write notes inside any lesson – they will be collected here.</p>
            ) : (
              <ul className="space-y-1.5">
                {notes.map(([id, n]) => (
                  <li key={id}>
                    <Link href={`/learn/${id}`} className="block rounded-xl border-2 border-border bg-surface px-3 py-2 text-sm hover:bg-surface-2">
                      <span className="block truncate font-bold">{lessonTitles[id] ?? id}</span>
                      <span className="line-clamp-2 block text-xs font-semibold text-muted-foreground">{n.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </DashCard>
        </div>

        <p className="text-center text-xs font-semibold text-muted-foreground">
          Progress is saved in this browser. Create an optional account in{" "}
          <Link href="/settings" className="font-bold text-primary underline-offset-4 hover:underline">
            Settings
          </Link>{" "}
          to sync it across devices.
        </p>
      </div>
    </>
  );
}
