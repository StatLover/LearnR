"use client";

import { useEffect, useState } from "react";
import { useMounted } from "./use-mounted";

function untilMidnight(now = new Date()) {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return Math.max(0, next.getTime() - now.getTime());
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Live countdown to local midnight, when the next daily challenge unlocks. */
export function MidnightCountdown({ className, onZero }: { className?: string; onZero?: () => void }) {
  const mounted = useMounted();
  const [ms, setMs] = useState(() => untilMidnight());
  useEffect(() => {
    const id = window.setInterval(() => {
      const left = untilMidnight();
      setMs(left);
      if (left < 1000) onZero?.();
    }, 1000);
    return () => window.clearInterval(id);
  }, [onZero]);
  if (!mounted) return <span className={className}>--:--:--</span>;
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const label = `${h} hours ${m} minutes`;
  return (
    <span role="timer" aria-label={label} className={className}>
      <span aria-hidden className="tabular-nums">
        {pad(h)}:{pad(m)}:{pad(s % 60)}
      </span>
    </span>
  );
}
