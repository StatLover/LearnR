"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bug, Loader2, Play, Search, Terminal } from "lucide-react";
import { StaticCode } from "@/components/code/static-code";
import { ConsoleView } from "@/components/code/output-panels";
import { Hexy } from "@/components/brand/mascot";
import { Button } from "@/components/ui/button";
import { rSession } from "@/lib/r/session";
import type { RunResult } from "@/lib/r/console";
import { progress } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

const BUGS = [
  { id: "typo", label: "A typo in a name", code: `scores <- c(80, 90, 100)\nmean(score)` },
  { id: "bracket", label: "A missing bracket", code: `ages <- c(12, 15, 14\nmax(ages)` },
  { id: "text", label: "Text, not a number", code: `price <- "5"\nprice * 2` },
];

/**
 * A small taste of the Error Detective: run a buggy snippet in real R to see
 * R's own message, then hand the code to the full Error Detective, which
 * explains it, points at the line and tests a fix.
 */
export function ErrorDemo() {
  const router = useRouter();
  const [pick, setPick] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const bug = BUGS[pick];

  const run = async () => {
    setRunning(true);
    try {
      setResult(await rSession.run(bug.code, { workspace: "home:bugs", fresh: true }));
      progress.bumpStat("codeRuns");
    } finally {
      setRunning(false);
    }
  };

  const investigate = () => {
    try {
      sessionStorage.setItem("ra-check-code", bug.code);
      sessionStorage.setItem("ra-check-auto", "1");
    } catch {
      /* ignore */
    }
    router.push("/error-checker");
  };

  const failed = result && result.status !== "ok";

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap gap-2 border-b-2 border-border bg-surface-2/60 p-3" role="radiogroup" aria-label="Choose a buggy snippet">
        {BUGS.map((b, i) => (
          <button
            key={b.id}
            role="radio"
            aria-checked={i === pick}
            onClick={() => {
              setPick(i);
              setResult(null);
            }}
            className={cn(
              "cursor-pointer rounded-full border-2 px-3 py-1 font-display text-sm font-semibold transition-colors",
              i === pick ? "border-coral bg-coral text-white" : "border-border bg-card hover:bg-surface-2",
            )}
          >
            {b.label}
          </button>
        ))}
      </div>
      <StaticCode code={bug.code} lineNumbers className="py-3 text-[14px]" />
      <div className="border-t-2 border-border">
        {result ? (
          <div aria-live="polite">
            <p className="flex items-center gap-1.5 bg-surface-2/70 px-4 py-1.5 text-xs font-bold text-muted-foreground">
              <Terminal className="size-3.5" /> What R really says
            </p>
            <ConsoleView lines={result.lines} maxHeight={160} empty="(No output.)" />
          </div>
        ) : (
          <p className="bg-console px-4 py-3 text-sm font-semibold text-muted-foreground">Press “Run it” to see the real error from R.</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t-2 border-border p-3">
        <Button variant="outline" onClick={run} disabled={running}>
          {running ? <Loader2 className="animate-spin" /> : <Play className="fill-current" />} Run it
        </Button>
        <Button variant="danger" onClick={investigate}>
          <Search /> Find my error
        </Button>
        {failed && (
          <span className="ml-auto flex items-center gap-2 text-sm font-bold text-danger animate-pop-in">
            <Hexy mood="oops" size={36} /> <Bug className="size-4" /> Bug found – let&apos;s investigate!
          </span>
        )}
      </div>
    </div>
  );
}
