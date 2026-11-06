import type { Module } from "../types";
import { meanMedianModeLesson } from "./m07/mean-median-mode";
import { measuresOfSpreadLesson } from "./m07/measures-of-spread";
import { tablesCorrelationSummariesLesson } from "./m07/tables-correlation-summaries";
import { m07Exercises } from "./m07/exercises";

export const module07: Module = {
  number: 7,
  id: "descriptive-statistics",
  stage: 2,
  title: "Descriptive Statistics",
  description: "Summarise data with measures of center and spread, frequency tables and correlation, and interpret the results.",
  topics: [
    "Mean, median and mode",
    "Range and quantiles",
    "Variance and standard deviation",
    "Frequency tables",
    "Correlation",
    "Summarizing datasets",
    "Understanding statistical results",
  ],
  lessons: [meanMedianModeLesson, measuresOfSpreadLesson, tablesCorrelationSummariesLesson],
  exercises: m07Exercises,
  checkpoint: [
    {
      id: "m7-cp-q1",
      type: "multiple-choice",
      prompt: "You want to describe the yearly incomes of 1,000 people in a town where a few people are millionaires. Which pair of statistics is the best choice?",
      options: [
        "Median and interquartile range",
        "Mean and standard deviation",
        "Mode and range",
        "Mean and range",
      ],
      answer: 0,
      explanation: "Incomes are skewed by a few very large values. The median and the IQR are both robust: they describe the typical person and the spread of the middle half without being pulled around by the millionaires.",
      optionFeedback: [
        "Correct – both are robust to outliers.",
        "The mean and the SD are both pulled up strongly by the millionaires, so they would overstate the typical income and its spread.",
        "The mode of exact incomes is rarely meaningful (few people earn exactly the same), and the range depends only on the extremes.",
        "Both depend heavily on the extreme values.",
      ],
      concept: "outliers",
    },
    {
      id: "m7-cp-q2",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `x <- c(1, 2, 3, 4, 100)
median(x) - mean(x)`,
      options: ["[1] 0", "[1] -19", "[1] 19", "[1] -17"],
      answer: 1,
      explanation: "The median is 3 (the middle of five sorted values). The mean is 110 / 5 = 22, pulled up by the outlier 100. So median − mean = 3 − 22 = −19.",
      optionFeedback: [
        "The two measures are only equal for balanced data; the outlier pulls the mean far away.",
        "Correct.",
        "Check the order: the code computes median − mean, and the mean is the larger one.",
        "The mean is 110 / 5 = 22, not 20.",
      ],
      concept: "outliers",
    },
    {
      id: "m7-cp-q3",
      type: "fill-blank",
      prompt: "Complete the code so it returns the most common colour (the mode).",
      code: `colors <- c("red", "blue", "red", "green", "red")
names(which.max(___(colors)))`,
      accept: ["table"],
      hint: "First count how often each value occurs.",
      explanation: "`table(colors)` counts each colour, `which.max()` finds the biggest count and `names()` returns its label: `\"red\"`.",
      concept: "mode",
    },
    {
      id: "m7-cp-q4",
      type: "true-false",
      prompt: "This code prints `[1] 0`. Therefore x and y are not related at all.",
      code: `x <- -5:5
y <- x^2
cor(x, y)`,
      answer: false,
      explanation: "False. y is completely determined by x (y = x²), but the relationship is U-shaped, not a straight line. Pearson correlation only measures **straight-line** relationships, so it is 0 here. Always plot your data before concluding there is no relationship.",
      concept: "correlation",
    },
    {
      id: "m7-cp-q5",
      type: "multiple-choice",
      prompt: "The exam scores of a class have a mean of 70 points and a standard deviation of 12 points. What does the standard deviation tell you?",
      options: [
        "A typical score is roughly 12 points away from the mean of 70",
        "12% of the students scored exactly 70",
        "The highest score is 70 + 12 = 82",
        "The scores range from 58 to 82",
      ],
      answer: 0,
      explanation: "The standard deviation is (roughly) the typical distance of a value from the mean, in the data's own unit. Many scores will be within about 12 points of 70, but some will be further away.",
      optionFeedback: [
        "Correct.",
        "The SD is a distance in points, not a percentage of students.",
        "The SD does not give the maximum – several students can be more than one SD above the mean.",
        "That would be one SD either side of the mean, but some values lie outside that band (for bell-shaped data about a third of them).",
      ],
      concept: "standard-deviation",
    },
  ],
};
