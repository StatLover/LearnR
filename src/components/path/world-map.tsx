"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Popover } from "radix-ui";
import { ArrowRight, BookOpen, Check, CheckCircle2, Clock, Crown, Flag, FolderKanban, Lock, Map as MapIcon, Play, RotateCcw, Star, Target, Trophy, Zap } from "lucide-react";
import { useGame, useOutline } from "@/components/game/outline-context";
import { TopicArt } from "@/components/brand/topic-art";
import { Button } from "@/components/ui/button";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { allOutlineLessons, isLessonUnlocked, progress, suggestedNextLesson, useProgress, type Outline, type OutlineLesson, type OutlineModule, type ProgressState } from "@/lib/store/progress";
import { useSettings } from "@/lib/store/settings";
import { LESSON_ART, PROJECT_ART, worlds, type World } from "@/lib/game/worlds";
import { exerciseXp, XP } from "@/lib/game/xp";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type Status = "done" | "current" | "open" | "locked";

type Row =
  | { type: "module"; module: OutlineModule }
  | { type: "lesson"; lesson: OutlineLesson; module: OutlineModule; number: string; status: Status; started: boolean; prevTitle?: string }
  | { type: "checkpoint"; module: OutlineModule; status: "done" | "open" | "locked"; best?: number }
  | { type: "projects" }
  | { type: "project"; project: Outline["projects"][number]; done: number; total: number };

interface WorldData {
  world: World;
  modules: OutlineModule[];
  lessons: OutlineLesson[];
  done: number;
  pct: number;
  rows: Row[];
  /** The lesson to open from the world card. */
  target?: OutlineLesson;
  locked: boolean;
  minutes: number;
  challenges: number;
}

function useWorldData(): { data: WorldData[]; next?: OutlineLesson; state: ProgressState } {
  const outline = useOutline();
  const state = useProgress();
  const { learningMode } = useSettings();
  const data = useMemo(() => {
    const ordered = allOutlineLessons(outline);
    const next = suggestedNextLesson(outline, state);
    const result: WorldData[] = worlds.map((world) => {
      const modules = world.modules.map((n) => outline.modules.find((m) => m.number === n)).filter((m): m is OutlineModule => Boolean(m));
      const lessons = modules.flatMap((m) => m.lessons);
      const rows: Row[] = [];
      let k = 0;
      for (const m of modules) {
        rows.push({ type: "module", module: m });
        for (const l of m.lessons) {
          k++;
          const i = ordered.findIndex((x) => x.id === l.id);
          const done = Boolean(state.lessons[l.id]?.completedAt);
          const unlocked = isLessonUnlocked(outline, state, l.id, learningMode);
          const status: Status = done ? "done" : !unlocked ? "locked" : next?.id === l.id ? "current" : "open";
          const started = Boolean(state.lessonSteps?.[l.id]?.at) || Boolean(state.lessons[l.id]?.visitedAt);
          rows.push({ type: "lesson", lesson: l, module: m, number: `${world.number}.${k}`, status, started, prevTitle: i > 0 ? ordered[i - 1].title : undefined });
        }
        const cp = state.checkpoints[String(m.number)];
        const allDone = m.lessons.every((l) => state.lessons[l.id]?.completedAt);
        rows.push({ type: "checkpoint", module: m, status: cp?.passedAt ? "done" : allDone || learningMode === "free" ? "open" : "locked", best: cp?.best });
      }
      if (world.id === "r-pro" && outline.projects.length) {
        rows.push({ type: "projects" });
        for (const p of outline.projects) {
          const ps = state.projects[p.id];
          rows.push({ type: "project", project: p, done: p.stepIds.filter((s) => ps?.steps[s]?.passedAt).length, total: p.stepIds.length });
        }
      }
      const done = lessons.filter((l) => state.lessons[l.id]?.completedAt).length;
      const firstOpen = lessons.find((l) => !state.lessons[l.id]?.completedAt);
      return {
        world,
        modules,
        lessons,
        done,
        pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0,
        rows,
        target: firstOpen ?? lessons[0],
        locked: lessons.length > 0 && !isLessonUnlocked(outline, state, lessons[0].id, learningMode),
        minutes: lessons.reduce((a, l) => a + l.minutes, 0),
        challenges: modules.reduce((a, m) => a + m.exercises.length, 0),
      };
    });
    return { data: result, next };
  }, [outline, state, learningMode]);
  return { ...data, state };
}

