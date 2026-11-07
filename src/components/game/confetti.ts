/**
 * A tiny dependency-free confetti burst drawn on a temporary canvas.
 * Respects reduced-motion preferences and the "celebrations" setting.
 */
import { settingsStore } from "@/lib/store/settings";

const COLORS = ["#5b5bf6", "#18b874", "#ffbd14", "#ff5a5f", "#1e9bf0", "#9a5cf0", "#f2559d", "#ff8433"];

export function fireConfetti({ x = 0.5, y = 0.35, count = 120, spread = 70 }: { x?: number; y?: number; count?: number; spread?: number } = {}) {
  if (typeof window === "undefined") return;
  if (!settingsStore.get().celebrations) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.reduceMotion === "true") return;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "90" });
  document.body.appendChild(canvas);
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas.remove();
  ctx.scale(dpr, dpr);
  const ox = window.innerWidth * x;
  const oy = window.innerHeight * y;
  const parts = Array.from({ length: count }, () => {
    const angle = ((-90 + (Math.random() - 0.5) * spread * 2) * Math.PI) / 180;
    const speed = 7 + Math.random() * 9;
    return {
      x: ox,
      y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 5 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() < 0.3 ? "hex" : Math.random() < 0.5 ? "circle" : "rect",
    };
  });
  const start = performance.now();
  const frame = (t: number) => {
    const age = t - start;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const p of parts) {
      p.vy += 0.25;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - age / 2600);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === "hex") {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i;
          ctx.lineTo((Math.cos(a) * p.size) / 1.6, (Math.sin(a) * p.size) / 1.6);
        }
        ctx.fill();
      } else ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }
    if (age < 2600) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}
