import type { Lesson } from "../../types";

export const chartStylingAndChoosingLesson: Lesson = {
  id: "chart-styling-and-choosing",
  module: 6,
  title: "Labels, Colours, Themes and Choosing the Right Chart",
  summary: "Polish ggplot2 charts with labs(), colour and fill, and themes – and learn which chart answers which kind of question.",
  minutes: 40,
  objectives: [
    "Add a title, subtitle, axis labels, legend title and caption with `labs()`",
    "Tell the difference between mapping colour to a column (inside `aes()`) and setting a fixed colour (outside `aes()`)",
    "Use `fill` for the inside of bars and boxes and `colour` for points, lines and outlines",
    "Change the overall look of a chart with themes such as `theme_minimal()` and adjust details with `theme()`",
    "Choose a suitable chart for a question based on the types of variables involved",
  ],
  intro: `A chart is a message to someone else – your teacher, your boss, your readers, or yourself in three months. The default ggplot2 chart is correct, but its axis labels are column names like \`systolic_bp\`, it has no title, and its grey background is not to everyone's taste.

In this lesson you learn to **polish** charts: clear titles and labels, colours that carry meaning, and a clean theme. Just as important, you learn to **choose** the right kind of chart. A beautiful chart of the wrong type still confuses people, so the second half of the lesson gives you a simple decision guide: start from your question and the type of your variables, and the chart almost chooses itself.`,
  sections: [
    {
      id: "labs",
      title: "Titles and labels with labs()",
      blocks: [
        {
          kind: "code",
          example: {
            id: "labs-example",
            title: "Give the chart a title and readable labels",
            code: `library(ggplot2)
patients <- read.csv("data/patients.csv")

ggplot(patients, aes(x = age, y = systolic_bp)) +
  geom_point() +
  labs(title = "Blood pressure rises with age",
       subtitle = "150 patients of a fictional clinic",
       x = "Age (years)",
       y = "Systolic blood pressure (mmHg)",
       caption = "Data: patients.csv")`,
            explanation: [
              { code: "labs(...)", text: "`labs()` (*labels*) is one more layer, added with `+`. Every argument is optional." },
              { code: `title = "Blood pressure rises with age"`, text: "The main title. A good title states the **finding**, not just the variables." },
              { code: "subtitle = ...", text: "A smaller line under the title for extra context." },
              { code: "x = ..., y = ...", text: "Axis labels in plain words, **with units** in brackets." },
              { code: "caption = ...", text: "Small text in the bottom-right corner, often used for the data source." },
            ],
            plot: true,
            outputNote: "The same scatter plot as before, but now a reader understands it without knowing the column names.",
            tryIt: "Rewrite the title as a question: *\"Does blood pressure rise with age?\"*. Which version do you prefer?",
          },
        },
        {
          kind: "callout",
          tone: "tip",
          title: "labs() also names legends",
          md: "If a column is mapped to `colour` or `fill`, its legend title is the column name. Rename it in `labs()` with the aesthetic's name: `labs(colour = \"Smoker\")` or `labs(fill = \"Class\")`.",
        },
      ],
    },
    {
      id: "mapped-vs-fixed",
      title: "Colour: mapped to data, or fixed?",
      blocks: [
        {
          kind: "text",
          md: "There are two very different ways to use colour in ggplot2:\n\n- **Mapped** – *inside* `aes()`: `aes(colour = smoker)`. The colour **shows a variable**: each group gets its own colour and a legend explains them.\n- **Fixed** – *outside* `aes()`, in the geom: `geom_point(colour = \"steelblue\")`. Every point gets the **same** colour; it is just decoration, so there is no legend.",
        },
        {
          kind: "code",
          example: {
            id: "colour-mapped",
            title: "Mapped colour: one colour per group",
            code: `library(ggplot2)
patients <- read.csv("data/patients.csv")

ggplot(patients, aes(x = age, y = systolic_bp, colour = smoker)) +
  geom_point() +
  labs(x = "Age (years)", y = "Systolic blood pressure (mmHg)",
       colour = "Smoker")`,
            explanation: [
              { code: "colour = smoker", text: "Inside `aes()`: the `smoker` column decides each point's colour. ggplot2 picks one colour for `No` and one for `Yes`." },
              { code: `colour = "Smoker"`, text: "Inside `labs()`: renames the legend title from `smoker` to `Smoker`." },
            ],
            plot: true,
            outputNote: "Two colours and a legend. The smokers' points tend to lie a little higher at the same age – a third variable added to a two-variable chart.",
          },
        },
        {
          kind: "code",
          example: {
            id: "colour-fixed",
            title: "Fixed colour: the same for every point",
            code: `library(ggplot2)
patients <- read.csv("data/patients.csv")

ggplot(patients, aes(x = age, y = systolic_bp)) +
  geom_point(colour = "steelblue", size = 2, alpha = 0.6)`,
            explanation: [
              { code: `geom_point(colour = "steelblue", size = 2, alpha = 0.6)`, text: "Outside `aes()`, inside the geom: fixed settings for all points – a colour name, a size and a transparency (`alpha` from 0 to 1)." },
            ],
            plot: true,
            outputNote: "All points are steel blue, slightly larger and partly see-through, so overlapping points look darker. There is no legend, because the colour does not represent any data.",
          },
        },
        {
          kind: "table",
          caption: "colour or fill?",
          headers: ["Aesthetic", "Colours…", "Typical geoms"],
          rows: [
            ["`colour`", "points, lines and the **outline** of shapes", "`geom_point()`, `geom_line()`, outlines of bars and boxes"],
            ["`fill`", "the **inside** of shapes", "`geom_bar()`, `geom_col()`, `geom_histogram()`, `geom_boxplot()`"],
          ],
        },
        {
          kind: "code",
          example: {
            id: "fill-mapped",
            title: "Mapped fill in bars and boxes",
            code: `library(ggplot2)
survey <- read.csv("data/survey.csv")
table(survey$region, survey$recommend)

ggplot(survey, aes(x = region, fill = recommend)) +
  geom_bar(position = "dodge") +
  labs(x = "Region", y = "Number of users", fill = "Would recommend")`,
            explanation: [
              { code: "table(survey$region, survey$recommend)", text: "The counts behind the chart, as a two-way table." },
              { code: "aes(x = region, fill = recommend)", text: "Regions on the x-axis; the `recommend` answer decides the **fill** colour of the bars." },
              { code: `geom_bar(position = "dodge")`, text: "`geom_bar()` counts the rows for every region-and-answer combination. `position = \"dodge\"` puts the No and Yes bars side by side; without it they would be stacked on top of each other." },
            ],
            output: `
        No Yes
  East  16  31
  North 12  35
  South 19  34
  West  12  41`,
            plot: true,
            outputNote: "In every region more users would recommend the app than not. The West has the most *Yes* answers (41), the South the most *No* answers (19).",
            tryIt: "Remove `position = \"dodge\"` to see the stacked version. Which makes it easier to compare the No bars?",
          },
        },
      ],
    },
    {
      id: "themes",
      title: "Themes: changing the whole look",
      blocks: [
        {
          kind: "text",
          md: "A **theme** controls everything that is not data: the background, grid lines, fonts and the legend position. ggplot2 comes with several complete themes, and `theme()` adjusts single details.",
        },
        {
          kind: "table",
          headers: ["Theme", "Look"],
          rows: [
            ["`theme_grey()`", "the default: grey background, white grid lines"],
            ["`theme_minimal()`", "no background, light grid lines – clean and modern"],
            ["`theme_classic()`", "axis lines, no grid – like a textbook chart"],
            ["`theme_bw()`", "white background with a black frame and grid"],
            ["`theme_light()`", "like `theme_bw()` with lighter lines"],
          ],
        },
        {
          kind: "code",
          example: {
            id: "theme-minimal",
            title: "A complete theme plus a detail",
            code: `library(ggplot2)
students <- read.csv("data/students.csv")

ggplot(students, aes(x = class, y = math, fill = class)) +
  geom_boxplot() +
  labs(title = "Math scores by class", x = "Class", y = "Math score") +
  theme_minimal(base_size = 14) +
  theme(legend.position = "none")`,
            explanation: [
              { code: "fill = class", text: "Each class's box gets its own fill colour." },
              { code: "theme_minimal(base_size = 14)", text: "Switches to the minimal theme. `base_size` sets the font size (the default is 11), which helps on slides." },
              { code: `theme(legend.position = "none")`, text: "Fine-tunes one detail: hides the legend. It is not needed here, because the x-axis already names the classes. Other options are `\"bottom\"`, `\"top\"`, `\"left\"` and `\"right\"`." },
            ],
            plot: true,
            outputNote: "Coloured boxes on a white background with larger text and no legend. `theme()` must come **after** the complete theme – a complete theme resets all details.",
            tryIt: "Replace `theme_minimal()` with `theme_classic()` or `theme_bw()`.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m6-style-q-inline1",
            type: "multiple-choice",
            prompt: "You want **all** bars of a histogram to be dark green. Which code is right?",
            options: [
              "`geom_histogram(aes(fill = \"darkgreen\"), binwidth = 5)`",
              "`geom_histogram(fill = \"darkgreen\", binwidth = 5)`",
              "`geom_histogram(colour = \"darkgreen\", binwidth = 5)`",
              "`geom_histogram(binwidth = 5) + theme_minimal(\"darkgreen\")`",
            ],
            answer: 1,
            optionFeedback: [
              "Inside `aes()`, `\"darkgreen\"` is treated as a data value – the bars get ggplot2's first default colour (a pinkish red) and a legend reading *darkgreen*.",
              "Correct – a fixed fill colour outside `aes()`.",
              "`colour` only changes the outline of the bars.",
              "Themes do not colour the data.",
            ],
            explanation: "A fixed colour goes **outside** `aes()`, and for the inside of bars you need `fill` rather than `colour`.",
            concept: "colour-mapping",
          },
        },
      ],
    },
    {
      id: "choosing",
      title: "Choosing the right chart",
      blocks: [
        {
          kind: "text",
          md: "Start every chart with two questions: **What do I want to show?** and **What type are my variables?** Then look up the chart:",
        },
        {
          kind: "table",
          caption: "Which chart for which question",
          headers: ["Your question", "Variables", "Chart", "Base R", "ggplot2"],
          rows: [
            ["How are the values of one number column spread?", "1 numeric", "Histogram (or box plot)", "`hist(x)`", "`geom_histogram()`"],
            ["How many observations are in each category?", "1 categorical", "Bar chart", "`barplot(table(x))`", "`geom_bar()`"],
            ["Do the groups differ in a number?", "1 numeric + 1 categorical", "Box plot (side by side)", "`boxplot(y ~ g)`", "`geom_boxplot()`"],
            ["Are two number columns related?", "2 numeric", "Scatter plot", "`plot(x, y)`", "`geom_point()`"],
            ["How does a value change over time?", "time + numeric", "Line chart", "`plot(x, type = \"l\")`", "`geom_line()`"],
            ["How do two categorical variables combine?", "2 categorical", "Grouped bar chart", "`barplot(table(a, b), beside = TRUE)`", "`geom_bar(aes(fill = b), position = \"dodge\")`"],
            ["Compare a few totals or averages you calculated", "category + value", "Bar chart of values", "`barplot(values)`", "`geom_col()`"],
          ],
        },
        {
          kind: "diagram",
          name: "histogram-vs-bar",
          caption: "Histogram vs bar chart: a histogram's touching bars cover a number line; a bar chart's separate bars are categories.",
        },
        {
          kind: "text",
          md: "The pair that is confused most often is the **histogram** and the **bar chart**. Both have bars, but:\n\n- A **histogram** is for a **numeric** variable. The x-axis is a number line cut into bins, the bars touch, and their order is fixed by the numbers.\n- A **bar chart** is for a **categorical** variable. Each bar is a separate category, there are gaps between bars, and you may reorder the bars (for example from largest to smallest).",
        },
        {
          kind: "code",
          example: {
            id: "same-data-two-questions",
            title: "Same dataset, different questions, different charts",
            code: `library(ggplot2)
patients <- read.csv("data/patients.csv")

# How old are the patients?  -> one numeric variable -> histogram
ggplot(patients, aes(x = age)) +
  geom_histogram(binwidth = 5, fill = "steelblue", colour = "white") +
  labs(title = "Age of patients", x = "Age (years)", y = "Patients")

# How many smoke? -> one categorical variable -> bar chart
ggplot(patients, aes(x = smoker)) +
  geom_bar(fill = "tomato") +
  labs(title = "Smokers and non-smokers", x = "Smoker", y = "Patients")`,
            explanation: [
              { code: "# How old are the patients? ...", text: "A comment states the question and the reasoning – a good habit." },
              { code: "aes(x = age) + geom_histogram(...)", text: "Age is numeric, so its distribution needs a histogram." },
              { code: "aes(x = smoker) + geom_bar(...)", text: "`smoker` is categorical (Yes/No), so we count it with a bar chart." },
            ],
            plot: true,
            outputNote: "Two charts are drawn (the Plots tab lets you flip between them). The histogram shows ages from 25 to 80, with more older patients; the bar chart shows 119 non-smokers and 31 smokers.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m6-style-q-inline2",
            type: "multiple-choice",
            prompt: "A shop wants to know whether customers who spend more time on the website also spend more money. Both are numbers. Which chart fits best?",
            options: ["A bar chart", "A histogram", "A scatter plot", "A box plot"],
            answer: 2,
            optionFeedback: [
              "Bar charts compare categories.",
              "A histogram shows one variable at a time.",
              "Correct – a scatter plot shows the relationship between two numeric variables.",
              "A box plot compares a number across categories.",
            ],
            explanation: "Two numeric variables and a question about their relationship: put one on each axis in a scatter plot and look for a trend.",
            concept: "choosing-charts",
          },
        },
      ],
    },
    {
      id: "good-habits",
      title: "Habits of clear charts",
      blocks: [
        {
          kind: "steps",
          title: "Before you share a chart, check that…",
          items: [
            "it answers **one** clear question – and the title says what the answer is;",
            "both axes have readable labels with **units**;",
            "colour carries meaning (a variable) or is calm decoration – not a rainbow for its own sake;",
            "bar charts start at zero (ggplot2 does this automatically), so bar lengths can be compared fairly;",
            "categories are in a sensible order (largest first, or a natural order like ratings 1–5);",
            "the chart type matches the variable types (see the table above).",
          ],
        },
        {
          kind: "code",
          example: {
            id: "polished-chart",
            title: "Putting it all together",
            code: `library(ggplot2)
students <- read.csv("data/students.csv")

ggplot(students, aes(x = study_hours, y = math, colour = class)) +
  geom_point(size = 2.5) +
  labs(title = "More study time, higher math scores",
       subtitle = "Each point is one student",
       x = "Study hours per week", y = "Math score (0-100)",
       colour = "Class") +
  theme_minimal() +
  theme(legend.position = "bottom")`,
            explanation: [
              { code: "aes(x = study_hours, y = math, colour = class)", text: "Two numeric variables on the axes (scatter plot) and a categorical variable mapped to colour." },
              { code: "geom_point(size = 2.5)", text: "A fixed point size, a bit larger than the default." },
              { code: "labs(...)", text: "A title that states the finding, a subtitle, axis labels with units and a legend title." },
              { code: "theme_minimal() + theme(legend.position = \"bottom\")", text: "A clean theme, with the legend moved below the chart to leave more room for the data." },
            ],
            plot: true,
            outputNote: "A chart ready for a report: the message is in the title, the axes explain themselves and the colours show the classes.",
            tryIt: "Map `colour = gender` instead of `class` and update the legend title.",
          },
        },
        {
          kind: "callout",
          tone: "note",
          title: "Colour-blind friendly colours",
          md: "About 1 in 12 men has some form of colour blindness, most often difficulty telling red from green. Avoid using only red vs green to separate groups. ggplot2's default palette is a reasonable start; `scale_colour_viridis_d()` (for colour) and `scale_fill_viridis_d()` (for fill) give palettes that work for most readers.",
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Putting a fixed colour inside aes()",
      wrong: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = study_hours, y = math)) +
  geom_point(aes(colour = "blue"))`,
      why: "Inside `aes()`, `\"blue\"` is treated as a data value, as if there were a column whose every value is the word *blue*. ggplot2 gives that single group its first default colour (a reddish pink, not blue!) and adds a legend saying *blue*. Fixed colours go outside `aes()`.",
      right: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = study_hours, y = math)) +
  geom_point(colour = "blue")`,
    },
    {
      title: "Using colour when you mean fill",
      wrong: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = class)) +
  geom_bar(colour = "steelblue")`,
      why: "For bars and boxes, `colour` only paints the thin outline – the bars stay grey. Use `fill` for the inside.",
      right: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = class)) +
  geom_bar(fill = "steelblue")`,
    },
    {
      title: "A histogram of a categorical variable",
      wrong: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = gender)) +
  geom_histogram(binwidth = 1)`,
      error: "requires a continuous x aesthetic",
      why: "A histogram cuts a **number line** into bins, so it needs a numeric (\"continuous\") variable. `gender` is categorical (\"discrete\"). To count categories, use `geom_bar()`.",
      right: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = gender)) +
  geom_bar()`,
    },
    {
      title: "Adding theme() before a complete theme",
      wrong: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = study_hours, y = math, colour = class)) +
  geom_point() +
  theme(legend.position = "bottom") +
  theme_minimal()`,
      why: "Layers are applied in order. `theme_minimal()` is a complete theme that resets every setting, so it undoes the `legend.position` you set before it – the legend is back on the right. Put `theme()` tweaks after the complete theme.",
      right: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = study_hours, y = math, colour = class)) +
  geom_point() +
  theme_minimal() +
  theme(legend.position = "bottom")`,
    },
  ],
  exerciseIds: ["m6-polish-plot", "m6-choose-chart"],
  quiz: [
    {
      id: "m6-style-q1",
      type: "fill-blank",
      prompt: "Complete the code so the chart gets the title *Math scores by class*.",
      code: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = class, y = math)) +
  geom_boxplot() +
  labs(___ = "Math scores by class")`,
      accept: ["title"],
      hint: "Which `labs()` argument sets the main heading?",
      explanation: "`labs(title = ...)` sets the title. `labs()` also takes `subtitle`, `x`, `y`, `caption` and legend titles such as `fill`.",
      concept: "plot-labels",
    },
    {
      id: "m6-style-q2",
      type: "multiple-choice",
      prompt: "What is the difference between `aes(colour = smoker)` and `geom_point(colour = \"red\")`?",
      options: [
        "There is no difference",
        "The first gives each smoker group its own colour (with a legend); the second makes every point red",
        "The first makes every point red; the second colours by group",
        "The first only works in base R",
      ],
      answer: 1,
      optionFeedback: [
        "Inside vs outside `aes()` makes all the difference.",
        "Correct – mapped colour shows data; fixed colour is decoration.",
        "It is the other way round.",
        "`aes()` is a ggplot2 function.",
      ],
      explanation: "Inside `aes()`, colour is **mapped** to a column and varies with the data. Outside `aes()`, it is a **fixed** setting for all points.",
      concept: "colour-mapping",
    },
    {
      id: "m6-style-q3",
      type: "true-false",
      prompt: "To colour the inside of the bars in `geom_bar()`, you use `fill`, not `colour`.",
      answer: true,
      explanation: "`fill` colours the inside of shapes (bars, boxes, histogram bins); `colour` colours points, lines and outlines.",
      concept: "colour-mapping",
    },
    {
      id: "m6-style-q4",
      type: "find-error",
      prompt: "This code should show how many male and female students there are, but it stops with an error. Which line is wrong?",
      code: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = gender)) +
  geom_histogram(binwidth = 1)`,
      errorLine: 4,
      errorKind: "error",
      fix: `library(ggplot2)
