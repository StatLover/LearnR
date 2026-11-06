import type { Lesson } from "../../types";

export const measuresOfSpreadLesson: Lesson = {
  id: "measures-of-spread",
  module: 7,
  title: "Spread: Range, Quantiles, Variance and Standard Deviation",
  summary: "Measure how much your data varies with the range, quantiles, the IQR, the variance and the standard deviation.",
  minutes: 35,
  objectives: [
    "Explain why a measure of center is not enough without a measure of spread",
    "Compute the minimum, maximum and range with min(), max(), range() and diff()",
    "Find quartiles and percentiles with quantile() and the interquartile range with IQR()",
    "Calculate the variance and standard deviation by hand and with var() and sd()",
    "Explain in simple words why the variance divides by n - 1",
  ],
  intro: `Two classes both have an average test score of 70. In the first class everybody scored between 68 and 72; in the second, scores ran from 40 to 100. Same center – completely different classes! To describe data properly you need a second kind of number: a **measure of spread** (also called *variability* or *dispersion*), which says how far the values wander from each other and from the center.

In this lesson you will meet the spread measures every analyst uses: the **range** (largest minus smallest), **quantiles** and the **interquartile range** (spread of the middle half), and the **variance** and **standard deviation** (the typical distance from the mean). As before, you will first compute each one by hand with tiny numbers, then in R, and then put it into words.`,
  sections: [
    {
      id: "why-spread",
      title: "Why the center is not enough",
      blocks: [
        {
          kind: "code",
          example: {
            id: "same-center",
            title: "Same mean, same median …",
            code: `class_a <- c(68, 69, 70, 71, 72)
class_b <- c(40, 55, 70, 85, 100)

mean(class_a)
mean(class_b)
median(class_a)
median(class_b)`,
            explanation: [
              { code: "class_a <- c(68, 69, 70, 71, 72)", text: "Five scores packed tightly around 70." },
              { code: "class_b <- c(40, 55, 70, 85, 100)", text: "Five scores spread out widely around 70." },
              { code: "mean(class_a)", text: "Both classes have the same mean …" },
              { code: "median(class_b)", text: "… and the same median." },
            ],
            output: `[1] 70
[1] 70
[1] 70
[1] 70`,
            outputNote: "Every measure of center says **70** for both classes. If you only reported the center, nobody would know that class B contains both struggling and excellent students. That is the job of a measure of spread.",
          },
        },
        {
          kind: "diagram",
          name: "center-spread",
          caption: "Center answers \"where?\"; spread answers \"how scattered?\". A good summary always reports both.",
        },
      ],
    },
    {
      id: "range",
      title: "Minimum, maximum and range",
      blocks: [
        {
          kind: "text",
          md: `The simplest measure of spread is the **range**: the distance from the smallest value to the largest value.

For class B (40, 55, 70, 85, 100): the minimum is 40, the maximum is 100, and the range is 100 − 40 = **60** points. For class A the range is only 72 − 68 = **4** points.

In R, be careful: the function \`range()\` does **not** return that single distance. It returns **two numbers** – the minimum and the maximum. To get the width, take the difference with \`diff()\` (or compute \`max(x) - min(x)\`).`,
        },
        {
          kind: "code",
          example: {
            id: "range-min-max",
            title: "min(), max(), range() and diff()",
            code: `class_b <- c(40, 55, 70, 85, 100)

min(class_b)
max(class_b)
range(class_b)
diff(range(class_b))`,
            explanation: [
              { code: "min(class_b)", text: "The smallest value." },
              { code: "max(class_b)", text: "The largest value." },
              { code: "range(class_b)", text: "A vector of length 2: `c(min, max)`." },
              { code: "diff(range(class_b))", text: "`diff()` subtracts the first value from the second: 100 − 40." },
            ],
            output: `[1] 40
[1] 100
[1]  40 100
[1] 60`,
            outputNote: "`range()` printed `40 100` (two values), and `diff()` turned that into the statistical range, **60 points**.",
          },
        },
        {
          kind: "code",
          example: {
            id: "range-students",
            title: "Range of real data (and missing values again)",
            code: `students <- read.csv("data/students.csv")

range(students$math)
diff(range(students$math))
range(students$science)
range(students$science, na.rm = TRUE)`,
            explanation: [
              { code: "range(students$math)", text: "The lowest and highest math scores in the class." },
              { code: "diff(range(students$math))", text: "The distance between them." },
              { code: "range(students$science)", text: "The science column has missing values, so both ends are unknown: `NA NA`." },
              { code: "range(students$science, na.rm = TRUE)", text: "`na.rm = TRUE` works here too." },
            ],
            output: `[1] 53 99
[1] 46
[1] NA NA
[1]  46 100`,
            outputNote: "Math scores run from 53 to 99, a range of **46 points**. The range is easy to understand, but it only uses the two most extreme values – a single outlier can make it huge. The next measures are more robust.",
            tryIt: "Find the range of `students$study_hours`. What is the difference between the hardest- and the least-studying student?",
          },
        },
      ],
    },
    {
      id: "quantiles",
      title: "Quantiles, percentiles and the IQR",
      blocks: [
        {
          kind: "text",
          md: `A **quantile** is a cut point that splits the sorted data at a certain proportion. The **median** is the 0.5 quantile: half of the data is below it. Other famous cut points:

* **Quartiles** split the data into four quarters: the 1st quartile (Q1, 25%), the median (Q2, 50%) and the 3rd quartile (Q3, 75%).
* **Percentiles** use the 0–100 scale: the 90th percentile is the value below which 90% of the data lies. If a baby is "in the 90th percentile for height", 90% of babies of that age are shorter.

Nine ages, already sorted: 18, 20, **21**, 22, **25**, 27, **30**, 34, 41. The median is the 5th value (25). The 1st quartile sits a quarter of the way along (21) and the 3rd quartile three quarters of the way (30).`,
        },
        {
          kind: "definition",
          term: "Interquartile range (IQR)",
          md: "Q3 − Q1: the width of the **middle 50%** of the data. Because it ignores the lowest and highest quarter, outliers barely affect it. For the ages above, IQR = 30 − 21 = 9 years.",
        },
        {
          kind: "code",
          example: {
            id: "quantile-default",
            title: "quantile() gives the five-number summary",
            code: `ages <- c(18, 20, 21, 22, 25, 27, 30, 34, 41)
quantile(ages)
IQR(ages)`,
            explanation: [
              { code: "quantile(ages)", text: "Without extra arguments, `quantile()` returns the 0%, 25%, 50%, 75% and 100% points." },
              { code: "IQR(ages)", text: "`IQR()` (capital letters!) computes Q3 − Q1 directly." },
            ],
            output: `  0%  25%  50%  75% 100%
  18   21   25   30   41
[1] 9`,
            outputNote: "Read the named result column by column: the minimum is 18 (0%), Q1 is 21 (25%), the median is 25 (50%), Q3 is 30 (75%) and the maximum is 41 (100%). These five numbers are called the **five-number summary**. The middle half of the people are between 21 and 30 years old – an IQR of 9 years.",
          },
        },
        {
          kind: "code",
          example: {
            id: "quantile-probs",
            title: "Any percentile you like with probs",
            code: `students <- read.csv("data/students.csv")

quantile(students$math, probs = c(0.1, 0.9))
quantile(students$math, probs = 0.9)
IQR(students$math)`,
            explanation: [
              { code: "quantile(students$math, probs = c(0.1, 0.9))", text: "`probs` takes proportions between 0 and 1: 0.1 is the 10th percentile, 0.9 the 90th." },
              { code: "quantile(students$math, probs = 0.9)", text: "One percentile on its own." },
              { code: "IQR(students$math)", text: "The width of the middle half of the math scores." },
            ],
            output: ` 10%  90%
59.0 90.3
 90%
90.3
[1] 15.25`,
            outputNote: "10% of the students scored below 59 and 90% scored below 90.3 (only the top 10% scored higher). 90.3 is not one of the scores: when a cut point falls between two sorted values, R **interpolates** (goes part of the way between them). The middle 50% of the class spans 15.25 points.",
            tryIt: "Find the 95th percentile of `students$reading`. Remember: `probs` uses 0.95, not 95.",
          },
        },
        {
          kind: "text",
          md: `### Quartiles and box plots

You met box plots in the visualisation module. Now you can see exactly what they draw: the box runs from Q1 to Q3 (so its length is the IQR), the line inside is the median, and points beyond **1.5 × IQR** from the box are drawn individually as possible outliers.`,
        },
        {
          kind: "diagram",
          name: "boxplot-anatomy",
          caption: "A box plot is a picture of the five-number summary. Its box is exactly one IQR long.",
        },
        {
          kind: "code",
          example: {
            id: "iqr-outlier-rule",
            title: "The 1.5 × IQR rule for spotting outliers",
            code: `commute <- c(25, 30, 18, 42, 30, 22, 95, 30, 27)

q1 <- quantile(commute, 0.25)
q3 <- quantile(commute, 0.75)
iqr <- IQR(commute)

q1 - 1.5 * iqr
q3 + 1.5 * iqr
commute[commute > q3 + 1.5 * iqr]`,
            explanation: [
              { code: "q1 <- quantile(commute, 0.25)", text: "The 1st quartile (25 minutes)." },
              { code: "q3 <- quantile(commute, 0.75)", text: "The 3rd quartile (30 minutes)." },
              { code: "iqr <- IQR(commute)", text: "Q3 − Q1 = 5 minutes." },
              { code: "q1 - 1.5 * iqr", text: "The lower *fence*: values below it are flagged." },
              { code: "q3 + 1.5 * iqr", text: "The upper fence." },
              { code: "commute[commute > q3 + 1.5 * iqr]", text: "Logical indexing keeps only the values above the upper fence." },
            ],
            output: ` 25%
17.5
 75%
37.5
[1] 42 95`,
            outputNote: "The fences are 17.5 and 37.5 minutes (the labels `25%` and `75%` were simply carried over from the quantiles). Commutes of **42 and 95 minutes** are flagged as possible outliers. \"Flagged\" does not mean \"wrong\" – it means *look at these values and decide whether they are errors or genuine unusual cases*.",
          },
        },
        {
          kind: "code",
          example: {
            id: "commute-boxplot",
            title: "The same rule, drawn as a box plot",
            code: `commute <- c(25, 30, 18, 42, 30, 22, 95, 30, 27)
boxplot(commute, horizontal = TRUE, main = "Commute times (minutes)")`,
            explanation: [
              { code: `boxplot(commute, horizontal = TRUE, main = "Commute times (minutes)")`, text: "`boxplot()` computes the quartiles and the 1.5 × IQR fences for you; `horizontal = TRUE` lays it on its side." },
            ],
            plot: true,
            tryIt: "Change the 95 to 35 and redraw. How many points are drawn outside the whiskers now?",
          },
        },
        {
          kind: "question",
          question: {
            id: "m7-spread-q1",
            type: "multiple-choice",
            prompt: "The 25th percentile of a set of exam scores is 62 and the 75th percentile is 81. Which statement is true?",
            options: [
              "The middle half of the students scored between 62 and 81",
              "25 students scored 62",
              "The mean score is (62 + 81) / 2 = 71.5",
              "The range of the scores is 19",
            ],
            answer: 0,
            explanation: "Q1 = 62 and Q3 = 81, so 50% of the scores lie between them. The IQR is 81 − 62 = 19 – but that is the IQR, not the range (which uses the minimum and maximum).",
            optionFeedback: [
              "Correct – between the 25th and 75th percentile lies the middle 50% of the data.",
              "A percentile is about the **proportion** of values below a point, not a count of students.",
              "Quartiles say nothing exact about the mean.",
              "19 is the **IQR** (Q3 − Q1). The range is max − min, which we do not know here.",
            ],
            concept: "quantiles",
          },
        },
      ],
    },
    {
      id: "variance",
      title: "Variance: the average squared distance from the mean",
      blocks: [
        {
          kind: "text",
          md: `The range and IQR use only a few cut points. The **variance** uses **every** value. The idea: measure how far each value is from the mean, and average those distances.

Take x = 2, 4, 4, 4, 5, 5, 7, 9. The mean is 40 / 8 = **5**.

| value | deviation (value − mean) | squared deviation |
|---|---|---|
| 2 | −3 | 9 |
| 4 | −1 | 1 |
| 4 | −1 | 1 |
| 4 | −1 | 1 |
| 5 | 0 | 0 |
| 5 | 0 | 0 |
| 7 | 2 | 4 |
| 9 | 4 | 16 |
| | **sum: 0** | **sum: 32** |

1. A **deviation** is how far a value is from the mean. Values below the mean have negative deviations.
2. The deviations always add up to **zero** (the mean is the balance point!), so we cannot simply average them. Instead we **square** them, which makes every distance positive and gives big distances extra weight.
3. Add the squared deviations: 32.
4. Divide by **n − 1** (here 8 − 1 = 7): the variance is 32 / 7 ≈ **4.57**.`,
        },
        {
          kind: "code",
          example: {
            id: "variance-by-hand",
            title: "The variance step by step",
            code: `x <- c(2, 4, 4, 4, 5, 5, 7, 9)

mean(x)
deviations <- x - mean(x)
deviations
squared <- deviations^2
squared
sum(squared)
sum(squared) / (length(x) - 1)
var(x)`,
            explanation: [
              { code: "deviations <- x - mean(x)", text: "Thanks to vectorisation, `x - mean(x)` subtracts the mean (5) from **every** value at once." },
              { code: "squared <- deviations^2", text: "`^2` squares each deviation." },
              { code: "sum(squared)", text: "The *sum of squares*: 32." },
              { code: "sum(squared) / (length(x) - 1)", text: "Divide by n − 1 = 7. The parentheses matter: without them R would compute `sum(squared) / length(x)` first and then subtract 1." },
              { code: "var(x)", text: "`var()` does all of the above in one call." },
            ],
            output: `[1] 5
[1] -3 -1 -1 -1  0  0  2  4
[1]  9  1  1  1  0  0  4 16
[1] 32
[1] 4.571429
[1] 4.571429`,
            outputNote: "Our hand calculation and `var()` agree: the variance is **4.571429**. Its unit is awkward, though: if x were measured in kilograms, the variance would be in *kilograms squared*. That is why we usually report its square root – the standard deviation.",
            tryIt: "Change the 9 to 19. Which squared deviation grows the most? What happens to `var(x)`?",
          },
        },
      ],
    },
    {
      id: "n-minus-1",
      title: "Why divide by n − 1?",
      blocks: [
        {
          kind: "text",
          md: `Dividing by n − 1 instead of n looks strange at first. Here is the simple reason.

Usually your data is a **sample** – a few people out of a much larger group – and you want to know the spread of that larger group. Ideally you would measure distances from the *true* mean of the larger group, but you do not know it, so you use the sample's own mean instead.

The sample mean sits right in the middle of *your* values. In fact, it is the point that makes the sum of squared distances **as small as possible**. Distances measured from it are therefore a little too small compared with distances from the true mean. Dividing by a slightly smaller number (n − 1 instead of n) makes the answer a little bigger, which corrects for this on average.`,
        },
        {
          kind: "code",
          example: {
            id: "sample-mean-too-close",
            title: "Distances from the sample mean are too small",
            code: `my_sample <- c(1, 3)

mean(my_sample)
sum((my_sample - mean(my_sample))^2)
sum((my_sample - 5)^2)`,
            explanation: [
              { code: "my_sample <- c(1, 3)", text: "Imagine these two values were drawn from a big group whose true mean is 5 (normally you would not know that)." },
              { code: "sum((my_sample - mean(my_sample))^2)", text: "Squared distances from the sample's own mean (2): 1 + 1." },
              { code: "sum((my_sample - 5)^2)", text: "Squared distances from the true mean (5): 16 + 4." },
            ],
            output: `[1] 2
[1] 2
[1] 20`,
            outputNote: "Measured from its own mean, the sample looks much less spread out (2) than it really is around the true center (20). This always happens to some degree, and dividing by n − 1 compensates.",
          },
        },
        {
          kind: "callout",
          tone: "info",
          title: "Another way to see it: degrees of freedom",
          md: "The deviations from the mean always sum to zero. So once you know n − 1 of them, the last one is fixed – it has no \"freedom\" left. Only n − 1 deviations carry independent information, which is why statisticians say the variance has **n − 1 degrees of freedom**. You will meet degrees of freedom again in the t-tests of Module 9.",
        },
        {
          kind: "code",
          example: {
            id: "deviations-sum-zero",
            title: "The deviations always sum to zero",
            code: `x <- c(2, 4, 4, 4, 5, 5, 7, 9)
deviations <- x - mean(x)
sum(deviations)`,
            explanation: [
              { code: "sum(deviations)", text: "−3 − 1 − 1 − 1 + 0 + 0 + 2 + 4 = 0, for any data set." },
            ],
            output: `[1] 0`,
            outputNote: "If you knew the first seven deviations, you could work out the eighth: it must make the total zero.",
          },
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Do not worry too much",
          md: "With large datasets, dividing by n or by n − 1 gives almost the same answer. R's `var()` and `sd()` always use n − 1, which is the standard choice for samples – so you can simply use them.",
        },
      ],
    },
    {
      id: "standard-deviation",
      title: "Standard deviation: the typical distance from the mean",
      blocks: [
        {
          kind: "definition",
          term: "Standard deviation (SD)",
          md: "The square root of the variance. It is in the **same unit as the data** and can be read as *roughly how far a typical value is from the mean*. A small SD means the values are packed closely around the mean; a large SD means they are spread out. An SD of 0 means all values are identical.",
        },
        {
          kind: "code",
          example: {
            id: "sd-basic",
            title: "sd() is the square root of var()",
            code: `x <- c(2, 4, 4, 4, 5, 5, 7, 9)

var(x)
sqrt(var(x))
sd(x)`,
            explanation: [
              { code: "sqrt(var(x))", text: "`sqrt()` takes the square root, undoing the squaring and bringing us back to the original unit." },
              { code: "sd(x)", text: "`sd()` gives the same number directly." },
            ],
            output: `[1] 4.571429
[1] 2.13809
[1] 2.13809`,
            outputNote: "The SD is about **2.14**: the values are typically about 2 units away from their mean of 5 – which matches what you see in the data (most values are between 4 and 7).",
          },
        },
        {
          kind: "code",
          example: {
            id: "sd-two-classes",
            title: "Back to the two classes",
            code: `class_a <- c(68, 69, 70, 71, 72)
class_b <- c(40, 55, 70, 85, 100)

sd(class_a)
sd(class_b)`,
            explanation: [
              { code: "sd(class_a)", text: "Spread of the tightly packed class." },
              { code: "sd(class_b)", text: "Spread of the widely spread class." },
            ],
            output: `[1] 1.581139
[1] 23.71708`,
            outputNote: "Now the difference is obvious in numbers: both classes average 70 points, but scores in class A typically differ from 70 by about **1.6 points**, in class B by about **24 points**. A complete summary is \"mean 70, SD 1.6\" versus \"mean 70, SD 23.7\".",
          },
        },
        {
          kind: "code",
          example: {
            id: "sd-patients",
            title: "Mean ± one standard deviation on real data",
            code: `patients <- read.csv("data/patients.csv")

bp <- patients$systolic_bp
mean(bp)
sd(bp)
mean(bp) - sd(bp)
mean(bp) + sd(bp)
mean(abs(bp - mean(bp)) <= sd(bp))`,
            explanation: [
              { code: "bp <- patients$systolic_bp", text: "Store the blood pressure column in a short variable name." },
              { code: "mean(bp) - sd(bp)", text: "One SD below the mean." },
              { code: "mean(bp) + sd(bp)", text: "One SD above the mean." },
              { code: "mean(abs(bp - mean(bp)) <= sd(bp))", text: "`abs()` gives each patient's distance from the mean; `<= sd(bp)` is TRUE for patients within one SD; the mean of TRUE/FALSE values is the **proportion** of TRUEs." },
            ],
            output: `[1] 138.12
[1] 13.84474
[1] 124.2753
[1] 151.9647
[1] 0.7066667`,
            outputNote: "The average systolic blood pressure is **138 mmHg with an SD of about 14 mmHg**. About 71% of patients lie within one SD of the mean (between roughly 124 and 152). For data shaped like a bell curve this proportion is typically around two thirds – you will see why in Module 9.",
            tryIt: "Repeat the analysis for `patients$cholesterol`. You will need `na.rm = TRUE` in `mean()` and `sd()`, and in the last line too.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m7-spread-q2",
            type: "predict-output",
            prompt: "What does this code print?",
            code: `sd(c(4, 4, 4, 4))`,
            options: ["[1] 4", "[1] 1", "[1] 0", "[1] NA"],
            answer: 2,
            explanation: "Every value equals the mean (4), so every deviation is 0, the variance is 0 and the standard deviation is 0. Zero spread means all values are identical.",
            optionFeedback: [
              "4 is the mean, not the spread.",
              "There is no variation at all, so the SD cannot be 1.",
              "Correct – no value differs from the mean.",
              "There are no missing values here, so the result is a real number.",
            ],
            concept: "standard-deviation",
          },
        },
      ],
    },
    {
      id: "choosing-spread",
      title: "Which measure of spread should you report?",
      blocks: [
        {
          kind: "table",
          caption: "Measures of spread at a glance",
          headers: ["Measure", "R code", "Meaning", "Robust to outliers?"],
          rows: [
            ["Range", "`diff(range(x))`", "Distance from smallest to largest value", "No – depends only on the extremes"],
            ["IQR", "`IQR(x)`", "Width of the middle 50% (Q3 − Q1)", "Yes"],
            ["Variance", "`var(x)`", "Average squared distance from the mean (÷ n − 1)", "No"],
            ["Standard deviation", "`sd(x)`", "Typical distance from the mean, in the data's unit", "No"],
          ],
        },
        {
          kind: "text",
          md: `A good rule of thumb is to **pair them up**: report the **mean with the standard deviation** for roughly symmetric data, and the **median with the IQR** for skewed data or data with outliers. Then say it in words, for example:

> *"Systolic blood pressure averaged 138 mmHg (SD 14 mmHg), so most patients were within about 14 mmHg of the average."*

> *"The median commute was 30 minutes (IQR 5 minutes), but two people travelled much longer: 42 and 95 minutes."*`,
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Expecting range() to return one number",
      wrong: `x <- c(3, 8, 1, 12)
range(x)`,
      why: "`range()` returns the minimum and the maximum (`1 12`), not their difference. If you use it in a calculation you will get two numbers back.",
      right: `x <- c(3, 8, 1, 12)
diff(range(x))`,
    },
    {
      title: "Giving quantile() a percentage instead of a proportion",
      wrong: `x <- c(3, 8, 1, 12)
quantile(x, 90)`,
      error: "'probs' outside [0,1]",
      why: "The `probs` argument expects proportions between 0 and 1. The 90th percentile is `0.9`, not `90`.",
      right: `x <- c(3, 8, 1, 12)
quantile(x, 0.9)`,
    },
    {
      title: "Writing iqr() in lower case",
      wrong: `x <- c(3, 8, 1, 12)
iqr(x)`,
      error: `could not find function "iqr"`,
      why: "R is case-sensitive. The function is called `IQR()` with capital letters.",
      right: `x <- c(3, 8, 1, 12)
IQR(x)`,
    },
    {
      title: "Forgetting na.rm in spread functions",
      wrong: `patients <- read.csv("data/patients.csv")
sd(patients$cholesterol)`,
      why: "Like `mean()`, the functions `sd()`, `var()`, `range()`, `quantile()` and `IQR()` need `na.rm = TRUE` when there are missing values. `sd()` and `var()` quietly return `NA`; `quantile()` and `IQR()` stop with an error.",
      right: `patients <- read.csv("data/patients.csv")
sd(patients$cholesterol, na.rm = TRUE)`,
    },
  ],
  exerciseIds: ["m7-spread-measures", "m7-variance-by-hand"],
  quiz: [
    {
      id: "m7-spread-q3",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `range(c(5, 1, 9, 3))`,
      options: ["[1] 8", "[1] 1 9", "[1] 5 3", "[1] 9"],
      answer: 1,
      explanation: "`range()` returns the smallest and the largest value as a vector of two numbers. To get the single number 8, use `diff(range(...))`.",
      optionFeedback: [
        "8 is the statistical range, which you get with `diff(range(x))` or `max(x) - min(x)`.",
        "Correct – the minimum and the maximum.",
        "`range()` does not return the first and last values in the order they were typed; it returns the min and max.",
        "9 is only the maximum.",
      ],
      concept: "range",
    },
    {
      id: "m7-spread-q4",
      type: "multiple-choice",
      prompt: "Heights are measured in centimetres. In which unit is the standard deviation of the heights?",
      options: ["Centimetres", "Centimetres squared", "Percent", "It has no unit"],
      answer: 0,
      explanation: "The variance is in squared units (cm²) because it averages squared distances. Taking the square root brings the standard deviation back to centimetres – that is exactly why the SD is easier to interpret.",
      optionFeedback: [
        "Correct.",
        "That is the unit of the **variance**. The SD is its square root.",
        "The SD is not a percentage; it is a distance in the data's own unit.",
        "It has the same unit as the data.",
      ],
      concept: "standard-deviation",
    },
    {
      id: "m7-spread-q5",
      type: "fill-blank",
      prompt: "Complete the code to compute the 90th percentile of `scores`.",
      code: `scores <- c(55, 61, 70, 74, 78, 83, 90, 95)
quantile(scores, probs = ___)`,
      accept: ["0.9", "0.90", ".9"],
      hint: "`probs` uses proportions between 0 and 1.",
      explanation: "The 90th percentile is the 0.9 quantile: `quantile(scores, probs = 0.9)`. 90% of the values lie below it.",
      concept: "quantiles",
    },
    {
      id: "m7-spread-q6",
      type: "true-false",
      prompt: "The interquartile range (IQR) is less affected by a single extreme value than the range is.",
      answer: true,
      explanation: "True. The IQR only depends on the 25th and 75th percentiles, so changing the largest value does not move it at all. The range is computed from the minimum and maximum, so one outlier changes it directly.",
      concept: "iqr",
    },
    {
      id: "m7-spread-q7",
      type: "multiple-choice",
      prompt: "Why do `var()` and `sd()` divide by n − 1 instead of n?",
      options: [
        "Distances from the sample's own mean are slightly too small, and dividing by n − 1 corrects for that",
        "To avoid dividing by zero when n is 1",
        "Because R counts from zero",
        "It makes the variance smaller and therefore more precise",
      ],
      answer: 0,
      explanation: "The sample mean is the point that makes the squared distances as small as possible, so the sum of squares around it underestimates the spread around the true (unknown) mean. Dividing by n − 1 makes the result a little bigger, which corrects this on average.",
      optionFeedback: [
        "Correct.",
        "With n = 1 you actually do divide by zero – R returns `NA` for `sd()` of a single value. That is not the reason.",
        "R counts from 1 (the first element is `x[1]`).",
        "Dividing by a smaller number makes the variance **bigger**, not smaller.",
      ],
      concept: "variance",
    },
  ],
  keyPoints: [
    "A measure of spread says how much the values vary; always report it together with a measure of center.",
    "`range(x)` returns the minimum and maximum; `diff(range(x))` gives the range as one number.",
    "`quantile(x, probs = ...)` finds percentiles using proportions (0.9 = 90th percentile); `IQR(x)` is Q3 − Q1, the width of the middle half.",
    "The variance averages squared deviations from the mean, dividing by n − 1; `var(x)` computes it.",
    "The standard deviation `sd(x)` is the square root of the variance, in the data's own unit: roughly the typical distance from the mean.",
    "Pair mean with SD for symmetric data, and median with IQR for skewed data or data with outliers.",
  ],
  concepts: ["range", "quantiles", "iqr", "variance", "standard-deviation"],
  glossary: ["range", "quantile", "percentile", "iqr", "variance", "standard-deviation", "outlier", "box-plot", "degrees-of-freedom"],
  playground: `# Measures of spread – experiment here!
patients <- read.csv("data/patients.csv")

range(patients$age)
quantile(patients$age)
IQR(patients$age)
sd(patients$age)
`,
  prerequisites: ["mean-median-mode"],
  datasets: ["students", "patients"],
};
