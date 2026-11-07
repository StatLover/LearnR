"use client";

import { useRef, useState } from "react";
import { Upload, FileCheck2, AlertTriangle, Plus, FileSpreadsheet, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopicArt } from "@/components/brand/topic-art";
import type { TopicKind } from "@/lib/game/worlds";
import { rSession } from "@/lib/r/session";
import type { DatasetInfo } from "@/content/types";
import { cn } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = /\.(csv|tsv|txt)$/i;

/** Validate an uploaded data file before it is written into R's file system. */
export async function validateUpload(file: File): Promise<{ ok: true; name: string; data: Uint8Array } | { ok: false; error: string }> {
  if (!ALLOWED.test(file.name)) return { ok: false, error: "Only .csv, .tsv and .txt files can be uploaded." };
  if (file.size === 0) return { ok: false, error: "The file is empty." };
  if (file.size > MAX_BYTES) return { ok: false, error: "The file is larger than 5 MB. Please upload a smaller file." };
  const data = new Uint8Array(await file.arrayBuffer());
  const head = data.slice(0, 8192);
  if (head.includes(0)) return { ok: false, error: "This does not look like a text file (it contains binary data)." };
  try {
    new TextDecoder("utf-8", { fatal: true }).decode(head.length < data.length ? head.slice(0, head.lastIndexOf(10) > 0 ? head.lastIndexOf(10) : head.length) : head);
  } catch {
    return { ok: false, error: "The file is not valid UTF-8 text. Save it as “CSV UTF-8” and try again." };
  }
  const name = file.name.replace(/[^A-Za-z0-9._-]/g, "_").replace(/^\.+/, "").slice(0, 80) || "upload.csv";
  return { ok: true, name, data };
}

/** Code that loads a dataset and takes a first look at it. */
export function datasetCode(d: DatasetInfo) {
  return d.source === "built-in" ? `head(${d.path})\nstr(${d.path})` : `${d.id} <- read.csv("${d.path}")\nhead(${d.id})\nstr(${d.id})`;
}

/** Illustration and colour for each sample dataset (PhET-style mini thumbnails). */
const DATASET_ART: Record<string, { kind: TopicKind; color: string }> = {
  students: { kind: "scatter", color: "sky" },
  survey: { kind: "bar", color: "pink" },
  sales: { kind: "regression", color: "tangerine" },
  patients: { kind: "test", color: "teal" },
  customers_messy: { kind: "clean", color: "coral" },
  housing: { kind: "table", color: "grape" },
  weather: { kind: "calendar", color: "sky" },
  mtcars: { kind: "correlation", color: "mint" },
  iris: { kind: "palette", color: "grape" },
  airquality: { kind: "missing", color: "sun" },
};

export function DatasetList({ datasets, onInsert }: { datasets: DatasetInfo[]; onInsert: (code: string) => void }) {
  return (
    <ul className="space-y-2.5">
      {datasets.map((d) => {
        const art = DATASET_ART[d.id] ?? { kind: "table" as TopicKind, color: "primary" };
        return (
          <li key={d.id} className="flex items-center gap-3 rounded-2xl border-2 border-border bg-surface p-2.5">
            <span className="w-16 shrink-0 overflow-hidden rounded-xl border-2 border-border">
              <TopicArt kind={art.kind} bg={`var(--${art.color}-soft)`} className="block" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{d.name}</span>
              <span className="block truncate font-mono text-[11px] font-semibold text-muted-foreground">{d.path}</span>
              <span className="block text-[11px] font-semibold text-muted-foreground">
                {d.rows.toLocaleString("en-US")} rows · {d.columns.length} columns
              </span>
            </span>
            <Button size="sm" variant="outline" className="shrink-0 px-2.5" aria-label={`Insert code that loads ${d.name}`} onClick={() => onInsert(datasetCode(d))}>
              <Plus /> <span className="hidden sm:inline">Insert</span>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

export function UploadPanel({ onInsert }: { onInsert: (code: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<string[]>([]);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const code = (name: string) => `my_data <- read.csv("data/${name}")\nhead(my_data)\nstr(my_data)`;

  const upload = async (f: File | undefined) => {
    if (!f) return;
    setBusy(true);
    try {
      const v = await validateUpload(f);
      if (!v.ok) return setMsg({ ok: false, text: v.error });
      await rSession.writeFile(v.name, v.data);
      setUploads((u) => [...new Set([...u, v.name])]);
      setMsg({ ok: true, text: `Uploaded as data/${v.name}. It stays in R's memory until you reload the page – nothing is sent to a server.` });
      onInsert(code(v.name));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3 text-sm">
      <input
        ref={input}
        type="file"
        accept=".csv,.tsv,.txt,text/csv,text/plain"
        className="sr-only"
        id="data-upload"
        tabIndex={-1}
        onChange={(e) => void upload(e.target.files?.[0]).finally(() => { if (input.current) input.current.value = ""; })}
      />
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void upload(e.dataTransfer.files?.[0]);
        }}
        className={cn("flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed px-4 py-6 text-center transition-colors", drag ? "border-sky bg-sky-soft" : "border-border-strong bg-surface")}
      >
        <span className="grid size-14 place-items-center rounded-2xl bg-sky text-white shadow-[0_4px_0_var(--sky-shadow)]">
          <FileSpreadsheet className="size-7" />
        </span>
        <p className="font-display text-base font-semibold">Drop a CSV file here</p>
        <Button variant="accent" size="sm" onClick={() => input.current?.click()} disabled={busy}>
          <Upload /> {busy ? "Uploading…" : "Choose a file"}
        </Button>
        <p className="text-xs font-semibold text-muted-foreground">.csv, .tsv or .txt · up to 5 MB</p>
      </div>
      <p className="flex items-start gap-2 rounded-2xl bg-mint-soft px-3 py-2 text-xs font-semibold text-success">
        <ShieldCheck className="size-4 shrink-0" /> Files stay in your browser. R reads them from the <code className="font-mono">data/</code> folder.
      </p>
      {msg && (
        <p role="status" className={cn("flex gap-1.5 rounded-2xl p-3 text-xs font-semibold", msg.ok ? "bg-success-soft" : "bg-danger-soft text-danger")}>
          {msg.ok ? <FileCheck2 className="size-4 shrink-0 text-success" /> : <AlertTriangle className="size-4 shrink-0" />} {msg.text}
        </p>
      )}
      {uploads.length > 0 && (
        <div>
          <p className="mb-1.5 font-display text-sm font-semibold">Your files</p>
          <ul className="space-y-1.5">
            {uploads.map((u) => (
              <li key={u} className="flex items-center gap-2 rounded-xl border-2 border-border bg-surface px-3 py-1.5">
                <span className="min-w-0 flex-1 truncate font-mono text-xs font-semibold">data/{u}</span>
                <Button size="icon-sm" variant="ghost" aria-label={`Insert code that loads ${u}`} onClick={() => onInsert(code(u))}>
                  <Plus />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
