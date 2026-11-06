import type { CSSProperties } from "react";
import {
  ArrowLeftRight,
  Brackets,
  Calculator,
  CalendarDays,
  ChartColumn,
  ChartScatter,
  FileDown,
  FlaskConical,
  GitBranch,
  Package,
  Repeat,
  Sigma,
  Table2,
  Terminal,
  Type,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/** Candy accent names from the design system (each has -soft and -shadow tokens). */
export type Candy = "primary" | "mint" | "sun" | "coral" | "sky" | "grape" | "tangerine" | "pink" | "teal";

export const CANDY_CYCLE: Candy[] = ["mint", "sky", "grape", "tangerine", "pink", "teal", "coral", "sun", "primary"];

/**
 * CSS custom properties for one candy colour, so a component can use
 * `bg-[var(--c)]`, `bg-[var(--c-soft)]`, `[--press-shadow:var(--c-shadow)]`,
 * `text-[var(--c-fg)]` (text on the solid colour) and `text-[var(--c-ink)]`
 * (readable coloured text on the soft colour; pair with `dark:text-[var(--c)]`).
 */
export function candy(c: Candy): CSSProperties {
  return {
    "--c": `var(--${c})`,
    "--c-soft": `var(--${c}-soft)`,
    "--c-shadow": `var(--${c}-shadow)`,
    "--c-fg": c === "sun" ? "#3b2600" : "#ffffff",
    "--c-ink": c === "sun" ? "var(--warning)" : c === "primary" ? "var(--primary-strong)" : `var(--${c}-shadow)`,
  } as CSSProperties;
}

/** Coloured text that stays readable on soft backgrounds in light and dark mode. */
export const INK = "text-[var(--c-ink)] dark:text-[var(--c)]";

/** Function reference categories: colour + icon (display order follows the content file). */
export const FN_CATEGORY: Record<string, { color: Candy; icon: LucideIcon }> = {
  "Basics & output": { color: "mint", icon: Terminal },
  Vectors: { color: "sky", icon: Brackets },
  "Data frames": { color: "tangerine", icon: Table2 },
  "Import & export": { color: "teal", icon: FileDown },
  "Math & rounding": { color: "sun", icon: Calculator },
  "Text (strings)": { color: "pink", icon: Type },
  Dates: { color: "grape", icon: CalendarDays },
  "Logic & control": { color: "coral", icon: GitBranch },
  "Apply family": { color: "primary", icon: Repeat },
  Statistics: { color: "sky", icon: Sigma },
  "Statistical tests": { color: "grape", icon: FlaskConical },
  "Base plots": { color: "pink", icon: ChartColumn },
  dplyr: { color: "tangerine", icon: Wrench },
  tidyr: { color: "teal", icon: ArrowLeftRight },
  ggplot2: { color: "coral", icon: ChartScatter },
  "Packages & help": { color: "sun", icon: Package },
};

export function fnCategory(category: string) {
  return FN_CATEGORY[category] ?? { color: "primary" as Candy, icon: Terminal };
}

/** How a function is written on cards: `mean()`, but operators stay as they are (`%in%`). */
export function fnLabel(name: string) {
  return /^%.+%$/.test(name) ? name : `${name}()`;
}
