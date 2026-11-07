import Link from "next/link";
import { Clock, Crown, Database, ListChecks, Zap } from "lucide-react";
import type { Project } from "@/content/types";
import { getDataset } from "@/content/datasets";
import { TopicArt } from "@/components/brand/topic-art";
import { Hexy } from "@/components/brand/mascot";
import { FloatingHexes } from "@/components/brand/decor";
import { PROJECT_ART } from "@/lib/game/worlds";
import { cn } from "@/lib/utils";
import { LevelBadge, levelColor, projectXp } from "./project-meta";
import { ProjectCardProgress } from "./project-progress";

function Skills({ skills, max = 3 }: { skills: string[]; max?: number }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Skills">
      {skills.slice(0, max).map((s) => (
        <li key={s} className="max-w-full truncate rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
          {s}
        </li>
      ))}
      {skills.length > max && <li className="rounded-full px-1.5 py-0.5 text-xs font-bold text-muted-foreground">+{skills.length - max} more</li>}
    </ul>
  );
}

function Facts({ p }: { p: Project }) {
  return (
    <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-muted-foreground [&_svg]:size-3.5">
      <span className="inline-flex items-center gap-1">
        <Clock aria-hidden /> {p.minutes} min
      </span>
      <span className="inline-flex items-center gap-1">
        <ListChecks aria-hidden /> {p.steps.length} steps
      </span>
      <span className="inline-flex min-w-0 items-center gap-1">
        <Database aria-hidden /> {p.datasets.map((d) => getDataset(d)?.name ?? d).join(", ")}
      </span>
    </p>
  );
}

function XpPill({ xp, className }: { xp: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 font-display text-xs font-semibold text-warning shadow-[0_2px_0_var(--border)]", className)}>
      <Zap className="size-3.5 fill-current" aria-hidden /> {xp} XP
    </span>
  );
}

/** PhET-style project card: illustration, level, facts, skills and live progress. */
export function ProjectCard({ p }: { p: Project }) {
  const c = levelColor(p.level);
  return (
    <Link
      href={`/projects/${p.id}`}
      className="group lift flex h-full flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)] hover:border-[var(--lc)]"
      style={{ ["--lc" as string]: c.main }}
    >
      <div className="relative overflow-hidden border-b-2 border-border" style={{ background: c.soft }}>
        <div className="transition-transform duration-300 group-hover:scale-[1.05] [&_svg]:block">
          <TopicArt kind={PROJECT_ART[p.id] ?? "table"} bg={c.soft} />
        </div>
        <LevelBadge level={p.level} className="absolute left-3 top-3" />
        <XpPill xp={projectXp(p.steps.length)} className="absolute right-3 top-3" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Facts p={p} />
        <h3 className="mt-2 font-display text-xl font-semibold leading-snug group-hover:text-primary">{p.title}</h3>
        <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{p.summary}</p>
        <div className="mt-3">
          <Skills skills={p.skills} />
        </div>
        <div className="mt-auto pt-5">
          <ProjectCardProgress id={p.id} stepIds={p.steps.map((s) => s.id)} color={c.main} />
        </div>
      </div>
    </Link>
  );
}

/** The capstone gets a wide, golden "boss level" card. */
export function BossProjectCard({ p }: { p: Project }) {
  const c = levelColor(p.level);
  return (
    <Link
      href={`/projects/${p.id}`}
      className="group lift relative flex flex-col overflow-hidden rounded-3xl border-2 border-sun bg-card shadow-[0_6px_0_var(--sun-shadow),var(--shadow-card)] md:flex-row"
    >
      <div className="relative overflow-hidden border-b-2 border-sun md:w-[46%] md:shrink-0 md:border-b-0 md:border-r-2" style={{ background: "linear-gradient(135deg, var(--sun-soft), var(--tangerine-soft))" }}>
        <FloatingHexes count={6} />
        <div className="relative flex h-full items-center transition-transform duration-300 group-hover:scale-[1.04] [&_svg]:block">
          <TopicArt kind={PROJECT_ART[p.id] ?? "report"} bg="transparent" />
        </div>
        <span className="absolute left-0 top-5 inline-flex items-center gap-1.5 rounded-r-full bg-sun py-1.5 pl-4 pr-4 font-display text-sm font-bold uppercase tracking-widest text-[#3b2600] shadow-[0_3px_0_var(--sun-shadow)]">
          <Crown className="size-4 fill-current" aria-hidden /> Boss level
        </span>
      </div>
      <div className="relative flex flex-1 flex-col p-6 sm:p-7" style={{ background: "linear-gradient(160deg, var(--sun-soft) 0%, var(--card) 55%)" }}>
        <Hexy mood="cool" size={74} className="absolute -top-2 right-4 hidden opacity-95 sm:block" />
        <div className="flex flex-wrap items-center gap-2 sm:pr-20">
          <LevelBadge level={p.level} />
          <XpPill xp={projectXp(p.steps.length)} />
        </div>
        <h3 className="mt-3 font-display text-2xl font-bold leading-tight group-hover:text-primary sm:text-3xl">{p.title}</h3>
        <p className="mt-2 text-[15px] font-semibold text-muted-foreground">{p.summary}</p>
        <div className="mt-3">
          <Facts p={p} />
        </div>
        <div className="mt-3">
          <Skills skills={p.skills} max={5} />
        </div>
        <div className="mt-auto pt-5">
          <ProjectCardProgress id={p.id} stepIds={p.steps.map((s) => s.id)} color={c.main} />
        </div>
      </div>
    </Link>
  );
}