students <- read.csv("data/students.csv")
ggplot(students, aes(x = gender)) +
  geom_bar()`,
      explanation: "`gender` is categorical, and a histogram needs a numeric variable (*requires a continuous x aesthetic*). Counting categories is the job of a bar chart: `geom_bar()`.",
      concept: "choosing-charts",
    },
    {
      id: "m6-style-q5",
      type: "multiple-choice",
      prompt: "Which chart best shows whether house prices differ between four neighbourhoods?",
      options: [
        "A histogram of prices",
        "Side-by-side box plots of price for each neighbourhood",
        "A scatter plot of neighbourhood against price",
        "A line chart of prices",
      ],
      answer: 1,
      optionFeedback: [
        "One histogram mixes all neighbourhoods together.",
        "Correct – one numeric variable compared across a categorical one.",
        "With a categorical x-axis, points pile up in columns; box plots summarise each group more clearly.",
        "Line charts are for change over time.",
      ],
      explanation: "Price is numeric and neighbourhood is categorical. Comparing a number across groups is exactly what side-by-side box plots (`boxplot(price ~ neighborhood)` or `geom_boxplot()`) are for.",
      concept: "choosing-charts",
    },
    {
      id: "m6-style-q6",
      type: "multiple-choice",
      prompt: "You wrote `+ theme(legend.position = \"bottom\") + theme_minimal()` but the legend is still on the right. Why?",
      options: [
        "`legend.position` only accepts `\"left\"` and `\"right\"`",
        "`theme_minimal()` comes later and resets all theme settings, including the legend position",
        "Legends can only be moved in base R",
        "The plot has no legend",
      ],
      answer: 1,
      optionFeedback: [
        "`\"bottom\"` and `\"top\"` are valid too.",
        "Correct – put the `theme()` tweak after the complete theme.",
        "`theme(legend.position = ...)` is the ggplot2 way to move legends.",
        "The legend is visible – it is just on the right.",
      ],
      explanation: "Complete themes like `theme_minimal()` set every theme element. Added after your `theme()` call, they overwrite it. Order: complete theme first, then `theme()` tweaks.",
      concept: "themes",
    },
  ],
  keyPoints: [
    "`labs()` sets the title, subtitle, axis labels, caption and legend titles – a good title states the finding, good axis labels include units.",
    "Inside `aes()`, colour/fill is mapped to a column and gets a legend; outside `aes()`, it is a fixed colour for everything.",
    "`fill` colours the inside of bars and boxes; `colour` colours points, lines and outlines.",
    "Complete themes (`theme_minimal()`, `theme_classic()`, `theme_bw()`) change the whole look; `theme()` adjusts details and must come after them.",
    "Choose by question and variable type: histogram for one numeric, bar chart for categories, box plot for numeric by group, scatter plot for two numeric, line chart for time.",
    "Histograms (numeric, touching bars) and bar charts (categories, separate bars) are not interchangeable.",
  ],
  concepts: ["plot-labels", "colour-mapping", "themes", "choosing-charts"],
  glossary: ["aesthetic", "histogram", "bar-chart", "categorical-variable", "numeric-variable", "eda"],
  datasets: ["patients", "survey", "students"],
  packages: ["ggplot2"],
  prerequisites: ["ggplot2-introduction"],
  playground: `library(ggplot2)

students <- read.csv("data/students.csv")

ggplot(students, aes(x = class, y = math, fill = class)) +
  geom_boxplot() +
  labs(title = "Math scores by class", x = "Class", y = "Math score") +
  theme_minimal()`,
};
