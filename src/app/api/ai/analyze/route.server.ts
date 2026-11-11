/**
 * Structured AI analysis of R code and its real error, used by the Error
 * Checker ("Explain My Error", "Fix My Code", "Explain More Simply").
 * The model receives the learner's code with line numbers and exactly what
 * R printed; it returns JSON that the browser then *verifies* by running the
 * suggested fix in webR before showing any output.
 */
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { aiConfig, aiConfigured, anthropic, fallbackOptions } from "@/lib/ai/config";
import { rateLimit, clientKey } from "@/lib/ai/rate-limit";
import { BASE_PROMPT } from "@/lib/ai/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const Body = z.object({
  code: z.string().min(1).max(30_000),
  console: z.string().max(20_000).default(""),
  status: z.string().max(40),
  errorLine: z.number().int().nullable().optional(),
  ruleDiagnosis: z.string().max(4000).optional(),
  simpler: z.boolean().optional(),
});

const Analysis = z.object({
  kind: z.enum(["syntax", "runtime", "warning", "logic", "none"]).describe("What kind of problem this is"),
  category: z.string().describe("Short category name, e.g. 'Object Not Found'"),
  summary: z.string().describe("One sentence: what went wrong"),
  explanation: z.string().describe("Markdown: why it happened, in simple English"),
  how_to_fix: z.string().describe("Markdown: how to correct it"),
  location: z.object({
    line: z.number().int().nullable().describe("1-based line of the problem, or null if not supported by the evidence"),
    basis: z.enum(["reported_by_r", "inferred_from_code", "unknown"]),
    note: z.string().describe("What the location is based on"),
  }),
  fixed_code: z.string().nullable().describe("The complete corrected code, or null if no fix is needed or possible"),
  changes: z.array(z.object({ line: z.number().int().nullable(), before: z.string(), after: z.string(), reason: z.string() })),
  prevention_tips: z.array(z.string()),
});

export async function POST(req: Request) {
  if (!aiConfigured()) return Response.json({ error: "AI explanations are not configured on this server (ANTHROPIC_API_KEY is not set)." }, { status: 503 });
  const limit = rateLimit(clientKey(req), aiConfig.perMinute, aiConfig.perDay);
  if (!limit.ok) return Response.json({ error: "Too many AI requests – please wait a moment." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const numbered = body.code
    .split("\n")
    .map((l, i) => `${String(i + 1).padStart(3)} | ${l}`)
    .join("\n");
  const prompt = [
    "Analyse this learner's R code and what happened when it was run in R.",
    `Code (line numbers added):\n${numbered}`,
    `Run status: ${body.status}${body.errorLine ? ` (R stopped on line ${body.errorLine})` : ""}`,
    `Exact console output from R:\n${body.console || "(no output)"}`,
    body.ruleDiagnosis ? `R Academy's rule-based checker said:\n${body.ruleDiagnosis}` : "",
    "Rules: base the location only on the error message / reported line or on code you can point to; set location.line to null and basis to unknown otherwise. Distinguish syntax errors, runtime errors, warnings and logical issues. If the code ran without errors, look for logical issues but only report ones you can justify from the code; otherwise kind = none. fixed_code must be the complete corrected program, changing as little as possible. Do not state what the fixed code prints – it will be run for real.",
    body.simpler ? "The learner asked for a much simpler explanation: use very short sentences, an everyday analogy, and no jargon." : "",
  ]
    .filter(Boolean)
    .join("\n\n");
  try {
    const msg = await anthropic().beta.messages.parse({
      model: aiConfig.model,
      max_tokens: 16000,
      output_config: { effort: aiConfig.effort, format: betaZodOutputFormat(Analysis) },
      system: [{ type: "text", text: BASE_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: prompt }],
      ...fallbackOptions(),
    });
    if (msg.stop_reason === "refusal") return Response.json({ error: "The AI declined to analyse this code." }, { status: 422 });
    if (!msg.parsed_output) return Response.json({ error: "The AI response could not be read. Please try again." }, { status: 502 });
    return Response.json({ analysis: msg.parsed_output, model: msg.model });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return Response.json({ error: "The AI service is busy. Try again in a moment." }, { status: 429 });
    if (e instanceof Anthropic.AuthenticationError) return Response.json({ error: "The server's AI key is invalid." }, { status: 500 });
    if (e instanceof Anthropic.APIError) return Response.json({ error: `AI service error: ${e.message}` }, { status: e.status ?? 500 });
    return Response.json({ error: "Something went wrong while asking the AI." }, { status: 500 });
  }
}
