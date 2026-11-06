import type { Lesson } from "../../types";

export const ggplot2IntroductionLesson: Lesson = {
  id: "ggplot2-introduction",
  module: 6,
  title: "Introduction to ggplot2",
  summary: "Build charts layer by layer with ggplot2: data, aesthetics and geoms for scatter plots, histograms, bar charts, box plots and line charts.",
  minutes: 45,
  objectives: [
    "Explain the three building blocks of every ggplot: data, aesthetics (`aes()`) and geoms",
    "Build a chart step by step by adding layers with `+`",
    "Draw scatter plots, histograms, bar charts, box plots and line charts with `geom_point()`, `geom_histogram()`, `geom_bar()`, `geom_col()`, `geom_boxplot()` and `geom_line()`",
    "Choose between `geom_bar()` (R counts the rows) and `geom_col()` (you provide the heights)",
    "Store a plot in a variable and add more layers to it later",
  ],
  intro: `**ggplot2** is the most popular plotting package for R. Instead of one function per chart type, it uses a small *grammar*: you describe **which data** to use, **which columns go where** (x-axis, y-axis, colour…) and **which shapes to draw** (points, bars, boxes, lines). Then you stack these pieces with \`+\`, like layers on a cake.

This feels a little more wordy than \`hist()\` or \`plot()\` at first. The pay-off is that every chart is built the same way: once you can make a scatter plot, a box plot is just a different shape, and adding colours, labels or a trend line is just one more layer. ggplot2 also makes good-looking charts by default, which is why it is used in reports, newspapers and research papers.`,
  sections: [
    {
      id: "grammar",
      title: "The grammar of graphics: data + aesthetics + geoms",
      blocks: [
        {
          kind: "text",
          md: "Every ggplot is made of the same parts:\n\n1. **Data** – a data frame, e.g. `students`.\n2. **Aesthetics** – which columns are shown by which visual property, written inside `aes()`: `aes(x = study_hours, y = math)`.\n3. **Geoms** – the geometric shapes that draw the data: `geom_point()` for points, `geom_bar()` for bars, …\n\nOptional extra layers add labels, colour scales and themes (next lesson).",
        },
        {
          kind: "definition",
          term: "Aesthetic",
          md: "An **aesthetic** is a visual property of the chart that can show a variable: position on the x-axis, position on the y-axis, colour, fill, size or shape. `aes()` *maps* columns to aesthetics, e.g. `aes(x = class, y = math, fill = class)`.",
        },
        {
          kind: "definition",
          term: "Geom",
          md: "A **geom** (*geometric object*) is the shape used to draw the data. Each geom function starts with `geom_`: `geom_point()`, `geom_histogram()`, `geom_bar()`, `geom_col()`, `geom_boxplot()`, `geom_line()` and many more.",
        },
        {
          kind: "diagram",
          name: "ggplot-layers",
          caption: "A ggplot is built in layers: data + aesthetics + geoms (+ labels + theme).",
        },
        {
          kind: "callout",
          tone: "info",
          title: "Loading ggplot2",
          md: "Like dplyr, ggplot2 is a package: load it with `library(ggplot2)` in every script. On R Academy it is installed automatically the first time; on your own computer run `install.packages(\"ggplot2\")` once.",
        },
      ],
    },
    {
      id: "first-ggplot",
      title: "Your first ggplot: a scatter plot, layer by layer",
      blocks: [
        {
          kind: "code",
          example: {
            id: "empty-canvas",
            title: "Step 1: data and aesthetics give an empty canvas",
            code: `library(ggplot2)
students <- read.csv("data/students.csv")

ggplot(students, aes(x = study_hours, y = math))`,
            explanation: [
              { code: "library(ggplot2)", text: "Loads the package." },
              { code: "ggplot(students, ...)", text: "Starts a plot and says which data frame to use." },
              { code: "aes(x = study_hours, y = math)", text: "Maps the `study_hours` column to the x-axis and `math` to the y-axis. Inside `aes()` you write bare column names, as in dplyr." },
            ],
            plot: true,
            outputNote: "The chart shows the axes with the right ranges and labels – but no data points. ggplot2 knows *where* things would go, but you have not told it *what shape* to draw yet.",
          },
        },
        {
          kind: "code",
          example: {
            id: "geom-point",
            title: "Step 2: add a geom",
            code: `library(ggplot2)
students <- read.csv("data/students.csv")

ggplot(students, aes(x = study_hours, y = math)) +
  geom_point()`,
            explanation: [
              { code: "+", text: "`+` adds a layer to the plot. Put it at the **end** of a line, so R knows the plot continues on the next line." },
              { code: "geom_point()", text: "Draws one point per row, at the position given by the aesthetics. The brackets are empty because the geom uses the aesthetics from `ggplot()`." },
            ],
            plot: true,
            outputNote: "The same relationship you saw with base R's `plot()`: more study hours tend to go with higher math scores. ggplot2 adds a grey background with grid lines and labels the axes with the column names.",
            tryIt: "Map `y = reading` instead of `math`, or try `geom_point(size = 3, colour = \"steelblue\")`.",
          },
        },
        {
          kind: "code",
          example: {
            id: "plot-object",
            title: "Plots are objects: store them and add layers later",
            code: `library(ggplot2)
students <- read.csv("data/students.csv")

p <- ggplot(students, aes(x = study_hours, y = math)) +
  geom_point()

p + geom_smooth(method = "lm", formula = y ~ x, se = FALSE)`,
            explanation: [
              { code: "p <- ggplot(...) + geom_point()", text: "A ggplot can be stored in a variable like any other object. Storing it draws nothing yet." },
              { code: "p + geom_smooth(...)", text: "Adds a new layer to `p` and – because the result is not stored – prints (draws) it." },
              { code: `method = "lm", formula = y ~ x, se = FALSE`, text: "`geom_smooth()` draws a trend line. `method = \"lm\"` makes it a straight line (a *linear model*, which you will study later) and `se = FALSE` hides the grey uncertainty band." },
            ],
            plot: true,
            outputNote: "The points with a straight line that follows their upward trend. The variable `p` itself is unchanged; you can add different layers to it as often as you like.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m6-gg-q-inline1",
            type: "multiple-choice",
            prompt: "In `ggplot(patients, aes(x = age, y = systolic_bp)) + geom_point()`, what does `aes()` do?",
            options: [
              "It draws the points",
              "It maps the column `age` to the x-axis and `systolic_bp` to the y-axis",
              "It loads the patients data",
              "It sets the colour of the points",
            ],
            answer: 1,
            optionFeedback: [
              "Drawing is the job of the geom, `geom_point()`.",
              "Correct – aesthetics connect columns to visual properties.",
              "The data is given as the first argument of `ggplot()`.",
              "Nothing is mapped to colour here, so the default colour is used.",
            ],
            explanation: "`aes()` describes the *mapping*: which column is shown by which visual property. The geom then draws shapes at those positions.",
            concept: "ggplot-grammar",
          },
        },
      ],
    },
    {
      id: "geom-histogram",
      title: "Histograms with geom_histogram()",
      blocks: [
        {
          kind: "code",
          example: {
            id: "gg-histogram",
            title: "Distribution of math scores",
            code: `library(ggplot2)
students <- read.csv("data/students.csv")

ggplot(students, aes(x = math)) +
  geom_histogram(binwidth = 5, fill = "steelblue", colour = "white")`,
            explanation: [
              { code: "aes(x = math)", text: "A histogram needs only an x aesthetic – the y-axis (the count) is calculated by ggplot2." },
              { code: "binwidth = 5", text: "Each bar covers 5 points (e.g. 70–75). You can use `bins = 10` instead to ask for a number of bars." },
              { code: `fill = "steelblue", colour = "white"`, text: "`fill` is the inside colour of the bars, `colour` their outline. Written **outside** `aes()`, they are fixed colours for all bars." },
            ],
            plot: true,
            outputNote: "The same shape as the base R histogram: most scores between 60 and 90, centred in the low 70s.",
            tryIt: "Change `binwidth` to 2 and to 10. Which one shows the shape best?",
          },
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Always choose binwidth or bins",
          md: "Without `binwidth` or `bins`, ggplot2 uses 30 bins and prints a reminder: *`stat_bin()` using `bins = 30`. Pick better value with `binwidth`.* The reminder is harmless, but 30 bins is rarely the best choice for small datasets.",
        },
        {
          kind: "callout",
          tone: "note",
          title: "Missing values",
          md: "If the column has NAs (like `science` or `bmi`), ggplot2 still draws the chart and warns *Removed 3 rows containing non-finite values*. It is telling you those rows could not be drawn – a useful reminder, not an error.",
        },
      ],
    },
    {
      id: "geom-bar-col",
      title: "Bar charts: geom_bar() and geom_col()",
      blocks: [
        {
          kind: "text",
          md: "ggplot2 has two bar geoms, and the difference matters:\n\n- `geom_bar()` **counts the rows for you**. Give it only an `x` aesthetic with a categorical column.\n- `geom_col()` draws bars whose heights **you provide** in a `y` column – for example totals you calculated with dplyr.",
        },
        {
          kind: "code",
          example: {
            id: "gg-geom-bar",
            title: "geom_bar(): ggplot2 counts",
            code: `library(ggplot2)
survey <- read.csv("data/survey.csv")

ggplot(survey, aes(x = favorite_feature)) +
  geom_bar(fill = "orange")`,
            explanation: [
              { code: "aes(x = favorite_feature)", text: "The categories go on the x-axis. There is no `y`: `geom_bar()` counts how many rows have each value – like `table()`." },
              { code: `geom_bar(fill = "orange")`, text: "Draws one orange bar per feature." },
            ],
            plot: true,
            outputNote: "Four bars with the same heights as `table(survey$favorite_feature)`: Price 60, Recommendations 43, Search 55, Support 42. No need to call `table()` first, unlike `barplot()`.",
          },
        },
        {
          kind: "code",
          example: {
            id: "gg-geom-col",
            title: "geom_col(): you provide the heights",
            packages: ["ggplot2", "dplyr"],
            code: `library(ggplot2)
library(dplyr)
sales <- read.csv("data/sales.csv")

totals <- sales |>
  group_by(region) |>
  summarise(revenue = sum(revenue)) |>
  as.data.frame()
totals

ggplot(totals, aes(x = region, y = revenue)) +
  geom_col(fill = "seagreen")`,
            explanation: [
              { code: "totals <- sales |> group_by(region) |> summarise(revenue = sum(revenue))", text: "dplyr from the previous module: one row per region with its total revenue." },
              { code: "aes(x = region, y = revenue)", text: "This time the bar heights are already in a column, so we map it to `y`." },
              { code: "geom_col(...)", text: "Draws bars exactly as tall as the `revenue` values." },
            ],
            output: `  region  revenue
1   East 342037.8
2  North 473708.7
3  South 445650.1
4   West 361711.2`,
            plot: true,
            outputNote: "The table shows the four totals and the chart draws them as bars. North's bar is the tallest. dplyr and ggplot2 work together naturally: summarise first, then plot the summary.",
            tryIt: "Plot the average units per region instead: change `sum(revenue)` to `mean(units)` (and rename the column).",
          },
        },
        {
          kind: "question",
          question: {
            id: "m6-gg-q-inline2",
            type: "multiple-choice",
            prompt: "You have a data frame `avg_scores` with the columns `class` and `average` (one row per class). Which geom draws one bar per class with height `average`?",
            options: [
              "`ggplot(avg_scores, aes(x = class)) + geom_bar()`",
              "`ggplot(avg_scores, aes(x = class, y = average)) + geom_col()`",
              "`ggplot(avg_scores, aes(x = average)) + geom_histogram()`",
              "`ggplot(avg_scores, aes(x = class, y = average)) + geom_bar()`",
            ],
            answer: 1,
            optionFeedback: [
              "`geom_bar()` would count the rows – every bar would have height 1.",
              "Correct – the heights are already in a column, so use `geom_col()` with `y = average`.",
              "A histogram of three averages does not compare the classes.",
              "`geom_bar()` counts rows and does not accept a `y` aesthetic by default – it stops with an error.",
            ],
            explanation: "Use `geom_col()` when the bar heights are values in your data; use `geom_bar()` when ggplot2 should count rows.",
            concept: "bar-geoms",
          },
        },
      ],
    },
    {
      id: "geom-boxplot",
      title: "Box plots with geom_boxplot()",
      blocks: [
        {
          kind: "code",
          example: {
            id: "gg-boxplot",
            title: "Math scores by class",
            code: `library(ggplot2)
students <- read.csv("data/students.csv")

ggplot(students, aes(x = class, y = math)) +
  geom_boxplot(fill = "lightblue")`,
            explanation: [
              { code: "aes(x = class, y = math)", text: "The grouping variable goes on the x-axis and the numeric variable on the y-axis – the same idea as `math ~ class` in base R." },
              { code: `geom_boxplot(fill = "lightblue")`, text: "Draws one box per class: median line, box from the first to the third quartile, whiskers and outlier points." },
            ],
            plot: true,
            outputNote: "Class C's median is the highest and class B has the widest spread – the same picture as the base R box plot.",
          },
        },
        {
          kind: "code",
          example: {
            id: "gg-boxplot-points",
            title: "Two geoms in one plot",
            code: `library(ggplot2)
patients <- read.csv("data/patients.csv")

ggplot(patients, aes(x = smoker, y = systolic_bp)) +
  geom_boxplot(fill = "grey90") +
  geom_point(colour = "tomato", alpha = 0.4)`,
            explanation: [
              { code: "geom_boxplot(...) +", text: "First layer: the boxes." },
              { code: `geom_point(colour = "tomato", alpha = 0.4)`, text: "Second layer, drawn on top: every patient as a point. `alpha` sets transparency from 0 (invisible) to 1 (solid), so overlapping points show up as darker spots." },
            ],
            plot: true,
            outputNote: "Layers are drawn in the order you add them. Showing the raw points on top of the boxes reminds the reader how many patients each box summarises – there are far more non-smokers (119) than smokers (31).",
            tryIt: "Swap the two layers (points first, then boxes). The boxes now cover the points.",
          },
        },
      ],
    },
    {
      id: "geom-line",
      title: "Line charts with geom_line()",
      blocks: [
        {
          kind: "text",
          md: "Line charts show how a value changes **over time**. The dates in `sales.csv` are stored as text (`\"2022-01-01\"`). `as.Date()` turns them into real **dates**, so ggplot2 spaces them correctly and labels the axis with years.",
        },
        {
          kind: "code",
          example: {
            id: "gg-line",
            title: "Units sold per month in the North",
            code: `library(ggplot2)
sales <- read.csv("data/sales.csv")
north <- sales[sales$region == "North", ]
north$month <- as.Date(north$month)

ggplot(north, aes(x = month, y = units)) +
  geom_line(colour = "darkgreen") +
  geom_point(colour = "darkgreen")`,
            explanation: [
              { code: "north$month <- as.Date(north$month)", text: "Converts the text column into a Date column – *fixing a type*, as in the cleaning lesson." },
              { code: "aes(x = month, y = units)", text: "Time on the x-axis, the value on the y-axis." },
              { code: "geom_line(...) + geom_point(...)", text: "`geom_line()` connects the months in date order; `geom_point()` marks each month on top." },
            ],
            plot: true,
            outputNote: "The line climbs over the three years, with a peak around the middle of each year. The x-axis is labelled with years because `month` is now a real date.",
          },
        },
        {
          kind: "code",
          example: {
            id: "gg-lines-by-group",
            title: "One line per region",
            code: `library(ggplot2)
sales <- read.csv("data/sales.csv")
sales$month <- as.Date(sales$month)
class(sales$month)

ggplot(sales, aes(x = month, y = revenue, colour = region)) +
  geom_line()`,
            explanation: [
              { code: "class(sales$month)", text: "Confirms the conversion: the column is now of class `Date`." },
              { code: "colour = region", text: "Mapping `region` to the **colour** aesthetic (inside `aes()`) gives each region its own line and colour, and ggplot2 adds a legend automatically." },
            ],
            output: `[1] "Date"`,
            plot: true,
            outputNote: "Four coloured lines, one per region, with a legend explaining the colours. Without `colour = region`, ggplot2 would connect all 144 points in one confusing zig-zag line.",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Using the pipe instead of + between layers",
      wrong: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = math)) |>
  geom_histogram(binwidth = 5)`,
      error: "instead of `+`?",
      why: "Layers are added with `+`, not with `|>` or `%>%`. The pipe would pass the whole plot into `geom_histogram()` as its first argument, which makes no sense. ggplot2 recognises the slip and asks: *Did you use `%>%` or `|>` instead of `+`?*",
      right: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = math)) +
  geom_histogram(binwidth = 5)`,
    },
    {
      title: "Putting + at the start of a line",
      wrong: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = study_hours, y = math))
  + geom_point()`,
      error: "with a single argument",
      why: "R treats the first line as complete and draws an empty plot. The next line, `+ geom_point()`, then has nothing on its left. The `+` must be at the **end** of a line.",
      right: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = study_hours, y = math)) +
  geom_point()`,
    },
    {
      title: "Forgetting aes()",
      wrong: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, x = study_hours, y = math) +
  geom_point()`,
      error: "requires the following missing aesthetics: x and y",
      why: "Column mappings must be wrapped in `aes()`. Without it, ggplot2 does not know which columns to use for the axes, and the geom complains that x and y are missing.",
      right: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = study_hours, y = math)) +
  geom_point()`,
    },
    {
      title: "Forgetting library(ggplot2)",
      wrong: `students <- read.csv("data/students.csv")
ggplot(students, aes(x = math)) + geom_histogram(binwidth = 5)`,
      error: "could not find function \"ggplot\"",
      why: "`ggplot()` lives in the ggplot2 package. Until the package is loaded, R does not know the function.",
      right: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = math)) + geom_histogram(binwidth = 5)`,
    },
  ],
  exerciseIds: ["m6-gg-scatter", "m6-gg-geoms"],
  quiz: [
    {
      id: "m6-gg-q1",
      type: "multiple-choice",
      prompt: "Which three parts does every ggplot need?",
      options: [
        "A title, a legend and a theme",
        "Data, aesthetics (`aes()`) and at least one geom",
        "`library()`, `read.csv()` and `print()`",
        "An x-axis, a y-axis and colours",
      ],
      answer: 1,
      optionFeedback: [
        "Titles, legends and themes are optional extras.",
        "Correct – the data, the mapping of columns to visual properties, and the shapes to draw.",
        "These are useful functions, but not the parts of a plot.",
        "A histogram, for example, has no y aesthetic – and colours are optional.",
      ],
      explanation: "The grammar of graphics: **data** (which data frame), **aesthetics** (which columns go where) and **geoms** (which shapes to draw). Everything else is an extra layer.",
      concept: "ggplot-grammar",
    },
    {
      id: "m6-gg-q2",
      type: "fill-blank",
      prompt: "Complete the code to draw a box plot of math scores for each class.",
      code: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = class, y = math)) +
  ___()`,
      accept: ["geom_boxplot"],
      hint: "Geom functions all start with `geom_`.",
      explanation: "`geom_boxplot()` draws one box per value of the x aesthetic (`class`), summarising the y aesthetic (`math`).",
      concept: "geoms",
    },
    {
      id: "m6-gg-q3",
      type: "find-error",
      prompt: "This code stops with an error. Which line contains the mistake?",
      code: `library(ggplot2)
survey <- read.csv("data/survey.csv")
ggplot(survey, aes(x = region)) |>
  geom_bar()`,
      errorLine: 3,
      errorKind: "error",
      fix: `library(ggplot2)
survey <- read.csv("data/survey.csv")
ggplot(survey, aes(x = region)) +
  geom_bar()`,
      explanation: "Line 3 ends with the pipe `|>`, but ggplot layers are joined with `+`. Replace `|>` with `+`.",
      concept: "ggplot-grammar",
    },
    {
      id: "m6-gg-q4",
      type: "true-false",
      prompt: "`geom_bar()` counts the number of rows in each category for you, so it needs only an x aesthetic.",
      answer: true,
      explanation: "`geom_bar()` counts rows (like `table()`). If your data already contains the bar heights, use `geom_col()` with a y aesthetic instead.",
      concept: "bar-geoms",
    },
    {
      id: "m6-gg-q5",
      type: "multiple-choice",
      prompt: "Which code draws one line per region in a different colour?",
      options: [
        "`ggplot(sales, aes(x = month, y = revenue)) + geom_line(colour = \"region\")`",
        "`ggplot(sales, aes(x = month, y = revenue, colour = region)) + geom_line()`",
        "`ggplot(sales, aes(x = region, y = revenue)) + geom_line()`",
        "`ggplot(sales, aes(x = month, y = revenue)) + geom_col()`",
      ],
      answer: 1,
      optionFeedback: [
        "Outside `aes()`, `colour` expects a colour name, not a column – R does not know a colour called \"region\".",
        "Correct – mapping `region` to `colour` inside `aes()` makes one coloured line per region, with a legend.",
        "Region on the x-axis does not show change over time.",
        "`geom_col()` draws bars, not lines.",
      ],
      explanation: "To let a column control the colour, map it inside `aes()`: `aes(..., colour = region)`. ggplot2 then draws a separate line for each region.",
      concept: "geoms",
    },
  ],
  keyPoints: [
    "Load ggplot2 with `library(ggplot2)`; a plot starts with `ggplot(data, aes(...))`.",
    "`aes()` maps columns to visual properties (x, y, colour, fill); geoms (`geom_...()`) draw the shapes.",
    "Layers are added with `+` at the end of a line – never with `|>`.",
    "`geom_point()` scatter plot, `geom_histogram()` histogram (set `binwidth` or `bins`), `geom_boxplot()` box plot, `geom_line()` line chart.",
    "`geom_bar()` counts rows per category; `geom_col()` uses heights from a y column.",
    "A plot can be stored in a variable (`p <- ggplot(...)`) and extended later (`p + geom_smooth()`).",
  ],
  concepts: ["ggplot-grammar", "geoms", "bar-geoms"],
  glossary: ["ggplot2", "aesthetic", "geom", "package", "library", "date"],
  datasets: ["students", "survey", "sales", "patients"],
  packages: ["ggplot2", "dplyr"],
  prerequisites: ["base-r-plots"],
  playground: `library(ggplot2)

students <- read.csv("data/students.csv")

ggplot(students, aes(x = study_hours, y = math)) +
  geom_point()`,
};
