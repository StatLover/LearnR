import type { Lesson } from "../../types";

export const tTestsChiSquareAnovaLesson: Lesson = {
  id: "t-tests-chi-square-anova",
  module: 9,
  title: "Comparing Groups: t-tests, Chi-square and ANOVA",
  summary: "Choose and run the right test – one-sample, two-sample and paired t-tests, chi-square tests and ANOVA – and read R's output line by line.",
  minutes: 50,
  objectives: [
    "Choose a suitable test from the type of question and data",
    "Run one-sample, two-sample (Welch) and paired t-tests with t.test() and read every line of the output",
    "Test whether two categorical variables are related with chisq.test(), and check the expected counts",
    "Compare three or more group means with aov(), explain the F value, and find which groups differ with TukeyHSD()",
    "Report a test result in a clear, honest sentence",
  ],
  intro: `In the last lesson you learned the logic of every hypothesis test: assume "no effect" (H₀), measure how surprising the data is (the p-value), then decide. Now you will meet the tests analysts use every day.

* **t-tests** compare **means**: one group against a fixed value, two independent groups, or the same people measured twice.
* The **chi-square test** checks whether two **categorical** variables are related.
* **ANOVA** compares the means of **three or more** groups at once.

R prints the results of these tests in a compact, slightly cryptic format. By the end of this lesson you will be able to read every line of it – and turn it into a plain-English conclusion.`,
  sections: [
    {
      id: "choosing-a-test",
      title: "Which test for which question?",
      blocks: [
        {
          kind: "table",
          caption: "Choosing a test",
          headers: ["Question", "Data", "Test", "R function"],
          rows: [
            ["Is the mean different from a known value?", "One numeric variable", "One-sample t-test", "`t.test(x, mu = 70)`"],
            ["Do two independent groups have different means?", "Numeric outcome + group with 2 levels", "Two-sample (Welch) t-test", "`t.test(y ~ group, data = df)`"],
            ["Did the same subjects change between two measurements?", "Two numeric measurements per subject", "Paired t-test", "`t.test(after, before, paired = TRUE)`"],
            ["Are two categorical variables related?", "Two categorical variables", "Chi-square test of independence", "`chisq.test(table(a, b))`"],
            ["Do three or more groups have different means?", "Numeric outcome + group with 3+ levels", "One-way ANOVA", "`summary(aov(y ~ group, data = df))`"],
          ],
        },
        {
          kind: "diagram",
          name: "hypothesis-test",
          caption: "Every test in this lesson follows the same path: assume H₀, compute a test statistic (t, χ² or F), turn it into a p-value, and decide.",
        },
        {
          kind: "callout",
          tone: "info",
          title: "Assumptions in one sentence",
          md: "t-tests and ANOVA assume independent observations and roughly normal data within each group – but with moderately large groups (say 30+), the tests work well even for data that is not perfectly bell-shaped. Chi-square tests need large enough **expected** counts (more on that below). Always look at your data with a plot first.",
        },
      ],
    },
    {
      id: "one-sample-t-test",
      title: "The one-sample t-test",
      blocks: [
        {
          kind: "text",
          md: `Suppose a national report says the average score on this math test is **70**. Our 60 students averaged 74.65. Do students like ours really score differently, or could a difference this big just be sampling luck?

* **H₀:** the population mean is 70 (μ = 70).
* **H₁:** the population mean is not 70 (μ ≠ 70).

The test statistic is the **t value**: how many standard errors the sample mean is away from 70.

> t = (sample mean − 70) / SE

A t value near 0 is what H₀ predicts; a t value far from 0 (beyond about ±2) is surprising under H₀.`,
        },
        {
          kind: "code",
          example: {
            id: "one-sample-t-test",
            title: "t.test() with mu",
            code: `students <- read.csv("data/students.csv")

t.test(students$math, mu = 70)`,
            explanation: [
              { code: "t.test(students$math, mu = 70)", text: "`mu` is the value from the null hypothesis. Without `mu`, R tests against 0, which is rarely what you want." },
            ],
            output: `
\tOne Sample t-test

data:  students$math
t = 3.1452, df = 59, p-value = 0.002599
alternative hypothesis: true mean is not equal to 70
95 percent confidence interval:
 71.69165 77.60835
sample estimates:
mean of x
    74.65`,
            outputNote: `Reading the output line by line:

* **One Sample t-test** – which test was run.
* **data: students$math** – which data was tested.
* **t = 3.1452** – the sample mean is 3.1 standard errors above 70.
* **df = 59** – degrees of freedom, n − 1 = 59.
* **p-value = 0.002599** – if the true mean were 70, a sample mean at least this far from 70 (in either direction) would occur only about 0.26% of the time.
* **alternative hypothesis: true mean is not equal to 70** – H₁ (two-sided).
* **95 percent confidence interval: 71.69 77.61** – plausible values for the true mean. 70 is not in it, consistent with p < 0.05.
* **sample estimates: mean of x 74.65** – the sample mean.

**Conclusion:** p = 0.0026 < 0.05, so we reject H₀. *"The students' mean math score (74.7) is significantly higher than the national average of 70 (t = 3.15, df = 59, p = 0.003); the true mean is plausibly between 71.7 and 77.6."*`,
            tryIt: "Test against `mu = 75` instead. What is the p-value, and what is your conclusion now?",
          },
        },
        {
          kind: "code",
          example: {
            id: "t-by-hand",
            title: "Where the t value comes from",
            code: `students <- read.csv("data/students.csv")
x <- students$math

se <- sd(x) / sqrt(length(x))
(mean(x) - 70) / se`,
            explanation: [
              { code: "se <- sd(x) / sqrt(length(x))", text: "The standard error of the mean, from the last lesson." },
              { code: "(mean(x) - 70) / se", text: "The distance between the sample mean and the null value, measured in standard errors." },
            ],
            output: `[1] 3.145213`,
            outputNote: "The same 3.1452 that `t.test()` printed. R then looks up how unusual a t of 3.15 is in a t-distribution with 59 degrees of freedom – that tail area is the p-value.",
          },
        },
      ],
    },
    {
      id: "two-sample-t-test",
      title: "The two-sample t-test: comparing two groups",
      blocks: [
        {
          kind: "text",
          md: `The built-in \`ToothGrowth\` data records tooth growth (\`len\`) in 60 guinea pigs that received vitamin C either as orange juice (\`OJ\`) or as a supplement (\`VC\`). Does the delivery method matter?

* **H₀:** the two methods give the same mean tooth length.
* **H₁:** the means differ.

The formula \`len ~ supp\` reads "len, split by supp". R uses **Welch's t-test** by default, which does **not** assume that both groups have the same spread – a safe choice.`,
        },
        {
          kind: "code",
          example: {
            id: "welch-toothgrowth",
            title: "Welch two-sample t-test",
            code: `t.test(len ~ supp, data = ToothGrowth)`,
            explanation: [
              { code: "len ~ supp", text: "The numeric outcome on the left of `~`, the grouping variable (exactly two groups) on the right." },
              { code: "data = ToothGrowth", text: "Where to find the columns." },
            ],
            output: `
\tWelch Two Sample t-test

data:  len by supp
t = 1.9153, df = 55.309, p-value = 0.06063
alternative hypothesis: true difference in means between group OJ and group VC is not equal to 0
95 percent confidence interval:
 -0.1710156  7.5710156
sample estimates:
mean in group OJ mean in group VC
        20.66333         16.96333`,
            outputNote: `* **t = 1.9153** – the difference in means is 1.9 standard errors from 0.
* **df = 55.309** – Welch's test adjusts the degrees of freedom for unequal spreads, so they need not be a whole number.
* **p-value = 0.06063** – just above 0.05.
* **95 percent confidence interval: −0.17 to 7.57** – plausible values for the difference *mean(OJ) − mean(VC)*. It includes 0, so "no difference" is still plausible.
* **sample estimates** – the two group means: 20.7 (OJ) and 17.0 (VC).

**Conclusion:** p = 0.061 > 0.05, so we **fail to reject H₀**. The orange-juice group grew 3.7 units more on average, but the data is not strong enough to rule out that this is sampling variability. That is *not* proof that the methods are equally good – the interval shows the true difference could be up to 7.6 units in favour of OJ.`,
          },
        },
        {
          kind: "code",
          example: {
            id: "welch-patients",
            title: "Do smokers have higher blood pressure?",
            code: `patients <- read.csv("data/patients.csv")

result <- t.test(systolic_bp ~ smoker, data = patients)
result
result$p.value`,
            explanation: [
              { code: "result <- t.test(systolic_bp ~ smoker, data = patients)", text: "Compare mean blood pressure between non-smokers (`No`) and smokers (`Yes`), storing the result." },
              { code: "result", text: "Printing the stored result shows the usual report." },
              { code: "result$p.value", text: "Extract the exact p-value for further use." },
            ],
            output: `
\tWelch Two Sample t-test

data:  systolic_bp by smoker
t = -2.2195, df = 46.507, p-value = 0.03136
alternative hypothesis: true difference in means between group No and group Yes is not equal to 0
95 percent confidence interval:
 -11.7281671  -0.5743539
sample estimates:
 mean in group No mean in group Yes
         136.8487          143.0000

[1] 0.03136459`,
            outputNote: "The difference is computed as **No − Yes** (groups in alphabetical order), so negative numbers mean smokers are higher. Smokers' mean blood pressure is 143.0 vs 136.8 mmHg; p = 0.031 < 0.05, so the difference is statistically significant. The CI says smokers' mean is plausibly between **0.6 and 11.7 mmHg higher**. Careful: this is observational data, so it does not prove that smoking *causes* the difference – smokers might, for example, differ in age or weight.",
            tryIt: "Compare cholesterol between smokers and non-smokers: `t.test(cholesterol ~ smoker, data = patients)`. (Missing values are dropped automatically.)",
          },
        },
        {
          kind: "question",
          question: {
            id: "m9-tests-q1",
            type: "multiple-choice",
            prompt: "A two-sample t-test gives a 95% confidence interval for the difference in means of −2.1 to 5.3. What can you say about the p-value (two-sided)?",
            options: [
              "It is greater than 0.05, because the interval contains 0",
              "It is smaller than 0.05, because the interval contains 0",
              "It is exactly 0.05",
              "Nothing – confidence intervals and p-values are unrelated",
            ],
            answer: 0,
            explanation: "A 95% CI and a two-sided test at α = 0.05 always agree: if 0 (\"no difference\") is inside the interval, the test does not reject H₀, so p > 0.05.",
            optionFeedback: [
              "Correct.",
              "It is the other way round: 0 inside the interval means \"no difference\" is plausible.",
              "p = 0.05 exactly would put 0 right on the edge of the interval.",
              "They are two views of the same calculation and always agree.",
            ],
            concept: "t-tests",
          },
        },
      ],
    },
    {
      id: "paired-t-test",
      title: "The paired t-test: the same subjects twice",
      blocks: [
        {
          kind: "text",
          md: `The built-in \`sleep\` data comes from a classic experiment: **10 patients** each took **two** sleeping drugs (on different nights), and \`extra\` records how many extra hours they slept. Because every patient tried both drugs, the two measurements are **paired**: patient 1's two values belong together.

The smart approach is to compute each patient's **difference** (drug 2 − drug 1) and test whether the mean difference is 0. That removes the big differences *between* patients (some people simply sleep more) and focuses on the drug effect *within* each patient.`,
        },
        {
          kind: "code",
          example: {
            id: "paired-sleep",
            title: "Paired t-test on the sleep data",
            code: `drug1 <- sleep$extra[sleep$group == "1"]
drug2 <- sleep$extra[sleep$group == "2"]

drug2 - drug1
t.test(drug2, drug1, paired = TRUE)`,
            explanation: [
              { code: `drug1 <- sleep$extra[sleep$group == "1"]`, text: "The 10 values for drug 1, in patient order (patient 1 to 10)." },
              { code: `drug2 <- sleep$extra[sleep$group == "2"]`, text: "The 10 values for drug 2, in the same patient order – essential for pairing." },
              { code: "drug2 - drug1", text: "Each patient's difference between the drugs." },
              { code: "t.test(drug2, drug1, paired = TRUE)", text: "`paired = TRUE` tests whether the mean of those differences is 0." },
            ],
            output: ` [1] 1.2 2.4 1.3 1.3 0.0 1.0 1.8 0.8 4.6 1.4

\tPaired t-test

data:  drug2 and drug1
t = 4.0621, df = 9, p-value = 0.002833
alternative hypothesis: true mean difference is not equal to 0
95 percent confidence interval:
 0.7001142 2.4598858
sample estimates:
mean difference
           1.58`,
            outputNote: "Every one of the 10 patients slept at least as long with drug 2. The **mean difference** is 1.58 hours (95% CI 0.70 to 2.46), with **df = 9** (10 pairs − 1) and **p = 0.0028**. Conclusion: *drug 2 gave significantly more extra sleep than drug 1, by about 1.6 hours on average.* (A paired t-test is exactly a one-sample t-test on the differences: `t.test(drug2 - drug1)` gives the same result.)",
          },
        },
        {
          kind: "code",
          example: {
            id: "paired-vs-unpaired",
            title: "Why pairing matters",
            code: `drug1 <- sleep$extra[sleep$group == "1"]
drug2 <- sleep$extra[sleep$group == "2"]

t.test(drug2, drug1, paired = TRUE)$p.value
t.test(drug2, drug1)$p.value`,
            explanation: [
              { code: "t.test(drug2, drug1, paired = TRUE)$p.value", text: "The correct, paired analysis." },
              { code: "t.test(drug2, drug1)$p.value", text: "Wrongly treating the two columns as independent groups (Welch test)." },
            ],
            output: `[1] 0.00283289
[1] 0.07939414`,
            outputNote: "Ignoring the pairing throws away information: the patient-to-patient differences in sleep are counted as noise, and the p-value rises from 0.003 to 0.079. Always use a paired test when the same subjects are measured twice.",
          },
        },
      ],
    },
    {
      id: "chi-square-test",
      title: "The chi-square test: are two categories related?",
      blocks: [
        {
          kind: "text",
          md: `In Module 7 you saw that 77% of West respondents would recommend the app, but only 64% in the South. Is recommending **related** to region, or could differences like these arise by chance?

* **H₀:** region and recommending are independent (the share of "Yes" is the same in every region).
* **H₁:** they are related.

The idea is to compare the **observed** counts with the **expected** counts – the counts we would expect if H₀ were true. Overall, 141 of 200 people (70.5%) said Yes. If region did not matter, we would expect 70.5% of the 47 East respondents to say Yes: 47 × 141 / 200 ≈ **33.1**, and 47 × 59 / 200 ≈ **13.9** to say No. In general:

> expected count = row total × column total / grand total

The **chi-square statistic** adds up (observed − expected)² / expected over all cells. Big gaps between observed and expected give a big statistic and a small p-value.`,
        },
        {
          kind: "code",
          example: {
            id: "chisq-region",
            title: "chisq.test() on a two-way table",
            code: `survey <- read.csv("data/survey.csv")
tab <- table(Region = survey$region, Recommend = survey$recommend)

result <- chisq.test(tab)
result
round(result$expected, 1)`,
            explanation: [
              { code: "tab <- table(Region = survey$region, Recommend = survey$recommend)", text: "The observed counts: a two-way table, as in Module 7." },
              { code: "result <- chisq.test(tab)", text: "Run the chi-square test of independence on the table." },
              { code: "round(result$expected, 1)", text: "The expected counts under H₀, rounded to one decimal." },
            ],
            output: `
\tPearson's Chi-squared test

data:  tab
X-squared = 3.0482, df = 3, p-value = 0.3843

       Recommend
Region    No  Yes
  East  13.9 33.1
  North 13.9 33.1
  South 15.6 37.4
  West  15.6 37.4`,
            outputNote: `* **X-squared = 3.0482** – the chi-square statistic (X stands for the Greek letter χ, "chi").
* **df = 3** – (rows − 1) × (columns − 1) = 3 × 1.
* **p-value = 0.3843** – differences between regions at least this large would happen 38% of the time even if region did not matter.

Compare the expected counts with the observed ones (East: 16 No and 31 Yes observed vs 13.9 and 33.1 expected): the gaps are small. **Conclusion:** p = 0.38 > 0.05, so we fail to reject H₀ – *the survey gives no evidence that willingness to recommend differs between regions.* The differences seen in Module 7 are well within what sampling variability produces.`,
          },
        },
        {
          kind: "code",
          example: {
            id: "chisq-small-expected",
            title: "Check the expected counts",
            code: `survey <- read.csv("data/survey.csv")
tab <- table(survey$gender, survey$recommend)
tab

result <- chisq.test(tab)
result
round(result$expected, 1)`,
            explanation: [
              { code: "tab <- table(survey$gender, survey$recommend)", text: "Gender × recommend. Only 6 respondents are non-binary." },
              { code: "result <- chisq.test(tab)", text: "R runs the test but warns us." },
              { code: "round(result$expected, 1)", text: "The expected counts explain the warning." },
            ],
            output: `
             No Yes
  Female     34  70
  Male       20  70
  Non-binary  5   1
Warning message:
In chisq.test(tab) : Chi-squared approximation may be incorrect

\tPearson's Chi-squared test

data:  tab
X-squared = 11.162, df = 2, p-value = 0.003768


               No  Yes
  Female     30.7 73.3
  Male       26.6 63.5
  Non-binary  1.8  4.2`,
            outputNote: "The chi-square p-value is only trustworthy when the **expected** counts are large enough – a common rule is at least 5 in every cell. Here the non-binary row expects only 1.8 and 4.2, so R warns: *Chi-squared approximation may be incorrect*. Options: collect more data, combine small groups when that makes sense, or use **Fisher's exact test** (`fisher.test(tab)`), which does not need large counts (here it gives p = 0.0043). Never ignore this warning.",
          },
        },
      ],
    },
    {
      id: "anova",
      title: "ANOVA: comparing three or more means",
      blocks: [
        {
          kind: "text",
          md: `The built-in \`PlantGrowth\` data has the dried weight of 30 plants: 10 controls (\`ctrl\`) and 10 each under two treatments (\`trt1\`, \`trt2\`). Do the treatments change the mean weight?

Why not just run three t-tests (ctrl vs trt1, ctrl vs trt2, trt1 vs trt2)? Because every test carries a 5% false-alarm risk, so three tests together have about a 1 − 0.95³ ≈ **14%** chance of at least one false alarm. **Analysis of variance (ANOVA)** answers one overall question with a single test:

* **H₀:** all group means are equal.
* **H₁:** at least one group mean differs.`,
        },
        {
          kind: "code",
          example: {
            id: "plantgrowth-look",
            title: "Look first",
            code: `aggregate(weight ~ group, data = PlantGrowth, FUN = mean)
boxplot(weight ~ group, data = PlantGrowth,
        xlab = "Group", ylab = "Dried weight")`,
            explanation: [
              { code: "aggregate(weight ~ group, data = PlantGrowth, FUN = mean)", text: "The mean weight of each group (Module 7)." },
              { code: "boxplot(weight ~ group, data = PlantGrowth,", text: "A box plot per group shows centers **and** spreads." },
            ],
            output: `  group weight
1  ctrl  5.032
2  trt1  4.661
3  trt2  5.526`,
            plot: true,
            outputNote: "trt1 looks a bit lower and trt2 a bit higher than the control. But the boxes overlap – is the difference bigger than the natural variation between plants?",
          },
        },
        {
          kind: "text",
          md: `### The idea behind F

ANOVA compares two kinds of variation:

* **between groups** – how far the group means are from each other;
* **within groups** – how much individual plants vary inside their own group (the "noise").

The **F value** is the ratio: **F = between-group variation / within-group variation**. If H₀ is true, both measure only noise, so F is around 1. A large F means the group means differ more than the noise can explain.`,
        },
        {
          kind: "code",
          example: {
            id: "anova-summary",
            title: "aov() and summary()",
            code: `model <- aov(weight ~ group, data = PlantGrowth)
summary(model)`,
            explanation: [
              { code: "model <- aov(weight ~ group, data = PlantGrowth)", text: "`aov()` fits the ANOVA model: weight explained by group. `group` must be a factor or text, not numbers." },
              { code: "summary(model)", text: "Prints the ANOVA table." },
            ],
            output: `            Df Sum Sq Mean Sq F value Pr(>F)
group        2  3.766  1.8832   4.846 0.0159 *
Residuals   27 10.492  0.3886
---
Signif. codes:  0 ‘***’ 0.001 ‘**’ 0.01 ‘*’ 0.05 ‘.’ 0.1 ‘ ’ 1`,
            outputNote: `The ANOVA table, column by column:

* **Df** – degrees of freedom: groups − 1 = 2 for \`group\`; plants − groups = 30 − 3 = 27 for \`Residuals\` (the within-group part).
* **Sum Sq** – sums of squared deviations: 3.766 between groups, 10.492 within groups.
* **Mean Sq** – Sum Sq / Df: the average variation per degree of freedom (1.8832 and 0.3886).
* **F value** – 1.8832 / 0.3886 = **4.846**: the between-group variation is almost 5 times the noise.
* **Pr(>F)** – the p-value, **0.0159**. The star marks it as significant at the 0.05 level; the "Signif. codes" line is the legend for the stars.

**Conclusion:** p = 0.016 < 0.05, so we reject H₀: *at least one group's mean weight differs.* ANOVA does not say **which** – for that we need a follow-up.`,
          },
        },
        {
          kind: "code",
          example: {
            id: "tukey-hsd",
            title: "Which groups differ? TukeyHSD()",
            code: `model <- aov(weight ~ group, data = PlantGrowth)
TukeyHSD(model)`,
            explanation: [
              { code: "TukeyHSD(model)", text: "Tukey's *Honest Significant Difference* compares every pair of groups, adjusting the p-values so that the overall false-alarm risk stays at 5%." },
            ],
            output: `  Tukey multiple comparisons of means
    95% family-wise confidence level

Fit: aov(formula = weight ~ group, data = PlantGrowth)

$group
            diff        lwr       upr     p adj
trt1-ctrl -0.371 -1.0622161 0.3202161 0.3908711
trt2-ctrl  0.494 -0.1972161 1.1852161 0.1979960
trt2-trt1  0.865  0.1737839 1.5562161 0.0120064`,
            outputNote: "One row per pair: **diff** is the difference in means, **lwr**/**upr** a confidence interval for it, and **p adj** the adjusted p-value. Only **trt2 − trt1** is significant (difference 0.865, CI 0.17 to 1.56, p = 0.012). Neither treatment differs significantly from the control. In words: *\"Plant weight differed between groups (ANOVA, F = 4.85, df = 2 and 27, p = 0.016); plants under treatment 2 were heavier than under treatment 1 by about 0.87 on average.\"*",
            tryIt: "Run `summary(aov(math ~ class, data = read.csv(\"data/students.csv\")))`. Do the three classes differ in mean math score?",
          },
        },
        {
          kind: "question",
          question: {
            id: "m9-tests-q2",
            type: "true-false",
            prompt: "A significant ANOVA p-value tells you exactly which groups differ from each other.",
            answer: false,
            explanation: "False. ANOVA only tells you that **at least one** mean differs. A follow-up such as `TukeyHSD()` compares the pairs and shows which ones differ.",
            concept: "anova",
          },
        },
      ],
    },
    {
      id: "reporting-results",
      title: "Reporting a test result",
      blocks: [
        {
          kind: "steps",
          title: "A good report of a test includes",
          items: [
            "**The question and the test**, e.g. \"We compared mean blood pressure of smokers and non-smokers with a Welch t-test.\"",
            "**The estimates**: the means (or proportions) and the size of the difference, in real units.",
            "**The uncertainty**: the 95% confidence interval for the difference.",
            "**The test statistic and p-value**: t = −2.22, df = 46.5, p = 0.031.",
            "**A plain-English conclusion** using \"reject\" or \"fail to reject\" correctly – never \"proved\".",
            "**Caveats**: small groups, warnings, observational data (correlation is not causation), number of tests run.",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Example report",
          md: "*\"Smokers in our clinic had a higher mean systolic blood pressure than non-smokers (143.0 vs 136.8 mmHg; difference 6.2 mmHg, 95% CI 0.6 to 11.7; Welch t-test t = −2.22, df = 46.5, p = 0.031). Because the data is observational and there were only 31 smokers, this does not show that smoking causes the difference.\"*",
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Using a t-test for more than two groups",
      wrong: `students <- read.csv("data/students.csv")
t.test(math ~ class, data = students)`,
      error: "grouping factor must have exactly 2 levels",
      why: "A t-test compares exactly two groups, but `class` has three (A, B, C). Use ANOVA for three or more groups.",
      right: `students <- read.csv("data/students.csv")
summary(aov(math ~ class, data = students))`,
    },
    {
      title: "Using paired = TRUE with a formula",
      wrong: `t.test(extra ~ group, data = sleep, paired = TRUE)`,
      error: "cannot use 'paired' in formula method",
      why: "Recent versions of R do not allow `paired = TRUE` together with a `y ~ group` formula, because the formula does not say which values belong together. Give the two measurement vectors (in matching order) instead.",
      right: `drug1 <- sleep$extra[sleep$group == "1"]
drug2 <- sleep$extra[sleep$group == "2"]
t.test(drug2, drug1, paired = TRUE)`,
    },
    {
      title: "Running ANOVA with groups stored as numbers",
      wrong: `summary(aov(mpg ~ cyl, data = mtcars))`,
      why: "`cyl` (4, 6 or 8 cylinders) is stored as numbers, so `aov()` treats it as a numeric slope rather than three groups – look at `Df`: it is 1 instead of 2. Convert the grouping variable with `factor()`.",
      right: `summary(aov(mpg ~ factor(cyl), data = mtcars))`,
    },
    {
      title: "Ignoring the pairing in before/after data",
      wrong: `drug1 <- sleep$extra[sleep$group == "1"]
drug2 <- sleep$extra[sleep$group == "2"]
t.test(drug2, drug1)`,
      why: "The code runs, but it treats the 10 patients' two measurements as 20 unrelated people. The test loses power (p = 0.079 instead of 0.003) and answers the wrong question.",
      right: `drug1 <- sleep$extra[sleep$group == "1"]
drug2 <- sleep$extra[sleep$group == "2"]
t.test(drug2, drug1, paired = TRUE)`,
    },
  ],
  exerciseIds: ["m9-compare-two-groups", "m9-chi-square-test"],
  quiz: [
    {
      id: "m9-tests-q3",
      type: "multiple-choice",
      prompt: "A fitness app measures the resting heart rate of 25 users before and after an 8-week training plan. Which test fits best?",
      options: ["Paired t-test", "Welch two-sample t-test", "Chi-square test", "One-way ANOVA"],
      answer: 0,
      explanation: "The same 25 people are measured twice, so each \"before\" value is paired with an \"after\" value. A paired t-test analyses each person's change.",
      optionFeedback: [
        "Correct.",
        "A two-sample test assumes two separate groups of people, which would ignore the pairing.",
        "Chi-square tests are for two categorical variables; heart rate is numeric.",
        "ANOVA compares three or more independent groups.",
      ],
      concept: "t-tests",
    },
    {
      id: "m9-tests-q4",
      type: "multiple-choice",
      prompt: "You want to know whether the favourite feature of an app (Price, Search, Support, Recommendations) is related to the user's age group. Which test fits?",
      options: ["Chi-square test of independence", "One-sample t-test", "Paired t-test", "Correlation with cor()"],
      answer: 0,
      explanation: "Both variables are categorical, so you cross them in a two-way table and test for independence with `chisq.test()`.",
      optionFeedback: [
        "Correct.",
        "t-tests compare means of numeric variables.",
        "There are no paired measurements here.",
        "`cor()` needs two numeric variables.",
      ],
      concept: "chi-square-test",
    },
    {
      id: "m9-tests-q5",
      type: "predict-output",
      prompt: "What does this code print? (Expected count = row total × column total / grand total.)",
      code: `tab <- matrix(c(10, 20, 30, 40), nrow = 2)
chisq.test(tab)$expected`,
      options: [
        `     [,1] [,2]
[1,]   12   28
[2,]   18   42`,
        `     [,1] [,2]
[1,]   10   30
[2,]   20   40`,
        `     [,1] [,2]
[1,]   25   25
[2,]   25   25`,
        `[1] 12 18 28 42`,
      ],
      answer: 0,
      explanation: "The matrix is filled column by column: row 1 is 10, 30 (total 40), row 2 is 20, 40 (total 60); the columns total 30 and 70; the grand total is 100. Expected for row 1, column 1 = 40 × 30 / 100 = 12, and so on. The result keeps the matrix shape.",
      optionFeedback: [
        "Correct.",
        "These are the **observed** counts.",
        "Expected counts depend on the row and column totals, not on an equal split.",
        "`$expected` keeps the shape of the table.",
      ],
      concept: "chi-square-test",
    },
    {
      id: "m9-tests-q6",
      type: "fill-blank",
      prompt: "Complete the code to test whether the same students scored differently in a second exam.",
      code: `exam1 <- c(62, 70, 58, 81, 75)
exam2 <- c(66, 74, 60, 85, 76)
t.test(exam2, exam1, ___ = TRUE)`,
      accept: ["paired"],
      hint: "The two scores belong to the same student.",
      explanation: "`paired = TRUE` turns it into a paired t-test on each student's difference (here every student improved).",
      concept: "t-tests",
    },
    {
      id: "m9-tests-q7",
      type: "find-error",
      prompt: "This code should test whether mean math scores differ between the three classes. Click the line that fails.",
      code: `students <- read.csv("data/students.csv")
table(students$class)
t.test(math ~ class, data = students)`,
      errorLine: 3,
      errorKind: "error",
      fix: `students <- read.csv("data/students.csv")
table(students$class)
summary(aov(math ~ class, data = students))`,
      explanation: "There are three classes, and a t-test can only compare two groups (\"grouping factor must have exactly 2 levels\"). For three or more groups use ANOVA: `summary(aov(math ~ class, data = students))`.",
      concept: "anova",
    },
    {
      id: "m9-tests-q8",
      type: "true-false",
      prompt: "The F value in an ANOVA table compares the variation between group means with the variation within the groups.",
      answer: true,
      explanation: "True. F = (between-group mean square) / (within-group mean square). Values near 1 are what H₀ predicts; large values suggest real differences between the groups.",
      concept: "anova",
    },
  ],
  keyPoints: [
    "Choose the test from the question: t-tests compare means, chi-square tests relate two categorical variables, ANOVA compares three or more means.",
    "`t.test(x, mu = value)` is a one-sample test; `t.test(y ~ group, data = df)` compares two independent groups with Welch's test.",
    "Use `t.test(after, before, paired = TRUE)` when the same subjects are measured twice – it tests the mean of the differences.",
    "Read test output in order: test name, data, statistic, df, p-value, alternative hypothesis, confidence interval, estimates.",
    "`chisq.test(table(a, b))` compares observed with expected counts; check that expected counts are at least about 5.",
    "`summary(aov(y ~ group, data = df))` gives the ANOVA table: F = between-group / within-group variation; `TukeyHSD()` shows which pairs differ.",
    "Report the estimate, its confidence interval, the test statistic and p-value, and a careful plain-English conclusion.",
  ],
  concepts: ["choosing-a-test", "t-tests", "chi-square-test", "anova"],
  glossary: ["t-test", "chi-square-test", "anova", "degrees-of-freedom", "p-value", "null-hypothesis", "alternative-hypothesis", "categorical-variable", "box-plot"],
  playground: `# Comparing groups – experiment here!
patients <- read.csv("data/patients.csv")

t.test(bmi ~ diabetes, data = patients)
chisq.test(table(patients$sex, patients$smoker))
summary(aov(len ~ factor(dose), data = ToothGrowth))
`,
  prerequisites: ["confidence-intervals-hypothesis-tests"],
  datasets: ["students", "patients", "survey"],
};
