import { aiConfig, aiConfigured } from "@/lib/ai/config";

export const dynamic = "force-dynamic";

/** Lets the UI know whether the AI tutor is available (never exposes the key). */
export function GET() {
  return Response.json({ configured: aiConfigured(), model: aiConfigured() ? aiConfig.model : null });
}
