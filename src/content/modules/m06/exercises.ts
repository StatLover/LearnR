import type { Exercise } from "../../types";

export const m06Exercises: Exercise[] = [
  {
    id: "m6-base-histogram",
    title: "A histogram of patient ages",
    difficulty: "easy",
    module: 6,
    lesson: "base-r-plots",
    concepts: ["histograms", "base-plotting"],
    datasets: ["patients"],
    prompt: `Show how the ages of the patients in \`data/patients.csv\` are spread out.

1. Import the file into \`patients\`.
2. Draw a histogram of \`age\` with bins of 10 years from 20 to 80 (\`breaks = seq(20, 80, by = 10)\`), a title (\`main\`) and an x-axis label (\`xlab\`). Store the result of \`hist()\` in \`h\`.
3. Print \`h$counts\` to see how many patients fall into each age group.`,
    starterCode: `patients <- read.csv("data/patients.csv")

# Draw the histogram and store it in h
h <- hist(patients$age)

# Print the counts
`,
    expected: "A histogram with six bars appears in the Plots tab, and the console shows `[1] 14 17 17 33 27 42`.",
    hints: [
      "Add `breaks = seq(20, 80, by = 10)` inside `hist()`, separated by a comma.",
      "Titles and labels are arguments too: `main = \"Age of patients\"`, `xlab = \"Age (years)\"`.",
      "`h <- hist(patients$age, breaks = seq(20, 80, by = 10), main = \"Age of patients\", xlab = \"Age (years)\")` and then `h$counts`.",
    ],
    solution: `patients <- read.csv("data/patients.csv")

h <- hist(patients$age, breaks = seq(20, 80, by = 10),
          main = "Age of patients", xlab = "Age (years)", col = "lightblue")

h$counts`,
    explanation: `- \`seq(20, 80, by = 10)\` creates the edges 20, 30, …, 80: six bins of ten years each.
- \`main\` and \`xlab\` give the chart a title and an x-axis label; \`col\` is optional decoration.
- \`hist()\` draws the chart and returns its numbers, so \`h$counts\` shows the bar heights: 14 patients in their twenties (20–30), 17 in each of the next two bins, then 33, 27 and 42. The oldest group (70–80) is the largest – this clinic sees many older patients.`,
    tests: [
      {
        name: "A plot was drawn",
        check: `.plots > 0`,
        failMessage: "Call `hist()` on `patients$age` to draw the histogram.",
      },
      {
        name: "`h` holds the histogram with bins of 10 years from 20 to 80",
        check: `inherits(h, "histogram") && isTRUE(all.equal(h$breaks, seq(20, 80, by = 10)))`,
        failMessage: "Store the result: `h <- hist(patients$age, breaks = seq(20, 80, by = 10), ...)`.",
      },
      {
        name: "All 150 patients are counted",
        check: `sum(h$counts) == 150`,
        failMessage: "Draw the histogram of the `age` column of the full `patients` data.",
      },
      {
        name: "The chart has a title and an x-axis label",
        check: `grepl("main", .code, fixed = TRUE) && grepl("xlab", .code, fixed = TRUE)`,
        failMessage: "Add `main = \"...\"` and `xlab = \"...\"` inside `hist()`.",
      },
      {
        name: "The counts are printed",
        check: `grepl("14 17 17 33 27 42", .out, fixed = TRUE)`,
        failMessage: "Print the counts with `h$counts` on its own line.",
      },
    ],
  },
  {
    id: "m6-base-bar-box",
    title: "Would users recommend the app?",
    difficulty: "medium",
    module: 6,
    lesson: "base-r-plots",
    concepts: ["bar-charts", "box-plots"],
    datasets: ["survey"],
    prompt: `Use \`data/survey.csv\` to draw two charts:

1. Store the counts of the \`recommend\` column (Yes/No) in \`rec_counts\` and draw them as a **bar chart**.
2. Draw a **box plot** of \`hours_online\` split by \`recommend\`, using the formula form \`y ~ group\`. Store the result of \`boxplot()\` in \`b\`.

Do people who would recommend the app spend more time online?`,
    starterCode: `survey <- read.csv("data/survey.csv")

# 1. Count the answers and draw a bar chart


# 2. Box plot of hours_online by recommend, stored in b
`,
    expected: "Two charts are drawn. `rec_counts` shows 59 No and 141 Yes; `b$names` is `\"No\" \"Yes\"`.",
    hints: [
      "Counting categories is a job for `table()`: `rec_counts <- table(survey$recommend)`, then `barplot(rec_counts)`.",
      "In a box plot formula, the number goes on the left: `hours_online ~ recommend`, and you add `data = survey`.",
      "`b <- boxplot(hours_online ~ recommend, data = survey)`.",
    ],
    solution: `survey <- read.csv("data/survey.csv")

rec_counts <- table(survey$recommend)
barplot(rec_counts, col = c("salmon", "lightgreen"),
        main = "Would you recommend the app?", ylab = "Number of users")

b <- boxplot(hours_online ~ recommend, data = survey,
             col = c("salmon", "lightgreen"),
             xlab = "Would recommend", ylab = "Hours online per day")`,
    explanation: `- \`table(survey$recommend)\` counts the answers: 59 No and 141 Yes. \`barplot()\` turns the counts into two bars.
- \`boxplot(hours_online ~ recommend, data = survey)\` draws one box per answer. \`boxplot()\` ignores the 8 missing values of \`hours_online\` automatically.
- Storing the result in \`b\` keeps the numbers behind the boxes: \`b$names\` are the groups and \`b$stats\` the five numbers of each box. The median for *Yes* (3.65 hours) is a little higher than for *No* (3.4 hours), but the boxes overlap a lot – the difference is small.`,
    tests: [
      {
        name: "`rec_counts` counts the Yes/No answers",
        check: `isTRUE(all.equal(as.vector(rec_counts), c(59, 141))) && identical(names(rec_counts), c("No", "Yes"))`,
        failMessage: "Use `rec_counts <- table(survey$recommend)`.",
      },
      {
        name: "Two charts were drawn",
        check: `.plots >= 2`,
        failMessage: "Draw both charts: `barplot(rec_counts)` and the `boxplot()`.",
      },
      {
        name: "`b` is a box plot of hours_online by recommend",
        check: `is.list(b) && identical(b$names, c("No", "Yes")) && isTRUE(all.equal(b$stats[3, ], c(3.4, 3.65)))`,
        failMessage: "Store the box plot in `b` and use the formula `hours_online ~ recommend` with `data = survey`.",
      },
    ],
  },
  {
    id: "m6-gg-scatter",
    title: "Age and blood pressure with ggplot2",
    difficulty: "easy",
    module: 6,
    lesson: "ggplot2-introduction",
    concepts: ["ggplot-grammar", "geoms"],
    datasets: ["patients"],
    packages: ["ggplot2"],
    prompt: `Does blood pressure go up with age? Make a scatter plot with ggplot2.

1. Load ggplot2 and import \`data/patients.csv\` into \`patients\`.
2. Create a plot \`p\` with \`age\` on the x-axis and \`systolic_bp\` on the y-axis, drawn as points.
3. Print \`p\` so the chart appears.`,
    starterCode: `library(ggplot2)
patients <- read.csv("data/patients.csv")

# Create the scatter plot and store it in p
p <- ggplot(patients)

# Print p
`,
    expected: "A scatter plot of 150 points appears, with age on the x-axis and systolic blood pressure on the y-axis.",
    hints: [
      "The mapping goes inside `aes()`: `ggplot(patients, aes(x = age, y = systolic_bp))`.",
      "Add the points layer with `+ geom_point()`.",
      "`p <- ggplot(patients, aes(x = age, y = systolic_bp)) + geom_point()` and then `p` on its own line.",
    ],
    solution: `library(ggplot2)
patients <- read.csv("data/patients.csv")

p <- ggplot(patients, aes(x = age, y = systolic_bp)) +
  geom_point()

p`,
    explanation: `- \`ggplot(patients, aes(x = age, y = systolic_bp))\` sets the data and maps age to the x-axis and blood pressure to the y-axis.
- \`+ geom_point()\` adds the layer that draws one point per patient.
- Storing the plot in \`p\` draws nothing; typing \`p\` prints it.

The points drift upwards from left to right: older patients tend to have higher systolic blood pressure, although the spread is large at every age.`,
    tests: [
      {
        name: "`p` is a ggplot with a point layer",
        check: `.has_geom(p, "GeomPoint")`,
        failMessage: "Add `+ geom_point()` to your `ggplot()` call and store the result in `p`.",
      },
      {
        name: "age is on the x-axis and systolic_bp on the y-axis",
        check: `identical(.gg_label(p, "x"), "age") && identical(.gg_label(p, "y"), "systolic_bp")`,
        failMessage: "Map the columns inside `aes()`: `aes(x = age, y = systolic_bp)`.",
      },
      {
        name: "The plot is printed",
        check: `.plots > 0`,
        failMessage: "Type `p` on its own line to draw the plot.",
      },
    ],
  },
  {
    id: "m6-gg-geoms",
    title: "Reading scores: two geoms",
    difficulty: "medium",
    module: 6,
    lesson: "ggplot2-introduction",
    concepts: ["geoms", "bar-geoms"],
    datasets: ["students"],
    packages: ["ggplot2"],
    prompt: `Explore the reading scores in \`data/students.csv\` with two ggplot2 charts:

1. \`p_hist\`: a **histogram** of \`reading\` with a bin width of 5.
2. \`p_box\`: a **box plot** of \`reading\` for each \`gender\` (gender on the x-axis).
3. \`p_count\`: a **bar chart** that counts the students in each \`class\`.

Print all three plots.`,
    starterCode: `library(ggplot2)
students <- read.csv("data/students.csv")

# 1. Histogram of reading (binwidth = 5)


# 2. Box plot of reading by gender


# 3. Bar chart: number of students per class


# Print the three plots
`,
    expected: "Three charts are drawn: a histogram, two boxes (Female, Male) and three bars (A, B, C).",
    hints: [
      "Each plot is `ggplot(students, aes(...)) + geom_...()`. A histogram needs only `x = reading`.",
      "Box plot: `aes(x = gender, y = reading)` with `geom_boxplot()`. Counting bars: `aes(x = class)` with `geom_bar()`.",
      "`p_hist <- ggplot(students, aes(x = reading)) + geom_histogram(binwidth = 5)` – then build the other two the same way and print each one on its own line.",
    ],
    solution: `library(ggplot2)
students <- read.csv("data/students.csv")

p_hist <- ggplot(students, aes(x = reading)) +
  geom_histogram(binwidth = 5, fill = "steelblue", colour = "white")

p_box <- ggplot(students, aes(x = gender, y = reading)) +
  geom_boxplot()

p_count <- ggplot(students, aes(x = class)) +
  geom_bar()

p_hist
p_box
p_count`,
    explanation: `- The **histogram** maps only \`x = reading\`; \`geom_histogram(binwidth = 5)\` counts the scores in 5-point bins.
- The **box plot** puts the groups on the x-axis and the numbers on the y-axis: \`aes(x = gender, y = reading)\` with \`geom_boxplot()\`.
- The **bar chart** maps \`x = class\` and lets \`geom_bar()\` count the rows: 18, 22 and 20 students. (\`geom_col()\` would need a column with the heights.)
- Each plot is stored in its own variable and printed by typing its name.`,
    tests: [
      {
        name: "`p_hist` is a histogram of reading",
        check: `.has_geom(p_hist, "GeomBar") && identical(.gg_label(p_hist, "x"), "reading") && grepl("geom_histogram", .code, fixed = TRUE)`,
        failMessage: "Build `p_hist` with `aes(x = reading)` and `geom_histogram(binwidth = 5)`.",
      },
      {
        name: "`p_box` is a box plot of reading by gender",
        check: `.has_geom(p_box, "GeomBoxplot") && identical(.gg_label(p_box, "x"), "gender") && identical(.gg_label(p_box, "y"), "reading")`,
        failMessage: "Use `aes(x = gender, y = reading)` with `geom_boxplot()` for `p_box`.",
      },
      {
        name: "`p_count` counts the students per class",
        check: `.has_geom(p_count, "GeomBar") && identical(.gg_label(p_count, "x"), "class")`,
        failMessage: "Use `aes(x = class)` with `geom_bar()` for `p_count`.",
      },
      {
        name: "All three plots are printed",
        check: `.plots >= 3`,
        failMessage: "Print each plot by writing its name on its own line.",
      },
    ],
  },
  {
    id: "m6-polish-plot",
    title: "Polish a histogram",
    difficulty: "medium",
    module: 6,
    lesson: "chart-styling-and-choosing",
    concepts: ["plot-labels", "themes", "colour-mapping"],
    datasets: ["students"],
    packages: ["ggplot2"],
    prompt: `The starter code draws a plain histogram of math scores. Turn it into a chart you could put in a school report:

1. Make the bars \`"steelblue"\` with \`"white"\` outlines (fixed colours).
2. Add the title **Math scores of 60 students**, the x-axis label **Math score** and the y-axis label **Number of students** with \`labs()\`.
3. Use \`theme_minimal()\`.
4. Print \`p\`.`,
    starterCode: `library(ggplot2)
students <- read.csv("data/students.csv")

p <- ggplot(students, aes(x = math)) +
  geom_histogram(binwidth = 5)

# Add colours, labs() and theme_minimal(), then print p
`,
    expected: "A blue histogram with white bar outlines, the title *Math scores of 60 students*, readable axis labels and a white minimal background.",
    hints: [
      "Fixed colours go inside the geom, outside `aes()`: `geom_histogram(binwidth = 5, fill = \"steelblue\", colour = \"white\")`.",
      "Add `+ labs(title = \"...\", x = \"...\", y = \"...\")` and then `+ theme_minimal()`.",
      "Do not forget to print the plot: write `p` on the last line.",
    ],
    solution: `library(ggplot2)
students <- read.csv("data/students.csv")

p <- ggplot(students, aes(x = math)) +
  geom_histogram(binwidth = 5, fill = "steelblue", colour = "white") +
  labs(title = "Math scores of 60 students",
       x = "Math score",
       y = "Number of students") +
  theme_minimal()

p`,
    explanation: `- \`fill = "steelblue"\` colours the inside of the bars and \`colour = "white"\` their outlines. Both are **fixed** settings, so they go outside \`aes()\` and no legend appears.
- \`labs()\` replaces the default labels (\`math\` and \`count\`) with words a reader understands, and adds a title.
- \`theme_minimal()\` removes the grey background for a cleaner look.
- Each part is a layer joined with \`+\`; \`p\` on the last line draws the result.`,
    tests: [
      {
        name: "`p` is still a histogram",
        check: `.has_geom(p, "GeomBar") && grepl("geom_histogram", .code, fixed = TRUE)`,
        failMessage: "Keep `geom_histogram()` in your plot `p`.",
      },
      {
        name: "Bars are steelblue with white outlines",
        check: `grepl("steelblue", .code, fixed = TRUE) && grepl("white", .code, fixed = TRUE)`,
        failMessage: "Add `fill = \"steelblue\", colour = \"white\"` inside `geom_histogram()`.",
      },
      {
        name: "The title is \"Math scores of 60 students\"",
        check: `identical(.gg_label(p, "title"), "Math scores of 60 students")`,
        failMessage: "Add `labs(title = \"Math scores of 60 students\")` – check the spelling.",
      },
      {
        name: "The axes are labelled \"Math score\" and \"Number of students\"",
        check: `identical(.gg_label(p, "x"), "Math score") && identical(.gg_label(p, "y"), "Number of students")`,
        failMessage: "In `labs()`, set `x = \"Math score\"` and `y = \"Number of students\"`.",
      },
      {
        name: "theme_minimal() is used and the plot is printed",
        check: `grepl("theme_minimal", .code, fixed = TRUE) && .plots > 0`,
        failMessage: "Add `+ theme_minimal()` and print `p` on the last line.",
      },
    ],
  },
  {
    id: "m6-choose-chart",
    title: "Choose the chart: diabetes and blood pressure",
    difficulty: "challenge",
    module: 6,
    lesson: "chart-styling-and-choosing",
    concepts: ["choosing-charts", "colour-mapping", "plot-labels", "geoms"],
    datasets: ["patients"],
    packages: ["ggplot2", "dplyr"],
    prompt: `The clinic asks: **"Do patients with diabetes have higher systolic blood pressure than patients without diabetes?"**

1. Think about the variable types (\`diabetes\` is Yes/No, \`systolic_bp\` is a number) and choose a suitable chart. Create it with ggplot2 as \`p\`: \`diabetes\` on the x-axis, \`systolic_bp\` on the y-axis, and the **fill** colour mapped to \`diabetes\`.
2. Give it a title and readable axis labels with \`labs()\`, and use a complete theme of your choice.
3. Back the chart up with numbers: use dplyr to create \`bp_medians\`, a plain data frame with one row per \`diabetes\` group and a column \`median_bp\` (the median systolic blood pressure).
4. Print \`p\` and \`bp_medians\`.`,
    starterCode: `library(ggplot2)
library(dplyr)
patients <- read.csv("data/patients.csv")

# 1-2. The chart, with labels and a theme


# 3. Median blood pressure per group


# 4. Print both
`,
    expected: "A box plot with two coloured boxes (No, Yes), a title and axis labels; `bp_medians` shows a median of 137 for No and 142.5 for Yes.",
    hints: [
      "One numeric variable compared between groups is a job for side-by-side **box plots**: `geom_boxplot()`.",
      "`ggplot(patients, aes(x = diabetes, y = systolic_bp, fill = diabetes)) + geom_boxplot() + labs(title = ..., x = ..., y = ...) + theme_minimal()`.",
      "`bp_medians <- patients |> group_by(diabetes) |> summarise(median_bp = median(systolic_bp)) |> as.data.frame()`.",
    ],
    solution: `library(ggplot2)
library(dplyr)
patients <- read.csv("data/patients.csv")

p <- ggplot(patients, aes(x = diabetes, y = systolic_bp, fill = diabetes)) +
  geom_boxplot() +
  labs(title = "Patients with diabetes have slightly higher blood pressure",
       x = "Diabetes", y = "Systolic blood pressure (mmHg)") +
  theme_minimal() +
  theme(legend.position = "none")

bp_medians <- patients |>
  group_by(diabetes) |>
  summarise(median_bp = median(systolic_bp)) |>
  as.data.frame()

p
bp_medians`,
    explanation: `- **Choosing the chart:** the question compares a numeric variable (\`systolic_bp\`) between the groups of a categorical variable (\`diabetes\`). That is exactly what side-by-side box plots show. A histogram would mix both groups, and a bar chart of counts would not show blood pressure at all.
- \`fill = diabetes\` inside \`aes()\` gives each group its own colour. The legend would only repeat the x-axis, so \`theme(legend.position = "none")\` hides it (optional).
- \`labs()\` adds a title that states the finding and axis labels with units; \`theme_minimal()\` cleans up the background.
- The dplyr pipeline groups the patients by \`diabetes\` and takes the median of each group: 137 mmHg without diabetes and 142.5 mmHg with diabetes. The boxes overlap a lot, so the difference is modest – the statistics module will show you how to test whether it is more than chance.`,
    tests: [
      {
        name: "`p` is a box plot",
        check: `.has_geom(p, "GeomBoxplot")`,
        failMessage: "A number compared between groups calls for a box plot – use `geom_boxplot()`.",
      },
      {
        name: "diabetes is on the x-axis and systolic_bp on the y-axis",
        check: `{ d <- ggplot2::ggplot_build(p)$data[[1]]; isTRUE(all.equal(sort(d$middle), c(137, 142.5))) }`,
        failMessage: "Map `x = diabetes` and `y = systolic_bp` inside `aes()`.",
      },
      {
        name: "The fill colour is mapped to diabetes",
        check: `{ d <- ggplot2::ggplot_build(p)$data[[1]]; length(unique(d$fill)) == 2 }`,
        failMessage: "Put `fill = diabetes` **inside** `aes()` so each group gets its own colour.",
      },
      {
        name: "The chart has a title and a readable y-axis label",
        check: `{ t <- .gg_label(p, "title"); y <- .gg_label(p, "y"); is.character(t) && nzchar(t) && is.character(y) && !identical(y, "systolic_bp") }`,
        failMessage: "Add `labs(title = \"...\", x = \"...\", y = \"...\")` with words instead of column names.",
      },
      {
        name: "A complete theme is used",
        check: `grepl("theme_[a-z]+[(]", .code)`,
        failMessage: "Add a complete theme such as `+ theme_minimal()` or `+ theme_classic()`.",
      },
      {
        name: "`bp_medians` holds the median blood pressure per group",
        check: `is.data.frame(bp_medians) && nrow(bp_medians) == 2 && isTRUE(all.equal(sort(bp_medians$median_bp), c(137, 142.5)))`,
        failMessage: "Use `group_by(diabetes)` and `summarise(median_bp = median(systolic_bp))`, then `as.data.frame()`.",
      },
      {
        name: "The plot is drawn",
        check: `.plots > 0`,
        failMessage: "Print `p` on its own line.",
      },
    ],
  },
];
