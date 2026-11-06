import { highlightR } from "@/lib/r/language";
import { cn } from "@/lib/utils";

/** Server-friendly highlighted R code (same colours as the editor). */
export function StaticCode({
  code,
  lineNumbers = false,
  highlight = [],
  error = [],
  className,
  wrap = false,
}: {
  code: string;
  lineNumbers?: boolean;
  highlight?: number[];
  error?: number[];
  className?: string;
  wrap?: boolean;
}) {
  const lines = highlightR(code.replace(/\n$/, ""));
  return (
    <pre className={cn("code-static overflow-x-auto bg-code py-3 scrollbar-thin", className)}>
      <code>
        {lines.map((spans, i) => (
          <span
            key={i}
            className={cn(
              "block px-4",
              lineNumbers && "pl-2",
              highlight.includes(i + 1) && "bg-info-soft",
              error.includes(i + 1) && "bg-danger-soft",
              wrap && "whitespace-pre-wrap break-words",
            )}
          >
            {lineNumbers && <span className="mr-4 inline-block w-6 select-none text-right text-[var(--code-gutter)]">{i + 1}</span>}
            {spans.length === 0 ? " " : spans.map((s, j) => (s.cls ? <span key={j} className={s.cls}>{s.text}</span> : s.text))}
          </span>
        ))}
      </code>
    </pre>
  );
}
