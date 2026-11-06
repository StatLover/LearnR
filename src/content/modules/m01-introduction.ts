import type { Module } from "../types";
import { whatIsProgrammingLesson } from "./m01/what-is-programming";
import { consoleAndScriptsLesson } from "./m01/console-and-scripts";
import { firstRProgramLesson } from "./m01/first-r-program";
import { module01Exercises } from "./m01/exercises";

export const module01: Module = {
  number: 1,
  id: "introduction-to-r",
  stage: 1,
  title: "Introduction to R",
  description: "Discover what programming is, what R is used for, and write and run your very first R program.",
  topics: [
    "What programming means",
    "What R is and why it is useful",
    "Applications of R in statistics, research and data analysis",
    "R versus RStudio",
    "The R console and scripts",
    "Writing your first R program",
    "Using print() and comments",
  ],
  lessons: [whatIsProgrammingLesson, consoleAndScriptsLesson, firstRProgramLesson],
  exercises: module01Exercises,
  checkpoint: [
    {
      id: "m1-cp-q1",
      type: "multiple-choice",
      prompt: "Which description of R is correct?",
      options: [
        "A free programming language designed for working with data, statistics and charts",
        "A paid spreadsheet program for offices",
        "A website for watching videos about statistics",
        "A type of calculator you have to buy",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – R is free, open source and built for data analysis.",
        "R is free, and it is a programming language rather than a spreadsheet.",
        "R is a language you write code in, not a video website.",
        "R can calculate, but it is free software that does far more than a calculator.",
      ],
      explanation: "R is a free, open-source programming language created for statistics and data analysis. It is used in health, business, science and social research.",
      concept: "what-is-r",
    },
    {
      id: "m1-cp-q2",
      type: "true-false",
      prompt: "RStudio runs R code by itself, so you do not need R installed if you have RStudio.",
      answer: false,
      explanation: "RStudio is a dashboard for R: it sends your code to R, which does the actual work. To use RStudio on your own computer you must install R first. (On this website, R runs in your browser, so you need neither.)",
      concept: "r-vs-rstudio",
    },
    {
      id: "m1-cp-q3",
      type: "predict-output",
      prompt: "What does this program print?",
      code: `# Total cost of 3 cinema tickets
print("Ticket total:")
3 * 12`,
      options: [
        `[1] "Ticket total:"
[1] 36`,
        `# Total cost of 3 cinema tickets
[1] "Ticket total:"
[1] 36`,
        `[1] "Ticket total:"
[1] 312`,
        `[1] Ticket total:
[1] "36"`,
      ],
      answer: 0,
      optionFeedback: [
        "Correct – the comment is skipped, the text is printed with quotes, and 3 × 12 = 36.",
        "Comments are ignored by R and never appear in the output.",
        "`*` multiplies; it does not join the digits together.",
        "Text is shown with quotes; numbers are shown without them.",
      ],
      explanation: "R skips the comment, prints the string (with quotes) and then shows the answer to `3 * 12`, which is 36.",
      concept: "comments",
    },
    {
      id: "m1-cp-q4",
      type: "find-error",
      prompt: "This program stops with an error. Click the line that causes it.",
      code: `print("Weekly budget")
print(50 * 7)
Print("Done")`,
      errorLine: 3,
      errorKind: "error",
      fix: `print("Weekly budget")
print(50 * 7)
print("Done")`,
      explanation: "R is case-sensitive: `Print` with a capital P does not exist, so R says `could not find function \"Print\"`. The function is `print` with a small p.",
      concept: "print",
    },
    {
      id: "m1-cp-q5",
      type: "multiple-choice",
      prompt: "Why is it a good idea to save your analysis in a script instead of typing it into the console?",
      options: [
        "You can run all the steps again later, fix them and share them",
        "Scripts make R calculate faster",
        "The console cannot do calculations",
        "Scripts never produce errors",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – a script is a saved recipe you can repeat, improve and share.",
        "Speed is the same; the benefit is that the code is saved.",
        "The console can calculate anything, but what you type there is not saved as a program.",
        "Scripts can contain errors too – but they are easy to fix because the code is saved.",
      ],
      explanation: "A script keeps your code in a file, so you can re-run every step with one click, change a line, and share exactly what you did.",
      concept: "scripts",
    },
  ],
};
