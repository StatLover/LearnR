"use client";

import { ArrowRight, Check, CheckCircle2, Flag, FolderKanban, Play, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { useProgress, type ProgressState } from "@/lib/store/progress";
import { XP } from "@/lib/game/xp";
import { cn } from "@/lib/utils";
import { projectXp } from "./project-meta";

export interface ProjectLite {
  id: string;
  title: string;
  steps: { id: string; title: string }[];
}

/** Progress of one project derived from the learner's saved state. */
export function projectStatus(s: ProgressState, id: string, stepIds: string[]) {
  const steps = s.projects[id]?.steps ?? {};
  const done = stepIds.filter((st) => steps[st]?.passedAt).length;
  const complete = stepIds.length > 0 && done === stepIds.length;
  const next = stepIds.find((st) => !steps[st]?.passedAt);
  return { done, total: stepIds.length, complete, next, started: Boolean(s.projects[id]), earned: done * XP.projectStep + (complete ? XP.projectComplete : 0) };
}

/** Progress strip at the bottom of a project card. */
export function ProjectCardProgress({ id, stepIds, color }: { id: string; stepIds: string[]; color: string }) {
  const s = useProgress();
  const st = projectStatus(s, id, stepIds);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2 text-xs font-bold">
        <span className={cn(st.complete ? "text-success" : "text-muted-foreground")}>
          {st.complete ? (
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="size-3.5" aria-hidden /> Quest complete
            </span>
          ) : st.done > 0 ? (
            `${st.done} of ${st.total} steps passed`
          ) : (
            `${st.total} steps · not started`
          )}
        </span>
        <span className="inline-flex items-center gap-1 text-warning">
          <Zap className="size-3.5 fill-current" aria-hidden />
          {st.complete ? `${st.earned} XP earned` : `up to ${projectXp(st.total)} XP`}
        </span>
      </div>
      <ProgressBar value={(st.done / Math.max(1, st.total)) * 100} color={st.complete ? "var(--mint)" : color} size="sm" label={`${st.done} of ${st.total} steps passed`} />
    </div>
  );
}

