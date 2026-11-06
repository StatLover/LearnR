import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Tiny inline-markdown renderer for short one-line texts (card summaries):
 * `code`, **bold** and *italic* only. Much lighter than the full Markdown component,
 * which matters on pages that show 100+ cards.
 */
export function InlineMd({ children, className, codeClassName }: { children: string; className?: string; codeClassName?: string }) {
  const parts: ReactNode[] = [];
  const re = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(children))) {
    if (m.index > last) parts.push(children.slice(last, m.index));
    if (m[1] !== undefined)
      parts.push(
        <code key={m.index} className={cn("rounded-md bg-surface-2 px-1 py-px font-mono text-[0.86em] font-semibold text-foreground [overflow-wrap:anywhere]", codeClassName)}>
          {m[1]}
        </code>,
      );
    else if (m[2] !== undefined) parts.push(<strong key={m.index} className="font-extrabold text-foreground">{m[2]}</strong>);
    else parts.push(<em key={m.index}>{m[3]}</em>);
    last = re.lastIndex;
  }
  if (last < children.length) parts.push(children.slice(last));
  return <span className={className}>{parts}</span>;
}
