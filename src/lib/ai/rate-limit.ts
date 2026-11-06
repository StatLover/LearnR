import "server-only";

/**
 * In-memory rate limiter (per client IP) for the AI endpoints.
 * Good for a single server instance; when running several instances behind a
 * load balancer, replace this with a shared store (e.g. Redis/Upstash).
 */
const minute = new Map<string, number[]>();
const day = new Map<string, number[]>();

function hit(map: Map<string, number[]>, key: string, windowMs: number, limit: number, now: number) {
  const list = (map.get(key) ?? []).filter((t) => now - t < windowMs);
  if (list.length >= limit) {
    map.set(key, list);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - list[0])) / 1000) };
  }
  list.push(now);
  map.set(key, list);
  return { ok: true, retryAfter: 0 };
}

export function rateLimit(key: string, perMinute: number, perDay: number) {
  const now = Date.now();
  const m = hit(minute, key, 60_000, perMinute, now);
  if (!m.ok) return { ok: false as const, retryAfter: m.retryAfter, scope: "minute" as const };
  const d = hit(day, key, 86_400_000, perDay, now);
  if (!d.ok) return { ok: false as const, retryAfter: d.retryAfter, scope: "day" as const };
  if (minute.size > 5000) for (const [k, v] of minute) if (!v.some((t) => now - t < 60_000)) minute.delete(k);
  return { ok: true as const };
}

export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] || req.headers.get("x-real-ip") || "local").trim();
}
