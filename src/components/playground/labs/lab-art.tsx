import { TopicArt } from "@/components/brand/topic-art";
import { cn } from "@/lib/utils";
import type { LabInfo } from "./lab-list";

/** Same palette as TopicArt, so the custom scene matches the other thumbnails. */
const P = { ink: "#1b1e3d", w: "#ffffff", grape: "#9a5cf0", tang: "#ff8433", coral: "#ff5a5f", sun: "#ffbd14" };

/** Custom thumbnail for the Central Limit Theorem lab: a skewed histogram turning into a bell. */
function CltArt({ bg, className }: { bg: string; className?: string }) {
  const skew = [34, 26, 18, 12, 8, 5, 3];
  const bell = Array.from({ length: 31 }, (_, i) => {
    const z = -3 + (6 * i) / 30;
    return `${(116 + z * 9).toFixed(2)},${(80 - 50 * Math.exp(-(z * z) / 2)).toFixed(2)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 160 100" className={cn("h-auto w-full", className)} aria-hidden>
      <rect width="160" height="100" fill={bg} />
      <circle cx="146" cy="8" r="26" fill="#ffffff" opacity="0.18" />
      <circle cx="10" cy="96" r="20" fill="#ffffff" opacity="0.14" />
      <rect x="12" y="20" width="62" height="66" rx="9" fill={P.w} />
      {skew.map((h, i) => (
        <rect key={i} x={18 + i * 7.6} y={80 - h * 1.4} width="6" height={h * 1.4} rx="1.5" fill={P.tang} />
      ))}
      <path d="M78 52 h12" stroke="var(--foreground)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M86 46 l6 6 -6 6" stroke="var(--foreground)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="92" y="20" width="56" height="66" rx="9" fill={P.w} />
      <polygon points={`89,80 ${bell} 143,80`} fill={P.grape} opacity="0.3" />
      <polyline points={bell} fill="none" stroke={P.grape} strokeWidth="3.5" strokeLinejoin="round" />
      <text x="120" y="33" textAnchor="middle" fontSize="9" fontWeight="800" fill={P.ink}>x̄</text>
    </svg>
  );
}

export function LabArt({ lab, className }: { lab: LabInfo; className?: string }) {
  const bg = `var(--${lab.color}-soft)`;
  if (lab.art === "clt") return <CltArt bg={bg} className={className} />;
  return <TopicArt kind={lab.art} bg={bg} className={className} />;
}
