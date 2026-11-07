"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { useOutline } from "@/components/game/outline-context";
import { ProgressBar } from "@/components/ui/progress";
import { isLessonUnlocked, moduleCompletion, useProgress } from "@/lib/store/progress";
import { useSettings } from "@/lib/store/settings";
import { cn } from "@/lib/utils";
import { useMounted } from "./use-mounted";

/**
 * The lessons of one module with the learner's status (done / open / locked),
 * used on the module checkpoint page. Thumbnails are rendered on the server.
 */
export function ModuleLessons({ moduleNumber, color, thumbs }: { moduleNumber: number; color: string; thumbs: Record<string, ReactNode> }) {
  const outline = useOutline();
  const s = useProgress();
  const settings = useSettings();
  const mounted = useMounted();
  const m = outline.modules.find((x) => x.number === moduleNumber);
  if (!m) return null;
  const mc = moduleCompletion(m, s);
  const next = m.lessons.find((l) => !s.lessons[l.id]?.completedAt);
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <ProgressBar value={mc.pct} color={color} size="sm" className="flex-1" label={`Module ${m.number} lessons completed`} />
        <span className="shrink-0 text-xs font-bold text-muted-foreground">
          {mc.done}/{mc.total} lessons
        </span>
      </div>
      <ol className="space-y-2">
        {m.lessons.map((l, i) => {
          const done = Boolean(s.lessons[l.id]?.completedAt);
          // Lock state depends on saved progress and settings, which only exist in the browser.
          const unlocked = !mounted || isLessonUnlocked(outline, s, l.id, settings.learningMode);
          const isNext = mounted && next?.id === l.id && unlocked;
          return (
            <li key={l.id}>
              <Link
                href={`/learn/${l.id}`}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl border-2 bg-card p-2 pr-3 transition-colors hover:border-[var(--mc)]",
                  isNext ? "border-[var(--mc)]" : "border-border",
                  !unlocked && "opacity-70",
                )}
                style={{ ["--mc" as string]: color }}
              >
                <span className="relative w-16 shrink-0 overflow-hidden rounded-xl border-2 border-border [&_svg]:block">{thumbs[l.id]}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-muted-foreground">
                    Lesson {m.number}.{i + 1} · {l.minutes} min
                  </span>
                  <span className="block font-display font-semibold leading-snug group-hover:text-primary">{l.title}</span>
                </span>
                {done ? (
                  <CheckCircle2 className="size-6 shrink-0 text-success" aria-label="Completed" />
                ) : unlocked ? (
                  <PlayCircle className={cn("size-6 shrink-0", isNext ? "text-primary" : "text-muted-foreground")} aria-label={isNext ? "Up next" : "Not started"} />
                ) : (
                  <Lock className="size-5 shrink-0 text-muted-foreground" aria-label="Locked" />
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
