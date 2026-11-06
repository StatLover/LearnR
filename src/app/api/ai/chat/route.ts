/**
 * AI tutor chat endpoint (streaming).
 *
 * The browser sends the conversation; this route adds the system prompt
 * (tutor rules + active mode + current lesson), calls Claude and streams the
 * answer back as newline-delimited JSON:
 *   {"type":"text","text":"…"}                     text as it is written
 *   {"type":"done","content":[…],"stop_reason":…}  the complete assistant turn
 *   {"type":"error","message":"…"}
 * When Claude wants to run R code it stops with stop_reason "tool_use"; the
 * browser runs the code in webR and sends the tool_result back in a new
 * request. The API key is only read here, on the server.
 */
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { aiConfig, aiConfigured, anthropic, fallbackOptions } from "@/lib/ai/config";
import { rateLimit, clientKey } from "@/lib/ai/rate-limit";
import { BASE_PROMPT, contextPrompt, RUN_R_TOOL, TUTOR_MODES } from "@/lib/ai/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MAX_BODY = 400_000;

const Body = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.union([z.string().max(40_000), z.array(z.record(z.string(), z.unknown())).max(40)]) }))
    .min(1)
    .max(80),
  mode: z.enum(TUTOR_MODES).default("beginner"),
  lessonId: z.string().max(100).optional(),
  exerciseId: z.string().max(100).optional(),
  profile: z
    .object({ programming: z.string().max(30).optional(), statistics: z.string().max(30).optional(), completedLessons: z.number().int().min(0).max(1000).optional() })
    .optional(),
});

function friendlyError(e: unknown): { status: number; message: string } {
  if (e instanceof Anthropic.AuthenticationError) return { status: 500, message: "The AI tutor is not configured correctly on the server (invalid API key)." };
  if (e instanceof Anthropic.PermissionDeniedError) return { status: 500, message: "The server's AI key does not have access to the configured model." };
  if (e instanceof Anthropic.RateLimitError) return { status: 429, message: "The AI service is busy right now. Please wait a moment and try again." };
  if (e instanceof Anthropic.BadRequestError) return { status: 400, message: `The AI service rejected the request: ${e.message}` };
  if (e instanceof Anthropic.InternalServerError) return { status: 503, message: "The AI service is temporarily unavailable. Please try again shortly." };
  if (e instanceof Anthropic.APIConnectionError) return { status: 503, message: "Could not reach the AI service. Please try again." };
  if (e instanceof Anthropic.APIError) return { status: e.status ?? 500, message: e.message };
  return { status: 500, message: "Something went wrong while talking to the AI tutor." };
}

export async function POST(req: Request) {
  if (!aiConfigured()) {
    return Response.json(
      { error: "The AI tutor is not configured on this server. Set ANTHROPIC_API_KEY in the server environment (see .env.example) to enable it." },
      { status: 503 },
    );
  }
  const limit = rateLimit(clientKey(req), aiConfig.perMinute, aiConfig.perDay);
  if (!limit.ok) {
    return Response.json(
      { error: limit.scope === "minute" ? "You're sending messages very quickly. Please wait a few seconds." : "You've reached today's limit for AI questions. It resets within 24 hours." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }
  const raw = await req.text();
  if (raw.length > MAX_BODY) return Response.json({ error: "This conversation is too long. Please start a new conversation." }, { status: 413 });
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(JSON.parse(raw));
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (body.messages[0].role !== "user") return Response.json({ error: "Invalid conversation." }, { status: 400 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      try {
        const s = anthropic().beta.messages.stream(
          {
            model: aiConfig.model,
            max_tokens: 32000,
            output_config: { effort: aiConfig.effort },
            system: [
              { type: "text", text: BASE_PROMPT, cache_control: { type: "ephemeral" } },
              { type: "text", text: contextPrompt({ mode: body.mode, lessonId: body.lessonId, exerciseId: body.exerciseId, ...body.profile }) },
            ],
            tools: [RUN_R_TOOL],
            messages: body.messages as Anthropic.Beta.BetaMessageParam[],
            ...fallbackOptions(),
          },
          { signal: req.signal },
        );
        s.on("text", (text) => send({ type: "text", text }));
        const message = await s.finalMessage();
        send({ type: "done", content: message.content, stop_reason: message.stop_reason, model: message.model });
      } catch (e) {
        if (req.signal.aborted) return controller.close();
        const { message } = friendlyError(e);
        send({ type: "error", message });
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}
