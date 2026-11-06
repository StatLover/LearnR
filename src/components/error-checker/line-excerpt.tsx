import type { ReactNode } from "react";
import { highlightR, type Span } from "@/lib/r/language";
import { cn } from "@/lib/utils";

/** The token R complained about, as reported by the analysis (1-based columns, `to` exclusive). */
export interface ExcerptToken {
  line: number;
  from: number;
  to: number;
}

function renderSpans(spans: Span[], token: ExcerptToken | null, lineNo: number): ReactNode {
  if (!spans.length) return " ";
  if (!token || token.line !== lineNo) return spans.map((s, i) => (s.cls ? <span key={i} className={s.cls}>{s.text}</span> : s.text));
  const out: ReactNode[] = [];
  let col = 0;
  spans.forEach((s, i) => {
    const start = col;
    const end = col + s.text.length;
    col = end;
    const a = Math.max(start, token.from - 1);
    const b = Math.min(end, token.to - 1);
    if (a >= b) {
      out.push(<span key={i} className={s.cls || undefined}>{s.text}</span>);
      return;
    }
    if (a > start) out.push(<span key={`${i}a`} className={s.cls || undefined}>{s.text.slice(0, a - start)}</span>);
    out.push(
      <mark key={`${i}b`} className={cn(s.cls, "rounded-sm bg-danger-soft text-inherit ring-2 ring-danger/50 cm-error-token")}>
        {s.text.slice(a - start, b - start)}
      </mark>,
    );
    if (b < end) out.push(<span key={`${i}c`} className={s.cls || undefined}>{s.text.slice(b - start)}</span>);
  });
  return out;
}

/** A few lines of the learner's code around the problem, with the failing line(s) and token marked. */
export function LineExcerpt({ code, lineStart, lineEnd, token, kind = "error" }: { code: string; lineStart: number; lineEnd?: number | null; token?: ExcerptToken | null; kind?: "error" | "warning" | "highlight" }) {
  const lines = highlightR(code.replace(/\n$/, ""));
  const last = Math.min(lines.length, lineEnd && lineEnd >= lineStart ? lineEnd : lineStart);
  // Show one line of context on each side; long ranges are trimmed to 8 lines.
  const from = Math.max(1, lineStart - 1);
  const to = Math.min(lines.length, Math.max(last + 1, from), from + 7);
  const marked = (n: number) => n >= lineStart && n <= last;
  const tone = kind === "error" ? "bg-danger-soft shadow-[inset_3px_0_0_var(--danger)]" : kind === "warning" ? "bg-warning-soft shadow-[inset_3px_0_0_var(--sun)]" : "bg-info-soft shadow-[inset_3px_0_0_var(--info)]";
  if (lineStart > lines.length) return null;
  return (
    <pre className="code-static overflow-x-auto rounded-2xl border-2 border-border bg-code py-2 text-[13px] scrollbar-thin">
      <code>
        {lines.slice(from - 1, to).map((spans, i) => {
          const n = from + i;
          return (
            <span key={n} className={cn("flex px-2", marked(n) && tone)}>
              <span className="mr-3 inline-block w-6 shrink-0 select-none text-right text-[var(--code-gutter)]">{n}</span>
              <span className="whitespace-pre-wrap break-all">
                {marked(n) && <span className="sr-only">(problem line) </span>}
                {renderSpans(spans, token ?? null, n)}
              </span>
            </span>
          );
        })}
      </code>
    </pre>
  );
}
