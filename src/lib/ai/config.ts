import "server-only";
import Anthropic from "@anthropic-ai/sdk";

/** Server-side AI configuration. The API key never leaves the server. */
export const aiConfig = {
  model: process.env.ANTHROPIC_MODEL || "claude-opus-5-5",
  effort: (["low", "medium", "high"].includes(process.env.AI_EFFORT ?? "") ? process.env.AI_EFFORT : "medium") as "low" | "medium" | "high",
  /** Server-side refusal fallback ("default" lets the API choose a fallback model by refusal category). */
  fallbacks: process.env.AI_FALLBACKS === "off" ? null : ("default" as const),
  perMinute: Number(process.env.AI_RATE_LIMIT_PER_MINUTE || 12),
  perDay: Number(process.env.AI_RATE_LIMIT_PER_DAY || 200),
};

export function aiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

let client: Anthropic | null = null;
export function anthropic(): Anthropic {
  if (!client) client = new Anthropic({ maxRetries: 2 });
  return client;
}

/** Beta options shared by every request (server-side refusal fallback). */
export function fallbackOptions() {
  return aiConfig.fallbacks ? { betas: ["server-side-fallback-2026-07-01"] as string[], fallbacks: aiConfig.fallbacks } : {};
}
