"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Search } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { useProgress } from "@/lib/store/progress";

export interface ExerciseSummary {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "challenge";
  module: number;
  moduleTitle: string;
  lessonTitle?: string;
  prompt: string;
}

export function ExerciseBrowser({ exercises }: { exercises: ExerciseSummary[] }) {
  const s = useProgress();
  const [q, setQ] = useState("");
  const [diff, setDiff] = useState("all");
  const [mod, setMod] = useState("all");
  const [status, setStatus] = useState("all");
  const list = useMemo(
    () =>
      exercises.filter((e) => {
        if (diff !== "all" && e.difficulty !== diff) return false;
        if (mod !== "all" && String(e.module) !== mod) return false;
        const passed = Boolean(s.exercises[e.id]?.passedAt);
        if (status === "done" && !passed) return false;
        if (status === "todo" && passed) return false;
        if (q && !`${e.title} ${e.prompt} ${e.lessonTitle ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [exercises, diff, mod, status, q, s.exercises],
  );
  const passedCount = exercises.filter((e) => s.exercises[e.id]?.passedAt).length;
  const modules = [...new Map(exercises.map((e) => [e.module, e.moduleTitle])).entries()];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <label htmlFor="ex-search" className="sr-only">Search exercises</label>
          <Input id="ex-search" className="pl-9" placeholder="Search exercises…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div>
          <label htmlFor="ex-diff" className="mb-1 block text-xs font-medium text-muted-foreground">Difficulty</label>
          <Select id="ex-diff" value={diff} onChange={(e) => setDiff(e.target.value)}>
            <option value="all">All levels</option>
            <option value="easy">Easy – reinforce syntax</option>
            <option value="medium">Medium – apply concepts</option>
            <option value="challenge">Challenge – practical problems</option>
          </Select>
        </div>
        <div>
          <label htmlFor="ex-mod" className="mb-1 block text-xs font-medium text-muted-foreground">Module</label>
          <Select id="ex-mod" value={mod} onChange={(e) => setMod(e.target.value)}>
            <option value="all">All modules</option>
            {modules.map(([n, t]) => <option key={n} value={n}>{n}. {t}</option>)}
          </Select>
        </div>
        <div>
          <label htmlFor="ex-status" className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
          <Select id="ex-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="todo">Not passed yet</option>
            <option value="done">Passed</option>
          </Select>
        </div>
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing {list.length} of {exercises.length} exercises · you have passed {passedCount}.
      </p>
      <ul className="grid gap-3 md:grid-cols-2">
        {list.map((e) => {
          const passed = s.exercises[e.id]?.passedAt;
          return (
            <li key={e.id}>
              <Link href={`/exercises/${e.id}`} className="flex h-full gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:bg-surface">
                {passed ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-label="Passed" /> : <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground/50" aria-label="Not passed" />}
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{e.title}</span>
                    <DifficultyBadge difficulty={e.difficulty} />
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">Module {e.module}: {e.moduleTitle}{e.lessonTitle ? ` · ${e.lessonTitle}` : ""}</span>
                  <span className="mt-1.5 line-clamp-2 block text-sm text-muted-foreground">{e.prompt.replace(/[`*#]/g, "")}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
