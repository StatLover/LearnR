/**
 * The seven learning worlds. Each world groups modules of the curriculum and
 * has its own colour and illustration. The learning map, lesson player,
 * dashboard and badges all use this definition.
 */

export interface WorldColor {
  /** CSS variable names, e.g. "var(--mint)". */
  main: string;
  shadow: string;
  soft: string;
}

export interface World {
  id: string;
  number: number;
  name: string;
  tagline: string;
  description: string;
  /** Module numbers (in learning order). */
  modules: number[];
  color: WorldColor;
  /** Topic illustration used for the world emblem. */
  art: TopicKind;
  /** What you will be able to do after the world. */
  goals: string[];
}

export type TopicKind =
  | "hello"
  | "console"
  | "code"
  | "variable"
  | "calc"
  | "types"
  | "error"
  | "vector"
  | "list"
  | "table"
  | "missing"
  | "logic"
  | "loop"
  | "function"
  | "import"
  | "filter"
  | "clean"
  | "pipe"
  | "bar"
  | "scatter"
  | "palette"
  | "center"
  | "spread"
  | "correlation"
  | "bell"
  | "test"
  | "regression"
  | "apply"
  | "calendar"
  | "package"
  | "map"
  | "report"
  | "trophy";

const c = (name: string): WorldColor => ({ main: `var(--${name})`, shadow: `var(--${name}-shadow)`, soft: `var(--${name}-soft)` });

export const worlds: World[] = [
  {
    id: "r-explorer",
    number: 1,
    name: "R Explorer",
    tagline: "Write your very first R code",
    description: "Discover what programming and R are, run your first lines of code, and learn variables, numbers, text and functions.",
    modules: [1, 2],
    color: c("mint"),
    art: "hello",
    goals: ["Run R code and read the output", "Store values in variables", "Use built-in functions and read error messages"],
  },
  {
    id: "data-adventurer",
    number: 2,
    name: "Data Adventurer",
    tagline: "Vectors, lists and data frames",
    description: "Organise data the R way: vectors, lists, matrices, factors and data frames – and deal with missing values.",
    modules: [3],
    color: c("sky"),
    art: "table",
    goals: ["Build and index vectors", "Work with data frames", "Find and handle NA values"],
  },
  {
    id: "logic-builder",
    number: 3,
    name: "Logic Builder",
    tagline: "Conditions, loops and functions",
    description: "Teach R to make decisions, repeat work automatically and package your code into reusable functions.",
    modules: [4],
    color: c("grape"),
    art: "logic",
    goals: ["Write if / else decisions", "Repeat work with loops", "Create your own functions"],
  },
  {
    id: "data-wizard",
    number: 4,
    name: "Data Wizard",
    tagline: "Import, clean and transform data",
    description: "Import real CSV files, filter and sort them, clean messy values and master dplyr and tidyr.",
    modules: [5],
    color: c("tangerine"),
    art: "clean",
    goals: ["Import and explore CSV files", "Clean messy data", "Transform data with dplyr and tidyr"],
  },
  {
    id: "visualization-creator",
    number: 5,
    name: "Visualization Creator",
    tagline: "Charts with base R and ggplot2",
    description: "Turn numbers into pictures: histograms, bar charts, scatter plots and box plots – in base R and ggplot2.",
    modules: [6],
    color: c("pink"),
    art: "bar",
    goals: ["Draw the main chart types", "Build layered ggplot2 charts", "Pick the right chart for a question"],
  },
  {
    id: "statistics-detective",
    number: 6,
    name: "Statistics Detective",
    tagline: "Describe data and test ideas",
    description: "Summarise data with statistics, then investigate questions with distributions, confidence intervals, hypothesis tests and regression.",
    modules: [7, 9],
    color: c("teal"),
    art: "bell",
    goals: ["Summarise data with the right statistics", "Run and interpret t-tests, chi-square and ANOVA", "Fit and read a linear regression"],
  },
  {
    id: "r-pro",
    number: 7,
    name: "R Pro",
    tagline: "Intermediate R and real projects",
    description: "Level up with advanced functions, the apply family, dates, strings and debugging – then complete real data projects.",
    modules: [8, 10],
    color: c("sun"),
    art: "trophy",
    goals: ["Write cleaner, more powerful code", "Work with dates, text and packages", "Complete a full data analysis project"],
  },
];

export function worldOfModule(moduleNumber: number): World {
  return worlds.find((w) => w.modules.includes(moduleNumber)) ?? worlds[0];
}

export function getWorld(id: string): World | undefined {
  return worlds.find((w) => w.id === id);
}

/** Module numbers in the order learners meet them (world order). */
export const moduleOrder: number[] = worlds.flatMap((w) => w.modules);

/** Illustration for each lesson (PhET-style topic thumbnails). */
export const LESSON_ART: Record<string, TopicKind> = {
  "what-is-programming": "hello",
  "console-and-scripts": "console",
  "first-r-program": "code",
  "variables-and-assignment": "variable",
  "values-and-arithmetic": "calc",
  "operators-and-data-types": "types",
  "functions-and-error-messages": "error",
  vectors: "vector",
  "lists-matrices-factors": "list",
  "data-frames": "table",
  "missing-values-and-inspection": "missing",
  "conditions-and-logic": "logic",
  "for-and-while-loops": "loop",
  "writing-functions": "function",
  "importing-and-exploring-csv": "import",
  "filtering-sorting-selecting": "filter",
  "missing-data-and-cleaning": "clean",
  "dplyr-and-tidyr-intro": "pipe",
  "base-r-plots": "bar",
  "ggplot2-introduction": "scatter",
  "chart-styling-and-choosing": "palette",
  "mean-median-mode": "center",
  "measures-of-spread": "spread",
  "tables-correlation-summaries": "correlation",
  "probability-distributions-sampling": "bell",
  "confidence-intervals-hypothesis-tests": "test",
  "t-tests-chi-square-anova": "test",
  "linear-regression": "regression",
  "advanced-functions-and-scope": "function",
  "apply-family-and-data-transformations": "apply",
  "dates-strings-and-regex": "calendar",
  "packages-and-debugging": "package",
  "planning-a-data-analysis": "map",
  "writing-an-eda-report": "report",
};

export const PROJECT_ART: Record<string, TopicKind> = {
  "clean-messy-customers": "clean",
  "explore-survey": "bar",
  "student-performance": "scatter",
  "sales-trends": "regression",
  "patient-health": "test",
  "housing-eda-capstone": "report",
};
