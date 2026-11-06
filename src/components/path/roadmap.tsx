"use client";

import Link from "next/link";
import { moduleCompletion, useProgress, type Outline } from "@/lib/store/progress";

/** Modules laid out as a snake: Stage 1 left→right, Stage 2 right→left, Stage 3 left→right. */
const XS = [140, 360, 580, 800];
const ROWS = [80, 205, 330];
const POS: Record<number, [number, number]> = {
  1: [XS[0], ROWS[0]], 2: [XS[1], ROWS[0]], 3: [XS[2], ROWS[0]], 4: [XS[3], ROWS[0]],
  5: [XS[3], ROWS[1]], 6: [XS[2], ROWS[1]], 7: [XS[1], ROWS[1]],
  8: [XS[1], ROWS[2]], 9: [XS[2], ROWS[2]], 10: [XS[3], ROWS[2]],
};
const W = 160;
const H = 58;

function edge(a: [number, number], b: [number, number]) {
  if (a[1] === b[1]) {
    const dir = Math.sign(b[0] - a[0]);
    return { x1: a[0] + (dir * W) / 2, y1: a[1], x2: b[0] - (dir * W) / 2 - dir * 4, y2: b[1] };
  }
  return { x1: a[0], y1: a[1] + H / 2, x2: b[0], y2: b[1] - H / 2 - 4 };
}

export function Roadmap({ outline }: { outline: Outline }) {
  const s = useProgress();
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card p-4">
      <svg viewBox="0 0 940 380" className="h-auto w-full min-w-[680px]" role="img" aria-label="Course roadmap: the ten modules in their recommended order">
        <defs>
          <marker id="rm-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--muted-foreground)" />
          </marker>
        </defs>
        {[["Stage 1 · Absolute beginner", ROWS[0]], ["Stage 2 · Practical skills", ROWS[1]], ["Stage 3 · Intermediate", ROWS[2]]].map(([t, y]) => (
          <text key={String(t)} x={12} y={Number(y) - H / 2 - 12} fontSize={12} fill="var(--muted-foreground)" fontWeight={650}>
            {t}
          </text>
        ))}
        {outline.modules.slice(0, -1).map((m, i) => {
          const a = POS[m.number];
          const b = POS[outline.modules[i + 1].number];
          if (!a || !b) return null;
          const e = edge(a, b);
          return <line key={m.number} {...e} stroke="var(--muted-foreground)" strokeOpacity={0.6} strokeWidth={2} markerEnd="url(#rm-arr)" />;
        })}
        {outline.modules.map((m) => {
          const [x, y] = POS[m.number] ?? [0, 0];
          const c = moduleCompletion(m, s);
          const fill = c.pct === 100 ? "var(--primary-soft)" : c.done > 0 ? "var(--accent-soft)" : "var(--surface)";
          const stroke = c.pct === 100 ? "var(--primary)" : c.done > 0 ? "var(--accent)" : "var(--border)";
          const words = m.title.split(" ");
          const two = m.title.length > 18;
          const mid = Math.ceil(words.length / 2);
          return (
            <Link key={m.number} href={`/learn/module/${m.id}`} aria-label={`Module ${m.number}: ${m.title}, ${c.pct}% complete`}>
              <g className="cursor-pointer">
                <rect x={x - W / 2} y={y - H / 2} width={W} height={H} rx={12} fill={fill} stroke={stroke} strokeWidth={2} />
                <text x={x} y={y - 13} textAnchor="middle" fontSize={10.5} fill="var(--muted-foreground)" fontWeight={650}>
                  MODULE {m.number} · {c.pct}%
                </text>
                <text x={x} y={two ? y + 3 : y + 10} textAnchor="middle" fontSize={12.5} fill="var(--foreground)" fontWeight={600}>
                  {two ? words.slice(0, mid).join(" ") : m.title}
                </text>
                {two && (
                  <text x={x} y={y + 19} textAnchor="middle" fontSize={12.5} fill="var(--foreground)" fontWeight={600}>
                    {words.slice(mid).join(" ")}
                  </text>
                )}
              </g>
            </Link>
          );
        })}
      </svg>
    </div>
  );
}
