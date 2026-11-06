"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Lock, PlayCircle, Flag } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { courseCompletion, isLessonUnlocked, moduleCompletion, suggestedNextLesson, useProgress, type Outline, type OutlineModule } from "@/lib/store/progress";
import { useSettings } from "@/lib/store/settings";
import { cn } from "@/lib/utils";

export function ContinueCard({ outline }: { outline: Outline }) {
  const s = useProgress();
  const next = suggestedNextLesson(outline, s);
  const c = courseCompletion(outline, s);
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-5">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">Your progress</p>
        <p className="text-lg font-semibold">
          {c.done} of {c.total} lessons complete ({c.pct}%)
        </p>
        <ProgressBar value={c.pct} className="mt-2 max-w-md" label="Course progress" />
      </div>
      {next && (
        <Button asChild size="lg">
          <Link href={`/learn/${next.id}`}>
            <PlayCircle /> {c.done === 0 ? "Start learning" : "Continue learning"}
          </Link>
        </Button>
      )}
    </div>
  );
}

export function ModuleLessonList({ outline, module: m }: { outline: Outline; module: OutlineModule }) {
  const s = useProgress();
  const settings = useSettings();
  const mc = moduleCompletion(m, s);
  const cp = s.checkpoints[String(m.number)];
  return (
    <div>
      <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
        <ProgressBar value={mc.pct} className="h-1.5 max-w-40" label={`Module ${m.number} progress`} />
        {mc.done}/{mc.total} lessons
      </div>
      <ol className="space-y-1.5">
        {m.lessons.map((l, i) => {
          const done = s.lessons[l.id]?.completedAt;
          const unlocked = isLessonUnlocked(outline, s, l.id, settings.learningMode);
          return (
            <li key={l.id}>
              <Link href={`/learn/${l.id}`} className={cn("group flex items-start gap-3 rounded-lg border border-transparent p-2.5 hover:border-border hover:bg-surface", !unlocked && "opacity-75")}>
                {done ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-label="Completed" /> : unlocked ? <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground/60" aria-label="Not started" /> : <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-label="Locked" />}
                <span className="min-w-0 flex-1">
                  <span className="block font-medium group-hover:text-primary">
                    {m.number}.{i + 1} {l.title}
                  </span>
                  <span className="block text-sm text-muted-foreground">{l.summary}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{l.minutes} min</span>
              </Link>
            </li>
          );
        })}
        {m.checkpointSize > 0 && (
          <li>
            <Link href={`/learn/module/${m.id}#checkpoint`} className="flex items-center gap-3 rounded-lg border border-dashed border-border p-2.5 hover:bg-surface">
              {cp?.passedAt ? <CheckCircle2 className="size-5 text-success" /> : <Flag className="size-5 text-primary" />}
              <span className="flex-1 font-medium">Module checkpoint</span>
              <span className="text-xs text-muted-foreground">{cp ? `best ${Math.round(cp.best * 100)}%` : `${m.checkpointSize} questions`}</span>
            </Link>
          </li>
        )}
      </ol>
    </div>
  );
}

export function ModuleBadge({ module: m }: { module: OutlineModule }) {
  const s = useProgress();
  const c = moduleCompletion(m, s);
  if (!c.total) return null;
  return c.pct === 100 ? (
    <span className="flex items-center gap-1 text-xs font-medium text-success">
      <CheckCircle2 className="size-3.5" /> Complete
    </span>
  ) : c.done > 0 ? (
    <span className="text-xs font-medium text-accent">{c.pct}% done</span>
  ) : null;
}