/* ------------------------------------------------------------------ */
/* Summary + world chips                                               */
/* ------------------------------------------------------------------ */

/** Progress summary shown in the map hero: overall ring, XP and the next lesson. */
export function MapSummary() {
  const { data, next } = useWorldData();
  const game = useGame();
  const done = data.reduce((a, w) => a + w.done, 0);
  const total = data.reduce((a, w) => a + w.lessons.length, 0);
  const nextWorld = next ? data.find((w) => w.lessons.some((l) => l.id === next.id)) : undefined;
  return (
    <div className="flex w-full flex-col gap-4 rounded-3xl border-2 border-border bg-card/90 p-4 shadow-[var(--shadow-card)] backdrop-blur sm:flex-row sm:items-center lg:w-auto lg:max-w-xl">
      <div className="flex items-center gap-4">
        <ProgressRing value={total ? (done / total) * 100 : 0} size={84} stroke={10} color="var(--mint)" label={`Course progress: ${done} of ${total} lessons`}>
          <span className="text-base">{total ? Math.round((done / total) * 100) : 0}%</span>
        </ProgressRing>
        <dl className="grid grid-cols-2 gap-x-5 gap-y-1 text-sm">
          <div>
            <dt className="text-xs font-bold text-muted-foreground">Lessons</dt>
            <dd className="font-display text-lg font-semibold">
              {done}/{total}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-muted-foreground">Level</dt>
            <dd className="font-display text-lg font-semibold">{game.level.level}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-muted-foreground">XP</dt>
            <dd className="flex items-center gap-1 font-display text-lg font-semibold">
              <Zap className="size-4 fill-sun text-sun" />
              {game.xp.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-muted-foreground">Streak</dt>
            <dd className="font-display text-lg font-semibold">
              {game.streak} day{game.streak === 1 ? "" : "s"}
            </dd>
          </div>
        </dl>
      </div>
      <div className="min-w-0 flex-1 sm:border-l-2 sm:border-border sm:pl-4">
        {next ? (
          <>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{done ? "Up next" : "Start here"}</p>
            <p className="truncate font-display text-lg font-semibold">{next.title}</p>
            {nextWorld && <p className="text-xs font-bold" style={{ color: nextWorld.world.color.main }}>World {nextWorld.world.number} · {nextWorld.world.name}</p>}
            <Button asChild size="md" variant="success" className="mt-2 w-full">
              <Link href={`/learn/${next.id}`}>
                <Play className="fill-current" /> {done ? "Continue" : "Start learning"}
              </Link>
            </Button>
          </>
        ) : (
          <>
            <p className="font-display text-lg font-semibold">Every lesson complete! 🎉</p>
            <p className="text-sm font-semibold text-muted-foreground">Revisit any world, or take on a project.</p>
            <Button asChild size="md" variant="sun" className="mt-2 w-full">
              <Link href="/projects">
                <Trophy /> Projects
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

/** PhET-style row of world cards that jump to each world on the map. */
export function WorldChips() {
  const { data } = useWorldData();
  return (
    <nav aria-label="Worlds" className="no-scrollbar -mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 pt-1">
      {data.map(({ world, done, lessons, pct, locked }) => (
        <a
          key={world.id}
          href={`#world-${world.id}`}
          className="lift group w-40 shrink-0 snap-start overflow-hidden rounded-2xl border-2 border-border bg-card shadow-[var(--shadow-card)] sm:w-44 xl:w-auto xl:min-w-0 xl:flex-1"
        >
          <div className="relative" style={{ background: world.color.soft }}>
            <TopicArt kind={world.art} bg="transparent" className={cn("h-20 w-full", locked && "opacity-60 grayscale-[40%]")} />
            <span className="absolute left-2 top-2 grid size-7 place-items-center rounded-lg font-display text-sm font-bold text-white" style={{ background: world.color.main }}>
              {world.number}
            </span>
            {pct === 100 && (
              <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-card text-success" aria-label="Completed">
                <Crown className="size-4 fill-sun text-sun" />
              </span>
            )}
          </div>
          <div className="p-2.5">
            <p className="truncate font-display text-sm font-semibold">{world.name}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <ProgressBar value={pct} size="sm" color={world.color.main} label={`${world.name}: ${done} of ${lessons.length} lessons`} />
              <span className="shrink-0 text-[11px] font-bold text-muted-foreground">
                {done}/{lessons.length}
              </span>
            </div>
          </div>
        </a>
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* The map                                                             */
/* ------------------------------------------------------------------ */

export function WorldMap() {
  const { data, state } = useWorldData();
  return (
    <div className="space-y-14">
      {data.map((w, i) => (
        <WorldSection key={w.world.id} data={w} state={state} prev={i > 0 ? data[i - 1].world : undefined} />
      ))}
    </div>
  );
}

/** World colour variables – popovers render in a portal, so they need them again. */
const WorldVars = createContext<React.CSSProperties>({});

function worldVars(world: World) {
  return { ["--world" as string]: world.color.main, ["--world-soft" as string]: world.color.soft, ["--world-shadow" as string]: world.color.shadow } as React.CSSProperties;
}

function WorldSection({ data, state, prev }: { data: WorldData; state: ProgressState; prev?: World }) {
  const { world, pct, done, lessons, target, locked } = data;
  const vars = useMemo(() => worldVars(world), [world]);
  const targetStarted = target && (state.lessons[target.id]?.visitedAt || state.lessonSteps?.[target.id]?.at);
  const action = pct === 100 ? "Review world" : done > 0 || targetStarted ? "Continue" : locked ? "Peek inside" : "Start world";
  return (
    <section id={`world-${world.id}`} aria-labelledby={`world-${world.id}-title`} className="scroll-mt-24" style={vars}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-10">
        {/* World card */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]">
            <div className="relative" style={{ background: `linear-gradient(160deg, var(--world-soft), var(--card))` }}>
              <TopicArt kind={world.art} bg="transparent" className={cn("mx-auto h-40 w-full max-w-sm", locked && "opacity-70")} label={`${world.name} emblem`} />
              <span className="absolute left-4 top-4 rounded-full px-3 py-1 font-display text-xs font-semibold uppercase tracking-wider text-white" style={{ background: "var(--world)" }}>
                World {world.number}
              </span>
              {pct === 100 ? (
                <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-card px-3 py-1 text-xs font-bold text-success">
                  <Crown className="size-3.5 fill-sun text-sun" /> Complete
                </span>
              ) : locked ? (
                <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-card px-3 py-1 text-xs font-bold text-muted-foreground">
                  <Lock className="size-3.5" /> Locked
                </span>
              ) : null}
            </div>
            <div className="p-5">
              <h2 id={`world-${world.id}-title`} className="font-display text-2xl font-bold">
                {world.name}
              </h2>
              <p className="font-display text-sm font-semibold" style={{ color: "var(--world)" }}>
                {world.tagline}
              </p>
              <p className="mt-2 text-[15px] font-semibold text-muted-foreground">{world.description}</p>
              <div className="mt-4 flex items-center gap-3">
                <ProgressBar value={pct} color="var(--world)" label={`${world.name} progress`} />
                <span className="shrink-0 font-display text-sm font-semibold">
                  {done}/{lessons.length}
                </span>
              </div>
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="size-3.5" /> {lessons.length} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Target className="size-3.5" /> {data.challenges} challenges
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" /> ~{Math.round(data.minutes / 60) || 1} h
                </span>
              </p>
              <div className="mt-4 rounded-2xl bg-surface-2/60 p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">By the end you can</p>
                <ul className="mt-1.5 space-y-1">
                  {world.goals.map((g) => (
                    <li key={g} className="flex gap-2 text-sm font-semibold">
                      <Star className="mt-0.5 size-4 shrink-0" style={{ color: "var(--world)", fill: "var(--world)" }} /> {g}
                    </li>
                  ))}
                </ul>
              </div>
              {locked && prev && <p className="mt-3 text-sm font-semibold text-muted-foreground">Finish World {prev.number} · {prev.name} to unlock the path – or peek inside any lesson.</p>}
              {target && (
                <Button asChild size="lg" className={cn("mt-4 w-full", !(pct === 100 || locked) && "text-white")} variant={pct === 100 || locked ? "outline" : "primary"} style={pct === 100 || locked ? undefined : { background: "var(--world)", ["--press-shadow" as string]: "var(--world-shadow)" }}>
                  <Link href={`/learn/${target.id}`}>
                    {pct === 100 ? <RotateCcw /> : <Play className="fill-current" />} {action}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Lesson path */}
        <WorldVars.Provider value={vars}>
          <WorldPath data={data} />
        </WorldVars.Provider>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Zig-zag path                                                         */
/* ------------------------------------------------------------------ */

const ROW_NODE = 112;
const ROW_HEAD = 72;
/** Horizontal swing of the path, as a fraction of the amplitude. */
const SWING = [-0.35, -0.9, -0.9, -0.35, 0.35, 0.9, 0.9, 0.35];

function WorldPath({ data }: { data: WorldData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const w = width || 340;
  const amp = Math.min(130, w * 0.22);
  const layout: { row: Row; top: number; h: number; x: number; k: number; isNode: boolean }[] = [];
  for (let i = 0, y = 0, n = 0; i < data.rows.length; i++) {
    const row = data.rows[i];
    const isNode = row.type === "lesson" || row.type === "checkpoint" || row.type === "project";
    const h = isNode ? ROW_NODE : ROW_HEAD;
    const k = isNode ? SWING[n++ % SWING.length] : 0;
    layout.push({ row, top: y, h, x: w / 2 + k * amp, k, isNode });
    y += h;
  }
  const last = layout[layout.length - 1];
  const height = last ? last.top + last.h : 0;
  const nodes = layout.filter((l) => l.isNode);
  const reached = (l: (typeof layout)[number]) =>
    l.row.type === "lesson" ? l.row.status === "done" || l.row.status === "current" : l.row.type === "checkpoint" ? l.row.status === "done" : l.row.type === "project" ? l.row.done > 0 : false;
  let d = "";
  let dDone = "";
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    const ay = a.top + a.h / 2;
    if (i === 0) {
      d = `M ${a.x} ${ay}`;
      continue;
    }
    const b = nodes[i - 1];
    const by = b.top + b.h / 2;
    const seg = ` C ${b.x} ${by + (ay - by) / 2}, ${a.x} ${ay - (ay - by) / 2}, ${a.x} ${ay}`;
    d += seg;
    if (reached(a) && reached(b)) dDone += ` M ${b.x} ${by}` + seg;
  }

  return (
    <div ref={ref} className="relative" style={{ height }}>
      {width > 0 && (
        <svg className="pointer-events-none absolute inset-0" width={w} height={height} aria-hidden>
          <path d={d} fill="none" stroke="var(--border-strong)" strokeWidth={7} strokeLinecap="round" strokeDasharray="0.1 16" />
          {dDone && <path d={dDone} fill="none" stroke="var(--world)" strokeWidth={9} strokeLinecap="round" opacity={0.85} />}
        </svg>
      )}
      <ol className="contents">
        {layout.map(({ row, top, h, x, k }, i) => (
          <li key={i} className="absolute inset-x-0" style={{ top, height: h }}>
            {row.type === "module" ? (
              <ModuleHeader module={row.module} />
            ) : row.type === "projects" ? (
              <div className="flex h-full items-center justify-center">
                <span className="relative z-10 flex items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-1.5 font-display text-sm font-semibold shadow-[var(--shadow-card)]">
                  <FolderKanban className="size-4" style={{ color: "var(--world)" }} /> Real projects
                </span>
              </div>
            ) : (
              <NodeRow row={row} x={x} side={k < 0 ? "right" : "left"} ready={width > 0} />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ModuleHeader({ module: m }: { module: OutlineModule }) {
  return (
    <div className="flex h-full items-center justify-center px-2">
      <Link
        href={`/learn/module/${m.id}`}
        className="relative z-10 flex max-w-full items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-1.5 font-display text-sm font-semibold shadow-[var(--shadow-card)] hover:border-[var(--world)]"
      >
        <span className="grid size-6 shrink-0 place-items-center rounded-full text-xs text-white" style={{ background: "var(--world)" }}>
          {m.number}
        </span>
        <span className="truncate">Module {m.number}: {m.title}</span>
      </Link>
    </div>
  );
}

function NodeRow({ row, x, side, ready }: { row: Extract<Row, { type: "lesson" | "checkpoint" | "project" }>; x: number; side: "left" | "right"; ready: boolean }) {
  const pos: React.CSSProperties = ready ? { left: x } : { left: "50%" };
  const labelPos: React.CSSProperties = ready ? (side === "right" ? { left: x + 52 } : { right: `calc(100% - ${x - 52}px)` }) : { left: "calc(50% + 52px)" };
  const current = row.type === "lesson" && row.status === "current";
  return (
    <div className="h-full">
      <div className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" style={pos}>
        {current && (
          <span className="pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-1/2 animate-bob whitespace-nowrap rounded-xl border-2 border-border bg-card px-3 py-1 font-display text-xs font-bold uppercase tracking-wider shadow-[var(--shadow-card)]" style={{ color: "var(--world)" }}>
            {row.started ? "Continue" : "Start"}
            <span className="absolute -bottom-[7px] left-1/2 size-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-border bg-card" />
          </span>
        )}
        <NodePopover row={row} />
      </div>
      <div className={cn("absolute top-1/2 hidden max-w-[min(280px,45%)] -translate-y-1/2 min-[380px]:block", side === "left" && "text-right")} style={labelPos}>
        <NodeLabel row={row} align={side === "left" ? "right" : "left"} />
      </div>
    </div>
  );
}

function NodeLabel({ row, align }: { row: Extract<Row, { type: "lesson" | "checkpoint" | "project" }>; align: "left" | "right" }) {
  if (row.type === "lesson") {
    const art = LESSON_ART[row.lesson.id];
    return (
      <div className={cn("flex items-center gap-2.5", align === "right" && "flex-row-reverse")}>
        {art && (
          <span className={cn("hidden h-12 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-border md:block", row.status === "locked" && "opacity-50")} style={{ background: "var(--world-soft)" }}>
            <TopicArt kind={art} bg="transparent" className="h-full w-full" />
          </span>
        )}
        <span className="min-w-0">
          <span className="block text-[11px] font-bold uppercase tracking-wider" style={{ color: row.status === "locked" ? "var(--muted-foreground)" : "var(--world)" }}>
            Lesson {row.number}
          </span>
          <span className={cn("line-clamp-2 font-display text-[15px] font-semibold leading-tight", row.status === "locked" && "text-muted-foreground")}>{row.lesson.title}</span>
        </span>
      </div>
    );
  }
  if (row.type === "checkpoint")
    return (
      <span className="block">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-warning">Checkpoint</span>
        <span className="line-clamp-2 font-display text-[15px] font-semibold leading-tight">Module {row.module.number} quiz</span>
      </span>
    );
  return (
    <span className="block">
      <span className="block text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--world)" }}>
        Project · {row.done}/{row.total} steps
      </span>
      <span className="line-clamp-2 font-display text-[15px] font-semibold leading-tight">{row.project.title}</span>
    </span>
  );
}

function NodeButton({ row, ...rest }: { row: Extract<Row, { type: "lesson" | "checkpoint" | "project" }> } & React.ComponentProps<"button">) {
  if (row.type === "lesson") {
    const { status } = row;
    const label = `Lesson ${row.number}: ${row.lesson.title} – ${status === "done" ? "completed" : status === "locked" ? "locked" : status === "current" ? "up next" : "not started"}`;
    return (
      <button
        {...rest}
        aria-label={label}
        className={cn(
          "press relative grid cursor-pointer place-items-center rounded-full transition-transform [&_svg]:size-7",
          status === "current" ? "size-[78px] animate-pulse-ring [--node-color:var(--world)]" : "size-[66px]",
          status === "locked" ? "bg-surface-3 text-muted-foreground [--press-shadow:var(--border-strong)]" : "text-white",
          status === "open" && "border-4 border-[var(--world)] bg-card !text-[var(--world)]",
        )}
        style={status === "done" || status === "current" ? { background: "var(--world)", ["--press-shadow" as string]: "var(--world-shadow)" } : status === "open" ? { ["--press-shadow" as string]: "var(--world-shadow)" } : undefined}
      >
        {status === "done" ? <Check strokeWidth={3.5} /> : status === "locked" ? <Lock /> : status === "current" ? <Play className="fill-current" /> : <BookOpen />}
        {status === "done" && (
          <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-card" aria-hidden>
            <Star className="size-4 fill-sun text-sun" />
          </span>
        )}
      </button>
    );
  }
  if (row.type === "checkpoint") {
    return (
      <button
        {...rest}
        aria-label={`Module ${row.module.number} checkpoint quiz – ${row.status === "done" ? "passed" : row.status === "locked" ? "locked" : "ready"}`}
        className={cn(
          "press grid size-[70px] cursor-pointer place-items-center rounded-[22px] [&_svg]:size-8",
          row.status === "done" ? "bg-sun text-[#3b2600] [--press-shadow:var(--sun-shadow)]" : row.status === "open" ? "border-4 border-sun bg-card text-warning [--press-shadow:var(--sun-shadow)]" : "bg-surface-3 text-muted-foreground [--press-shadow:var(--border-strong)]",
        )}
      >
        {row.status === "done" ? <Trophy /> : <Flag />}
      </button>
    );
  }
  const complete = row.done === row.total && row.total > 0;
  return (
    <button
      {...rest}
      aria-label={`Project: ${row.project.title} – ${row.done} of ${row.total} steps done`}
      className={cn("press grid size-[66px] cursor-pointer place-items-center rounded-2xl [&_svg]:size-7", complete ? "text-white" : "border-4 border-[var(--world)] bg-card text-warning")}
      style={complete ? { background: "var(--world)", ["--press-shadow" as string]: "var(--world-shadow)" } : { ["--press-shadow" as string]: "var(--world-shadow)" }}
    >
      {complete ? <Crown /> : <FolderKanban />}
    </button>
  );
}

function NodePopover({ row }: { row: Extract<Row, { type: "lesson" | "checkpoint" | "project" }> }) {
  const vars = useContext(WorldVars);
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <NodeButton row={row} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side="bottom" sideOffset={10} collisionPadding={16} className="z-50 w-[min(92vw,320px)] animate-pop-in rounded-3xl border-2 border-border bg-card shadow-2xl outline-none" style={vars}>
          <PopoverBody row={row} />
          <Popover.Arrow className="fill-[var(--border)]" width={18} height={9} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function PopoverBody({ row }: { row: Extract<Row, { type: "lesson" | "checkpoint" | "project" }> }) {
  const outline = useOutline();
  if (row.type === "lesson") {
    const { lesson, status } = row;
    const exercises = outline.modules.flatMap((m) => m.exercises).filter((e) => lesson.exerciseIds.includes(e.id));
    const xp = XP.lesson + exercises.reduce((a, e) => a + exerciseXp(e.difficulty), 0);
    const art = LESSON_ART[lesson.id];
    return (
      <div>
        <div className="relative overflow-hidden rounded-t-[22px]" style={{ background: "var(--world-soft)" }}>
          {art && <TopicArt kind={art} bg="transparent" className={cn("mx-auto h-24 w-full", status === "locked" && "opacity-60")} />}
          <span className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white" style={{ background: status === "locked" ? "var(--muted-foreground)" : "var(--world)" }}>
            Lesson {row.number}
          </span>
        </div>
        <div className="p-4">
          <p className="font-display text-lg font-semibold leading-snug">{lesson.title}</p>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">{lesson.summary}</p>
          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" /> {lesson.minutes} min
            </span>
            <span className="flex items-center gap-1">
              <Target className="size-3.5" /> {exercises.length} challenge{exercises.length === 1 ? "" : "s"}
            </span>
            <span className="flex items-center gap-1 text-warning">
              <Zap className="size-3.5 fill-current" /> up to {xp} XP
            </span>
          </p>
          {status === "done" && (
            <p className="mt-3 flex items-center gap-1.5 text-sm font-bold text-success">
              <CheckCircle2 className="size-4" /> Completed – review it anytime
            </p>
          )}
          {status === "locked" ? (
            <div className="mt-3">
              <p className="flex items-start gap-1.5 text-sm font-semibold text-muted-foreground">
                <Lock className="mt-0.5 size-4 shrink-0" /> {row.prevTitle ? <>Finish “{row.prevTitle}” to unlock this lesson.</> : "Finish the previous lesson to unlock this one."}
              </p>
              <Button asChild variant="outline" className="mt-3 w-full">
                <Link href={`/learn/${lesson.id}`} onClick={() => progress.unlockLesson(lesson.id)}>
                  Open anyway <ArrowRight />
                </Link>
              </Button>
            </div>
          ) : (
            <Button asChild className={cn("mt-3 w-full", status !== "done" && "text-white")} style={status === "done" ? undefined : { background: "var(--world)", ["--press-shadow" as string]: "var(--world-shadow)" }} variant={status === "done" ? "outline" : "primary"}>
              <Link href={`/learn/${lesson.id}`}>
                {status === "done" ? (
                  <>
                    <RotateCcw /> Review lesson
                  </>
                ) : row.started ? (
                  <>
                    <Play className="fill-current" /> Continue lesson
                  </>
                ) : (
                  <>
                    <Play className="fill-current" /> Start lesson
                  </>
                )}
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }
  if (row.type === "checkpoint") {
    return (
      <div className="p-4">
        <p className="flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-wider text-warning">
          <Flag className="size-4" /> Module checkpoint
        </p>
        <p className="mt-1 font-display text-lg font-semibold leading-snug">Module {row.module.number}: {row.module.title}</p>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">
          A {row.module.checkpointSize}-question quiz that checks everything from this module. Pass it to earn {XP.checkpoint} XP.
        </p>
        {row.best !== undefined && <p className="mt-2 text-sm font-bold">Best score: {Math.round(row.best * 100)}%</p>}
        {row.status === "locked" && <p className="mt-2 text-sm font-semibold text-muted-foreground">Tip: finish the module&apos;s lessons first – you can still try it now.</p>}
        <Button asChild variant="sun" className="mt-3 w-full">
          <Link href={`/learn/module/${row.module.id}`}>
            {row.status === "done" ? <Trophy /> : <Flag />} {row.status === "done" ? "Open module & checkpoint" : "Go to the checkpoint"}
          </Link>
        </Button>
      </div>
    );
  }
  const art = PROJECT_ART[row.project.id];
  return (
    <div>
      {art && (
        <div className="overflow-hidden rounded-t-[22px]" style={{ background: "var(--world-soft)" }}>
          <TopicArt kind={art} bg="transparent" className="mx-auto h-24 w-full" />
        </div>
      )}
      <div className="p-4">
        <p className="font-display text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--world)" }}>
          Project · {row.project.level}
        </p>
        <p className="mt-1 font-display text-lg font-semibold leading-snug">{row.project.title}</p>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">
          {row.done}/{row.total} steps done · {XP.projectStep} XP per step, +{XP.projectComplete} XP when you finish.
        </p>
        <Button asChild className="mt-3 w-full text-white" style={{ background: "var(--world)", ["--press-shadow" as string]: "var(--world-shadow)" }}>
          <Link href={`/projects/${row.project.id}`}>
            <FolderKanban /> {row.done ? "Continue project" : "Open project"}
          </Link>
        </Button>
      </div>
    </div>
  );
}

/** A friendly "you are here" helper that scrolls to the next lesson node. */
export function JumpToNext() {
  const { next, data } = useWorldData();
  if (!next) return null;
  const w = data.find((d) => d.lessons.some((l) => l.id === next.id));
  if (!w) return null;
  return (
    <Button asChild variant="outline" size="sm">
      <a href={`#world-${w.world.id}`}>
        <MapIcon /> Jump to where I am
      </a>
    </Button>
  );
}

