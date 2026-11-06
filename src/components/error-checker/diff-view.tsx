"use client";

import { diffArrays } from "diff";
import { highlightR } from "@/lib/r/language";
import { cn } from "@/lib/utils";

interface Row {
  left: { n: number; text: string; kind: "same" | "removed" } | null;
  right: { n: number; text: string; kind: "same" | "added" } | null;
}

function buildRows(before: string, after: string): Row[] {
  const a = before.split("\n");
  const b = after.split("\n");
  const parts = diffArrays(a, b);
  const rows: Row[] = [];
  let ln = 1;
  let rn = 1;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (!p.added && !p.removed) {
      for (const line of p.value) rows.push({ left: { n: ln++, text: line, kind: "same" }, right: { n: rn++, text: line, kind: "same" } });
    } else if (p.removed) {
      const next = parts[i + 1];
      const added = next?.added ? next.value : [];
      const n = Math.max(p.value.length, added.length);
      for (let k = 0; k < n; k++)
        rows.push({
          left: k < p.value.length ? { n: ln++, text: p.value[k], kind: "removed" } : null,
          right: k < added.length ? { n: rn++, text: added[k], kind: "added" } : null,
        });
      if (next?.added) i++;
    } else {
      for (const line of p.value) rows.push({ left: null, right: { n: rn++, text: line, kind: "added" } });
    }
  }
  return rows;
}

function Line({ text }: { text: string }) {
  const spans = highlightR(text)[0] ?? [];
  return <>{spans.length ? spans.map((s, i) => (s.cls ? <span key={i} className={s.cls}>{s.text}</span> : s.text)) : " "}</>;
}

/** Side-by-side Before / After comparison of the learner's code and the corrected code. */
export function DiffView({ before, after, beforeLabel = "Your code", afterLabel = "Corrected code" }: { before: string; after: string; beforeLabel?: string; afterLabel?: string }) {
  const rows = buildRows(before, after);
  const cell = (c: Row["left"] | Row["right"], side: "left" | "right") => (
    <td
      className={cn(
        "w-1/2 px-2 align-top",
        c?.kind === "removed" && "bg-danger-soft",
        c?.kind === "added" && "bg-success-soft",
        !c && "bg-surface",
        side === "left" && "border-r-2 border-border",
      )}
    >
      {c && (
        <div className="flex gap-2">
          <span className="w-6 shrink-0 select-none text-right text-[var(--code-gutter)]">{c.n}</span>
          <span className="w-3 shrink-0 select-none font-bold" aria-hidden>
            {c.kind === "removed" ? <span className="text-danger">−</span> : c.kind === "added" ? <span className="text-success">+</span> : ""}
          </span>
          <span className="whitespace-pre-wrap break-all">
            <span className="sr-only">{c.kind === "removed" ? "removed: " : c.kind === "added" ? "added: " : ""}</span>
            <Line text={c.text} />
          </span>
        </div>
      )}
    </td>
  );
  return (
    <div className="overflow-x-auto rounded-2xl border-2 border-border bg-code scrollbar-thin">
      <table className="code-static w-full border-collapse text-[13px]">
        <thead>
          <tr className="border-b-2 border-border bg-surface-2/70 text-left text-xs text-muted-foreground">
            <th scope="col" className="border-r-2 border-border px-3 py-2 font-display font-semibold">
              <span className="mr-1.5 inline-block size-2 rounded-full bg-coral align-middle" aria-hidden />
              Before – {beforeLabel}
            </th>
            <th scope="col" className="px-3 py-2 font-display font-semibold">
              <span className="mr-1.5 inline-block size-2 rounded-full bg-mint align-middle" aria-hidden />
              After – {afterLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {cell(r.left, "left")}
              {cell(r.right, "right")}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
