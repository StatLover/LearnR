/**
 * Hexy – R Academy's mascot: a calm, minimal hexagon (a nod to the hex
 * stickers the R community loves). It is a non-interactive brand mark, not a
 * character you talk to: no limbs, no speech, no animation. Colours come from
 * the theme tokens, so it adapts to light and dark mode. Pure SVG.
 *
 * Moods only change the face slightly, so the mark stays consistent.
 */
import { cn } from "@/lib/utils";

export type HexyMood = "happy" | "wave" | "celebrate" | "think" | "oops" | "cool" | "sleep" | "point";

/** Rounded hexagon in a 120×130 box (pointy top). */
const BODY = "M60 6 L106 32.5 Q110 34.8 110 39.5 L110 90.5 Q110 95.2 106 97.5 L60 124 Q60 124 56 121.7 L14 97.5 Q10 95.2 10 90.5 L10 39.5 Q10 34.8 14 32.5 Z";
const INNER = "M60 18 L98 39.8 L98 90.2 L60 112 L22 90.2 L22 39.8 Z";

function Face({ mood }: { mood: HexyMood }) {
  const ink = { stroke: "var(--on-accent)", fill: "none", strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const dot = { fill: "var(--on-accent)" };
  switch (mood) {
    case "celebrate":
      return (
        <g>
          <path d="M40 63 q6 -7 12 0" style={ink} />
          <path d="M68 63 q6 -7 12 0" style={ink} />
          <path d="M44 80 q16 12 32 0" style={ink} />
        </g>
      );
    case "sleep":
      return (
        <g>
          <path d="M40 64 h12" style={ink} />
          <path d="M68 64 h12" style={ink} />
          <path d="M54 82 h12" style={ink} />
        </g>
      );
    case "think":
      return (
        <g>
          <rect x="45" y="52" width="7" height="12" rx="3.5" style={dot} />
          <rect x="71" y="52" width="7" height="12" rx="3.5" style={dot} />
          <path d="M52 82 h18" style={ink} />
        </g>
      );
    case "oops":
      return (
        <g>
          <rect x="43" y="56" width="7" height="12" rx="3.5" style={dot} />
          <rect x="70" y="56" width="7" height="12" rx="3.5" style={dot} />
          <path d="M48 86 q12 -7 24 0" style={ink} />
        </g>
      );
    default:
      return (
        <g>
          <rect x="43" y="55" width="7" height="12" rx="3.5" style={dot} />
          <rect x="70" y="55" width="7" height="12" rx="3.5" style={dot} />
          <path d="M47 80 q13 9 26 0" style={ink} />
        </g>
      );
  }
}

export function Hexy({
  mood = "happy",
  size = 120,
  className,
  title,
}: {
  mood?: HexyMood;
  size?: number;
  className?: string;
  /** Kept for compatibility; the mascot does not animate. */
  animate?: boolean;
  /** Accessible label; decorative (aria-hidden) when omitted. */
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 130"
      width={size}
      height={(size * 130) / 120}
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <path d={BODY} style={{ fill: "var(--primary)" }} />
      <path d={INNER} style={{ fill: "none", stroke: "var(--on-accent)", strokeOpacity: 0.22, strokeWidth: 2, strokeLinejoin: "round" }} />
      <Face mood={mood} />
    </svg>
  );
}

/** Small mascot mark for compact places (logo, list items). */
export function HexyAvatar({ size = 36, mood = "happy", className }: { size?: number; mood?: HexyMood; className?: string }) {
  return <Hexy mood={mood} size={size} className={className} />;
}
