"use client";

import { useEffect, type ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";
import { applySettingsToDocument, settingsStore, useSettings } from "@/lib/store/settings";
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

export function Providers({ children, outline }: { children: ReactNode; outline: Outline }) {
  return (
    <OutlineProvider outline={outline}>
      <TooltipProvider>
        <SettingsApplier />
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
