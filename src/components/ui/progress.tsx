import { cn } from "@/lib/utils";

const TONES = {
  primary: "bg-primary",
  mint: "bg-mint",
  sun: "bg-sun",
  grape: "bg-grape",
  sky: "bg-sky",
  accent: "bg-sky",
  coral: "bg-coral",
} as const;

export function ProgressBar({
  value,
  className,
  label,
  tone = "primary",
  color,
  size = "md",
}: {
  value: number;
  className?: string;
  label?: string;
  tone?: keyof typeof TONES;
  /** CSS colour overriding the tone (e.g. a world colour). */
  color?: string;
  size?: "sm" | "md" | "lg";
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      aria-label={label}
      className={cn("w-full overflow-hidden rounded-full bg-surface-3", size === "sm" ? "h-2" : size === "lg" ? "h-4" : "h-3", className)}
    >
      <div
        className={cn("relative h-full rounded-full transition-[width] duration-700 ease-out", !color && TONES[tone])}
        style={{ width: `${v}%`, background: color }}
      >
        {v > 0 && <div className="absolute inset-x-1.5 top-[3px] h-[30%] rounded-full bg-white/35" />}
      </div>
    </div>
  );
}

export function ProgressRing({ value, size = 64, stroke = 8, label, color = "var(--primary)", children }: { value: number; size?: number; stroke?: number; label?: string; color?: string; children?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label ?? `${Math.round(v)}% complete`} className="absolute inset-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (v / 100) * c}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset .8s ease" }}
        />
      </svg>
      <span className="relative font-display font-semibold" style={{ fontSize: size * 0.24 }}>
        {children ?? `${Math.round(v)}%`}
      </span>
    </div>
  );
}
