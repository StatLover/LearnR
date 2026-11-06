import type { GlossaryTerm } from "./types";
import { programmingTerms } from "./reference/glossary-programming";
import { dataStatsTerms } from "./reference/glossary-data-stats";

/**
 * The glossary: plain-English definitions of every term used in the course.
 * Lessons link to terms by `slug` (see the canonical list in
 * docs/CONTENT_GUIDE.md / lesson `glossary` fields). Sorted alphabetically by
 * term; `category` is "programming", "r", "data" or "statistics".
 */
export const glossary: GlossaryTerm[] = [...programmingTerms, ...dataStatsTerms].sort((a, b) =>
  a.term.localeCompare(b.term, "en", { sensitivity: "base" }),
);
