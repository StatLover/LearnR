/**
 * The R Labs: PhET-style interactive simulations. Every number and plot in a
 * lab comes from real R running in the browser – the controls only write the
 * R code, which is shown to the learner and run.
 *
 * Plain data (no React), so server pages can use it for routes and metadata.
 */
import type { TopicKind } from "@/lib/game/worlds";

export type LabTopic = "Visualization" | "Probability" | "Sampling" | "Correlation" | "Regression";

export interface LabInfo {
  id: string;
  title: string;
  /** One-line teaser for the card. */
  short: string;
  /** Longer description for the lab page hero and metadata. */
  description: string;
  topics: LabTopic[];
  /** Thumbnail illustration (TopicArt scene, or "clt" for the custom one). */
  art: TopicKind | "clt";
  /** Accent colour name (a design-system candy colour). */
  color: "pink" | "teal" | "sky" | "grape" | "tangerine" | "mint" | "coral";
  level: "Beginner" | "Intermediate";
  /** Lesson that teaches the idea behind the lab. */
  lesson?: { id: string; title: string };
}

export const labs: LabInfo[] = [
  {
    id: "chart-builder",
    title: "Chart Builder",
    short: "Pick a dataset and a chart type – R writes the plotting code for you.",
    description:
      "Choose a sample dataset, a chart type and colours. R Academy writes real R code (base R or ggplot2), runs it and draws the chart. Then edit the code to customise it and export the plot as a PNG.",
    topics: ["Visualization"],
    art: "bar",
    color: "pink",
    level: "Beginner",
    lesson: { id: "ggplot2-introduction", title: "Introduction to ggplot2" },
  },
  {
    id: "normal",
    title: "Normal Distribution Lab",
    short: "Slide the mean and standard deviation and watch the bell curve move.",
    description:
      "Draw random values from a normal distribution with rnorm(), compare the histogram with the true density curve and discover the 68–95–99.7 rule.",
    topics: ["Probability"],
    art: "bell",
    color: "teal",
    level: "Beginner",
    lesson: { id: "probability-distributions-sampling", title: "Probability distributions and sampling" },
  },
  {
    id: "clt",
    title: "Sampling & the Central Limit Theorem",
    short: "Average many samples from a skewed population – and watch a bell appear.",
    description:
      "Take many random samples from a skewed population, compute each sample's mean and see why the distribution of sample means becomes normal, with a spread of σ / √n.",
    topics: ["Sampling", "Probability"],
    art: "clt",
    color: "grape",
    level: "Intermediate",
    lesson: { id: "probability-distributions-sampling", title: "Probability distributions and sampling" },
  },
  {
    id: "correlation",
    title: "Correlation Lab",
    short: "Dial in a correlation, generate data and see what r really looks like.",
    description:
      "Set a target correlation and a sample size, generate correlated data, and see how the scatter plot, the fitted line and cor(x, y) respond – including what a single outlier can do.",
    topics: ["Correlation"],
    art: "correlation",
    color: "sky",
    level: "Beginner",
    lesson: { id: "tables-correlation-summaries", title: "Tables, correlation and summaries" },
  },
  {
    id: "regression",
    title: "Regression Lab",
    short: "Choose the true line and the noise – then see how well lm() recovers it.",
    description:
      "Simulate data from a straight line plus random noise, fit a linear model with lm() and compare the fitted line with the truth. See how noise and sample size change the estimates and R².",
    topics: ["Regression"],
    art: "regression",
    color: "tangerine",
    level: "Intermediate",
    lesson: { id: "linear-regression", title: "Linear regression" },
  },
];

export const labTopics: LabTopic[] = ["Visualization", "Probability", "Sampling", "Correlation", "Regression"];

/** Accent colour of each topic, and its tag-chip classes (readable in light and dark). */
export const TOPIC_COLOR: Record<LabTopic, string> = {
  Visualization: "pink",
  Probability: "teal",
  Sampling: "grape",
  Correlation: "sky",
  Regression: "tangerine",
};
export const TOPIC_CLASS: Record<LabTopic, string> = {
  Visualization: "bg-pink-soft text-pink-shadow dark:text-pink",
  Probability: "bg-teal-soft text-teal-shadow dark:text-teal",
  Sampling: "bg-grape-soft text-grape-shadow dark:text-grape",
  Correlation: "bg-sky-soft text-sky-shadow dark:text-sky",
  Regression: "bg-tangerine-soft text-tangerine-shadow dark:text-tangerine",
};

export function getLab(id: string): LabInfo | undefined {
  return labs.find((l) => l.id === id);
}
