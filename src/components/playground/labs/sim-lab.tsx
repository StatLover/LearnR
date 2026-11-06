"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Dices, ExternalLink, Lightbulb, Loader2, RotateCcw, SlidersHorizontal, Terminal, Code2, ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hexy } from "@/components/brand/mascot";
import { ConsoleView } from "@/components/code/output-panels";
import { StaticCode } from "@/components/code/static-code";
import { openInPlayground } from "@/components/code/code-block";
import { rSession } from "@/lib/r/session";
import type { RunResult } from "@/lib/r/console";
import { useRSession } from "@/hooks/use-r-session";
import { useResolvedTheme } from "@/hooks/use-theme";
import { useSettings } from "@/lib/store/settings";
import { cn, copyText } from "@/lib/utils";

/** Format a number for R code and labels: at most 2 decimals, no trailing zeros. */
export function num(v: number) {
  return String(Number(v.toFixed(2)));
}

/* ------------------------------------------------------------------ */
/* Controls                                                            */
/* ------------------------------------------------------------------ */

/** A labelled range slider with its current value always visible. */
export function Slider({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  values,
  format = String,
  color = "primary",
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Discrete values to choose from (the slider then moves over their index). */
  values?: number[];
  format?: (v: number) => string;
  /** Accent colour name. */
  color?: string;
  hint?: ReactNode;
}) {
  const lo = values ? 0 : (min ?? 0);
  const hi = values ? values.length - 1 : (max ?? 100);
  const pos = values ? Math.max(0, values.indexOf(value)) : value;
  const pct = ((pos - lo) / (hi - lo || 1)) * 100;
  const shown = format(value);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-bold">
          {label}
        </label>
        <output htmlFor={id} className="min-w-12 rounded-lg px-2 py-0.5 text-center font-mono text-sm font-bold text-white" style={{ background: `var(--${color})`, color: color === "sun" ? "#3b2600" : undefined }}>
          {shown}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={lo}
        max={hi}
        step={values ? 1 : step}
        value={pos}
        aria-valuetext={shown}
        onChange={(e) => {
          const v = Number(e.target.value);
          onChange(values ? values[v] : v);
        }}
        className={cn(
          "h-3 w-full cursor-pointer appearance-none rounded-full",
          "[&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-[var(--c)] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_2px_0_var(--c-shadow)] [&::-webkit-slider-thumb]:transition-transform active:[&::-webkit-slider-thumb]:scale-110",
          "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-[var(--c)] [&::-moz-range-thumb]:bg-white",
        )}
        style={{
          ["--c" as string]: `var(--${color})`,
          ["--c-shadow" as string]: `var(--${color}-shadow)`,
          background: `linear-gradient(to right, var(--${color}) 0%, var(--${color}) ${pct}%, var(--surface-3) ${pct}%, var(--surface-3) 100%)`,
        }}
      />
      <div className="mt-1 flex justify-between font-mono text-[11px] font-semibold text-muted-foreground" aria-hidden>
        <span>{format(values ? values[0] : lo)}</span>
        <span>{format(values ? values[values.length - 1] : hi)}</span>
      </div>
      {hint && <p className="mt-1 text-xs font-semibold text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** An on/off option shown as a switch-style checkbox. */
export function Toggle({ id, label, checked, onChange, hint }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-border bg-surface px-3 py-2.5 hover:bg-surface-2 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-[var(--ring)]">
      <input id={id} type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span aria-hidden className={cn("relative mt-0.5 inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors", checked ? "bg-mint" : "bg-surface-3")}>
        <span className={cn("block size-4.5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-[19px]" : "translate-x-[3px]")} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold">{label}</span>
        {hint && <span className="block text-xs font-semibold text-muted-foreground">{hint}</span>}
      </span>
    </label>
  );
}

/** A set of mutually exclusive tiles (radio group). */
export function Choice<T extends string>({
  label,
  value,
  onChange,
  options,
  color = "primary",
  columns = 2,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; hint?: string; icon?: ReactNode }[];
  color?: string;
  columns?: 1 | 2 | 3;
}) {
  const name = `choice-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-bold">{label}</legend>
      <div className={cn("grid gap-2", columns === 2 && "grid-cols-2", columns === 3 && "grid-cols-3")}>
        {options.map((o) => {
          const on = o.value === value;
          return (
            <label
              key={o.value}
              className={cn(
                "press flex cursor-pointer items-start gap-2 rounded-2xl border-2 px-3 py-2 text-left has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-[var(--ring)]",
                on ? "border-[var(--c)] bg-[var(--c-soft)] [--press-shadow:var(--c)]" : "border-border bg-surface [--press-shadow:var(--border)] hover:bg-surface-2",
              )}
              style={{ ["--c" as string]: `var(--${color})`, ["--c-soft" as string]: `var(--${color}-soft)` }}
            >
              <input type="radio" name={name} value={o.value} checked={on} onChange={() => onChange(o.value)} className="sr-only" />
              {o.icon && <span className="mt-0.5 shrink-0 [&_svg]:size-4" style={{ color: `var(--${color})` }}>{o.icon}</span>}
              <span className="min-w-0">
                <span className="block text-sm font-bold leading-tight">{o.label}</span>
                {o.hint && <span className="mt-0.5 block text-[11px] font-semibold leading-tight text-muted-foreground">{o.hint}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Seed slider plus a dice button that picks a new random seed. */
export function SeedControl({ id, value, onChange, color = "primary" }: { id: string; value: number; onChange: (v: number) => void; color?: string }) {
  return (
    <div className="flex items-end gap-2">
      <div className="min-w-0 flex-1">
        <Slider id={id} label="Random seed – set.seed()" value={value} onChange={onChange} min={1} max={999} color={color} />
      </div>
      <Button variant="outline" size="icon" className="mb-5" onClick={() => onChange(1 + Math.floor(Math.random() * 999))} aria-label="Roll a new random seed">
        <Dices />
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Running R                                                           */
/* ------------------------------------------------------------------ */

const NARROW = "(max-width: 640px)";
function useNarrow() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(NARROW);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(NARROW).matches,
    () => false,
  );
}

/**
 * Runs `code` in real R whenever it changes (debounced). Only the newest
 * code's result is kept, and runs never pile up in the R queue.
 */
export function useLabRun(code: string, workspace: string, delay = 450) {
  const settings = useSettings();
  const theme = useResolvedTheme();
  const dark = settings.plotTheme === "auto" && theme === "dark";
  // Phones get a smaller plot canvas, so R's text stays readable when scaled down.
  const narrow = useNarrow();
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const latest = useRef(0);
  const inflight = useRef<Promise<unknown> | null>(null);

  useEffect(() => {
    const id = ++latest.current;
    const timer = setTimeout(async () => {
      // Wait for the run in progress, then only run if nothing newer arrived.
      while (inflight.current) await inflight.current.catch(() => undefined);
      if (id !== latest.current) return;
      setRunning(true);
      const p = rSession.run(code, { workspace, fresh: true, dark, timeoutMs: settings.runTimeout * 1000, plotWidth: narrow ? 620 : 900, plotHeight: 560 });
      inflight.current = p;
      try {
        const r = await p;
        if (id === latest.current) setResult(r);
      } catch {
        /* reported by the session */
      } finally {
        inflight.current = null;
        if (id === latest.current) setRunning(false);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [code, workspace, dark, narrow, settings.runTimeout, delay]);

  return { result, running };
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

export function Panel({ icon, title, color = "primary", actions, children, className }: { icon: ReactNode; title: string; color?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  const id = useId();
  return (
    <section className={cn("overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]", className)} aria-labelledby={id}>
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-border bg-surface-2/60 px-4 py-2.5">
        <span className="grid size-8 place-items-center rounded-xl text-white [&_svg]:size-4.5" style={{ background: `var(--${color})` }} aria-hidden>
          {icon}
        </span>
        <h2 id={id} className="font-display text-base font-semibold">{title}</h2>
        {actions && <div className="ml-auto flex flex-wrap items-center gap-1">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

/** Numbered "questions to try" with hexagon bullets. */
export function ExploreList({ items }: { items: ReactNode[] }) {
  return (
    <ol className="space-y-3 p-5">
      {items.map((q, i) => (
        <li key={i} className="flex gap-3 text-sm font-semibold">
          <span className="relative grid size-7 shrink-0 place-items-center font-display text-sm font-bold text-[#3b2600]" aria-hidden>
            <svg viewBox="0 0 24 26" className="absolute size-7" aria-hidden>
              <path d="M12 1 L23 7 L23 19 L12 25 L1 19 L1 7 Z" fill="var(--sun)" />
            </svg>
            <span className="relative">{i + 1}</span>
          </span>
          <span className="min-w-0 pt-0.5">{q}</span>
        </li>
      ))}
    </ol>
  );
}

export interface SimLabProps {
  /** R workspace, e.g. "lab:normal". */
  workspace: string;
  /** The generated R code (it is shown and run exactly as is). */
  code: string;
  /** Accent colour of the lab. */
  color: string;
  controls: ReactNode;
  onReset: () => void;
  /** Questions that invite the learner to experiment. */
  explore: ReactNode[];
  /** Explanation of the idea behind the lab. */
  concept: { title: string; body: ReactNode };
  /** Describes the plot for screen readers (based on the current settings). */
  plotAlt: string;
  /** Short live summary shown above the plot (e.g. "n = 200, mean 50"). */
  caption?: ReactNode;
}

export function SimLab({ workspace, code, color, controls, onReset, explore, concept, plotAlt, caption }: SimLabProps) {
  const router = useRouter();
  const session = useRSession();
  const { result, running } = useLabRun(code, workspace);
  const [copied, setCopied] = useState(false);
  const img = result?.images[result.images.length - 1];
  const failed = result && result.status !== "ok";
  const stale = result && result.code !== code;

  const copy = async () => {
    if (await copyText(code)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(300px,360px)_minmax(0,1fr)] lg:items-start">
      {/* Left column (on phones its parts interleave with the plot via `order`). */}
      <div className="contents lg:block lg:space-y-6">
        <Panel
          icon={<SlidersHorizontal />}
          title="Controls"
          color={color}
          className="order-1"
          actions={
            <Button size="sm" variant="ghost" onClick={onReset}>
              <RotateCcw /> Reset
            </Button>
          }
        >
          <div className="space-y-5 p-5">{controls}</div>
        </Panel>

        <Panel icon={<Lightbulb />} title="What to explore" color="sun" className="order-4">
          <ExploreList items={explore} />
        </Panel>

        <Panel icon={<Sparkles />} title={concept.title} color="grape" className="order-5">
          <div className="space-y-3 p-5 text-sm font-semibold leading-relaxed text-muted-foreground [&_strong]:text-foreground">{concept.body}</div>
        </Panel>
      </div>

      <div className="order-2 min-w-0 space-y-6">
        <Panel
          icon={<ImageIcon />}
          title="Plot"
          color={color}
          actions={
            <span className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold", running ? "bg-sky-soft text-info" : failed ? "bg-coral-soft text-danger" : "bg-mint-soft text-success")} aria-live="polite">
              {running ? <Loader2 className="size-3.5 animate-spin" /> : <span className="size-2 rounded-full bg-current" aria-hidden />}
              {running ? (session.status === "loading" ? "Starting R…" : "R is drawing…") : failed ? "R reported a problem" : result ? "Live from R" : "Waiting for R"}
            </span>
          }
        >
          {caption && <div className="border-b-2 border-border px-4 py-2 text-sm font-semibold text-muted-foreground">{caption}</div>}
          <div className="relative grid min-h-60 place-items-center bg-surface p-2 sm:p-3">
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt={plotAlt} className={cn("h-auto w-full max-w-[900px] rounded-2xl transition-opacity", (running || stale) && "opacity-60")} />
            ) : (
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <Hexy mood={failed ? "oops" : "think"} size={84} animate={!failed} />
                <p className="max-w-sm text-sm font-semibold text-muted-foreground">
                  {failed
                    ? "R did not draw a plot this time – read the console below."
                    : session.status === "loading"
                      ? `${session.message} The first start takes a few seconds.`
                      : "R is getting ready to draw your plot…"}
                </p>
              </div>
            )}
          </div>
        </Panel>

        <div className="grid gap-6">
          <Panel icon={<Terminal />} title="R console output" color="mint">
            <ConsoleView lines={result?.lines ?? []} running={running && !result} empty="The real R output appears here." maxHeight={340} className="min-h-40" />
          </Panel>
          <Panel
            icon={<Code2 />}
            title="The R code"
            color="primary"
            actions={
              <>
                <Button size="sm" variant="ghost" onClick={copy} aria-label="Copy the R code">
                  {copied ? <Check className="text-success" /> : <Copy />} <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    openInPlayground(code);
                    router.push("/playground");
                  }}
                >
                  <ExternalLink /> Open in playground
                </Button>
              </>
            }
          >
            <p className="border-b-2 border-border px-4 py-2 text-xs font-semibold text-muted-foreground">The controls write this code. It runs exactly as shown.</p>
            <StaticCode code={code} className="max-h-[340px] text-[13px]" />
          </Panel>
        </div>
      </div>
    </div>
  );
}
