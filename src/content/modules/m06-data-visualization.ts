import type { Module } from "../types";
import { baseRPlotsLesson } from "./m06/base-r-plots";
import { ggplot2IntroductionLesson } from "./m06/ggplot2-introduction";
import { chartStylingAndChoosingLesson } from "./m06/chart-styling-and-choosing";
import { m06Exercises } from "./m06/exercises";

export const module06: Module = {
  number: 6,
  id: "data-visualization",
  stage: 2,
  title: "Data Visualization",
  description: "Draw histograms, bar charts, scatter plots and box plots with base R and ggplot2, and choose the right chart.",
  topics: [
    "Base R plots",
    "Histograms",
    "Bar charts",
    "Scatter plots",
    "Box plots",
    "Introduction to ggplot2",
    "Titles, labels, colors and themes",
    "Choosing appropriate visualizations",
  ],
  lessons: [baseRPlotsLesson, ggplot2IntroductionLesson, chartStylingAndChoosingLesson],
  exercises: m06Exercises,
  checkpoint: [
    {
      id: "m6-cp-q1",
      type: "multiple-choice",
      prompt: "Which chart shows how the values of **one numeric variable** are distributed?",
      options: ["Bar chart", "Histogram", "Scatter plot", "Line chart"],
      answer: 1,
      optionFeedback: [
        "Bar charts count categories.",
        "Correct – the histogram cuts the number line into bins and counts the values in each.",
        "A scatter plot needs two numeric variables.",
        "A line chart shows change over time.",
      ],
      explanation: "A histogram (`hist()` or `geom_histogram()`) shows which values of a numeric variable are common and which are rare. A box plot summarises the same distribution in five numbers.",
      concept: "histograms",
    },
    {
      id: "m6-cp-q2",
      type: "predict-output",
      prompt: "What does this code print in the console (besides drawing a chart)?",
      code: `survey <- read.csv("data/survey.csv")
counts <- table(survey$recommend)
counts
barplot(counts)`,
      options: [
        `
 No Yes 
 59 141 `,
        "[1]  59 141",
        "[1] 200",
        "Nothing – barplot() only draws",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – printing the frequency table shows the categories and their counts.",
        "A table prints its category names above the counts.",
        "`table()` counts each answer separately.",
        "`barplot()` prints nothing, but the line `counts` prints the table.",
      ],
      explanation: "The line `counts` prints the frequency table: 59 users answered No and 141 Yes. `barplot(counts)` then draws those two numbers as bars – it prints nothing itself.",
      concept: "bar-charts",
    },
    {
      id: "m6-cp-q3",
      type: "fill-blank",
      prompt: "Complete the code to draw a scatter plot of study hours against math scores.",
      code: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = study_hours, y = math)) +
  ___()`,
      accept: ["geom_point"],
      hint: "Which geom draws one point per row?",
      explanation: "`geom_point()` draws a point for every student at the position given by the x and y aesthetics.",
      concept: "geoms",
    },
    {
      id: "m6-cp-q4",
      type: "find-error",
      prompt: "This code stops with an error. Which line causes it?",
      code: `library(ggplot2)
patients <- read.csv("data/patients.csv")
ggplot(patients, aes(x = age, y = systolic_bp))
  + geom_point()`,
      errorLine: 4,
      errorKind: "error",
      fix: `library(ggplot2)
patients <- read.csv("data/patients.csv")
ggplot(patients, aes(x = age, y = systolic_bp)) +
  geom_point()`,
      explanation: "Line 3 is a complete command on its own, so R draws an empty plot. Line 4 then starts with `+`, which has nothing to add to. Move the `+` to the end of line 3.",
      concept: "ggplot-grammar",
    },
    {
      id: "m6-cp-q5",
      type: "true-false",
      prompt: "`geom_point(aes(colour = \"red\"))` makes all points red.",
      answer: false,
      explanation: "Inside `aes()`, `\"red\"` is treated as a data value, so the points get ggplot2's first default colour and a legend that says *red*. For a fixed colour, write it outside `aes()`: `geom_point(colour = \"red\")`.",
      concept: "colour-mapping",
    },
  ],
};
