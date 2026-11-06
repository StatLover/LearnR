"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { cn, todayKey } from "@/lib/utils";

/** True once the component runs in the browser (progress lives in localStorage). */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/** A dashboard card with a coloured icon tile and an h2 title. */
export function DashCard({
  id,
  title,
  icon,
  color = "primary",
  action,
  children,
  className,
}: {
  id: string;
  title: ReactNode;
  icon: ReactNode;
  color?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={cn("rounded-3xl border-2 border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6", className)}>
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <span
          className="grid size-9 shrink-0 place-items-center rounded-xl text-white [&_svg]:size-5"
          style={{ background: `var(--${color})`, boxShadow: `0 3px 0 var(--${color}-shadow, var(--primary-shadow))`, color: color === "sun" ? "#3b2600" : undefined }}
          aria-hidden
        >
          {icon}
        </span>
        <h2 id={id} className="min-w-0 flex-1 font-display text-lg font-semibold leading-tight">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** The hexagonal level chip (same shape as the header's level button). */
export function LevelHex({ level, size = 64 }: { level: number; size?: number }) {
  return (
    <span className="relative inline-grid shrink-0 place-items-center" style={{ width: size, height: size * 1.1 }} role="img" aria-label={`Level ${level}`}>
      <svg viewBox="0 0 40 44" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d="M20 5 L36 14 L36 33 L20 42 L4 33 L4 14 Z" fill="var(--primary-shadow)" />
        <path d="M20 3 L36 12 L36 31 L20 40 L4 31 L4 12 Z" fill="var(--primary)" stroke="var(--primary-shadow)" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M20 6 L33 13.5 L33 19 Q20 15 7 19 L7 13.5 Z" fill="#ffffff" opacity="0.22" />
      </svg>
      <span className="relative -mt-1 font-display font-bold text-white" style={{ fontSize: size * 0.38 }}>
        {level}
      </span>
    </span>
  );
}

/** Small stat tile: big number, label, optional sub-line. */
export function StatTile({ icon, label, value, sub, color }: { icon: ReactNode; label: string; value: ReactNode; sub?: string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-surface p-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl [&_svg]:size-5" style={{ background: `var(--${color}-soft)`, color: `var(--${color})` }} aria-hidden>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-display text-2xl font-bold leading-none">{value}</p>
        <p className="mt-1 text-xs font-bold text-muted-foreground">{label}</p>
        {sub && <p className="text-[11px] font-semibold text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

/** Weekly XP bar chart: 7 bars, today highlighted, a dashed daily-goal line. */
export function WeekChart({ week, goal }: { week: { day: string; label: string; xp: number }[]; goal: number }) {
  const today = todayKey();
  const max = Math.max(goal * 1.25, ...week.map((d) => d.xp), 10);
  const total = week.reduce((a, d) => a + d.xp, 0);
  const met = week.filter((d) => d.xp >= goal).length;
  const best = week.reduce((a, d) => (d.xp > a.xp ? d : a), week[0] ?? { day: "", label: "", xp: 0 });
  const label = `Bar chart of XP earned per day over the last 7 days: ${week.map((d) => `${d.day === today ? "today" : d.label} ${d.xp} XP`).join(", ")}. The daily goal is ${goal} XP.`;
  const goalPos = (goal / max) * 100;

  return (
    <div>
      <div className="relative ml-9 h-48" role="img" aria-label={label}>
        {/* recessive grid: 0 and max */}
        <div className="absolute inset-x-0 bottom-0 border-b-2 border-border" aria-hidden />
        <span className="absolute -left-9 bottom-0 w-7 translate-y-1/2 text-right font-mono text-[10px] font-semibold text-muted-foreground" aria-hidden>
          0
        </span>
        {/* goal line */}
        <div className="absolute inset-x-0 border-t-2 border-dashed border-sun" style={{ bottom: `${goalPos}%` }} aria-hidden />
        <span className="absolute -left-9 w-7 translate-y-1/2 text-right font-mono text-[10px] font-semibold text-muted-foreground" style={{ bottom: `${goalPos}%` }} aria-hidden>
          {goal}
        </span>
        <div className="absolute inset-0 flex items-end gap-2 sm:gap-4" aria-hidden>
          {week.map((d) => {
            const isToday = d.day === today;
            const h = (d.xp / max) * 100;
            return (
              <div key={d.day} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                {(isToday || d.xp > 0) && (
                  <span className={cn("mb-1 font-display text-xs font-bold", isToday ? "text-primary" : "text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100")}>{d.xp}</span>
                )}
                <div
                  className={cn("w-full max-w-12 rounded-t-lg transition-[height] duration-700", isToday ? "bg-primary shadow-[0_0_0_3px_var(--primary-soft)]" : d.xp >= goal ? "bg-mint" : "bg-sky/60")}
                  style={{ height: d.xp > 0 ? `max(${h}%, 6px)` : "4px", opacity: d.xp > 0 ? 1 : 0.35 }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="ml-9 mt-2 flex gap-2 sm:gap-4" aria-hidden>
        {week.map((d) => (
          <span key={d.day} className={cn("flex-1 text-center text-xs font-bold", d.day === today ? "text-primary" : "text-muted-foreground")}>
            {d.day === today ? "Today" : d.label}
          </span>
        ))}
      </div>
      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-muted-foreground">
        <span>
          <strong className="font-display text-foreground">{total.toLocaleString()} XP</strong> this week
        </span>
        <span>
          Goal reached on <strong className="text-foreground">{met}</strong> of 7 days
        </span>
        {best.xp > 0 && (
          <span>
            Best day: <strong className="text-foreground">{best.day === today ? "today" : best.label}</strong> ({best.xp} XP)
          </span>
        )}
      </p>
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-bold text-muted-foreground" aria-hidden>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-primary" /> Today</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-mint" /> Goal reached</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-sky/60" /> Other days</span>
        <span className="flex items-center gap-1.5"><span className="w-4 border-t-2 border-dashed border-sun" /> Daily goal ({goal} XP)</span>
      </div>
    </div>
  );
}

/** 12-week activity grid: each square is a day you learned. */
export function ActivityCalendar({ days }: { days: string[] }) {
  const set = new Set(days);
  const cells: { key: string; on: boolean }[] = [];
  const d = new Date();
  d.setDate(d.getDate() - 7 * 12 + 1);
  for (let i = 0; i < 7 * 12; i++) {
    const k = todayKey(d);
    cells.push({ key: k, on: set.has(k) });
    d.setDate(d.getDate() + 1);
  }
  const active = cells.filter((c) => c.on).length;
  return (
    <div>
      <div className="grid grid-flow-col grid-rows-7 justify-start gap-1" role="img" aria-label={`Learning activity over the last 12 weeks: active on ${active} days`}>
        {cells.map((c) => (
          <span key={c.key} title={c.key} className={cn("size-3.5 rounded-[4px]", c.on ? "bg-mint" : "bg-surface-3")} />
        ))}
      </div>
      <p className="mt-2 text-xs font-semibold text-muted-foreground">Last 12 weeks – each green square is a day you learned ({active} so far).</p>
    </div>
  );
}
