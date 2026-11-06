"use client";

import { useState } from "react";
import { Download, Maximize2, Table2 } from "lucide-react";
import type { ConsoleLine, EnvVariable, RTable } from "@/lib/r/console";
import { cn, downloadBlob, downloadText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const KIND_CLASS: Record<ConsoleLine["kind"], string> = {
  stdout: "text-foreground",
  stderr: "text-danger",
  error: "text-danger font-medium",
  warning: "text-warning",
  message: "text-info",
  info: "text-muted-foreground",
  system: "text-muted-foreground italic",
};

export function ConsoleView({
  lines,
  running,
  empty = "Output will appear here when you run your code.",
  className,
  maxHeight,
}: {
  lines: ConsoleLine[];
  running?: boolean;
  empty?: string;
  className?: string;
  maxHeight?: number | string;
}) {
  return (
    <div
      className={cn("code-static overflow-auto bg-console px-4 py-3 text-[13px] scrollbar-thin", className)}
      style={{ maxHeight }}
      role="log"
      aria-live="polite"
      aria-label="Console output"
      tabIndex={0}
    >
      {lines.length === 0 && !running && <p className="font-sans text-sm text-muted-foreground">{empty}</p>}
      {lines.map((l, i) => (
        <pre key={i} className={cn("whitespace-pre-wrap break-words", KIND_CLASS[l.kind])}>
          {l.text || " "}
        </pre>
      ))}
      {running && (
        <p className="mt-1 flex items-center gap-1.5 font-sans text-sm text-muted-foreground" aria-live="polite">
          <span className="typing-dot size-1.5 rounded-full bg-current" />
          <span className="typing-dot size-1.5 rounded-full bg-current" />
          <span className="typing-dot size-1.5 rounded-full bg-current" />
          <span className="ml-1">Running…</span>
        </p>
      )}
    </div>
  );
}

export function PlotGallery({ images, name = "plot" }: { images: string[]; name?: string }) {
  const [zoom, setZoom] = useState<string | null>(null);
  if (!images.length) return <p className="p-4 text-sm text-muted-foreground">No plots yet. Plots made with plot(), hist(), barplot(), boxplot() or ggplot2 appear here.</p>;
  const save = async (src: string, i: number) => {
    const blob = await (await fetch(src)).blob();
    downloadBlob(`${name}-${i + 1}.png`, blob);
  };
  return (
    <div className="grid gap-4 p-4">
      {images.map((src, i) => (
        <figure key={i} className="overflow-hidden rounded-lg border border-border bg-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={`Plot ${i + 1} produced by your R code`} className="mx-auto block h-auto w-full max-w-[900px]" />
          <figcaption className="flex items-center justify-between gap-2 border-t border-border px-3 py-2 text-xs text-muted-foreground">
            <span>Plot {i + 1}</span>
            <span className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => setZoom(src)} aria-label={`Enlarge plot ${i + 1}`}>
                <Maximize2 /> Enlarge
              </Button>
              <Button size="sm" variant="ghost" onClick={() => save(src, i)} aria-label={`Download plot ${i + 1} as PNG`}>
                <Download /> PNG
              </Button>
            </span>
          </figcaption>
        </figure>
      ))}
      <Dialog open={zoom !== null} onOpenChange={(o) => !o && setZoom(null)}>
        <DialogContent title="Plot" className="max-w-5xl" hideTitle>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {zoom && <img src={zoom} alt="Enlarged plot" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function tableToCsv(t: RTable) {
  const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return [t.names.map(esc).join(","), ...t.rows.map((r) => r.map(esc).join(","))].join("\n");
}

export function DataViewer({ tables }: { tables: RTable[] }) {
  const [active, setActive] = useState(0);
  if (!tables.length)
    return (
      <p className="p-4 text-sm text-muted-foreground">
        Data frames you print (or open with <code className="font-mono">View(df)</code>) appear here as an interactive table.
      </p>
    );
  const t = tables[Math.min(active, tables.length - 1)];
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="flex flex-wrap items-center gap-2">
        {tables.length > 1 && (
          <select
            className="h-8 max-w-full rounded-md border border-border bg-card px-2 text-xs"
            value={active}
            onChange={(e) => setActive(Number(e.target.value))}
            aria-label="Choose a table"
          >
            {tables.map((x, i) => (
              <option key={i} value={i}>
                {x.label.slice(0, 60)}
              </option>
            ))}
          </select>
        )}
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Table2 className="size-3.5" /> {t.nrow} rows × {t.ncol} columns{t.nrow > t.rows.length ? ` (showing first ${t.rows.length})` : ""}
        </span>
        <Button size="sm" variant="ghost" className="ml-auto" onClick={() => downloadText("table.csv", tableToCsv(t), "text/csv")}>
          <Download /> CSV
        </Button>
      </div>
      <div className="max-h-80 overflow-auto rounded-lg border border-border scrollbar-thin">
        <table className="w-full border-collapse text-xs">
          <caption className="sr-only">{t.label}</caption>
          <thead className="sticky top-0 bg-surface">
            <tr>
              <th scope="col" className="border-b border-border px-2 py-1.5 text-right font-medium text-muted-foreground">#</th>
              {t.names.map((n, i) => (
                <th key={i} scope="col" className="border-b border-border px-2 py-1.5 text-left font-semibold">
                  {n}
                  <span className="block font-normal text-muted-foreground">{t.types[i]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono">
            {t.rows.map((r, i) => (
              <tr key={i} className="odd:bg-surface/50">
                <td className="border-b border-border px-2 py-1 text-right text-muted-foreground">{i + 1}</td>
                {r.map((v, j) => (
                  <td key={j} className={cn("border-b border-border px-2 py-1 whitespace-nowrap", v === "NA" && "text-muted-foreground italic")}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function EnvironmentPane({ vars }: { vars: EnvVariable[] }) {
  if (!vars.length) return <p className="p-4 text-sm text-muted-foreground">No variables yet. When your code creates variables (for example <code className="font-mono">x &lt;- 5</code>) they are listed here, like RStudio&apos;s Environment pane.</p>;
  return (
    <div className="overflow-auto p-3 scrollbar-thin">
      <table className="w-full text-xs">
        <caption className="sr-only">Variables in this workspace</caption>
        <thead>
          <tr className="text-left text-muted-foreground">
            <th scope="col" className="px-2 py-1 font-medium">Name</th>
            <th scope="col" className="px-2 py-1 font-medium">Type</th>
            <th scope="col" className="px-2 py-1 font-medium">Size</th>
            <th scope="col" className="px-2 py-1 font-medium">Value</th>
          </tr>
        </thead>
        <tbody>
          {vars.map((v) => (
            <tr key={v.name} className="border-t border-border align-top">
              <td className="px-2 py-1.5 font-mono font-semibold">{v.name}</td>
              <td className="px-2 py-1.5">{v.class}</td>
              <td className="px-2 py-1.5 whitespace-nowrap text-muted-foreground">{v.size}</td>
              <td className="px-2 py-1.5 font-mono text-muted-foreground break-all">{v.preview}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
