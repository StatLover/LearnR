"use client";

import { useEffect, type ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";
import { applySettingsToDocument, SETTINGS_KEY, settingsStore, useSettings } from "@/lib/store/settings";
import type { Outline } from "@/lib/store/progress";
import { SearchDialog } from "./search-dialog";
import { Onboarding } from "./onboarding";
import { SyncManager } from "@/lib/sync/sync-manager";
import { OutlineProvider } from "@/components/game/outline-context";
import { CelebrationLayer } from "@/components/game/celebration-layer";

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

/** Removes data saved by features that no longer exist (the AI tutor's conversation). */
function LegacyCleanup() {
  useEffect(() => {
    try {
      localStorage.removeItem("ra-tutor");
      const raw = localStorage.getItem(SETTINGS_KEY);
      const saved = raw ? JSON.parse(raw) : null;
      if (saved && typeof saved === "object" && "tutorMode" in saved) {
        delete saved.tutorMode;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(saved));
      }
    } catch {
      /* storage unavailable */
    }
  }, []);
  return null;
}

export function Providers({ children, outline }: { children: ReactNode; outline: Outline }) {
  return (
    <OutlineProvider outline={outline}>
      <TooltipProvider>
        <SettingsApplier />
      <LegacyCleanup />
        <SyncManager />
        {children}
        <CelebrationLayer />
        <SearchDialog />
        <Onboarding />
        <Toaster />
      </TooltipProvider>
    </OutlineProvider>
  );
}
