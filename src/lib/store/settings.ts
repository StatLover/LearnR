import { createPersistedStore, useStore } from "./create-store";

export type ThemePref = "system" | "light" | "dark";
export type TutorMode = "beginner" | "step-by-step" | "debugging" | "practice" | "quiz" | "statistics";

export interface Settings {
  theme: ThemePref;
  fontSize: "sm" | "md" | "lg" | "xl";
  editorFontSize: number;
  lineNumbers: boolean;
  autoCloseBrackets: boolean;
  /** Plot colours: follow the site theme, or always light. */
  plotTheme: "auto" | "light";
  /** guided = lessons unlock in order; free = everything open */
  learningMode: "guided" | "free";
  tutorMode: TutorMode;
  /** Seconds before running code is stopped automatically. */
  runTimeout: number;
  reduceMotion: "system" | "on";
  /** Daily XP goal. */
  dailyGoalXp: number;
  /** Confetti and celebration animations. */
  celebrations: boolean;
}

export const defaultSettings: Settings = {
  theme: "system",
  fontSize: "md",
  editorFontSize: 14,
  lineNumbers: true,
  autoCloseBrackets: true,
  plotTheme: "auto",
  learningMode: "guided",
  tutorMode: "beginner",
  runTimeout: 30,
  reduceMotion: "system",
  dailyGoalXp: 50,
  celebrations: true,
};

import { SETTINGS_KEY } from "./theme-script";
export { SETTINGS_KEY };

export const settingsStore = createPersistedStore<Settings>(
  SETTINGS_KEY,
  () => ({ ...defaultSettings }),
  (raw) => ({ ...defaultSettings, ...(typeof raw === "object" && raw ? (raw as Partial<Settings>) : {}) }),
);

export function useSettings() {
  return useStore(settingsStore);
}

export function updateSettings(patch: Partial<Settings>) {
  settingsStore.set((s) => ({ ...s, ...patch }));
}

export function resolveTheme(pref: ThemePref): "light" | "dark" {
  if (pref !== "system") return pref;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Apply theme / font size / motion preferences to <html>. */
export function applySettingsToDocument(s: Settings) {
  const root = document.documentElement;
  const theme = resolveTheme(s.theme);
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.dataset.fontSize = s.fontSize;
  root.dataset.reduceMotion = s.reduceMotion === "on" ? "true" : "false";
  root.style.setProperty("--editor-font-size", `${s.editorFontSize}px`);
}

