"use client";

import { useRef, useState } from "react";
import { Bug, Calculator, Dumbbell, GraduationCap, ListOrdered, MessageCircleQuestion } from "lucide-react";
import { TutorChat, MODES } from "./tutor-chat";
import { CodeRunner, type CodeRunnerHandle } from "@/components/code/code-runner";
import { Card } from "@/components/ui/card";
import { updateSettings, useSettings, type TutorMode } from "@/lib/store/settings";
import type { RunResult } from "@/lib/r/console";
import { transcript } from "@/lib/r/console";
import { cn } from "@/lib/utils";

const ICONS: Record<TutorMode, typeof Bug> = {
  beginner: GraduationCap,
  "step-by-step": ListOrdered,
  debugging: Bug,
  practice: Dumbbell,
  quiz: MessageCircleQuestion,
  statistics: Calculator,
};

export function TutorPage() {
  const settings = useSettings();
  const runner = useRef<CodeRunnerHandle>(null);
  const [last, setLast] = useState<RunResult | null>(null);
  return (
    <div className="space-y-4">
      <div role="radiogroup" aria-label="Tutor mode" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {MODES.map((m) => {
          const Icon = ICONS[m.value];
          const on = settings.tutorMode === m.value;
          return (
            <button
              key={m.value}
              role="radio"
              aria-checked={on}
              onClick={() => updateSettings({ tutorMode: m.value })}
              className={cn("rounded-xl border p-3 text-left transition-colors cursor-pointer", on ? "border-primary bg-primary-soft" : "border-border bg-card hover:bg-surface-2")}
            >
              <Icon className={cn("size-5", on ? "text-primary" : "text-muted-foreground")} />
              <p className="mt-1.5 text-sm font-semibold">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.desc}</p>
            </button>
          );
        })}
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <Card className="flex h-[72vh] min-h-[520px] flex-col overflow-hidden">
          <TutorChat
            getCode={() => {
              const code = runner.current?.getCode() ?? "";
              return code.trim() ? { code, output: last && last.code === code ? transcript(last.lines) : null } : null;
            }}
          />
        </Card>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Your code: write or paste R code here, run it, then press <strong>Send my code to AI</strong> to ask about it together with its real output.
          </p>
          <CodeRunner
            ref={runner}
            workspace="tutor-scratch"
            variant="panel"
            storageKey="tutor-scratch"
            initialCode={'# Paste or write R code here, then press Run\nscores <- c(72, 85, 90)\nmean(scores)\n'}
            onResult={setLast}
            downloadName="tutor-code.R"
          />
        </div>
      </div>
    </div>
  );
}
