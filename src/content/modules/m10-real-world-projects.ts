import type { Module } from "../types";
import { planningAnalysisLesson } from "./m10/planning-a-data-analysis";
import { edaReportLesson } from "./m10/writing-an-eda-report";
import { module10Exercises } from "./m10/exercises";

export const module10: Module = {
  number: 10,
  id: "real-world-projects",
  stage: 3,
  title: "Real-World Data Projects",
  description: "Bring everything together: plan an analysis, clean messy data, explore, visualise and report on real-world style datasets.",
  topics: [
    "Cleaning a messy dataset",
    "Exploring survey data",
    "Analyzing student performance",
    "Visualizing sales trends",
    "Analyzing healthcare or public datasets",
    "Creating a complete exploratory data analysis report",
  ],
  lessons: [planningAnalysisLesson, edaReportLesson],
  exercises: module10Exercises,
  checkpoint: [
    {
      id: "m10-cp-q1",
      type: "multiple-choice",
      prompt: "You receive a new dataset and your manager says \"have a look at it\". What should you do first?",
      options: [
        "Agree on a specific question the analysis should answer, then import the data and check its quality.",
        "Fit a regression model with all the variables.",
        "Make as many charts as possible and send them all.",
        "Delete every row that has a missing value.",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – a clear question tells you what to clean, explore and report.",
        "Modelling comes late in the pipeline, after cleaning and exploring – and it needs a question.",
        "Without a question, nobody knows which charts matter.",
        "Deleting rows is a decision that needs a reason – and it can bias the results.",
      ],
      explanation: "Every analysis starts with a clear question. It decides which columns you need, what to check and clean, and what the final answer should look like.",
      concept: "analysis-question",
    },
    {
      id: "m10-cp-q2",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `df <- data.frame(a = c(1, NA, 3), b = c(NA, NA, "x"))
colSums(is.na(df))`,
      options: ["a b \n1 2 ", "[1] 3", "a b \n2 1 ", "a b \n0 0 "],
      answer: 0,
      optionFeedback: [
        "Correct – one missing value in `a`, two in `b`.",
        "`colSums()` gives one count per column, not one total.",
        "Count again: `a` has one `NA`, `b` has two.",
        "Both columns contain `NA` values.",
      ],
      explanation: "`is.na(df)` is `TRUE` for every missing cell, and `colSums()` adds the `TRUE`s per column: 1 for `a`, 2 for `b`.",
      concept: "data-quality",
    },
    {
      id: "m10-cp-q3",
      type: "multiple-choice",
      prompt: "You want to show whether bigger houses sell for higher prices (`size_sqft` and `price` are both numeric). Which chart fits best?",
      options: ["A scatter plot", "A pie chart", "A bar chart of counts", "A line chart over time"],
      answer: 0,
      optionFeedback: [
        "Correct – a scatter plot shows the relationship between two numeric variables.",
        "Pie charts show parts of a whole for one categorical variable.",
        "A bar chart counts categories; both variables here are numeric.",
        "There is no time variable in this question.",
      ],
      explanation: "Two numeric variables → scatter plot (`geom_point()`), optionally with a trend line. Each point is one house.",
      concept: "choosing-charts",
    },
    {
      id: "m10-cp-q4",
      type: "true-false",
      prompt: "If two variables have a correlation of 0.9, one of them must be causing the other.",
      answer: false,
      explanation: "A strong correlation shows that two variables move together, not why. A confounder can drive both, the direction of cause can be reversed, or the pattern can be a coincidence. Causal claims need experiments or much more careful analysis.",
      concept: "correlation-vs-causation",
    },
    {
      id: "m10-cp-q5",
      type: "multiple-choice",
      prompt: "Which practice makes an analysis **reproducible**?",
      options: [
        "A script that reads the raw file with a relative path and does every cleaning step in code, with comments explaining each decision.",
        "Fixing wrong values directly in the CSV file before importing it.",
        "Running the lines of the script in whatever order is convenient.",
        "Using random sampling without `set.seed()`, so that each run is fresh.",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – anyone can rerun the script from top to bottom and get the same results.",
        "Manual edits are invisible and cannot be repeated.",
        "A script must run from top to bottom in a fresh session.",
        "Without `set.seed()`, random results change on every run and cannot be reproduced.",
      ],
      explanation: "Reproducible means that anyone can run your script on the raw data and get exactly the same results. That requires relative paths, all changes in code, a fixed run order and `set.seed()` for randomness.",
      concept: "reproducible-script",
    },
  ],
};
