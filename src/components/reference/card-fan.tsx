import { Hexy } from "@/components/brand/mascot";
import { candy, type Candy } from "./candy";

const CARDS: { name: string; color: Candy; rotate: number; x: number }[] = [
  { name: "mean()", color: "sky", rotate: -14, x: 0 },
  { name: "filter()", color: "tangerine", rotate: -2, x: 54 },
  { name: "ggplot()", color: "coral", rotate: 11, x: 108 },
];

/** Decorative hero art for the function library: a fanned hand of function cards with Hexy. */
export function CardFan() {
  return (
    <div aria-hidden className="relative h-40 w-64">
      {CARDS.map((c) => (
        <div
          key={c.name}
          style={{ ...candy(c.color), left: c.x, transform: `rotate(${c.rotate}deg)` }}
          className="absolute top-3 w-28 origin-bottom overflow-hidden rounded-2xl border-2 border-border bg-card shadow-[var(--shadow-pop)]"
        >
          <div className="bg-[var(--c)] px-2.5 py-2">
            <div className="h-1.5 w-8 rounded-full bg-white/60" />
            <div className="mt-2 truncate font-mono text-xs font-bold text-[var(--c-fg)]">{c.name}</div>
          </div>
          <div className="space-y-1.5 p-2.5">
            <div className="h-1.5 w-full rounded-full bg-surface-3" />
            <div className="h-1.5 w-4/5 rounded-full bg-surface-3" />
            <div className="h-1.5 w-3/5 rounded-full bg-surface-3" />
            <div className="mt-2 h-4 rounded-md bg-[var(--c-soft)]" />
          </div>
        </div>
      ))}
      <Hexy mood="point" size={78} className="absolute -bottom-3 -left-8" />
    </div>
  );
}
