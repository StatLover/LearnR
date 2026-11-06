"use client";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Outline } from "@/lib/store/progress";
import { useProgress } from "@/lib/store/progress";
import { useSettings } from "@/lib/store/settings";
import { levelInfo, todaysChallenge, xpByDay, xpEvents, xpOnDay } from "@/lib/game/xp";
import { currentStreak } from "@/lib/store/progress";
import { todayKey } from "@/lib/utils";

const OutlineContext = createContext<Outline>({ modules: [], projects: [] });

export function OutlineProvider({ outline, children }: { outline: Outline; children: ReactNode }) {
  return <OutlineContext.Provider value={outline}>{children}</OutlineContext.Provider>;
}

/** The lightweight course outline (modules, lessons, exercises, projects). */
export function useOutline(): Outline {
  return useContext(OutlineContext);
}

/** Everything the gamification UI needs, derived from progress. */
export function useGame() {
  const outline = useOutline();
  const s = useProgress();
  const settings = useSettings();
  return useMemo(() => {
    const events = xpEvents(s, outline);
    const xp = events.reduce((a, e) => a + e.amount, 0);
    const today = xpOnDay(events, todayKey());
    return {
      xp,
      level: levelInfo(xp),
      events,
      todayXp: today,
      goalXp: settings.dailyGoalXp,
      goalPct: Math.min(100, Math.round((today / Math.max(1, settings.dailyGoalXp)) * 100)),
      week: xpByDay(events, 7),
      streak: currentStreak(s.activityDays),
      daily: todaysChallenge(s, outline),
    };
  }, [s, outline, settings.dailyGoalXp]);
}
