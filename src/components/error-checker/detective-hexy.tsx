import { Hexy, type HexyMood } from "@/components/brand/mascot";
import { cn } from "@/lib/utils";

/**
 * Hexy on detective duty: the mascot holding a magnifying glass.
 * (The glass is a small SVG overlay drawn in Hexy's 120×130 coordinate space.)
 */
export function DetectiveHexy({ mood = "happy", size = 120, animate, className, title }: { mood?: HexyMood; size?: number; animate?: boolean; className?: string; title?: string }) {
  const height = (size * 130) / 120;
  return (
    <span className={cn("relative inline-block shrink-0", animate && "animate-bob", className)} style={{ width: size, height }} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <Hexy mood={mood} size={size} />
      {mood !== "celebrate" && (
        <svg viewBox="0 0 120 130" width={size} height={height} className="absolute inset-0 overflow-visible" aria-hidden>
          {/* handle */}
          <line x1="111" y1="95" x2="120.5" y2="82" stroke="#8a4b14" strokeWidth="6" strokeLinecap="round" />
          <line x1="111" y1="95" x2="120.5" y2="82" stroke="#b86b2a" strokeWidth="3" strokeLinecap="round" />
          {/* lens */}
          <circle cx="127" cy="71" r="13" fill="#d9f1ff" fillOpacity="0.75" stroke="#ffbd14" strokeWidth="4.5" />
          <circle cx="127" cy="71" r="13" fill="none" stroke="#d99a00" strokeWidth="1.2" />
          <path d="M120 66 q3 -5 9 -5" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* hand */}
          <circle cx="111" cy="95" r="5.5" fill="#4b4bd8" />
        </svg>
      )}
    </span>
  );
}
