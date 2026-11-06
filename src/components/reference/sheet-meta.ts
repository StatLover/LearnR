import { Box, Brackets, Bug, CalendarDays, ChartScatter, Repeat, Sigma, SquareFunction, Table2, Wrench, type LucideIcon } from "lucide-react";
import { CANDY_CYCLE, type Candy } from "./candy";

const SHEETS: Record<string, { color: Candy; icon: LucideIcon }> = {
  variables: { color: "mint", icon: Box },
  vectors: { color: "sky", icon: Brackets },
  "data-frames": { color: "tangerine", icon: Table2 },
  loops: { color: "primary", icon: Repeat },
  functions: { color: "grape", icon: SquareFunction },
  dplyr: { color: "teal", icon: Wrench },
  ggplot2: { color: "pink", icon: ChartScatter },
  statistics: { color: "sky", icon: Sigma },
  "strings-dates": { color: "sun", icon: CalendarDays },
  errors: { color: "coral", icon: Bug },
};

/** Colour and icon of a cheat sheet (falls back to the candy cycle for new sheets). */
export function sheetMeta(id: string, index: number): { color: Candy; icon: LucideIcon } {
  return SHEETS[id] ?? { color: CANDY_CYCLE[index % CANDY_CYCLE.length], icon: Box };
}