/** Totals across every project (for the projects page). */
export function ProjectsOverview({ projects }: { projects: { id: string; stepIds: string[] }[] }) {
  const s = useProgress();
  const all = projects.map((p) => projectStatus(s, p.id, p.stepIds));
  const complete = all.filter((p) => p.complete).length;
  const steps = all.reduce((a, p) => a + p.done, 0);
  const totalSteps = all.reduce((a, p) => a + p.total, 0);
  const xp = all.reduce((a, p) => a + p.earned, 0);
  const xpAll = projects.reduce((a, p) => a + projectXp(p.stepIds.length), 0);
  const tiles = [
    { icon: <Trophy />, tile: "bg-sun text-[#3b2600] [--edge:var(--sun-shadow)]", value: `${complete}/${projects.length}`, label: "Projects completed" },
    { icon: <Flag />, tile: "bg-mint text-white [--edge:var(--mint-shadow)]", value: `${steps}/${totalSteps}`, label: "Steps passed" },
    { icon: <Zap className="fill-current" />, tile: "bg-tangerine text-white [--edge:var(--tangerine-shadow)]", value: xp.toLocaleString(), label: `of ${xpAll.toLocaleString()} project XP` },
  ];
  return (
    <ul className="grid gap-3 sm:grid-cols-3" aria-label="Your project progress">
      {tiles.map((t) => (
        <li key={t.label} className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3 shadow-[var(--shadow-card)]">
          <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl shadow-[0_3px_0_var(--edge)] [&_svg]:size-5", t.tile)} aria-hidden>
            {t.icon}
          </span>
          <span>
            <span className="block font-display text-xl font-bold leading-tight tabular-nums">{t.value}</span>
            <span className="block text-xs font-bold text-muted-foreground">{t.label}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Start / Continue / Review button for the project hero. */
export function ProjectStartButton({ project }: { project: ProjectLite }) {
  const s = useProgress();
  const st = projectStatus(
    s,
    project.id,
    project.steps.map((x) => x.id),
  );
  const nextIndex = project.steps.findIndex((x) => x.id === st.next);
  if (st.complete)
    return (
      <Button asChild variant="success" size="lg">
        <a href="#wrap-up">
          <Trophy /> Quest complete – see the wrap-up
        </a>
      </Button>
    );
  return (
    <Button asChild size="lg">
      <a href={`#step-${st.next}`}>
        {st.done === 0 ? <Play /> : <ArrowRight />} {st.done === 0 ? "Start the quest" : `Continue with step ${nextIndex + 1}`}
      </a>
    </Button>
  );
}

function MiniNode({ state, n }: { state: "done" | "current" | "todo"; n: number }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-full font-display text-xs font-bold",
        state === "done" && "bg-mint text-white",
        state === "current" && "border-2 border-primary bg-primary-soft text-primary",
        state === "todo" && "border-2 border-border-strong text-muted-foreground",
      )}
    >
      {state === "done" ? <Check className="size-3.5" strokeWidth={3.5} /> : n}
    </span>
  );
}

/** Sticky sidebar: progress ring, XP and the list of steps. */
export function ProjectSidebar({ project, color }: { project: ProjectLite; color: string }) {
  const s = useProgress();
  const st = projectStatus(
    s,
    project.id,
    project.steps.map((x) => x.id),
  );
  const pct = (st.done / Math.max(1, st.total)) * 100;
  return (
    <div className="rounded-3xl border-2 border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-4">
        <ProgressRing value={pct} size={84} stroke={10} color={st.complete ? "var(--mint)" : color} label={`${st.done} of ${st.total} steps passed`}>
          {st.done}/{st.total}
        </ProgressRing>
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold leading-tight">{st.complete ? "Quest complete!" : "Quest progress"}</p>
          <p className="text-sm font-semibold text-muted-foreground">
            {st.done} of {st.total} steps passed
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-sm font-bold text-warning">
            <Zap className="size-4 fill-current" aria-hidden /> {st.earned} / {projectXp(st.total)} XP
          </p>
        </div>
      </div>
      <nav aria-label="Project steps" className="mt-4">
        <ol className="space-y-0.5">
          {project.steps.map((x, i) => {
            const done = Boolean(s.projects[project.id]?.steps[x.id]?.passedAt);
            const current = x.id === st.next;
            return (
              <li key={x.id}>
                <a
                  href={`#step-${x.id}`}
                  aria-current={current ? "step" : undefined}
                  className={cn("flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm font-bold hover:bg-surface-2", current && "bg-primary-soft text-primary", done && "text-muted-foreground")}
                >
                  <MiniNode state={done ? "done" : current ? "current" : "todo"} n={i + 1} />
                  <span className="min-w-0 flex-1 leading-snug">{x.title}</span>
                  <span className="sr-only">{done ? "(passed)" : current ? "(next step)" : ""}</span>
                </a>
              </li>
            );
          })}
          <li>
            <a href="#wrap-up" className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm font-bold hover:bg-surface-2">
              <span aria-hidden className={cn("grid size-6 shrink-0 place-items-center rounded-full", st.complete ? "bg-sun text-[#3b2600]" : "border-2 border-dashed border-border-strong text-muted-foreground")}>
                <Trophy className="size-3.5" />
              </span>
              Wrap-up {st.complete ? "" : `· +${XP.projectComplete} XP bonus`}
            </a>
          </li>
        </ol>
      </nav>
    </div>
  );
}

/** Compact progress for phones (the full sidebar sits at the bottom there). */
export function ProjectMiniProgress({ project, color }: { project: ProjectLite; color: string }) {
  const s = useProgress();
  const st = projectStatus(
    s,
    project.id,
    project.steps.map((x) => x.id),
  );
  const nextIndex = project.steps.findIndex((x) => x.id === st.next);
  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3 shadow-[var(--shadow-card)] lg:hidden">
      <FolderKanban className="size-5 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">
          {st.done} of {st.total} steps passed
        </p>
        <ProgressBar value={(st.done / Math.max(1, st.total)) * 100} color={st.complete ? "var(--mint)" : color} size="sm" className="mt-1" label="Project progress" />
      </div>
      {st.complete ? (
        <CheckCircle2 className="size-6 text-success" aria-label="Complete" />
      ) : st.done > 0 ? (
        <a href={`#step-${st.next}`} className="shrink-0 text-sm font-bold text-primary hover:underline">
          Step {nextIndex + 1} <ArrowRight className="inline size-4" aria-hidden />
        </a>
      ) : null}
    </div>
  );
}
