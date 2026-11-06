"use client";

import { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Check, Copy, Loader2, PencilLine, Play, Terminal, ImageIcon, Undo2, Lightbulb } from "lucide-react";
import type { CodeExample } from "@/content/types";
import { StaticCode } from "@/components/code/static-code";
import { ConsoleView, PlotGallery } from "@/components/code/output-panels";
import { CodeRunner } from "@/components/code/code-runner";
import { Markdown } from "@/components/content/markdown";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { rSession } from "@/lib/r/session";
import type { RunResult } from "@/lib/r/console";
import { progress, useProgress } from "@/lib/store/progress";
import { useSettings } from "@/lib/store/settings";
import { useResolvedTheme } from "@/hooks/use-theme";
import { copyText, cn } from "@/lib/utils";

/** Ask a page-level playground (if any) to load some code. */
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

/**
 * A lesson code example: watch it run (real output from R), compare with the
 * expected output, read a line-by-line explanation, then switch to "edit"
 * mode to experiment with it.
 */
export function ExampleBlock({ example, lessonId, lessonTitle, onEditChange }: { example: CodeExample; lessonId: string; lessonTitle: string; onEditChange?: (code: string | null) => void }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [hover, setHover] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
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

  const toggleEdit = (on: boolean) => {
    setEditing(on);
    onEditChange?.(on ? example.code : null);
  };

  return (
    <figure className="not-prose overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]" aria-label={example.title ?? "Code example"}>
      <div className="flex flex-wrap items-center gap-1.5 border-b-2 border-border bg-surface-2/70 px-3 py-2">
        <span className="mr-auto flex items-center gap-2 font-display font-semibold">
          <span className="hidden gap-1.5 sm:flex" aria-hidden>
            <span className="size-3 rounded-full bg-coral" />
            <span className="size-3 rounded-full bg-sun" />
            <span className="size-3 rounded-full bg-mint" />
          </span>
          {example.title ?? "Example"}
        </span>
        {!editing && (
          <Button size="sm" variant="success" onClick={run} disabled={running} aria-label={`Run example: ${example.title ?? "code"}`}>
            {running ? <Loader2 className="animate-spin" /> : <Play className="fill-current" />} Run
          </Button>
        )}
        <Button size="sm" variant={editing ? "outline" : "grape"} onClick={() => toggleEdit(!editing)}>
          {editing ? <Undo2 /> : <PencilLine />} {editing ? "Back to example" : "Edit & experiment"}
        </Button>
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
            onClick={() => progress.toggleBookmark({ id: bookmarkId, kind: "example", title: `${example.title ?? "Example"} – ${lessonTitle}`, href: `/learn/${lessonId}` })}
          >
            {bookmarked ? <BookmarkCheck className="text-primary" /> : <Bookmark />}
          </Button>
        </Tooltip>
      </div>

      {editing ? (
        <div className="p-3">
          <p className="mb-2 flex items-center gap-2 px-1 text-sm font-semibold text-grape">
            <PencilLine className="size-4" /> Your copy – change anything and press Run. {example.tryIt ? "" : "Can you predict the output first?"}
          </p>
          {example.tryIt && (
            <div className="mb-3 flex gap-2 rounded-2xl bg-grape-soft px-4 py-2.5 text-sm">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-grape" />
              <Markdown runnableCode={false}>{example.tryIt}</Markdown>
            </div>
          )}
          <CodeRunner initialCode={example.code} workspace={`lesson:${lessonId}:edit`} variant="compact" title={example.title} showSave editorMinHeight={120} onCodeChange={(c) => onEditChange?.(c)} />
        </div>
      ) : (
        <>
          <StaticCode code={example.code} lineNumbers highlight={hover} className="py-4 text-[14px]" />
          {result && (
            <div className="border-t-2 border-border">
              <p className="flex items-center gap-1.5 bg-mint-soft px-4 py-1.5 text-xs font-bold text-success">
                <Terminal className="size-3.5" /> Your output (from real R) · {(result.elapsedMs / 1000).toFixed(2)} s
              </p>
              <ConsoleView lines={result.lines} empty="(This code printed nothing.)" maxHeight={300} />
              {result.images.length > 0 && <PlotGallery images={result.images} />}
            </div>
          )}
          {(example.output !== undefined || example.plot) && (
            <div className="border-t-2 border-border">
              <p className="flex items-center gap-1.5 bg-surface-2/70 px-4 py-1.5 text-xs font-bold text-muted-foreground">
                {example.output ? <Terminal className="size-3.5" /> : <ImageIcon className="size-3.5" />} Expected output
              </p>
              {example.output ? (
                <pre className="code-static overflow-x-auto bg-console px-4 py-3 text-[13px] whitespace-pre">{example.output}</pre>
              ) : (
                <p className="bg-console px-4 py-3 text-sm font-semibold text-muted-foreground">This code draws a plot – press Run to see it.</p>
              )}
            </div>
          )}
        </>
      )}

      {!editing && (example.explanation?.length || example.outputNote || example.tryIt) ? (
        <figcaption className="space-y-4 border-t-2 border-border p-4 text-[15px]">
          {example.explanation && example.explanation.length > 0 && (
            <div>
              <p className="mb-2 font-display text-base font-semibold">Line by line</p>
              <ol className="space-y-2">
                {example.explanation.map((n, i) => (
                  <li
                    key={i}
                    tabIndex={0}
                    onMouseEnter={() => setHover(noteLines[i])}
                    onMouseLeave={() => setHover([])}
                    onFocus={() => setHover(noteLines[i])}
                    onBlur={() => setHover([])}
                    className="flex gap-3 rounded-2xl border-2 border-transparent p-2 outline-none transition-colors hover:border-primary/30 hover:bg-primary-soft/50 focus-visible:border-primary/50 focus-visible:bg-primary-soft/50"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-primary font-display text-xs font-bold text-white">{i + 1}</span>
                    <span className="grid min-w-0 flex-1 gap-1 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-4">
                      <code className="code-static self-start overflow-x-auto rounded-lg bg-code px-2 py-1 text-[12.5px] whitespace-pre">{n.code}</code>
                      <Markdown runnableCode={false}>{n.text}</Markdown>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {example.outputNote && (
            <div className="rounded-2xl border-2 border-sky/30 bg-sky-soft px-4 py-3">
              <p className="mb-1 font-display text-xs font-semibold uppercase tracking-wider text-sky">Reading the output</p>
              <Markdown runnableCode={false}>{example.outputNote}</Markdown>
            </div>
          )}
          {example.tryIt && (
            <div className={cn("flex flex-wrap items-center gap-3 rounded-2xl border-2 border-dashed border-grape/50 bg-grape-soft/50 px-4 py-3")}>
              <PencilLine className="size-5 shrink-0 text-grape" />
              <div className="min-w-0 flex-1 basis-[12rem]">
                <span className="font-display font-semibold text-grape">Try it yourself: </span>
                <Markdown runnableCode={false} className="inline [&>p]:inline">{example.tryIt}</Markdown>
              </div>
              <Button size="sm" variant="grape" onClick={() => toggleEdit(true)}>
                Edit the code
              </Button>
            </div>
          )}
        </figcaption>
      ) : null}
    </figure>
  );
}
