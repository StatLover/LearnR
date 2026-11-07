import { cn } from "@/lib/utils";

const COLORS = ["var(--mint)", "var(--sun)", "var(--coral)", "var(--sky)", "var(--grape)", "var(--pink)", "var(--tangerine)"];

/** Softly floating hexagons used as background decoration in heroes. */
export function FloatingHexes({ className, count = 7 }: { className?: string; count?: number }) {
  const items = Array.from({ length: count }, (_, i) => ({
    left: `${(i * 37 + 7) % 92}%`,
    top: `${(i * 53 + 11) % 85}%`,
    size: 18 + ((i * 13) % 26),
    color: COLORS[i % COLORS.length],
    delay: `${(i * 0.7) % 4}s`,
    duration: `${6 + (i % 4)}s`,
  }));
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {items.map((h, i) => (
        <svg key={i} viewBox="0 0 24 26" className="absolute animate-float opacity-40" style={{ left: h.left, top: h.top, width: h.size, animationDelay: h.delay, animationDuration: h.duration }}>
          <path d="M12 1 L23 7 L23 19 L12 25 L1 19 L1 7 Z" fill={h.color} />
        </svg>
      ))}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, description, className, align = "left" }: { eyebrow?: string; title: string; description?: string; className?: string; align?: "left" | "center" }) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-2xl text-center", className)}>
      {eyebrow && <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>}
      <h2 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-[15px] font-semibold text-muted-foreground">{description}</p>}
    </div>
  );
}
