"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Loader2, Play, SquareArrowOutUpRight, Terminal, Bookmark, BookmarkCheck, PencilLine, ImageIcon } from "lucide-react";
import type { CodeExample } from "@/content/types";
import { StaticCode } from "@/components/code/static-code";
import { ConsoleView, PlotGallery } from "@/components/code/output-panels";
import { Markdown } from "@/components/content/markdown";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { rSession } from "@/lib/r/session";
import type { RunResult } from "@/lib/r/console";
import { progress, useProgress } from "@/lib/store/progress";
import { useSettings } from "@/lib/store/settings";
import { useResolvedTheme } from "@/hooks/use-theme";
import { copyText, cn } from "@/lib/utils";

/** Ask the lesson's side playground to load some code. */
export function sendToPlayground(code: string) {
  window.dispatchEvent(new CustomEvent("ra:playground", { detail: code }));
}

function linesFor(code: string, fragment: string): number[] {
  const all = code.split("\n");
  const frag = fragment.split("\n").map((l) => l.trim()).filter(Boolean);
  if (!frag.length) return [];
  for (let i = 0; i < all.length; i++) {
    if (all[i].trim() === frag[0] || (frag.length === 1 && all[i].includes(frag[0]))) {
      const out = [i + 1];
      for (let k = 1; k < frag.length && i + k < all.length; k++) out.push(i + k + 1);
      return out;
    }
  }
  return [];
}

export function ExampleBlock({ example, lessonId, lessonTitle }: { example: CodeExample; lessonId: string; lessonTitle: string }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [hover, setHover] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const settings = useSettings();
  const theme = useResolvedTheme();
  const state = useProgress();
  const bookmarkId = `example:${lessonId}:${example.id}`;
  const bookmarked = state.bookmarks.some((b) => b.id === bookmarkId);
  const noteLines = useMemo(() => (example.explanation ?? []).map((n) => linesFor(example.code, n.code)), [example]);

  const run = async () => {
    setRunning(true);
    try {
      setResult(
        await rSession.run(example.code, {
          workspace: `lesson:${lessonId}:example`,
          fresh: true,
          dark: settings.plotTheme === "auto" && theme === "dark",
          timeoutMs: settings.runTimeout * 1000,
        }),
      );
      progress.bumpStat("codeRuns");
    } finally {
      setRunning(false);
    }
  };

  return (
    <figure className="not-prose my-5 overflow-hidden rounded-xl border border-border bg-card" aria-label={example.title ?? "Code example"}>
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-surface px-3 py-1.5">
        <span className="mr-auto text-sm font-semibold">{example.title ?? "Example"}</span>
        <Button size="sm" onClick={run} disabled={running} aria-label={`Run example: ${example.title ?? "code"}`}>
          {running ? <Loader2 className="animate-spin" /> : <Play />} Run
        </Button>
        <Tooltip content="Open in the playground on the right, where you can edit it">
          <Button size="sm" variant="ghost" onClick={() => sendToPlayground(example.code)}>
            <PencilLine /> <span className="hidden sm:inline">Try in playground</span>
          </Button>
        </Tooltip>
        <Tooltip content={copied ? "Copied!" : "Copy code"}>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="Copy code"
            onClick={async () => {
              if (await copyText(example.code)) {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }
            }}
          >
            {copied ? <Check className="text-success" /> : <Copy />}
          </Button>
        </Tooltip>
        <Tooltip content={bookmarked ? "Remove bookmark" : "Bookmark this example"}>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-pressed={bookmarked}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark this example"}
            onClick={() => progress.toggleBookmark({ id: bookmarkId, kind: "example", title: `${example.title ?? "Example"} – ${lessonTitle}`, href: `/learn/${lessonId}#ex-${example.id}` })}
          >
            {bookmarked ? <BookmarkCheck className="text-primary" /> : <Bookmark />}
          </Button>
        </Tooltip>
      </div>
      <div id={`ex-${example.id}`} className="scroll-mt-24">
        <StaticCode code={example.code} lineNumbers highlight={hover} />
      </div>

      {result && (
        <div className="border-t border-border">
          <p className="flex items-center gap-1.5 bg-surface px-3 py-1 text-xs font-semibold text-muted-foreground">
            <Terminal className="size-3.5" /> Your output {result.elapsedMs ? `· ${(result.elapsedMs / 1000).toFixed(2)} s` : ""}
          </p>
          <ConsoleView lines={result.lines} empty="(This code printed nothing.)" maxHeight={300} />
          {result.images.length > 0 && <PlotGallery images={result.images} />}
        </div>
      )}

      {(example.output !== undefined || example.plot) && (
        <div className="border-t border-border">
          <p className="flex items-center gap-1.5 bg-surface px-3 py-1 text-xs font-semibold text-muted-foreground">
            {example.output ? <Terminal className="size-3.5" /> : <ImageIcon className="size-3.5" />} Expected output
          </p>
          {example.output ? (
            <pre className="code-static overflow-x-auto bg-console px-4 py-2.5 text-[13px] whitespace-pre">{example.output}</pre>
          ) : (
            <p className="bg-console px-4 py-2.5 text-sm text-muted-foreground">This code draws a plot. Press Run to see it.</p>
          )}
        </div>
      )}

      {(example.explanation?.length || example.outputNote || example.tryIt) && (
        <figcaption className="space-y-3 border-t border-border p-4 text-sm">
          {example.explanation && example.explanation.length > 0 && (
            <div>
              <p className="mb-2 font-semibold">Line by line</p>
              <ul className="space-y-2">
                {example.explanation.map((n, i) => (
                  <li
                    key={i}
                    tabIndex={0}
                    onMouseEnter={() => setHover(noteLines[i])}
                    onMouseLeave={() => setHover([])}
                    onFocus={() => setHover(noteLines[i])}
                    onBlur={() => setHover([])}
                    className="grid gap-1 rounded-lg p-2 outline-none hover:bg-surface focus-visible:bg-surface sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-4"
                  >
                    <code className="code-static self-start overflow-x-auto rounded-md bg-code px-2 py-1 text-[12.5px] whitespace-pre">{n.code}</code>
                    <Markdown runnableCode={false}>{n.text}</Markdown>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {example.outputNote && (
            <div className="rounded-lg bg-info-soft/70 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-info">Understanding the output</p>
              <Markdown runnableCode={false}>{example.outputNote}</Markdown>
            </div>
          )}
          {example.tryIt && (
            <div className={cn("flex gap-2 rounded-lg border border-dashed border-primary/50 p-3")}>
              <SquareArrowOutUpRight className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <span className="font-semibold">Try it yourself: </span>
                <Markdown runnableCode={false} className="inline">{example.tryIt}</Markdown>
              </div>
            </div>
          )}
        </figcaption>
      )}
    </figure>
  );
}
