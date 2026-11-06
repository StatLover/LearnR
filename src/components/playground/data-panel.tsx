"use client";

import { useRef, useState } from "react";
import { Database, Upload, FileCheck2, AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rSession } from "@/lib/r/session";
import type { DatasetInfo } from "@/content/types";

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

export function DataPanel({ datasets, onInsert }: { datasets: DatasetInfo[]; onInsert: (code: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<string[]>([]);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const upload = async (f: File | undefined) => {
    if (!f) return;
    const v = await validateUpload(f);
    if (!v.ok) return setMsg({ ok: false, text: v.error });
    await rSession.writeFile(v.name, v.data);
    setUploads((u) => [...new Set([...u, v.name])]);
    setMsg({ ok: true, text: `Uploaded as data/${v.name}. It stays in R's memory until you reload the page – nothing is sent to a server.` });
    onInsert(`my_data <- read.csv("data/${v.name}")\nhead(my_data)\nstr(my_data)`);
  };
  return (
    <div className="space-y-4 text-sm">
      <div>
        <p className="mb-2 flex items-center gap-2 font-semibold"><Database className="size-4 text-primary" /> Sample datasets</p>
        <ul className="space-y-1.5">
          {datasets.map((d) => (
            <li key={d.id} className="rounded-lg border border-border bg-card p-2.5">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{d.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{d.source === "built-in" ? d.path : d.path}</p>
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Insert code that loads ${d.name}`}
                  onClick={() => onInsert(d.source === "built-in" ? `head(${d.path})\nstr(${d.path})` : `${d.id} <- read.csv("${d.path}")\nhead(${d.id})\nstr(${d.id})`)}
                >
                  <Plus />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-2 flex items-center gap-2 font-semibold"><Upload className="size-4 text-primary" /> Your own data</p>
        <input ref={input} type="file" accept=".csv,.tsv,.txt,text/csv,text/plain" className="sr-only" id="data-upload" onChange={(e) => void upload(e.target.files?.[0]).finally(() => { if (input.current) input.current.value = ""; })} />
        <Button variant="outline" size="sm" className="w-full" onClick={() => input.current?.click()}>
          <Upload /> Upload a CSV file
        </Button>
        <p className="mt-1.5 text-xs text-muted-foreground">.csv, .tsv or .txt, up to 5 MB. Files stay in your browser.</p>
        {msg && (
          <p role="status" className={`mt-2 flex gap-1.5 rounded-md p-2 text-xs ${msg.ok ? "bg-success-soft" : "bg-danger-soft text-danger"}`}>
            {msg.ok ? <FileCheck2 className="size-4 shrink-0 text-success" /> : <AlertTriangle className="size-4 shrink-0" />} {msg.text}
          </p>
        )}
        {uploads.length > 0 && (
          <ul className="mt-2 space-y-1 font-mono text-xs">
            {uploads.map((u) => <li key={u}>data/{u}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
