import type { GlossaryTerm } from "../types";

/** Glossary – data terms ("data") and statistics terms ("statistics"). */
export const dataStatsTerms: GlossaryTerm[] = [
  /* ---------------------------------------------------------------- */
  /* Data                                                              */
  /* ---------------------------------------------------------------- */
  {
    slug: "dataset",
    term: "Dataset",
    category: "data",
    definition:
      "A collection of data about one topic, usually arranged as a table – for example the test scores of 60 students. In R a dataset is normally stored as a data frame.",
    example: `students <- read.csv("data/students.csv")
dim(students)`,
    related: ["data-frame", "observation", "csv"],
  },
  {
    slug: "row",
    term: "Row",
    category: "data",
    definition:
      "A horizontal line of a table. In a tidy dataset each row is one observation – one student, one sale, one day. `nrow()` counts rows and `df[1, ]` picks the first row.",
    example: `mtcars[1, ]
nrow(mtcars)`,
    related: ["column", "observation", "data-frame"],
  },
  {
    slug: "column",
    term: "Column",
    category: "data",
    definition:
      "A vertical line of a table. In a tidy dataset each column is one variable, such as `age` or `price`, and all its values have the same type. Get a column with `df$name` or `df[[\"name\"]]`.",
    example: `head(mtcars$mpg)
ncol(mtcars)`,
    related: ["row", "data-frame", "dollar-operator"],
  },
  {
    slug: "observation",
    term: "Observation",
    category: "data",
    definition:
      "One unit you collected data about – a person, a car, a day – with all its measurements. In a tidy table each observation is one row. \"60 observations\" means 60 rows.",
    example: `str(mtcars[1:3, 1:3])`,
    related: ["row", "dataset", "sample"],
  },
  {
    slug: "csv",
    term: "CSV file",
    category: "data",
    definition:
      "Comma-Separated Values: a plain text file where each line is a row and the values are separated by commas. Every spreadsheet program can save and open CSV files, which makes them the most common way to share data. Read one with `read.csv()`.",
    example: `students <- read.csv("data/students.csv")
head(students[, 1:4], 3)`,
    related: ["dataset", "file-path", "working-directory"],
  },
  {
    slug: "tidy-data",
    term: "Tidy data",
    category: "data",
    definition:
      "A standard way of arranging a table: each variable is a column, each observation is a row, and each value has its own cell. The tidyverse packages are built around this shape, so tidying data first makes everything else easier.",
    related: ["long-format", "wide-format", "tidyr", "tidyverse"],
  },
  {
    slug: "long-format",
    term: "Long format",
    category: "data",
    definition:
      "A table shape with more rows and fewer columns: measurements of the same kind are stacked in one column, with another column saying what each measurement is (e.g. `subject` and `score`). ggplot2 and dplyr usually work best with long data. `pivot_longer()` creates it.",
    example: `long <- data.frame(name = c("Ana", "Ana", "Ben", "Ben"),
                   subject = c("math", "art", "math", "art"),
                   score = c(90, 80, 75, 95))
long`,
    related: ["wide-format", "tidy-data", "tidyr"],
  },
  {
    slug: "wide-format",
    term: "Wide format",
    category: "data",
    definition:
      "A table shape with one row per subject and a separate column for each measurement (e.g. `math`, `art`). It is easy for people to read, like a spreadsheet, but often needs to be made long for analysis. `pivot_wider()` creates it.",
    example: `wide <- data.frame(name = c("Ana", "Ben"), math = c(90, 75), art = c(80, 95))
wide`,
    related: ["long-format", "tidy-data", "tidyr"],
  },
  {
    slug: "categorical-variable",
    term: "Categorical variable",
    category: "data",
    definition:
      "A variable whose values are categories or groups rather than measurements – for example gender, region, blood type or \"yes/no\". You count categories (with `table()`) instead of averaging them. In R they are stored as character or factor columns.",
    example: `table(iris$Species)`,
    related: ["numeric-variable", "factor", "frequency-table", "bar-chart"],
  },
  {
    slug: "numeric-variable",
    term: "Numeric variable",
    category: "data",
    definition:
      "A variable whose values are numbers you can do arithmetic with – height, price, temperature, a count. You summarise it with mean, median and standard deviation and show it with histograms and box plots.",
    example: `summary(mtcars$mpg)`,
    related: ["categorical-variable", "numeric", "histogram"],
  },
  {
    slug: "histogram",
    term: "Histogram",
    category: "data",
    definition:
      "A chart for one numeric variable: the range is cut into equal bins and each bar's height shows how many values fall in that bin. It reveals the shape of the distribution – centre, spread, skewness and outliers. Unlike a bar chart, the bars touch because the bins are continuous.",
    example: `hist(mtcars$mpg, main = "Miles per gallon", xlab = "mpg")`,
    related: ["bar-chart", "distribution", "box-plot"],
  },
  {
    slug: "bar-chart",
    term: "Bar chart",
    category: "data",
    definition:
      "A chart with one bar per category, where the bar's length shows a count or a value. It is the standard chart for a categorical variable. The bars are separate because the categories are distinct.",
    example: `barplot(table(mtcars$cyl), xlab = "Cylinders", ylab = "Cars")`,
    related: ["histogram", "categorical-variable", "frequency-table"],
  },
  {
    slug: "scatter-plot",
    term: "Scatter plot",
    category: "data",
    definition:
      "A chart that shows the relationship between two numeric variables: each observation is a dot placed by its x and y values. It shows whether the variables move together (correlation), the shape of the relationship and any unusual points.",
    example: `plot(mtcars$wt, mtcars$mpg, xlab = "Weight", ylab = "mpg")`,
    related: ["correlation", "linear-regression", "outlier"],
  },
  {
    slug: "box-plot",
    term: "Box plot",
    category: "data",
    definition:
      "A compact chart of a numeric variable's distribution. The box spans the middle 50% of the data (from the 1st to the 3rd quartile), the line inside is the median, the whiskers reach to the most extreme values that are not outliers, and dots mark outliers. Side-by-side box plots compare groups.",
    example: `boxplot(mpg ~ cyl, data = mtcars)`,
    related: ["median", "iqr", "outlier", "quantile"],
  },
  {
    slug: "eda",
    term: "Exploratory data analysis (EDA)",
    category: "data",
    definition:
      "The first look at a dataset, before any formal testing: checking its structure, summarising each variable, counting missing values and drawing plots to spot patterns, mistakes and outliers. It is detective work that tells you which questions the data can answer.",
    example: `str(airquality)
summary(airquality$Ozone)
colSums(is.na(airquality))`,
    related: ["summary-statistics", "data-cleaning", "histogram", "outlier"],
  },
  {
    slug: "missing-data",
    term: "Missing data",
    category: "data",
    definition:
      "Values that were never recorded – a skipped survey question, a broken sensor. In R they appear as `NA`. Missing data must be found (`is.na()`) and handled deliberately: removed, ignored with `na.rm = TRUE`, or filled in – because they can bias results.",
    example: `sum(is.na(airquality$Ozone))
mean(airquality$Ozone, na.rm = TRUE)`,
    related: ["na", "data-cleaning", "eda"],
  },
  {
    slug: "data-cleaning",
    term: "Data cleaning",
    category: "data",
    definition:
      "Fixing problems in raw data before analysis: removing duplicates, trimming spaces, making capitals consistent, converting text to numbers or dates, handling missing values and impossible values. It often takes most of the time in a real project.",
    example: `cities <- c(" Boston", "boston ", "BOSTON")
unique(tolower(trimws(cities)))`,
    related: ["missing-data", "eda", "type-conversion"],
  },
  {
    slug: "join",
    term: "Join",
    category: "data",
    definition:
      "Combining two tables by matching rows on a shared key column, such as a customer ID. A *left join* keeps every row of the first table and adds matching information from the second (`NA` where there is no match); an *inner join* keeps only rows found in both. In R: `merge()` or dplyr's `left_join()`.",
    example: `people <- data.frame(id = 1:3, name = c("Ana", "Ben", "Cleo"))
cities <- data.frame(id = c(1, 3), city = c("Rome", "Oslo"))
merge(people, cities, by = "id", all.x = TRUE)`,
    related: ["dplyr", "data-frame"],
  },
  {
    slug: "grouping",
    term: "Grouping",
    category: "data",
    definition:
      "Splitting data into groups (for example by class or region) so that a summary is calculated separately for each group – \"split, apply, combine\". In dplyr you use `group_by()` followed by `summarise()`; in base R `tapply()` or `aggregate()`.",
    example: `aggregate(mpg ~ cyl, data = mtcars, FUN = mean)`,
    related: ["dplyr", "summary-statistics", "apply-family"],
  },

  /* ---------------------------------------------------------------- */
  /* Statistics                                                        */
  /* ---------------------------------------------------------------- */
  {
    slug: "mean",
    term: "Mean",
    category: "statistics",
    definition:
      "The average: add up all values and divide by how many there are. It is the \"balance point\" of the data. Because every value counts, a few extreme values (outliers) can pull the mean a long way – then the median is often a better summary.",
    example: `mean(c(2, 4, 6, 8))`,
    related: ["median", "mode", "outlier", "summary-statistics"],
  },
  {
    slug: "median",
    term: "Median",
    category: "statistics",
    definition:
      "The middle value when the data are sorted: half the values are below it, half above. With an even number of values it is the average of the two middle ones. It is robust – an extreme value hardly changes it – which is why median income is reported instead of mean income.",
    example: `median(c(30, 35, 40, 45, 500))
mean(c(30, 35, 40, 45, 500))`,
    related: ["mean", "quantile", "box-plot"],
  },
  {
    slug: "mode",
    term: "Mode",
    category: "statistics",
    definition:
      "The most frequent value in the data – for example the most common shoe size. It is the only \"average\" that works for categories. R has no built-in function for it (`mode()` tells you an object's storage mode instead); use `table()` and look for the largest count.",
    example: `sizes <- c(38, 39, 39, 40, 39, 42)
counts <- table(sizes)
names(counts)[which.max(counts)]`,
    related: ["mean", "median", "frequency-table"],
  },
  {
    slug: "range",
    term: "Range",
    category: "statistics",
    definition:
      "The distance between the smallest and largest value: maximum minus minimum. It is the simplest measure of spread, but it depends on just two values, so a single outlier can change it a lot. In R, `range()` returns the minimum and maximum; `diff(range(x))` gives the range as one number.",
    example: `x <- c(12, 18, 25, 31)
range(x)
diff(range(x))`,
    related: ["iqr", "standard-deviation", "outlier"],
  },
  {
    slug: "quantile",
    term: "Quantile",
    category: "statistics",
    definition:
      "A cut point that splits sorted data into parts: the 0.25 quantile has 25% of the values below it. The three *quartiles* (0.25, 0.5, 0.75) split the data into four equal parts; the 0.5 quantile is the median. `quantile()` calculates them.",
    example: `quantile(mtcars$mpg)
quantile(mtcars$mpg, 0.9)`,
    related: ["percentile", "median", "iqr", "box-plot"],
  },
  {
    slug: "percentile",
    term: "Percentile",
    category: "statistics",
    definition:
      "A quantile written as a percentage: the 90th percentile is the value below which 90% of the data fall. If your test score is at the 90th percentile, you scored higher than 90% of test takers.",
    example: `scores <- c(55, 61, 68, 72, 75, 80, 84, 90, 95)
quantile(scores, probs = 0.9)`,
    related: ["quantile", "median"],
  },
  {
    slug: "iqr",
    term: "Interquartile range (IQR)",
    category: "statistics",
    definition:
      "The spread of the middle half of the data: the 3rd quartile minus the 1st quartile. Because it ignores the top and bottom 25%, outliers barely affect it. It is the height of the box in a box plot and the basis of the usual outlier rule (more than 1.5 × IQR beyond the box).",
    example: `IQR(mtcars$mpg)`,
    related: ["quantile", "box-plot", "outlier", "range"],
  },
  {
    slug: "variance",
    term: "Variance",
    category: "statistics",
    definition:
      "A measure of spread: the average of the squared distances from the mean (for a sample, divided by n − 1). Larger variance means values are more spread out. Because it is in squared units, people usually report its square root, the standard deviation.",
    example: `var(c(2, 4, 4, 4, 5, 5, 7, 9))`,
    related: ["standard-deviation", "mean"],
  },
  {
    slug: "standard-deviation",
    term: "Standard deviation",
    category: "statistics",
    definition:
      "The typical distance of values from the mean, in the same units as the data. A small standard deviation means values cluster near the mean; a large one means they are spread out. For roughly normal data, about 68% of values lie within one standard deviation of the mean. `sd()` calculates it.",
    example: `sd(c(160, 165, 170, 175, 180))
sd(c(150, 160, 170, 180, 190))`,
    related: ["variance", "mean", "normal-distribution", "z-score"],
  },
  {
    slug: "outlier",
    term: "Outlier",
    category: "statistics",
    definition:
      "A value that is unusually far from the rest – for example one house costing ten times more than the others. Outliers can be data-entry mistakes or genuine but rare cases, so investigate them rather than deleting them automatically. They pull the mean and standard deviation but barely affect the median and IQR.",
    example: `x <- c(10, 12, 11, 13, 95)
boxplot.stats(x)$out`,
    related: ["box-plot", "iqr", "median", "z-score"],
  },
  {
    slug: "distribution",
    term: "Distribution",
    category: "statistics",
    definition:
      "How the values of a variable are spread out: which values occur and how often. You describe a distribution by its centre (mean, median), spread (standard deviation, IQR) and shape (symmetric, skewed, one or several peaks). Histograms and box plots show it.",
    example: `hist(faithful$eruptions, main = "Old Faithful eruption times")`,
    related: ["histogram", "normal-distribution", "skewness"],
  },
  {
    slug: "normal-distribution",
    term: "Normal distribution",
    category: "statistics",
    definition:
      "The symmetric, bell-shaped distribution where most values are near the mean and fewer appear further away. About 68% of values lie within 1 standard deviation of the mean, 95% within 2 and 99.7% within 3. Heights and measurement errors are roughly normal, and many statistical tests assume it.",
    example: `set.seed(1)
heights <- rnorm(1000, mean = 170, sd = 10)
mean(abs(heights - 170) < 10)`,
    related: ["distribution", "standard-deviation", "z-score"],
  },
  {
    slug: "skewness",
    term: "Skewness",
    category: "statistics",
    definition:
      "How lopsided a distribution is. *Right-skewed* data have a long tail of large values (incomes, house prices) and their mean is larger than the median; *left-skewed* data have a long tail of small values. Symmetric data have no skew.",
    example: `incomes <- c(25, 28, 30, 32, 35, 40, 150)
mean(incomes) > median(incomes)`,
    related: ["distribution", "mean", "median"],
  },
  {
    slug: "z-score",
    term: "Z-score",
    category: "statistics",
    definition:
      "How many standard deviations a value is above (positive) or below (negative) the mean: (value − mean) / sd. Z-scores put different variables on a common scale; values with |z| above about 3 are unusual. `scale()` computes them.",
    example: `heights <- c(150, 160, 170, 180, 190)
(heights - mean(heights)) / sd(heights)`,
    related: ["standard-deviation", "normal-distribution", "outlier"],
  },
  {
    slug: "summary-statistics",
    term: "Summary statistics",
    category: "statistics",
    definition:
      "A handful of numbers that describe a variable: centre (mean, median), spread (standard deviation, IQR, range) and counts (n, missing values). They are the first step in describing any dataset; `summary()` gives several at once.",
    example: `summary(mtcars$hp)`,
    related: ["mean", "median", "standard-deviation", "eda"],
  },
  {
    slug: "frequency-table",
    term: "Frequency table",
    category: "statistics",
    definition:
      "A table that counts how many times each value or category occurs. Dividing the counts by the total gives *relative frequencies* (proportions). In R, `table()` makes one and `prop.table()` turns it into proportions.",
    example: `table(mtcars$gear)
prop.table(table(mtcars$gear))`,
    related: ["categorical-variable", "bar-chart", "mode", "chi-square-test"],
  },
  {
    slug: "correlation",
    term: "Correlation",
    category: "statistics",
    definition:
      "A number from −1 to +1 that measures how strongly two numeric variables move together in a straight-line pattern. +1 means perfectly together, −1 perfectly opposite, 0 no linear relationship. Correlation is not causation: ice-cream sales and sunburns are correlated because both rise in summer.",
    example: `cor(mtcars$wt, mtcars$mpg)`,
    related: ["scatter-plot", "linear-regression", "r-squared"],
  },
  {
    slug: "population",
    term: "Population",
    category: "statistics",
    definition:
      "The whole group you want to learn about – all voters in a country, all light bulbs a factory makes. Measuring everyone is usually impossible, so we study a sample and use statistics to draw conclusions about the population.",
    related: ["sample", "random-sample", "confidence-interval"],
  },
  {
    slug: "sample",
    term: "Sample",
    category: "statistics",
    definition:
      "The part of the population you actually collect data from, such as 1,000 surveyed voters. A sample is useful only if it represents the population well, which is why random samples are preferred. Results from a sample always contain some uncertainty.",
    example: `set.seed(3)
sample(1:100, 5)`,
    related: ["population", "random-sample", "standard-error"],
  },
  {
    slug: "random-sample",
    term: "Random sample",
    category: "statistics",
    definition:
      "A sample where every member of the population has the same chance of being chosen, like drawing names from a well-mixed hat. Randomness protects against bias (for example, only asking your friends). In R, `sample()` draws one; `set.seed()` makes it reproducible.",
    example: `set.seed(10)
sample(c("Ana", "Ben", "Cleo", "Dev", "Eli"), 2)`,
    related: ["sample", "population", "seed", "probability"],
  },
  {
    slug: "probability",
    term: "Probability",
    category: "statistics",
    definition:
      "A number between 0 and 1 that says how likely something is: 0 means impossible, 1 means certain, 0.5 means as likely as not (like a fair coin landing heads). In the long run, the share of times an event happens approaches its probability.",
    example: `set.seed(5)
flips <- sample(c("heads", "tails"), 1000, replace = TRUE)
mean(flips == "heads")`,
    related: ["random-sample", "p-value", "normal-distribution"],
  },
  {
    slug: "confidence-interval",
    term: "Confidence interval",
    category: "statistics",
    definition:
      "A range of plausible values for a population quantity, calculated from a sample – for example \"the mean height is 170 cm, 95% CI 167 to 173\". The method gives intervals that contain the true value 95% of the time. Wider intervals mean more uncertainty; larger samples make them narrower.",
    example: `t.test(mtcars$mpg)$conf.int`,
    related: ["standard-error", "t-test", "population", "sample"],
  },
  {
    slug: "hypothesis",
    term: "Hypothesis",
    category: "statistics",
    definition:
      "A clear, testable statement about the world, such as \"the new fertiliser makes plants grow taller\". In statistics you translate it into a null hypothesis and an alternative hypothesis and then use data to decide between them.",
    related: ["null-hypothesis", "alternative-hypothesis", "p-value"],
  },
  {
    slug: "null-hypothesis",
    term: "Null hypothesis (H₀)",
    category: "statistics",
    definition:
      "The \"nothing special is going on\" assumption: no difference between groups, no relationship between variables. A test asks whether the data are surprising *if* the null hypothesis were true. We either reject it (the data are too surprising) or fail to reject it – we never prove it.",
    related: ["alternative-hypothesis", "p-value", "hypothesis", "significance-level"],
  },
  {
    slug: "alternative-hypothesis",
    term: "Alternative hypothesis (H₁)",
    category: "statistics",
    definition:
      "The statement you are looking for evidence for: there *is* a difference or a relationship. If the p-value is small enough, you reject the null hypothesis in favour of the alternative.",
    related: ["null-hypothesis", "hypothesis", "p-value"],
  },
  {
    slug: "p-value",
    term: "p-value",
    category: "statistics",
    definition:
      "The probability of getting results at least as extreme as yours *if the null hypothesis were true*. A small p-value (typically below 0.05) means the data would be surprising under H₀, so you reject it. It is **not** the probability that H₀ is true, and it says nothing about how big or important an effect is.",
    example: `t.test(mpg ~ am, data = mtcars)$p.value`,
    related: ["significance-level", "null-hypothesis", "t-test"],
  },
  {
    slug: "significance-level",
    term: "Significance level (α)",
    category: "statistics",
    definition:
      "The threshold you choose *before* testing for calling a result significant, usually α = 0.05. If the p-value is below α, you reject the null hypothesis. α is also the risk you accept of wrongly rejecting a true null hypothesis (a false alarm).",
    example: `p <- t.test(mpg ~ am, data = mtcars)$p.value
p < 0.05`,
    related: ["p-value", "null-hypothesis", "confidence-interval"],
  },
  {
    slug: "t-test",
    term: "t-test",
    category: "statistics",
    definition:
      "A test that compares means: a one-sample t-test compares a mean with a fixed value, a two-sample t-test compares the means of two groups, and a paired t-test compares before/after measurements of the same subjects. In R: `t.test()`.",
    example: `t.test(mpg ~ am, data = mtcars)`,
    related: ["p-value", "anova", "degrees-of-freedom", "confidence-interval"],
  },
  {
    slug: "chi-square-test",
    term: "Chi-square test",
    category: "statistics",
    definition:
      "A test for categorical data. The test of independence checks whether two categorical variables are related, by comparing the observed counts in a table with the counts you would expect if they were unrelated. In R: `chisq.test(table(x, y))`.",
    example: `chisq.test(table(mtcars$am, mtcars$vs))`,
    related: ["frequency-table", "categorical-variable", "p-value"],
  },
  {
    slug: "anova",
    term: "ANOVA",
    category: "statistics",
    definition:
      "Analysis of variance: a test of whether the means of three or more groups differ, by comparing the variation *between* groups with the variation *within* groups (the F statistic). A significant result says at least one group differs; follow-up tests such as Tukey's say which. In R: `summary(aov(y ~ group, data))`.",
    example: `summary(aov(weight ~ group, data = PlantGrowth))`,
    related: ["t-test", "p-value", "variance"],
  },
  {
    slug: "linear-regression",
    term: "Linear regression",
    category: "statistics",
    definition:
      "A model that fits the best straight line through data to describe and predict a numeric outcome from one or more predictors: outcome = intercept + slope × predictor. \"Best\" means the line with the smallest total squared residuals. In R: `lm(outcome ~ predictor, data)`.",
    example: `model <- lm(mpg ~ wt, data = mtcars)
coef(model)`,
    related: ["coefficient", "residual", "r-squared", "correlation"],
  },
  {
    slug: "coefficient",
    term: "Coefficient",
    category: "statistics",
    definition:
      "A number in a regression model. The *intercept* is the predicted outcome when the predictors are 0; a *slope* coefficient says how much the outcome changes for a one-unit increase in that predictor. For `lm(mpg ~ wt)`, a slope of about −5.3 means each extra 1000 lbs lowers mpg by about 5.3.",
    example: `coef(lm(mpg ~ wt, data = mtcars))`,
    related: ["linear-regression", "standard-error", "residual"],
  },
  {
    slug: "residual",
    term: "Residual",
    category: "statistics",
    definition:
      "The difference between an observed value and the value the model predicted: observed − predicted. Residuals are the model's mistakes; small, patternless residuals mean the model fits well.",
    example: `model <- lm(mpg ~ wt, data = mtcars)
head(residuals(model), 3)`,
    related: ["linear-regression", "r-squared"],
  },
  {
    slug: "r-squared",
    term: "R-squared (R²)",
    category: "statistics",
    definition:
      "The share of the variation in the outcome that a regression model explains, from 0 (explains nothing) to 1 (explains everything). An R² of 0.75 means the predictors account for 75% of the variation. A high R² does not prove the model is correct or causal.",
    example: `summary(lm(mpg ~ wt, data = mtcars))$r.squared`,
    related: ["linear-regression", "residual", "correlation"],
  },
  {
    slug: "standard-error",
    term: "Standard error",
    category: "statistics",
    definition:
      "How much an estimate (such as a sample mean or a regression coefficient) would vary from sample to sample. Smaller is more precise; it shrinks as the sample gets larger. For a mean it equals sd / √n. Confidence intervals are built from it.",
    example: `x <- mtcars$mpg
sd(x) / sqrt(length(x))`,
    related: ["standard-deviation", "confidence-interval", "coefficient"],
  },
  {
    slug: "degrees-of-freedom",
    term: "Degrees of freedom (df)",
    category: "statistics",
    definition:
      "Roughly, the number of independent pieces of information left for estimating variability after you have estimated other quantities. For a one-sample t-test it is n − 1. Test output reports `df` because the shape of the reference distribution depends on it; you rarely compute it yourself.",
    example: `t.test(mtcars$mpg)$parameter`,
    related: ["t-test", "chi-square-test", "anova"],
  },
];
