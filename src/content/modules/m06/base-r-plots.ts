import type { Lesson } from "../../types";

export const baseRPlotsLesson: Lesson = {
  id: "base-r-plots",
  module: 6,
  title: "Plotting with Base R",
  summary: "Draw line charts, histograms, bar charts, scatter plots and box plots with R's built-in plotting functions, and give them titles, labels and colours.",
  minutes: 40,
  objectives: [
    "Draw a plot with `plot()` and explain what the x- and y-axis show",
    "Show the distribution of a number column with `hist()` and control the bars with `breaks`",
    "Draw a bar chart of category counts with `barplot(table(x))`",
    "Show the relationship between two number columns with a scatter plot",
    "Compare groups with a box plot (`boxplot(y ~ group, data = df)`) and read its parts",
    "Add a title, axis labels and colours with `main`, `xlab`, `ylab` and `col`",
  ],
  intro: `A table of 150 numbers hides its story; a picture shows it in a second. Is there a typical value? Are there strange outliers? Do students who study more score higher? A good chart answers such questions faster than any summary number.

R can draw charts without any extra package. These **base R** plotting functions – \`plot()\`, \`hist()\`, \`barplot()\` and \`boxplot()\` – are quick to type, which makes them perfect for exploring data. When you run plotting code on R Academy, the chart appears in the **Plots** tab next to the console. In the next lesson you will meet ggplot2, which builds more polished charts; the ideas you learn here carry over.`,
  sections: [
    {
      id: "why-plot",
      title: "Why plot, and what kind of data do you have?",
      blocks: [
        {
          kind: "text",
          md: "Which chart fits depends mostly on the **type of variable** (column) you want to show. Two types matter most:",
        },
        {
          kind: "definition",
          term: "Numeric variable",
          md: "A **numeric variable** holds numbers you can calculate with, such as a test score, an age or a price. Typical charts: histogram, box plot, scatter plot.",
        },
        {
          kind: "definition",
          term: "Categorical variable",
          md: "A **categorical variable** holds a label from a small set of groups, such as a class (A, B, C), a region or Yes/No. You count categories rather than calculate with them. Typical chart: bar chart.",
        },
        {
          kind: "table",
          caption: "Variable types in data/students.csv",
          headers: ["Column", "Type", "Example values"],
          rows: [
            ["`math`, `reading`, `study_hours`, `attendance`", "numeric", "86, 54, 99"],
            ["`gender`, `class`", "categorical", "\"Female\", \"B\""],
            ["`name`, `student_id`", "identifiers – not charted", "\"Amara\", \"S001\""],
          ],
        },
        {
          kind: "callout",
          tone: "info",
          title: "Plots do not print text",
          md: "Plotting functions draw in the Plots tab and usually print nothing in the console. In the examples below, the console output only shows what other lines (like `table()` or `summary()`) print.",
        },
      ],
    },
    {
      id: "plot-function",
      title: "plot(): your first chart",
      blocks: [
        {
          kind: "code",
          example: {
            id: "plot-vector",
            title: "Plot a single vector",
            code: `temps <- c(12, 15, 19, 23, 21, 16)

plot(temps)`,
            explanation: [
              { code: "temps <- c(12, 15, 19, 23, 21, 16)", text: "Six temperatures, one for each day." },
              { code: "plot(temps)", text: "With one vector, `plot()` draws one point per value. The **x-axis** (horizontal) shows the position – labelled *Index* – and the **y-axis** (vertical) shows the value." },
            ],
            plot: true,
            outputNote: "You see six points: they rise from 12 to a peak of 23 at position 4, then fall again. Nothing is printed in the console.",
            tryIt: "Add a seventh temperature to the vector and run it again.",
          },
        },
        {
          kind: "code",
          example: {
            id: "plot-line",
            title: "A line chart of sales over time",
            code: `sales <- read.csv("data/sales.csv")
north <- sales[sales$region == "North", ]
nrow(north)

plot(north$units, type = "l", col = "darkgreen",
     main = "North region: units sold per month",
     xlab = "Month (1 = January 2022)", ylab = "Units sold")`,
            explanation: [
              { code: `north <- sales[sales$region == "North", ]`, text: "Keeps the 36 monthly rows of the North region (filtering from the previous module)." },
              { code: `type = "l"`, text: "`type` chooses how to draw: `\"p\"` points (the default), `\"l\"` lines, `\"b\"` both. A line suits values that follow each other in time." },
              { code: `col = "darkgreen"`, text: "The colour of the line. R knows hundreds of colour names, such as `\"steelblue\"`, `\"tomato\"` or `\"orange\"`." },
              { code: "main = ..., xlab = ..., ylab = ...", text: "`main` is the title above the chart; `xlab` and `ylab` label the x- and y-axis. A chart without labels makes the reader guess." },
            ],
            output: "[1] 36",
            plot: true,
            outputNote: "The console shows the 36 rows from `nrow()`. The chart shows units sold going up and down from month to month, with a peak around the middle of each year and a general upward trend: on average about 465 units a month in 2022 and 620 in 2024.",
            tryIt: "Change `type = \"l\"` to `type = \"b\"`, or plot the `South` region instead.",
          },
        },
      ],
    },
    {
      id: "histograms",
      title: "Histograms: how one number column is spread",
      blocks: [
        {
          kind: "definition",
          term: "Histogram",
          md: "A **histogram** shows the **distribution** of a numeric variable – which values are common and which are rare. The number line is cut into intervals called *bins*; each bar's height is the number of values that fall into its bin. The bars touch, because the bins follow each other without gaps.",
        },
        {
          kind: "code",
          example: {
            id: "hist-basic",
            title: "A first histogram",
            code: `students <- read.csv("data/students.csv")

hist(students$math)`,
            explanation: [
              { code: "hist(students$math)", text: "`hist()` takes a numeric vector, chooses bins automatically and draws the bars. The title and x-label are created from the code (`Histogram of students$math`)." },
            ],
            plot: true,
            outputNote: "Most students score between 60 and 90; very low and very high scores are rare. The tallest bars show the most common scores.",
          },
        },
        {
          kind: "code",
          example: {
            id: "hist-breaks",
            title: "Choose the bins with breaks",
            code: `students <- read.csv("data/students.csv")

h <- hist(students$math, breaks = seq(50, 100, by = 10),
          main = "Math scores", xlab = "Score", col = "skyblue")
h$counts`,
            explanation: [
              { code: "seq(50, 100, by = 10)", text: "Creates the bin edges 50, 60, 70, 80, 90, 100 – five bins of width 10." },
              { code: "breaks = ...", text: "`breaks` tells `hist()` where to cut. You can give exact edges (as here) or a single number such as `breaks = 20`, which R treats as a *suggestion* for the number of bins." },
              { code: "h <- hist(...)", text: "`hist()` draws the chart **and** returns the numbers behind it, which we store in `h`." },
              { code: "h$counts", text: "How many students fall into each bin." },
            ],
            output: "[1]  8 16 18 12  6",
            plot: true,
            outputNote: "8 students scored 50–60, 16 scored 60–70, 18 scored 70–80 (the most common range), 12 scored 80–90 and 6 scored 90–100. Each bin includes its right edge: a score of exactly 60 counts in the 50–60 bin.",
            tryIt: "Try `breaks = seq(50, 100, by = 5)`. Narrower bins show more detail but also more random bumps.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m6-base-q-inline1",
            type: "multiple-choice",
            prompt: "In a histogram of exam scores, one bar from 70 to 80 is much taller than the others. What does that mean?",
            options: [
              "The average score is exactly 80",
              "Many students scored between 70 and 80",
              "Scores between 70 and 80 are the highest scores",
              "The student list is sorted from 70 to 80",
            ],
            answer: 1,
            optionFeedback: [
              "A histogram shows how many values fall in each bin, not the average.",
              "Correct – bar height = number of values in that bin.",
              "The highest scores are at the right end of the x-axis, not in the tallest bar.",
              "The order of the data does not matter for a histogram.",
            ],
            explanation: "The height of a histogram bar is the count of values inside its bin, so a tall 70–80 bar means that range is the most common.",
            concept: "histograms",
          },
        },
      ],
    },
    {
      id: "bar-charts",
      title: "Bar charts: counting categories",
      blocks: [
        {
          kind: "definition",
          term: "Bar chart",
          md: "A **bar chart** shows one bar per **category**, with the bar's height showing a number – usually how many times the category occurs. The bars are separate, because categories have no natural in-between values.",
        },
        {
          kind: "text",
          md: "`barplot()` needs the **heights** of the bars, not the raw data. So you first count the categories with `table()` and then draw the counts.",
        },
        {
          kind: "code",
          example: {
            id: "barplot-table",
            title: "Count first, then draw",
            code: `survey <- read.csv("data/survey.csv")

counts <- table(survey$favorite_feature)
counts

barplot(counts, col = "orange",
        main = "Favourite app feature", ylab = "Number of users")`,
            explanation: [
              { code: "counts <- table(survey$favorite_feature)", text: "A frequency table: how many of the 200 users chose each feature." },
              { code: "barplot(counts, ...)", text: "Draws one bar per feature, as tall as its count. The category names from the table become the bar labels." },
            ],
            output: `
          Price Recommendations          Search         Support
             60              43              55              42 `,
            plot: true,
            outputNote: "Price is the most popular feature (60 users), Support the least (42). The bars show the same numbers as the table – just much easier to compare.",
          },
        },
        {
          kind: "code",
          example: {
            id: "barplot-sorted",
            title: "Sorted, horizontal bars",
            code: `survey <- read.csv("data/survey.csv")

counts <- sort(table(survey$favorite_feature), decreasing = TRUE)
counts

barplot(counts, horiz = TRUE, col = "steelblue",
        main = "Favourite app feature", xlab = "Number of users")`,
            explanation: [
              { code: "sort(table(...), decreasing = TRUE)", text: "Sorting the counts puts the bars in order from largest to smallest, so the ranking is visible at a glance." },
              { code: "horiz = TRUE", text: "Draws the bars horizontally – handy when category names are long. The counts are now on the x-axis, so the label goes in `xlab`." },
            ],
            output: `
          Price          Search Recommendations         Support
             60              55              43              42 `,
            plot: true,
            outputNote: "With horizontal bars the first category is drawn at the bottom, so Price is the bottom bar.",
            tryIt: "Draw a bar chart of the satisfaction ratings: `barplot(table(survey$satisfaction))`. Here sorting by count would be a bad idea – why?",
          },
        },
      ],
    },
    {
      id: "scatter-plots",
      title: "Scatter plots: two number columns",
      blocks: [
        {
          kind: "definition",
          term: "Scatter plot",
          md: "A **scatter plot** draws one point per observation, with one numeric variable on the x-axis and another on the y-axis. It shows whether the two variables are related – for example, whether points tend to go up together.",
        },
        {
          kind: "code",
          example: {
            id: "scatter-basic",
            title: "Study time and math score",
            code: `students <- read.csv("data/students.csv")

plot(students$study_hours, students$math,
     pch = 19, col = "darkblue",
     main = "Study time and math score",
     xlab = "Study hours per week", ylab = "Math score")

cor(students$study_hours, students$math)`,
            explanation: [
              { code: "plot(students$study_hours, students$math, ...)", text: "With **two** vectors, `plot()` makes a scatter plot: the first goes on the x-axis, the second on the y-axis. Each point is one student." },
              { code: "pch = 19", text: "`pch` (*plotting character*) sets the point shape. 19 is a filled circle; the default (1) is an empty circle." },
              { code: "cor(students$study_hours, students$math)", text: "`cor()` calculates the **correlation**, a number between −1 and 1 that measures how strongly two variables move together in a straight-line way. You will study it in the statistics module." },
            ],
            output: "[1] 0.5898696",
            plot: true,
            outputNote: "The cloud of points goes up from left to right: students who study more tend to score higher. The correlation of 0.59 confirms a clear but not perfect positive relationship – some students study little and still do well.",
            tryIt: "Plot `attendance` against `math`. Is that relationship stronger or weaker?",
          },
        },
        {
          kind: "code",
          example: {
            id: "scatter-formula",
            title: "The formula way: y ~ x",
            code: `students <- read.csv("data/students.csv")

plot(math ~ reading, data = students, pch = 19, col = "tomato")

cor(students$math, students$reading)`,
            explanation: [
              { code: "math ~ reading", text: "A **formula**: read `~` as *\"explained by\"* or *\"against\"*. The variable on the left goes on the y-axis, the one on the right on the x-axis." },
              { code: "data = students", text: "Tells `plot()` where to find the columns, so you do not need `students$`." },
            ],
            output: "[1] 0.7979465",
            plot: true,
            outputNote: "Students who read well also tend to do well in math – the points lie close to a rising line, and the correlation (0.80) is stronger than for study hours.",
          },
        },
      ],
    },
    {
      id: "box-plots",
      title: "Box plots: summarising and comparing groups",
      blocks: [
        {
          kind: "definition",
          term: "Box plot",
          md: "A **box plot** (box-and-whisker plot) summarises a numeric variable in five numbers. The **box** goes from the first quartile (25% of values below) to the third quartile (75% below), so it holds the middle half of the data. The thick line inside is the **median**. The **whiskers** reach to the most extreme values that are not too far away, and points beyond them are drawn separately as possible **outliers**.",
        },
        {
          kind: "diagram",
          name: "boxplot-anatomy",
          caption: "Reading a box plot: median line, box from Q1 to Q3 (the IQR), whiskers and outliers.",
        },
        {
          kind: "code",
          example: {
            id: "boxplot-single",
            title: "One box plot and its numbers",
            code: `students <- read.csv("data/students.csv")

boxplot(students$math, main = "Math scores", ylab = "Score", col = "lightyellow")
fivenum(students$math)`,
            explanation: [
              { code: "boxplot(students$math, ...)", text: "Draws one box for all 60 math scores." },
              { code: "fivenum(students$math)", text: "The five numbers the box plot is built from: minimum, lower hinge (≈ first quartile), median, upper hinge (≈ third quartile), maximum." },
            ],
            output: "[1] 53.0 67.0 74.0 82.5 99.0",
            plot: true,
            outputNote: "The median is 74, the box runs from 67 to 82.5, and the whiskers reach the lowest (53) and highest (99) scores – no outliers. `summary()` reports 82.25 as the third quartile; box plots use a slightly different rule for the box edges, so tiny differences are normal.",
          },
        },
        {
          kind: "code",
          example: {
            id: "boxplot-groups",
            title: "Compare groups with y ~ group",
            code: `students <- read.csv("data/students.csv")

boxplot(math ~ class, data = students,
        col = c("lightblue", "lightgreen", "pink"),
        main = "Math scores by class", xlab = "Class", ylab = "Math score")`,
            explanation: [
              { code: "math ~ class", text: "The formula means *math scores, split by class*: one box per class. The numeric variable goes left of `~`, the grouping variable right of it." },
              { code: `col = c("lightblue", "lightgreen", "pink")`, text: "One colour per box, in the order of the groups (A, B, C)." },
            ],
            plot: true,
            outputNote: "Three boxes side by side make the groups easy to compare. Class C has the highest median and class B the widest spread – its box and whiskers are the longest.",
            tryIt: "Compare reading scores by `gender`: `boxplot(reading ~ gender, data = students)`.",
          },
        },
        {
          kind: "code",
          example: {
            id: "boxplot-patients",
            title: "Do smokers have higher blood pressure?",
            code: `patients <- read.csv("data/patients.csv")

boxplot(systolic_bp ~ smoker, data = patients,
        col = c("lightgreen", "salmon"),
        xlab = "Smoker", ylab = "Systolic blood pressure (mmHg)")

median(patients$systolic_bp[patients$smoker == "No"])
median(patients$systolic_bp[patients$smoker == "Yes"])`,
            explanation: [
              { code: "boxplot(systolic_bp ~ smoker, data = patients, ...)", text: "One box for non-smokers (`No`) and one for smokers (`Yes`)." },
              { code: `median(patients$systolic_bp[patients$smoker == "No"])`, text: "Checks the median line of the first box with a number: filter the blood pressures of non-smokers, then take the median." },
            ],
            output: `[1] 137
[1] 143`,
            plot: true,
            outputNote: "The smokers' box sits higher: their median blood pressure is 143 mmHg against 137 for non-smokers. The boxes overlap a lot, though – many non-smokers have higher blood pressure than many smokers. A chart shows such overlap better than the two medians alone.",
          },
        },
      ],
    },
    {
      id: "customising",
      title: "Titles, labels and colours",
      blocks: [
        {
          kind: "text",
          md: "All base R plotting functions understand the same handful of arguments. Here they are in one place:",
        },
        {
          kind: "table",
          headers: ["Argument", "What it changes", "Example"],
          rows: [
            ["`main`", "the title above the chart", "`main = \"Math scores\"`"],
            ["`xlab`, `ylab`", "the axis labels", "`xlab = \"Score\"`"],
            ["`col`", "fill colour of bars and boxes, colour of points and lines", "`col = \"steelblue\"`"],
            ["`border`", "outline colour of bars and boxes", "`border = \"white\"`"],
            ["`pch`", "point shape (19 = filled circle)", "`pch = 19`"],
            ["`type`", "points, lines or both in `plot()`", "`type = \"l\"`"],
            ["`breaks`", "bins of a histogram", "`breaks = seq(0, 100, by = 10)`"],
            ["`horiz`", "horizontal bars in `barplot()`", "`horiz = TRUE`"],
          ],
        },
        {
          kind: "code",
          example: {
            id: "styled-histogram",
            title: "A fully labelled histogram",
            code: `patients <- read.csv("data/patients.csv")

hist(patients$bmi,
     main = "BMI of 150 patients",
     xlab = "Body mass index (BMI)",
     col = "lightblue", border = "white")

summary(patients$bmi)`,
            explanation: [
              { code: "hist(patients$bmi, ...)", text: "`hist()` ignores the 5 missing BMI values automatically." },
              { code: `main = "BMI of 150 patients"`, text: "A title that says what the chart shows." },
              { code: `col = "lightblue", border = "white"`, text: "Light blue bars with white outlines – a clean, calm look." },
            ],
            output: `   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.     NAs
  17.00   23.50   25.80   26.26   29.00   37.00       5 `,
            plot: true,
            outputNote: "The histogram and the summary tell the same story: most BMI values lie between about 23 and 29, centred near 26.",
            tryIt: "Run `colors()` to see all colour names R knows, and try a few in `col`.",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Drawing a histogram of a text column",
      wrong: `students <- read.csv("data/students.csv")
hist(students$class)`,
      error: "'x' must be numeric",
      why: "A histogram needs numbers to cut into bins. `class` holds categories (A, B, C) – count them and use a bar chart instead.",
      right: `students <- read.csv("data/students.csv")
barplot(table(students$class))`,
    },
    {
      title: "Giving barplot() the raw categories instead of counts",
      wrong: `students <- read.csv("data/students.csv")
barplot(students$gender)`,
      error: "non-numeric argument to binary operator",
      why: "`barplot()` expects bar **heights** (numbers). The raw column is a vector of words. Count the categories with `table()` first.",
      right: `students <- read.csv("data/students.csv")
barplot(table(students$gender))`,
    },
    {
      title: "Using barplot() on a numeric column",
      wrong: `students <- read.csv("data/students.csv")
barplot(students$math)`,
      why: "This runs, but draws 60 thin bars – one per student, in file order. That shows nothing useful about the distribution. For the spread of a numeric column, use `hist()` or `boxplot()`.",
      right: `students <- read.csv("data/students.csv")
hist(students$math)`,
    },
    {
      title: "Putting the group on the wrong side of ~",
      wrong: `students <- read.csv("data/students.csv")
boxplot(class ~ math, data = students)`,
      error: "non-numeric argument to binary operator",
      why: "In `boxplot(y ~ group)`, the numeric variable goes on the **left** and the grouping variable on the right. Here R tries to make boxes of the class letters, split by math score.",
      right: `students <- read.csv("data/students.csv")
boxplot(math ~ class, data = students)`,
    },
  ],
  exerciseIds: ["m6-base-histogram", "m6-base-bar-box"],
  quiz: [
    {
      id: "m6-base-q1",
      type: "multiple-choice",
      prompt: "You want to see how the ages of 150 patients are spread out. Which function fits best?",
      options: ["`barplot()`", "`hist()`", "`plot()` with `type = \"l\"`", "`table()`"],
      answer: 1,
      optionFeedback: [
        "Bar charts are for counting categories, not for spreading out numbers.",
        "Correct – a histogram shows the distribution of one numeric variable.",
        "A line chart suits values that follow each other in time.",
        "`table()` counts values but does not draw anything.",
      ],
      explanation: "Age is a numeric variable, and *how it is spread out* is its distribution – exactly what a histogram shows.",
      concept: "histograms",
    },
    {
      id: "m6-base-q2",
      type: "fill-blank",
      prompt: "Complete the code to draw a bar chart of how many students are in each class.",
      code: `students <- read.csv("data/students.csv")
barplot(___(students$class))`,
      accept: ["table"],
      hint: "`barplot()` needs counts. Which function counts categories?",
      explanation: "`table(students$class)` counts the students per class, and `barplot()` draws those counts as bars.",
      concept: "bar-charts",
    },
    {
      id: "m6-base-q3",
      type: "predict-output",
      prompt: "`hist()` can also count without drawing (`plot = FALSE`). What does this code print?",
      code: `h <- hist(c(1, 2, 2, 3, 3, 3), breaks = c(0, 1, 2, 3), plot = FALSE)
h$counts`,
      options: ["[1] 1 2 3", "[1] 3 2 1", "[1] 6", "[1] 0 1 2 3"],
      answer: 0,
      optionFeedback: [
        "Correct – one value in (0, 1], two in (1, 2] and three in (2, 3].",
        "Look at how often each number appears.",
        "`counts` has one number per bin, not a total.",
        "Those are the break points, not the counts.",
      ],
      explanation: "The breaks 0, 1, 2, 3 make three bins. Each bin includes its right edge, so the bins hold one 1, two 2s and three 3s.",
      concept: "histograms",
    },
    {
      id: "m6-base-q4",
      type: "find-error",
      prompt: "This code should compare math scores between the classes. Which line causes the error?",
      code: `students <- read.csv("data/students.csv")
boxplot(class ~ math, data = students)
title("Math by class")`,
      errorLine: 2,
      errorKind: "error",
      fix: `students <- read.csv("data/students.csv")
boxplot(math ~ class, data = students)
title("Math by class")`,
      explanation: "In `boxplot(y ~ group)` the numeric variable comes first: `math ~ class`. With the sides swapped, R tries to summarise the class letters and stops with an error.",
      concept: "box-plots",
    },
    {
      id: "m6-base-q5",
      type: "true-false",
      prompt: "In a box plot, the line inside the box shows the mean.",
      answer: false,
      explanation: "The line inside the box is the **median** – the middle value. The box itself spans the middle 50% of the data, from the first to the third quartile.",
      concept: "box-plots",
    },
    {
      id: "m6-base-q6",
      type: "multiple-choice",
      prompt: "What does `plot(students$study_hours, students$math)` draw?",
      options: [
        "A histogram of study hours",
        "A scatter plot with study hours on the x-axis and math scores on the y-axis",
        "A scatter plot with math scores on the x-axis",
        "Two separate charts",
      ],
      answer: 1,
      optionFeedback: [
        "With two vectors, `plot()` draws points, not bars.",
        "Correct – the first vector goes on the x-axis, the second on the y-axis.",
        "The first argument is the x-axis.",
        "`plot()` with two vectors draws one chart with one point per pair of values.",
      ],
      explanation: "`plot(x, y)` makes a scatter plot. The formula version `plot(math ~ study_hours, data = students)` draws the same chart.",
      concept: "scatter-plots",
    },
  ],
  keyPoints: [
    "Choose a chart by variable type: histograms and box plots for one numeric variable, bar charts for categories, scatter plots for two numeric variables.",
    "`plot(x)` draws values against their position; `type = \"l\"` connects them into a line chart.",
    "`hist(x)` shows a distribution; `breaks` controls the bins, and the returned object holds the counts.",
    "`barplot()` needs counts: use `barplot(table(x))`.",
    "`plot(x, y)` or `plot(y ~ x, data = df)` makes a scatter plot.",
    "`boxplot(y ~ group, data = df)` compares groups; the box is the middle 50%, the line the median, points beyond the whiskers are possible outliers.",
    "`main`, `xlab`, `ylab` and `col` add a title, axis labels and colour to any base R chart.",
  ],
  concepts: ["base-plotting", "histograms", "bar-charts", "scatter-plots", "box-plots"],
  glossary: ["histogram", "bar-chart", "scatter-plot", "box-plot", "distribution", "outlier", "median", "quantile", "iqr", "categorical-variable", "numeric-variable", "correlation"],
  datasets: ["students", "survey", "sales", "patients"],
  playground: `# Try the base R plotting functions
students <- read.csv("data/students.csv")

hist(students$math, col = "skyblue", main = "Math scores", xlab = "Score")

# boxplot(math ~ class, data = students)
# plot(students$study_hours, students$math, pch = 19)`,
};
