import type { RFunction } from "./types";
import { basicsFunctions } from "./reference/functions-basics";
import { dataFunctions } from "./reference/functions-data";
import { analysisFunctions } from "./reference/functions-analysis";
import { tidyverseFunctions } from "./reference/functions-tidyverse";

/**
 * The R Function Reference: commonly used functions for beginners, grouped by
 * `category`. Each entry has a plain-English purpose, syntax, arguments, a
 * self-contained example with its verified output, common mistakes and
 * related functions (names of other entries).
 *
 * Categories, in display order: "Basics & output", "Vectors", "Data frames",
 * "Import & export", "Math & rounding", "Text (strings)", "Dates",
 * "Logic & control", "Apply family", "Statistics", "Statistical tests",
 * "Base plots", "dplyr", "tidyr", "ggplot2", "Packages & help".
 */
export const rFunctions: RFunction[] = [
  ...basicsFunctions,
  ...dataFunctions,
  ...analysisFunctions,
  ...tidyverseFunctions,
];
