"use client";

import { useEffect, type ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster, toast } from "@/components/ui/toast";
import { applySettingsToDocument, settingsStore, useSettings } from "@/lib/store/settings";
import { achievements, newlyEarned, progress, useProgress, type Outline } from "@/lib/store/progress";
import { SearchDialog } from "./search-dialog";
import { Onboarding } from "./onboarding";
import { SyncManager } from "@/lib/sync/sync-manager";

function SettingsApplier() {
  const settings = useSettings();
  useEffect(() => {
    applySettingsToDocument(settings);
    if (settings.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applySettingsToDocument(settingsStore.get());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [settings]);
  return null;
}

function AchievementWatcher({ outline }: { outline: Outline }) {
  const state = useProgress();
  useEffect(() => {
    if (!state.updatedAt) return;
    const earned = newlyEarned(state, outline);
    if (!earned.length) return;
    progress.grantAchievements(earned);
    for (const id of earned) {
      const a = achievements.find((x) => x.id === id);
      if (a) toast(`Achievement: ${a.title}`, { description: a.description, tone: "success", duration: 5000 });
    }
  }, [state, outline]);
  return null;
}

export function Providers({ children, outline }: { children: ReactNode; outline: Outline }) {
  return (
    <TooltipProvider>
      <SettingsApplier />
      <AchievementWatcher outline={outline} />
      <SyncManager />
      {children}
      <SearchDialog />
      <Onboarding />
      <Toaster />
    </TooltipProvider>
  );
}
