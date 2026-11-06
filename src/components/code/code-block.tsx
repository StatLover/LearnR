"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, ExternalLink, Play, Loader2 } from "lucide-react";
import { StaticCode } from "./static-code";
import { ConsoleView, PlotGallery } from "./output-panels";
import { Button } from "@/components/ui/button";
import { rSession } from "@/lib/r/session";
import type { RunResult } from "@/lib/r/console";
import { copyText, cn } from "@/lib/utils";
import { useResolvedTheme } from "@/hooks/use-theme";
import { useSettings } from "@/lib/store/settings";

export function openInPlayground(code: string) {
  try {
    sessionStorage.setItem("ra-open-code", code);
  } catch {
    /* ignore */
  }
}

/** A read-only code block with Copy, Run and Open-in-playground buttons. */
export function CodeBlock({ code, runnable = true, workspace = "snippets", className, label }: { code: string; runnable?: boolean; workspace?: string; className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const router = useRouter();
  const theme = useResolvedTheme();
  const settings = useSettings();
  const run = async () => {
    setRunning(true);
    try {
      setResult(await rSession.run(code, { workspace, fresh: true, dark: settings.plotTheme === "auto" && theme === "dark", timeoutMs: settings.runTimeout * 1000 }));
    } finally {
      setRunning(false);
    }
  };
  return (
    <div className={cn("not-prose my-3 overflow-hidden rounded-lg border border-border", className)}>
      <div className="flex items-center gap-1 border-b border-border bg-surface px-2 py-1">
        <span className="px-1 text-xs font-medium text-muted-foreground">{label ?? "R"}</span>
        <div className="ml-auto flex gap-0.5">
          {runnable && (
            <Button size="sm" variant="ghost" onClick={run} disabled={running} aria-label="Run this code">
              {running ? <Loader2 className="animate-spin" /> : <Play />} Run
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            aria-label="Copy code"
            onClick={async () => {
              if (await copyText(code)) {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }
            }}
          >
            {copied ? <Check className="text-success" /> : <Copy />} {copied ? "Copied" : "Copy"}
          </Button>
          {runnable && (
            <Button
              size="sm"
              variant="ghost"
              aria-label="Open this code in the playground"
              onClick={() => {
                openInPlayground(code);
                router.push("/playground");
              }}
            >
              <ExternalLink /> Playground
            </Button>
          )}
        </div>
      </div>
      <StaticCode code={code} />
      {result && (
        <div className="border-t border-border">
          <ConsoleView lines={result.lines} empty="(This code printed nothing.)" maxHeight={280} />
          {result.images.length > 0 && <PlotGallery images={result.images} />}
        </div>
      )}
    </div>
  );
}
