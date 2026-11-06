/**
 * Hexy – R Academy's mascot. A friendly hexagon (a nod to the hex stickers
 * the R community loves) with a light-bulb antenna. Pure SVG, so it is crisp
 * at any size and needs no image requests.
 */
import { useId } from "react";
import { cn } from "@/lib/utils";

export type HexyMood = "happy" | "wave" | "celebrate" | "think" | "oops" | "cool" | "sleep" | "point";

const BODY = "M60 14 L100 37 Q104 39.5 104 44 L104 80 Q104 84.5 100 87 L60 110 Q60 110 56 108 L20 87 Q16 84.5 16 80 L16 44 Q16 39.5 20 37 Z";

export function Hexy({
  mood = "happy",
  size = 120,
  className,
  animate = false,
  title,
}: {
  mood?: HexyMood;
  size?: number;
  className?: string;
  /** Gentle bobbing animation. */
  animate?: boolean;
  /** Accessible label; decorative (aria-hidden) when omitted. */
  title?: string;
}) {
  const uid = `hexy${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const eyeY = mood === "sleep" ? 58 : 56;
  return (
    <svg
      viewBox="0 0 120 130"
      width={size}
      height={(size * 130) / 120}
      className={cn("overflow-visible", animate && "animate-bob", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7a7aff" />
          <stop offset="55%" stopColor="#5b5bf6" />
          <stop offset="100%" stopColor="#8f4fe8" />
        </linearGradient>
        <linearGradient id={`${uid}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* shadow */}
      <ellipse cx="60" cy="124" rx="30" ry="4.5" fill="#1b1e3d" opacity="0.12" />

      {/* feet */}
      <ellipse cx="46" cy="115" rx="9" ry="5.5" fill="#3d3dbf" />
      <ellipse cx="74" cy="115" rx="9" ry="5.5" fill="#3d3dbf" />

      {/* arms (behind body) */}
      {mood === "celebrate" ? (
        <>
          <rect x="4" y="22" width="12" height="30" rx="6" fill="#4b4bd8" transform="rotate(-28 10 50)" />
          <rect x="104" y="22" width="12" height="30" rx="6" fill="#4b4bd8" transform="rotate(28 110 50)" />
        </>
      ) : mood === "wave" ? (
        <>
          <rect x="6" y="62" width="12" height="28" rx="6" fill="#4b4bd8" transform="rotate(18 12 64)" />
          <g className="origin-[110px_52px] animate-wiggle">
            <rect x="102" y="24" width="12" height="30" rx="6" fill="#4b4bd8" transform="rotate(24 108 52)" />
          </g>
        </>
      ) : mood === "think" ? (
        <>
          <rect x="6" y="62" width="12" height="28" rx="6" fill="#4b4bd8" transform="rotate(18 12 64)" />
          <rect x="84" y="70" width="12" height="26" rx="6" fill="#4b4bd8" transform="rotate(-60 90 82)" />
        </>
      ) : mood === "point" ? (
        <>
          <rect x="6" y="62" width="12" height="28" rx="6" fill="#4b4bd8" transform="rotate(18 12 64)" />
          <rect x="104" y="46" width="12" height="30" rx="6" fill="#4b4bd8" transform="rotate(-70 110 60)" />
        </>
      ) : (
        <>
          <rect x="6" y="62" width="12" height="28" rx="6" fill="#4b4bd8" transform="rotate(18 12 64)" />
          <rect x="102" y="62" width="12" height="28" rx="6" fill="#4b4bd8" transform="rotate(-18 108 64)" />
        </>
      )}

      {/* antenna */}
      <line x1="60" y1="15" x2="60" y2="4" stroke="#4b4bd8" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="60" cy="3" r="5.5" fill={mood === "sleep" ? "#a0a6c8" : "#ffbd14"} />
      {mood !== "sleep" && <circle cx="60" cy="3" r="9" fill="#ffbd14" opacity="0.25" />}

      {/* body */}
      <path d={BODY} fill={`url(#${uid}-body)`} stroke="#4b4bd8" strokeWidth="2" strokeLinejoin="round" />
      <path d="M60 18 L98 40 L98 52 Q60 40 22 52 L22 40 Z" fill={`url(#${uid}-shine)`} />

      {/* cheeks */}
      <ellipse cx="34" cy="72" rx="6.5" ry="4" fill="#ff7db8" opacity="0.6" />
      <ellipse cx="86" cy="72" rx="6.5" ry="4" fill="#ff7db8" opacity="0.6" />

      {/* eyes */}
      {mood === "sleep" ? (
        <>
          <path d="M38 58 Q45 63 52 58" stroke="#1b1e3d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M68 58 Q75 63 82 58" stroke="#1b1e3d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      ) : mood === "celebrate" ? (
        <>
          <path d="M37 59 Q45 49 53 59" stroke="#1b1e3d" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M67 59 Q75 49 83 59" stroke="#1b1e3d" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : mood === "cool" ? (
        <>
          <rect x="33" y="49" width="23" height="14" rx="6" fill="#1b1e3d" />
          <rect x="64" y="49" width="23" height="14" rx="6" fill="#1b1e3d" />
          <rect x="55" y="53" width="10" height="3" rx="1.5" fill="#1b1e3d" />
          <rect x="37" y="52" width="8" height="3" rx="1.5" fill="#ffffff" opacity="0.6" />
          <rect x="68" y="52" width="8" height="3" rx="1.5" fill="#ffffff" opacity="0.6" />
        </>
      ) : (
        <>
          <ellipse cx="45" cy={eyeY} rx="9.5" ry="10.5" fill="#ffffff" />
          <ellipse cx="75" cy={eyeY} rx="9.5" ry="10.5" fill="#ffffff" />
          <circle cx={mood === "think" ? 48 : mood === "point" ? 49 : 46.5} cy={mood === "think" ? eyeY - 3 : eyeY + 1.5} r="5" fill="#1b1e3d" />
          <circle cx={mood === "think" ? 78 : mood === "point" ? 79 : 73.5} cy={mood === "think" ? eyeY - 3 : eyeY + 1.5} r="5" fill="#1b1e3d" />
          <circle cx={mood === "think" ? 49.5 : 48} cy={mood === "think" ? eyeY - 5 : eyeY - 0.5} r="1.8" fill="#ffffff" />
          <circle cx={mood === "think" ? 79.5 : 75} cy={mood === "think" ? eyeY - 5 : eyeY - 0.5} r="1.8" fill="#ffffff" />
          {mood === "oops" && (
            <>
              <path d="M36 44 L50 47" stroke="#1b1e3d" strokeWidth="3" strokeLinecap="round" />
              <path d="M84 44 L70 47" stroke="#1b1e3d" strokeWidth="3" strokeLinecap="round" />
            </>
          )}
        </>
      )}

      {/* mouth */}
      {mood === "celebrate" ? (
        <>
          <path d="M47 74 Q60 92 73 74 Z" fill="#2b145a" />
          <path d="M53 82 Q60 88 67 82 Q60 79 53 82 Z" fill="#ff7db8" />
        </>
      ) : mood === "oops" ? (
        <path d="M48 81 q4 -4 8 0 t8 0 t8 0" stroke="#ffffff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ) : mood === "think" ? (
        <path d="M54 80 Q60 77 67 80" stroke="#ffffff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      ) : mood === "sleep" ? (
        <ellipse cx="60" cy="80" rx="4" ry="3" fill="#2b145a" />
      ) : (
        <path d="M48 75 Q60 88 72 75" stroke="#ffffff" strokeWidth="4" fill="none" strokeLinecap="round" />
      )}

      {/* extras */}
      {mood === "celebrate" && (
        <g>
          <path d="M14 10 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" fill="#ffbd14" />
          <path d="M104 6 l2 4.5 4.5 2 -4.5 2 -2 4.5 -2 -4.5 -4.5 -2 4.5 -2z" fill="#f2559d" />
          <circle cx="110" cy="30" r="3" fill="#18b874" />
          <circle cx="8" cy="34" r="2.5" fill="#1e9bf0" />
        </g>
      )}
      {mood === "think" && (
        <g fill="#a0a6c8">
          <circle cx="100" cy="20" r="3" />
          <circle cx="108" cy="12" r="4.5" />
          <circle cx="117" cy="2" r="6" />
        </g>
      )}
      {mood === "oops" && <path d="M98 30 q5 8 0 12 q-5 -4 0 -12z" fill="#7cc8ff" />}
      {mood === "sleep" && (
        <g fill="#a0a6c8" fontFamily="var(--font-display)" fontWeight="700">
          <text x="96" y="26" fontSize="14">z</text>
          <text x="106" y="14" fontSize="10">z</text>
        </g>
      )}
    </svg>
  );
}

/** Small round Hexy avatar for chat messages and badges. */
export function HexyAvatar({ size = 36, mood = "happy", className }: { size?: number; mood?: HexyMood; className?: string }) {
  return (
    <span className={cn("grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary-soft", className)} style={{ width: size, height: size }} aria-hidden>
      <Hexy mood={mood} size={size * 0.86} />
    </span>
  );
}
