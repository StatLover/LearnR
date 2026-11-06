import type { CheatSheet } from "./types";
import { basicsCheatSheets } from "./reference/cheatsheets-basics";
import { analysisCheatSheets } from "./reference/cheatsheets-analysis";

/**
 * Cheat sheets: compact, printable references. Each section lists short R
 * snippets with a one-line description. Snippets are correct R but are shown
 * as references; a snippet may use objects defined in an earlier item of the
 * same section (e.g. `scores`, `students`, `df`).
 */
export const cheatSheets: CheatSheet[] = [...basicsCheatSheets, ...analysisCheatSheets];
