import type { Lesson } from "../../types";

export const meanMedianModeLesson: Lesson = {
  id: "mean-median-mode",
  module: 7,
  title: "Mean, Median and Mode",
  summary: "Describe the typical value of your data with the mean, median and mode – and learn when each one tells the truth.",
  minutes: 30,
  objectives: [
    "Calculate the mean, median and mode of a set of numbers in R – and by hand",
    "Handle missing values with na.rm = TRUE",
    "Find the mode with table() and which.max(), and know why mode() is something else",
    "Explain how an outlier pulls the mean but barely moves the median",
    "Choose the right measure of center and describe it in a plain-English sentence",
  ],
  intro: `When you have a column of numbers – 60 test scores, 365 days of rainfall, 200 house prices – the first question is usually: **what is a typical value?** Statisticians call the answer a **measure of center**: one number that summarises where the data "sits".

There are three popular measures of center. The **mean** is the everyday "average": add everything up and share it out equally. The **median** is the value in the middle once you line the numbers up from smallest to largest. The **mode** is the value that appears most often.

They often give similar answers, but not always – and when they disagree, that disagreement tells you something important about your data. In this lesson you will compute all three by hand with small numbers, then in R, and learn which one to trust.`,
  sections: [
    {
      id: "typical-value",
      title: "What is a \"typical\" value?",
      blocks: [
        {
          kind: "text",
          md: `Imagine five friends tell you how many hours they slept last night: **6, 7, 7, 8 and 9**. If someone asks "how much do your friends sleep?", you would not read out all five numbers. You would say something like "about 7 hours". That single number is a summary of the center of the data.

Summarising is useful because people cannot keep many numbers in their head. But a summary also **throws information away**, so you must choose it carefully. This module is all about choosing and computing good summaries – *descriptive statistics* – and explaining them clearly.`,
        },
        {
          kind: "definition",
          term: "Descriptive statistics",
          md: "Numbers that **describe** the data you have – its center (mean, median, mode), its spread (range, standard deviation) and the relationships inside it (correlation). They describe; they do not yet try to generalise to people you did not measure (that is Module 9).",
        },
        {
          kind: "definition",
          term: "Measure of center",
          md: "A single number that represents a *typical* value of a numeric variable. The three common ones are the **mean**, the **median** and the **mode**.",
        },
        {
          kind: "diagram",
          name: "center-spread",
          caption: "The center tells you where the data sits; the spread (next lesson) tells you how far the values wander from it.",
        },
      ],
    },
    {
      id: "the-mean",
      title: "The mean: share everything out equally",
      blocks: [
        {
          kind: "text",
          md: `The **mean** is what most people call "the average". The recipe is:

1. **Add up** all the values.
2. **Divide** by how many values there are.

Take five quiz scores: 4, 8, 6, 5 and 7. Their sum is 4 + 8 + 6 + 5 + 7 = **30**, and there are **5** scores, so the mean is 30 / 5 = **6**. A nice way to picture it: if all five students pooled their points and shared them out equally, each would get 6.

Another picture: put the values on a seesaw. The mean is the point where the seesaw balances.`,
        },
        {
          kind: "code",
          example: {
            id: "mean-by-hand",
            title: "The mean, step by step and with mean()",
            code: `quiz_scores <- c(4, 8, 6, 5, 7)

sum(quiz_scores)
length(quiz_scores)
sum(quiz_scores) / length(quiz_scores)
mean(quiz_scores)`,
            explanation: [
              { code: "quiz_scores <- c(4, 8, 6, 5, 7)", text: "`c()` combines the five scores into a numeric vector, and `<-` stores it in the variable `quiz_scores`." },
              { code: "sum(quiz_scores)", text: "`sum()` adds all the values: 4 + 8 + 6 + 5 + 7 = 30." },
              { code: "length(quiz_scores)", text: "`length()` counts how many values the vector holds: 5." },
              { code: "sum(quiz_scores) / length(quiz_scores)", text: "The mean recipe written out by hand: total divided by count." },
              { code: "mean(quiz_scores)", text: "`mean()` does exactly the same calculation in one step." },
            ],
            output: `[1] 30
[1] 5
[1] 6
[1] 6`,
            outputNote: "The by-hand recipe and `mean()` agree: the mean quiz score is **6**. Each `[1]` simply means \"the first value of the result\".",
            tryIt: "Add a sixth score of 10 to the vector. Predict the new mean before you run the code (hint: the new total is 40).",
          },
        },
        {
          kind: "text",
          md: `### Missing values

Real data often has gaps, stored in R as \`NA\` ("not available"). If even one value is missing, R cannot know the total, so \`mean()\` honestly answers \`NA\`. To compute the mean of the values you *do* have, add the argument \`na.rm = TRUE\` ("NA remove = yes").`,
        },
        {
          kind: "code",
          example: {
            id: "mean-missing",
            title: "Missing values and na.rm",
            code: `temperatures <- c(21, 23, NA, 19, 22)

mean(temperatures)
mean(temperatures, na.rm = TRUE)`,
            explanation: [
              { code: "temperatures <- c(21, 23, NA, 19, 22)", text: "Five daily temperatures; the third day was not recorded, so it is `NA`." },
              { code: "mean(temperatures)", text: "Without help, the mean of something unknown is unknown: the result is `NA`." },
              { code: "mean(temperatures, na.rm = TRUE)", text: "`na.rm = TRUE` drops the `NA` first, so R averages the four known values: (21 + 23 + 19 + 22) / 4." },
            ],
            output: `[1] NA
[1] 21.25`,
            outputNote: "The second mean is 85 / 4 = **21.25**. Notice that R divides by 4, not 5 – the missing day is completely ignored.",
          },
        },
        {
          kind: "code",
          example: {
            id: "mean-students",
            title: "The mean of a real column",
            code: `students <- read.csv("data/students.csv")

mean(students$math)
mean(students$science)
mean(students$science, na.rm = TRUE)`,
            explanation: [
              { code: `students <- read.csv("data/students.csv")`, text: "Loads the student dataset: 60 students with math, reading and science scores." },
              { code: "mean(students$math)", text: "`students$math` pulls out the math column as a vector; `mean()` averages its 60 values." },
              { code: "mean(students$science)", text: "The science column has 3 missing scores, so the plain mean is `NA`." },
              { code: "mean(students$science, na.rm = TRUE)", text: "Ignoring the 3 missing scores gives the mean of the 57 known ones." },
            ],
            output: `[1] 74.65
[1] NA
[1] 74.29825`,
            outputNote: "In words: **the average math score is 74.65 points**, and the average science score (for the 57 students who took the test) is about **74.3**. When you report a result, round sensibly – nobody needs five decimals of a test score.",
            tryIt: "Compute the mean of `students$reading` and `students$study_hours`. Which of the two needs `na.rm = TRUE`?",
          },
        },
      ],
    },
    {
      id: "the-median",
      title: "The median: the value in the middle",
      blocks: [
        {
          kind: "text",
          md: `The **median** is the middle value once the data is **sorted** from smallest to largest. Half of the values are below it and half are above it.

* With an **odd** number of values there is exactly one middle value. The scores 7, 1, 5, 3, 9 sorted are 1, 3, **5**, 7, 9 – the median is **5**.
* With an **even** number of values there are two middle values, and the median is the mean of those two. For 1, 3, **5**, **7**, 9, 11 the median is (5 + 7) / 2 = **6**.

You do not have to sort the data yourself – \`median()\` does it for you – but sorting by hand once makes the idea stick.`,
        },
        {
          kind: "code",
          example: {
            id: "median-odd-even",
            title: "Median with an odd and an even number of values",
            code: `odd_values <- c(7, 1, 5, 3, 9)
sort(odd_values)
median(odd_values)

even_values <- c(7, 1, 5, 3, 9, 11)
sort(even_values)
median(even_values)`,
            explanation: [
              { code: "odd_values <- c(7, 1, 5, 3, 9)", text: "Five values, deliberately not in order." },
              { code: "sort(odd_values)", text: "`sort()` returns the values from smallest to largest, so you can see the middle one." },
              { code: "median(odd_values)", text: "The 3rd of 5 sorted values is the middle: 5." },
              { code: "even_values <- c(7, 1, 5, 3, 9, 11)", text: "Six values – now there is no single middle value." },
              { code: "median(even_values)", text: "R averages the two middle values, 5 and 7." },
            ],
            output: `[1] 1 3 5 7 9
[1] 5
[1]  1  3  5  7  9 11
[1] 6`,
            outputNote: "The medians are **5** and **6**. Note that 6 is not one of the data values – that is normal for an even number of values. (The extra spaces in `[1]  1  3 …` are R lining the numbers up because 11 has two digits.)",
            tryIt: "Change the 11 to 1100. Does the median change? Does the mean? Try both with `median()` and `mean()`.",
          },
        },
        {
          kind: "code",
          example: {
            id: "median-students",
            title: "Median of real data",
            code: `students <- read.csv("data/students.csv")

median(students$math)
median(students$science, na.rm = TRUE)`,
            explanation: [
              { code: "median(students$math)", text: "Sorts the 60 math scores and averages the 30th and 31st values." },
              { code: "median(students$science, na.rm = TRUE)", text: "`median()` also needs `na.rm = TRUE` when there are missing values." },
            ],
            output: `[1] 74
[1] 74`,
            outputNote: "Half of the students scored **74 or less** in math and half scored 74 or more. The median (74) is very close to the mean (74.65), a sign that the scores are fairly balanced, with no extreme values dragging the mean around.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m7-center-q1",
            type: "predict-output",
            prompt: "What does this code print?",
            code: `x <- c(2, 4, 6, 100)
median(x)`,
            options: ["[1] 28", "[1] 5", "[1] 4", "[1] 6"],
            answer: 1,
            explanation: "There are four values, so the median is the mean of the two middle ones: (4 + 6) / 2 = **5**. The 100 does not matter – only its position (last) does. The mean would be 112 / 4 = 28.",
            optionFeedback: [
              "28 is the **mean** (2 + 4 + 6 + 100 = 112, divided by 4). The median only looks at the middle.",
              "Correct – the two middle values are 4 and 6, and their average is 5.",
              "4 is one of the two middle values, but with an even count the median averages both middle values.",
              "6 is one of the two middle values, but with an even count the median averages both middle values.",
            ],
            concept: "median",
          },
        },
      ],
    },
    {
      id: "the-mode",
      title: "The mode: the most common value",
      blocks: [
        {
          kind: "text",
          md: `The **mode** is the value that occurs **most often**. It is the only measure of center that also works for categories: you cannot compute the mean of "red", "blue" and "green", but you can say which colour was picked most.

Shoe sizes sold in a shop today: 38, 40, 39, 40, 42, 40, 39, 41. Counting each size: 38 → 1, 39 → 2, **40 → 3**, 41 → 1, 42 → 1. The mode is **40** – the size the shop should keep most of in stock.

R has **no built-in function for the mode**. Instead, you combine two functions you can already use:

* \`table()\` counts how often each value appears (a *frequency table*),
* \`which.max()\` finds the position of the largest count.`,
        },
        {
          kind: "code",
          example: {
            id: "mode-table",
            title: "Finding the mode with table() and which.max()",
            code: `shoe_sizes <- c(38, 40, 39, 40, 42, 40, 39, 41)

counts <- table(shoe_sizes)
counts
which.max(counts)
names(which.max(counts))`,
            explanation: [
              { code: "counts <- table(shoe_sizes)", text: "`table()` counts each distinct value. The result is stored in `counts`." },
              { code: "counts", text: "Printing the table: the top row holds the values (sizes), the bottom row how many times each one appears." },
              { code: "which.max(counts)", text: "`which.max()` returns the **position** of the biggest count, labelled with its name." },
              { code: "names(which.max(counts))", text: "`names()` extracts just the label – the mode itself." },
            ],
            output: `shoe_sizes
38 39 40 41 42
 1  2  3  1  1
40
 3
[1] "40"`,
            outputNote: "The table shows size 40 was sold **3 times**, more than any other. `which.max(counts)` prints `40` (the name) above `3` – careful: that **3 is the position** of size 40 in the table (38, 39, **40**…), not its count. `names()` gives the mode as text, `\"40\"`. If you need it as a number, wrap it: `as.numeric(names(which.max(counts)))`.",
            tryIt: "Add two more 39s to the vector. Which size is the mode now?",
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "mode() is NOT the statistical mode",
          md: "R does have a function called `mode()`, but it answers a completely different question: **what type of data is stored** (\"numeric\", \"character\", \"logical\" …). `mode(c(38, 40, 40))` returns `\"numeric\"`, never 40. Use `table()` + `which.max()` for the most common value.",
        },
        {
          kind: "code",
          example: {
            id: "mode-function-trap",
            title: "What mode() really does",
            code: `shoe_sizes <- c(38, 40, 39, 40, 42, 40, 39, 41)
mode(shoe_sizes)
mode("hello")`,
            explanation: [
              { code: "mode(shoe_sizes)", text: "Tells you the storage type of the vector – numbers." },
              { code: `mode("hello")`, text: "For text it answers \"character\". Nothing here is about the most common value." },
            ],
            output: `[1] "numeric"
[1] "character"`,
            outputNote: "Both answers describe the **kind of data**, not its most common value. That is why this function is a classic trap.",
          },
        },
        {
          kind: "text",
          md: `### Ties and categories

A dataset can have **two or more modes** if several values share the top count. \`which.max()\` only reports the **first** of them, so when ties are possible, ask for every value whose count equals the maximum count.`,
        },
        {
          kind: "code",
          example: {
            id: "mode-ties",
            title: "When there is more than one mode",
            code: `votes <- c("red", "blue", "red", "green", "blue")

counts <- table(votes)
counts
which.max(counts)
names(counts)[counts == max(counts)]`,
            explanation: [
              { code: "counts <- table(votes)", text: "Counts the votes for each colour (the table is sorted alphabetically)." },
              { code: "which.max(counts)", text: "Reports only the first colour with the top count – blue – hiding that red tied." },
              { code: "names(counts)[counts == max(counts)]", text: "`max(counts)` is the top count (2). `counts == max(counts)` is TRUE for every colour with that count, and we keep those names." },
            ],
            output: `votes
 blue green   red
    2     1     2
blue
   1
[1] "blue" "red"`,
            outputNote: "Blue and red both got 2 votes, so this data has **two modes**. `which.max()` silently picked blue (position 1) – the last line gives the honest answer: `\"blue\" \"red\"`.",
          },
        },
        {
          kind: "code",
          example: {
            id: "mode-helper",
            title: "A reusable get_mode() function",
            code: `get_mode <- function(x) {
  counts <- table(x)
  names(counts)[which.max(counts)]
}

survey <- read.csv("data/survey.csv")
table(survey$favorite_feature)
get_mode(survey$favorite_feature)
get_mode(survey$satisfaction)`,
            explanation: [
              { code: "get_mode <- function(x) {", text: "Because R has no mode function, we write our own (you learned to write functions in Stage 1)." },
              { code: "  names(counts)[which.max(counts)]", text: "The last line is the return value: the name of the most frequent value." },
              { code: "table(survey$favorite_feature)", text: "The full frequency table, so we can check the answer by eye." },
              { code: "get_mode(survey$satisfaction)", text: "Works on numbers too – satisfaction is a 1–5 rating." },
            ],
            output: `
          Price Recommendations          Search         Support
             60              43              55              42
[1] "Price"
[1] "3"`,
            outputNote: "\"Price\" was the most popular favourite feature (60 of 200 answers), and the most common satisfaction rating was **3**. The mode is the natural summary for categories and for ratings on a short scale.",
            tryIt: "Use `get_mode()` on `survey$region` and `survey$age_group`.",
          },
        },
      ],
    },
    {
      id: "outliers",
      title: "Outliers: when the mean and median disagree",
      blocks: [
        {
          kind: "definition",
          term: "Outlier",
          md: "A value that is unusually far from the rest of the data – much bigger or much smaller. It might be a typing error (an age of 250) or a real but rare case (a billionaire in a salary survey).",
        },
        {
          kind: "text",
          md: `Five people work in a small café and earn (in thousands per year) 30, 32, 35, 38 and 40. Both the mean and the median are 35 – a fair description.

Now the owner, who earns 500, joins the list. The mean jumps to (175 + 500) / 6 = **112.5**, higher than what five of the six people earn! The median only moves from 35 to **36.5**, because it only cares about the order of the values, not how extreme the largest one is.

This is the most important practical difference between the two: **the mean is sensitive to outliers; the median is robust** (it resists them).`,
        },
        {
          kind: "code",
          example: {
            id: "outlier-salaries",
            title: "One outlier, two very different stories",
            code: `salaries <- c(30, 32, 35, 38, 40)
mean(salaries)
median(salaries)

salaries_with_owner <- c(salaries, 500)
mean(salaries_with_owner)
median(salaries_with_owner)`,
            explanation: [
              { code: "salaries <- c(30, 32, 35, 38, 40)", text: "Five café salaries in thousands." },
              { code: "salaries_with_owner <- c(salaries, 500)", text: "`c()` can also join a vector and a new value: the five salaries plus the owner's 500." },
              { code: "mean(salaries_with_owner)", text: "The single large value pulls the mean far up." },
              { code: "median(salaries_with_owner)", text: "The median is the average of the 3rd and 4th sorted values (35 and 38)." },
            ],
            output: `[1] 35
[1] 35
[1] 112.5
[1] 36.5`,
            outputNote: "Saying \"the average salary here is 112,500\" is technically true but misleading. \"The median salary is 36,500\" describes a typical employee much better.",
            tryIt: "Replace 500 with 5000. How much does the mean change? And the median?",
          },
        },
        {
          kind: "text",
          md: `### Skewed data

Outliers are an extreme case of **skewed** data: data with a long tail on one side. Incomes, house prices, waiting times and rainfall are typically skewed to the right (a few very large values). In skewed data the mean is pulled towards the tail, so **mean and median disagree**. The rainfall in our weather dataset is a great example.`,
        },
        {
          kind: "code",
          example: {
            id: "skewed-rain",
            title: "Daily rainfall: a skewed variable",
            code: `weather <- read.csv("data/weather.csv")

mean(weather$rain_mm)
median(weather$rain_mm)
sum(weather$rain_mm == 0)
mean(weather$rain_mm, trim = 0.1)`,
            explanation: [
              { code: "mean(weather$rain_mm)", text: "The mean daily rainfall over the 365 days of 2023." },
              { code: "median(weather$rain_mm)", text: "The middle day, after sorting all days by rainfall." },
              { code: "sum(weather$rain_mm == 0)", text: "`weather$rain_mm == 0` is TRUE for each dry day; `sum()` counts the TRUEs." },
              { code: "mean(weather$rain_mm, trim = 0.1)", text: "A **trimmed mean**: `trim = 0.1` drops the lowest 10% and the highest 10% of values before averaging – a compromise between mean and median." },
            ],
            output: `[1] 1.283562
[1] 0
[1] 248
[1] 0.5894198`,
            outputNote: "248 of the 365 days were completely dry, so the median day had **0 mm** of rain. A few very wet days pull the mean up to about **1.3 mm**. Neither number is \"wrong\" – they answer different questions. The median describes a typical day (dry); the mean tells you the total rainfall shared out over all days (365 × 1.28 ≈ 469 mm in the year).",
          },
        },
        {
          kind: "question",
          question: {
            id: "m7-center-q2",
            type: "multiple-choice",
            prompt: "In a town, the mean house price is $520,000 but the median is $310,000. What is the most likely explanation?",
            options: [
              "A few very expensive houses pull the mean up",
              "A few very cheap houses pull the mean up",
              "R made a rounding error",
              "Most houses cost about $520,000",
            ],
            answer: 0,
            explanation: "The mean is pulled towards extreme values. A mean far **above** the median means there is a long tail of **high** prices – a few mansions. A typical house costs about $310,000 (the median).",
            optionFeedback: [
              "Correct – expensive outliers drag the mean upwards, while the median stays with the typical house.",
              "Very cheap houses would pull the mean **down**, below the median.",
              "Both numbers are computed exactly; their difference tells you about the shape of the data.",
              "Half of the houses cost less than $310,000 (that is what the median means), so $520,000 is not typical.",
            ],
            concept: "outliers",
          },
        },
      ],
    },
    {
      id: "choosing",
      title: "Choosing a measure – and saying it in words",
      blocks: [
        {
          kind: "table",
          caption: "Which measure of center should you report?",
          headers: ["Measure", "How it is computed", "Use it for", "Affected by outliers?"],
          rows: [
            ["Mean", "Sum of values ÷ number of values", "Numeric data that is roughly symmetric (test scores, heights)", "Yes – strongly"],
            ["Median", "Middle value of the sorted data", "Skewed numeric data (incomes, prices, waiting times)", "Hardly at all"],
            ["Mode", "Most frequent value (`table()` + `which.max()`)", "Categories (favourite feature) and short rating scales", "No"],
          ],
        },
        {
          kind: "steps",
          title: "A quick routine for any numeric column",
          items: [
            "Compute **both** `mean()` and `median()` (with `na.rm = TRUE` if there are missing values).",
            "If they are close, the data is roughly balanced – the mean is a fine summary.",
            "If they are far apart, look for outliers or skew (a histogram helps) and prefer the median.",
            "Write one sentence that includes the number, its unit and what it describes.",
          ],
        },
        {
          kind: "code",
          example: {
            id: "commute-summary",
            title: "Putting it all together",
            code: `commute <- c(25, 30, 18, 42, 30, 22, 95, 30, 27)

mean(commute)
median(commute)
names(which.max(table(commute)))`,
            explanation: [
              { code: "commute <- c(25, 30, 18, 42, 30, 22, 95, 30, 27)", text: "Nine people's commute times in minutes – one person travels 95 minutes." },
              { code: "mean(commute)", text: "The mean is pulled up by the 95-minute commute." },
              { code: "median(commute)", text: "The middle (5th of 9) sorted value." },
              { code: "names(which.max(table(commute)))", text: "The mode in one line: count, find the biggest count, take its name." },
            ],
            output: `[1] 35.44444
[1] 30
[1] "30"`,
            outputNote: "A good plain-English summary: *\"The typical commute is 30 minutes (median, and also the most common value). The mean is higher, about 35 minutes, because one person travels 95 minutes.\"* Notice how the sentence gives the number, the unit, which measure it is, and why the measures differ.",
            tryIt: "Remove the 95 from the vector and rerun. How close are mean and median now?",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Forgetting na.rm = TRUE",
      wrong: `scores <- c(70, 85, NA, 90)
mean(scores)`,
      why: "One missing value makes the whole mean unknown, so R returns `NA`. There is no error message – the answer is simply `NA`, which is easy to overlook.",
      right: `scores <- c(70, 85, NA, 90)
mean(scores, na.rm = TRUE)`,
    },
    {
      title: "Giving mean() separate numbers instead of a vector",
      wrong: `mean(4, 8, 6)`,
      why: "`mean()` averages only its **first** argument. The 8 and the 6 are passed to other arguments and silently ignored, so the result is 4 instead of 6. `sum(4, 8, 6)` works with separate numbers, but `mean()` and `median()` do not.",
      right: `mean(c(4, 8, 6))`,
    },
    {
      title: "Using mode() to find the most common value",
      wrong: `sizes <- c(38, 40, 40, 41)
mode(sizes)`,
      why: "`mode()` returns the storage type (`\"numeric\"`), not the statistical mode. R has no built-in function for the most frequent value.",
      right: `sizes <- c(38, 40, 40, 41)
names(which.max(table(sizes)))`,
    },
    {
      title: "Taking the mean of a text column",
      wrong: `survey <- read.csv("data/survey.csv")
mean(survey$favorite_feature)`,
      error: "argument is not numeric or logical: returning NA",
      why: "A mean only makes sense for numbers. For a categorical column like `favorite_feature`, R warns you and returns `NA`. Use the mode (or a frequency table) for categories.",
      right: `survey <- read.csv("data/survey.csv")
names(which.max(table(survey$favorite_feature)))`,
    },
  ],
  exerciseIds: ["m7-mean-median", "m7-find-the-mode"],
  quiz: [
    {
      id: "m7-center-q3",
      type: "multiple-choice",
      prompt: "Which measure of center is most strongly affected by a single extreme value?",
      options: ["The mean", "The median", "The mode", "All three equally"],
      answer: 0,
      explanation: "The mean uses the actual size of every value, so one huge value changes the total – and the mean – a lot. The median only depends on the order of the values, and the mode only on how often values repeat.",
      optionFeedback: [
        "Correct – the mean is sensitive to outliers.",
        "The median is robust: an extreme value only counts as \"one value at the end\" of the sorted list.",
        "The mode only looks at which value repeats most, so a single extreme value cannot change it.",
        "They behave very differently – that difference is what helps you spot skewed data.",
      ],
      concept: "outliers",
    },
    {
      id: "m7-center-q4",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `mean(c(10, 20, 30, NA))`,
      options: ["[1] 20", "[1] 15", "[1] NA", "Error: missing value"],
      answer: 2,
      explanation: "With a missing value and no `na.rm = TRUE`, R cannot know the total, so the mean is `NA`. With `na.rm = TRUE` the answer would be 20.",
      optionFeedback: [
        "20 is the mean of the three known values – but only if you add `na.rm = TRUE`.",
        "15 would be 60 / 4, treating NA as 0. R never treats a missing value as zero.",
        "Correct – one unknown value makes the mean unknown.",
        "There is no error: `mean()` quietly returns `NA`, which is why this mistake is easy to miss.",
      ],
      concept: "mean",
    },
    {
      id: "m7-center-q5",
      type: "fill-blank",
      prompt: "Complete the code so the median ignores the missing value.",
      code: `heights <- c(160, 172, NA, 181)
median(heights, ___ = TRUE)`,
      accept: ["na.rm"],
      hint: "It is the same argument you use with mean(): \"NA remove\".",
      explanation: "`na.rm = TRUE` tells `median()` (and `mean()`, `sd()`, `max()` …) to drop missing values first. The median of 160, 172 and 181 is 172.",
      concept: "median",
    },
    {
      id: "m7-center-q6",
      type: "true-false",
      prompt: "`mode(x)` returns the most common value in the vector `x`.",
      answer: false,
      explanation: "False. `mode()` returns the storage type, such as \"numeric\" or \"character\". To find the most frequent value use `names(which.max(table(x)))`.",
      concept: "mode",
    },
    {
      id: "m7-center-q7",
      type: "find-error",
      prompt: "This code should compute the average of the three scores (which is 6), but it prints 4. Click the line with the mistake.",
      code: `scores <- c(4, 8, 6)
average <- mean(4, 8, 6)
average`,
      errorLine: 2,
      errorKind: "logic",
      fix: `scores <- c(4, 8, 6)
average <- mean(scores)
average`,
      explanation: "`mean()` only averages its first argument, so `mean(4, 8, 6)` is just the mean of 4. Pass a single vector instead: `mean(scores)` or `mean(c(4, 8, 6))`.",
      concept: "mean",
    },
    {
      id: "m7-center-q8",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `median(c(3, 1, 4, 1, 5, 9))`,
      options: ["[1] 4", "[1] 3.5", "[1] 3.833333", "[1] 1"],
      answer: 1,
      explanation: "Sorted: 1, 1, **3**, **4**, 5, 9. Six values, so the median is the average of the 3rd and 4th: (3 + 4) / 2 = 3.5.",
      optionFeedback: [
        "4 is the 4th value of the sorted data, but with six values you average the 3rd and 4th.",
        "Correct.",
        "3.833333 is the **mean** (23 / 6).",
        "1 is the **mode** (it appears twice).",
      ],
      concept: "median",
    },
  ],
  keyPoints: [
    "A measure of center is one number that describes a typical value of a variable.",
    "The mean is the sum divided by the count: `mean(x)`; add `na.rm = TRUE` when there are missing values.",
    "The median is the middle of the sorted values: `median(x)`; with an even count it averages the two middle values.",
    "The mode is the most frequent value; find it with `names(which.max(table(x)))` – `mode()` returns the data type instead.",
    "Outliers and skew pull the mean towards the tail, while the median stays put; when the two disagree, prefer the median for describing a typical value.",
    "Always report a center with its unit and in a plain sentence, e.g. \"the median commute is 30 minutes\".",
  ],
  concepts: ["mean", "median", "mode", "outliers", "measures-of-center"],
  glossary: ["mean", "median", "mode", "outlier", "numeric-variable", "categorical-variable", "frequency-table"],
  playground: `# Measures of center – experiment here!
students <- read.csv("data/students.csv")

mean(students$math)
median(students$math)
names(which.max(table(students$class)))
`,
  datasets: ["students", "survey", "weather"],
};
