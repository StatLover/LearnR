"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowRight, BookOpen, Code2, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Hexy } from "@/components/brand/mascot";
import { labs, labTopics, TOPIC_CLASS, TOPIC_COLOR, type LabTopic } from "./lab-list";

/**
 * Filterable grid of R Labs (PhET-style illustrated cards). The thumbnails are
 * rendered on the server and passed in, so the SVG scenes are not re-rendered
 * (and re-computed) in the browser.
 */
export function LabHub({ arts }: { arts: Record<string, ReactNode> }) {
  const [topic, setTopic] = useState<LabTopic | "all">("all");
  const shown = topic === "all" ? labs : labs.filter((l) => l.topics.includes(topic));
  const options: (LabTopic | "all")[] = ["all", ...labTopics];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <p id="lab-filter-label" className="font-display text-sm font-semibold text-muted-foreground">
          Filter by topic
        </p>
        <div role="radiogroup" aria-labelledby="lab-filter-label" className="flex flex-wrap gap-2">
          {options.map((t) => {
            const on = topic === t;
            const color = t === "all" ? "primary" : TOPIC_COLOR[t];
            const count = t === "all" ? labs.length : labs.filter((l) => l.topics.includes(t)).length;
            return (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setTopic(t)}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                  e.preventDefault();
                  const i = options.indexOf(t);
                  const next = options[(i + (e.key === "ArrowRight" ? 1 : options.length - 1)) % options.length];
                  setTopic(next);
                  (e.currentTarget.parentElement?.children[options.indexOf(next)] as HTMLElement | undefined)?.focus();
                }}
                tabIndex={on ? 0 : -1}
                className={cn(
                  "press flex h-10 cursor-pointer items-center gap-2 rounded-full border-2 px-4 font-display text-sm font-semibold",
                  on ? "border-transparent text-white" : "border-border bg-surface text-foreground hover:bg-surface-2 [--press-shadow:var(--border)]",
                )}
                style={on ? { background: `var(--${color})`, ["--press-shadow" as string]: `var(--${color}-shadow)` } : undefined}
              >
                {t === "all" ? "All labs" : t}
                <span className={cn("rounded-full px-1.5 text-xs", on ? "bg-white/25" : "bg-surface-2 text-muted-foreground")}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {shown.length} {shown.length === 1 ? "lab" : "labs"} shown
      </p>

      <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((lab, i) => (
          <li key={lab.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <Link
              href={`/visualize/${lab.id}`}
              className="lift group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)] hover:border-[var(--c)]"
              style={{ ["--c" as string]: `var(--${lab.color})` }}
            >
              <div className="relative border-b-2 border-border">
                <div className="transition-transform duration-300 group-hover:scale-[1.03]">{arts[lab.id]}</div>
                <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-0.5 font-display text-xs font-semibold text-foreground shadow-sm backdrop-blur">
                  {lab.level}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex flex-wrap gap-1.5">
                  {lab.topics.map((t) => (
                    <span key={t} className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", TOPIC_CLASS[t])}>
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="font-display text-xl font-semibold leading-tight">{lab.title}</h2>
                <p className="flex-1 text-sm font-semibold text-muted-foreground">{lab.short}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  {lab.lesson ? (
                    <span className="flex min-w-0 items-center gap-1 truncate text-xs font-semibold text-muted-foreground">
                      <BookOpen className="size-3.5 shrink-0" /> <span className="truncate">{lab.lesson.title}</span>
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="flex shrink-0 items-center gap-1 font-display text-sm font-semibold" style={{ color: `var(--${lab.color})` }}>
                    Open lab <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
        <li className="flex flex-col gap-4 rounded-3xl border-2 border-dashed border-border-strong bg-surface/60 p-6">
          <div className="flex items-center gap-3">
            <Hexy mood="point" size={64} />
            <h2 className="font-display text-xl font-semibold leading-tight">Everything here is real R</h2>
          </div>
          <ol className="space-y-3 text-sm font-semibold text-muted-foreground">
            {[
              ["Move a slider or flip a switch.", "sky"],
              ["The lab writes the R code – you can read every line.", "grape"],
              ["webR runs it in your browser and shows the true output and plot.", "mint"],
            ].map(([text, c], i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-xl font-display text-sm font-bold text-white" style={{ background: `var(--${c})` }} aria-hidden>
                  {i + 1}
                </span>
                <span className="pt-0.5">{text}</span>
              </li>
            ))}
          </ol>
          <div className="mt-auto flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/playground">
                <Code2 /> Open the playground
              </Link>
            </Button>
            <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
              <FlaskConical className="size-3.5" /> No setup needed
            </span>
          </div>
        </li>
      </ul>

    </div>
  );
}
