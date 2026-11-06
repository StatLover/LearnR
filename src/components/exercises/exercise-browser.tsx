"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Check, Minus, Search, SlidersHorizontal, Sun, X } from "lucide-react";
import type { Difficulty } from "@/content/types";
import { Hexy } from "@/components/brand/mascot";
import { Badge, DifficultyBadge, XpBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGame } from "@/components/game/outline-context";
import { useMounted } from "@/components/challenge/use-mounted";
import { useProgress } from "@/lib/store/progress";
import { getWorld, worlds, type World } from "@/lib/game/worlds";
import { cn } from "@/lib/utils";
import { WorldChip, WorldHex } from "./world-chip";

export interface ExerciseSummary {
  id: string;
  title: string;
  difficulty: Difficulty;
  module: number;
  moduleTitle: string;
  lessonTitle?: string;
  prompt: string;
  /** World id (see src/lib/game/worlds.ts). */
  world: string;
  /** Thumbnail illustration, rendered on the server (a TopicArt). */
  thumb: ReactNode;
  /** XP for solving it. */
  xp: number;
}

const DIFFS: { value: Difficulty; desc: string }[] = [
  { value: "easy", desc: "Reinforce syntax" },
  { value: "medium", desc: "Apply concepts" },
  { value: "challenge", desc: "Practical problems" },
];

type Status = "todo" | "done";
const STATUS: { value: Status; label: string }[] = [
  { value: "todo", label: "Not solved yet" },
  { value: "done", label: "Solved" },
];

const toggle = <T,>(list: T[], v: T, on: boolean) => (on ? (list.includes(v) ? list : [...list, v]) : list.filter((x) => x !== v));

/* ------------------------------------------------------------------ */
/* Filter controls                                                     */
/* ------------------------------------------------------------------ */

