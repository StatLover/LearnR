import { buildSearchDocs } from "@/lib/search/index-data";

export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSearchDocs(), { headers: { "Cache-Control": "public, max-age=3600" } });
}
