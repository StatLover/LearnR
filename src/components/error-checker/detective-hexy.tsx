import { Hexy, type HexyMood } from "@/components/brand/mascot";
import { cn } from "@/lib/utils";

/**
 * The mascot with a simple magnifying-glass glyph, used on the Error
 * Detective page. Drawn in the mascot's 120×130 coordinate space.
 */
export function DetectiveHexy({ mood = "happy", size = 120, className, title }: { mood?: HexyMood; size?: number; animate?: boolean; className?: string; title?: string }) {
  const height = (size * 130) / 120;
  return (
    <span className={cn("relative inline-block shrink-0", className)} style={{ width: size, height }} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <Hexy mood={mood} size={size} />
      <svg viewBox="0 0 120 130" width={size} height={height} className="absolute inset-0 overflow-visible" aria-hidden>
        <line x1="106" y1="104" x2="120" y2="122" style={{ stroke: "var(--foreground)", strokeWidth: 7, strokeLinecap: "round" }} />
        <circle cx="96" cy="90" r="16" style={{ fill: "var(--card)", fillOpacity: 0.85, stroke: "var(--foreground)", strokeWidth: 5 }} />
      </svg>
    </span>
  );
}