function FilterCheck({
  checked,
  mixed,
  onChange,
  children,
  count,
  color,
  small,
}: {
  checked: boolean;
  mixed?: boolean;
  onChange: (on: boolean) => void;
  children: ReactNode;
  count?: number;
  /** CSS colour of the ticked box. */
  color?: string;
  small?: boolean;
}) {
  const on = checked || mixed;
  const darkInk = color?.includes("--sun");
  return (
    <label className={cn("flex cursor-pointer items-center gap-2.5 rounded-xl px-2 transition-colors hover:bg-surface-2", small ? "py-1" : "py-1.5")}>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        ref={(el) => {
          if (el) el.indeterminate = Boolean(mixed);
        }}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-md border-2 transition-colors peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
          !on && "border-border-strong bg-surface",
          on && (darkInk ? "text-[#3b2600]" : "text-white"),
        )}
        style={on ? { background: color ?? "var(--primary)", borderColor: color ?? "var(--primary)" } : undefined}
      >
        {checked ? <Check className="size-3.5" strokeWidth={3.5} /> : mixed ? <Minus className="size-3.5" strokeWidth={3.5} /> : null}
      </span>
      <span className={cn("min-w-0 flex-1 font-bold", small ? "text-[13px]" : "text-sm")}>{children}</span>
      {count !== undefined && <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-bold tabular-nums text-muted-foreground">{count}</span>}
    </label>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-t-2 border-border pt-3 first-of-type:border-t-0 first-of-type:pt-0">
      <legend className="sr-only">{title}</legend>
      <p aria-hidden className="mb-1 px-2 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/* Exercise card                                                       */
/* ------------------------------------------------------------------ */

function ExerciseTile({ e, world, solved, daily }: { e: ExerciseSummary; world: World; solved: boolean; daily: boolean }) {
  return (
    <Link
      href={`/exercises/${e.id}`}
      className="group lift relative flex h-full overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)] hover:border-[var(--wc)] sm:flex-col"
      style={{ ["--wc" as string]: world.color.main }}
    >
      <div className="relative w-28 shrink-0 overflow-hidden border-r-2 border-border sm:w-auto sm:border-b-2 sm:border-r-0" style={{ background: world.color.soft }}>
        <div className="flex h-full items-center transition-transform duration-300 group-hover:scale-[1.05] [&_svg]:block">{e.thumb}</div>
        {daily && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-sun px-2 py-0.5 font-display text-[11px] font-semibold text-[#3b2600] shadow-[0_2px_0_var(--sun-shadow)] sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs">
            <Sun className="size-3.5" aria-hidden /> <span className="sr-only sm:not-sr-only">Today&apos;s challenge</span>
            <span className="sm:hidden">Today</span>
          </span>
        )}
        {solved && (
          <span className="absolute -right-10 top-5 hidden w-36 rotate-45 items-center justify-center gap-1 bg-mint py-1 font-display text-xs font-semibold uppercase tracking-wider text-white shadow-[0_2px_0_var(--mint-shadow)] sm:flex">
            <Check className="size-3.5" strokeWidth={3} aria-hidden /> Solved
          </span>
        )}
        {solved && (
          <span className="absolute bottom-2 left-2 grid size-7 place-items-center rounded-full bg-mint text-white shadow-[0_2px_0_var(--mint-shadow)] sm:hidden" aria-hidden>
            <Check className="size-4" strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-3.5 sm:p-4">
        <WorldChip world={world} label={world.name} className="self-start" />
        <h3 className="mt-1.5 font-display text-base font-semibold leading-snug group-hover:text-primary sm:mt-2 sm:text-lg">{e.title}</h3>
        {e.lessonTitle && <p className="mt-0.5 line-clamp-1 text-xs font-bold text-muted-foreground">Lesson: {e.lessonTitle}</p>}
        <p className="mt-1.5 line-clamp-2 hidden text-sm text-muted-foreground sm:block">{e.prompt.replace(/[`*#_]/g, "")}</p>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2.5 sm:pt-3">
          <DifficultyBadge difficulty={e.difficulty} />
          {solved ? (
            <Badge variant="success">
              <Check strokeWidth={3} /> Solved · +{e.xp} XP
            </Badge>
          ) : (
            <XpBadge xp={e.xp} />
          )}
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Browser                                                             */
/* ------------------------------------------------------------------ */

export function ExerciseBrowser({ exercises }: { exercises: ExerciseSummary[] }) {
  const s = useProgress();
  const g = useGame();
  const mounted = useMounted();
  const [q, setQ] = useState("");
  const [mods, setMods] = useState<number[]>([]);
  const [diffs, setDiffs] = useState<Difficulty[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [open, setOpen] = useState(false);

  // Deep links such as /exercises?module=3 or /exercises?world=data-wizard pre-select a filter.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const w = p.get("world") ? getWorld(p.get("world")!) : undefined;
    const m = Number(p.get("module"));
    const init = w ? w.modules : m ? [m] : [];
    // The query string is only known in the browser, so it is applied after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (init.length) setMods(init);
  }, []);

  const passed = (id: string) => Boolean(s.exercises[id]?.passedAt);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return exercises.filter((e) => {
      if (diffs.length && !diffs.includes(e.difficulty)) return false;
      if (mods.length && !mods.includes(e.module)) return false;
      if (statuses.length === 1) {
        const done = Boolean(s.exercises[e.id]?.passedAt);
        if (statuses[0] === "done" && !done) return false;
        if (statuses[0] === "todo" && done) return false;
      }
      if (needle && !`${e.title} ${e.prompt} ${e.lessonTitle ?? ""} ${e.moduleTitle}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [exercises, diffs, mods, statuses, q, s.exercises]);

  const byModule = useMemo(() => {
    const m = new Map<number, { title: string; count: number }>();
    for (const e of exercises) m.set(e.module, { title: e.moduleTitle, count: (m.get(e.module)?.count ?? 0) + 1 });
    return m;
  }, [exercises]);

  const worldRows = worlds
    .map((w) => {
      const wm = w.modules.filter((n) => byModule.has(n));
      const sel = wm.filter((n) => mods.includes(n)).length;
      return { w, wm, sel, count: wm.reduce((a, n) => a + (byModule.get(n)?.count ?? 0), 0) };
    })
    .filter((r) => r.wm.length);

  const solvedCount = exercises.filter((e) => passed(e.id)).length;
  const activeWorlds = worldRows.filter((r) => r.sel > 0);
  const activeCount = activeWorlds.length + diffs.length + statuses.length;
  const resetFilters = () => {
    setMods([]);
    setDiffs([]);
    setStatuses([]);
  };
  const clearAll = () => {
    resetFilters();
    setQ("");
  };

  // Chips summarising the active filters (each one removable).
  const chips: { key: string; label: string; remove: () => void; world?: World }[] = [
    ...activeWorlds.flatMap(({ w, wm, sel }) =>
      sel === wm.length
        ? [{ key: w.id, label: w.name, world: w, remove: () => setMods((m) => m.filter((n) => !wm.includes(n))) }]
        : wm.filter((n) => mods.includes(n)).map((n) => ({ key: `m${n}`, label: `Module ${n}`, world: w, remove: () => setMods((m) => m.filter((x) => x !== n)) })),
    ),
    ...diffs.map((d) => ({ key: d, label: d[0].toUpperCase() + d.slice(1), remove: () => setDiffs((x) => x.filter((v) => v !== d)) })),
    ...statuses.map((st) => ({ key: st, label: STATUS.find((x) => x.value === st)!.label, remove: () => setStatuses((x) => x.filter((v) => v !== st)) })),
  ];

  return (
    <div className="grid grid-cols-1 gap-5 [grid-template-areas:'toolbar'_'filters'_'results'] lg:grid-cols-[17rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:[grid-template-areas:'filters_toolbar'_'filters_results']">
      {/* toolbar */}
      <div className="space-y-3 [grid-area:toolbar]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1 basis-56">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <label htmlFor="ex-search" className="sr-only">
              Search exercises
            </label>
            <Input id="ex-search" type="search" className="pl-10" placeholder="Search exercises…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Button variant="outline" className="lg:hidden" aria-expanded={open} aria-controls="practice-filters" onClick={() => setOpen((o) => !o)}>
            <SlidersHorizontal /> Filters
            {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-primary text-[11px] text-primary-foreground">{activeCount}</span>}
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-1 text-sm font-bold text-muted-foreground" aria-live="polite">
            Showing <span className="text-foreground">{list.length}</span> of {exercises.length} exercises
            <span className="hidden sm:inline"> · you have solved {solvedCount}</span>
          </p>
          {chips.map((c) => (
            <button
              key={c.key}
              onClick={c.remove}
              className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-surface py-0.5 pl-2.5 pr-1.5 text-xs font-bold hover:bg-surface-2 cursor-pointer"
              aria-label={`Remove filter: ${c.label}`}
            >
              {c.world && <WorldHex world={c.world} className="size-3" />}
              {c.label}
              <X className="size-3.5 text-muted-foreground" aria-hidden />
            </button>
          ))}
          {(chips.length > 0 || q) && (
            <button onClick={clearAll} className="text-xs font-bold text-primary underline-offset-2 hover:underline cursor-pointer">
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* filter sidebar / collapsible panel */}
      <aside id="practice-filters" aria-label="Exercise filters" className={cn("[grid-area:filters] lg:sticky lg:top-20 lg:block lg:self-start", open ? "block animate-fade-up" : "hidden")}>
        <div className="space-y-3 rounded-3xl border-2 border-border bg-card p-4 shadow-[var(--shadow-card)] lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="flex items-center justify-between px-2">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <SlidersHorizontal className="size-4 text-primary" aria-hidden /> Filters
            </h2>
            {activeCount > 0 && (
              <button onClick={resetFilters} className="text-xs font-bold text-primary hover:underline cursor-pointer">
                Reset
              </button>
            )}
          </div>

          <FilterGroup title="World">
            {worldRows.map(({ w, wm, sel, count }) => (
              <div key={w.id}>
                <FilterCheck
                  checked={sel === wm.length}
                  mixed={sel > 0 && sel < wm.length}
                  color={w.color.main}
                  count={count}
                  onChange={(on) => setMods((m) => (on ? [...new Set([...m, ...wm])] : m.filter((n) => !wm.includes(n))))}
                >
                  <span className="flex items-center gap-1.5">
                    <WorldHex world={w} />
                    <span className="truncate">{w.name}</span>
                  </span>
                </FilterCheck>
                {wm.length > 1 && sel > 0 && (
                  <div className="mb-1 ml-5 border-l-2 border-border pl-2">
                    {wm.map((n) => (
                      <FilterCheck key={n} small color={w.color.main} checked={mods.includes(n)} count={byModule.get(n)?.count} onChange={(on) => setMods((m) => toggle(m, n, on))}>
                        <span className="line-clamp-1">
                          Module {n}: {byModule.get(n)?.title}
                        </span>
                      </FilterCheck>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </FilterGroup>

          <FilterGroup title="Difficulty">
            {DIFFS.map((d) => (
              <FilterCheck key={d.value} checked={diffs.includes(d.value)} onChange={(on) => setDiffs((x) => toggle(x, d.value, on))} count={exercises.filter((e) => e.difficulty === d.value).length}>
                <span className="flex flex-wrap items-center gap-x-2">
                  <DifficultyBadge difficulty={d.value} />
                  <span className="text-xs font-semibold text-muted-foreground">{d.desc}</span>
                </span>
              </FilterCheck>
            ))}
          </FilterGroup>

          <FilterGroup title="Status">
            {STATUS.map((st) => (
              <FilterCheck
                key={st.value}
                color={st.value === "done" ? "var(--mint)" : undefined}
                checked={statuses.includes(st.value)}
                onChange={(on) => setStatuses((x) => toggle(x, st.value, on))}
                count={st.value === "done" ? solvedCount : exercises.length - solvedCount}
              >
                {st.label}
              </FilterCheck>
            ))}
          </FilterGroup>
          <Button variant="primary" size="sm" className="w-full lg:hidden" onClick={() => setOpen(false)} aria-controls="practice-filters">
            Show {list.length} {list.length === 1 ? "exercise" : "exercises"}
          </Button>
        </div>
      </aside>

      {/* results */}
      <section aria-label="Exercises" className="min-w-0 [grid-area:results]">
        {list.length === 0 ? (
          <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-border bg-card/60 px-6 py-12 text-center">
            <Hexy mood="think" size={110} />
            <h2 className="mt-3 font-display text-xl font-semibold">No exercises match these filters</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">Try removing a filter or searching for a different word.</p>
            <Button variant="outline" className="mt-4" onClick={clearAll}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((e) => (
              <li key={e.id}>
                <ExerciseTile e={e} world={getWorld(e.world) ?? worlds[0]} solved={passed(e.id)} daily={mounted && g.daily.exerciseId === e.id} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
