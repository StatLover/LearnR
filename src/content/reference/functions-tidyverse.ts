import type { RFunction } from "../types";

/**
 * Function reference – "dplyr", "tidyr" and "ggplot2".
 * Examples call library() themselves. dplyr verbs on a data.frame return a
 * data.frame; results that would be tibbles are converted with
 * as.data.frame() so the printout stays the same across package versions.
 */
export const tidyverseFunctions: RFunction[] = [
  /* ---------------------------------------------------------------- */
  /* dplyr                                                            */
  /* ---------------------------------------------------------------- */
  {
    name: "filter",
    package: "dplyr",
    category: "dplyr",
    purpose:
      "Keeps only the rows that meet one or more conditions. Several conditions separated by commas must *all* be true. Column names are used directly, without `df$`.",
    syntax: "filter(.data, ...)",
    args: [
      { name: ".data", description: "A data frame (usually passed in with the pipe `|>`)." },
      { name: "...", description: "Conditions such as `class == \"A\"`, `math > 85`. Use `|` for \"or\"." },
    ],
    example: `library(dplyr)
students <- read.csv("data/students.csv")
students |>
  filter(class == "A", math > 85) |>
  select(name, class, math)`,
    output: "  name class math\n1 Tara     A   88\n2 Lena     A   87\n3 Yara     A   93\n4 Zane     A   94",
    mistakes: [
      "Using `=` instead of `==`: `filter(class = \"A\")` stops with an error telling you to use `==`.",
      "Forgetting quotes around text values: `filter(class == A)` looks for an object called `A`.",
      "Expecting rows with `NA` in the condition to be kept – `filter()` drops them. Add `| is.na(col)` if you want them.",
    ],
    related: ["select", "arrange", "subset", "%in%"],
  },
  {
    name: "select",
    package: "dplyr",
    category: "dplyr",
    purpose:
      "Keeps (or drops) columns by name. A minus sign removes columns, and `first:last` selects a range of neighbouring columns.",
    syntax: "select(.data, ...)",
    args: [
      { name: ".data", description: "A data frame." },
      { name: "...", description: "Column names to keep, `-name` to drop, `a:c` for a range, or helpers like `starts_with(\"temp\")`." },
    ],
    example: `library(dplyr)
mtcars |>
  select(mpg, cyl, hp) |>
  head(3)
mtcars |>
  select(-(mpg:qsec)) |>
  head(2)`,
    output: "               mpg cyl  hp\nMazda RX4     21.0   6 110\nMazda RX4 Wag 21.0   6 110\nDatsun 710    22.8   4  93\n              vs am gear carb\nMazda RX4      0  1    4    4\nMazda RX4 Wag  0  1    4    4",
    mistakes: [
      "Putting column names in a vector of strings and expecting it to drop them with a minus: use `select(-c(a, b))` or `select(-all_of(cols))`.",
      "Confusing `select()` (columns) with `filter()` (rows).",
      "A typo in a name stops with \"Column `nmae` doesn't exist\" – check spelling and capitals with `names()`.",
    ],
    related: ["filter", "rename", "mutate", "names"],
  },
  {
    name: "mutate",
    package: "dplyr",
    category: "dplyr",
    purpose:
      "Adds new columns or changes existing ones, calculated from other columns. Later columns in the same `mutate()` can use the ones created before them.",
    syntax: "mutate(.data, new_col = expression, ...)",
    args: [
      { name: ".data", description: "A data frame." },
      { name: "new_col = expression", description: "The name of the (new or existing) column and how to calculate it." },
    ],
    example: `library(dplyr)
people <- data.frame(name = c("Ana", "Ben"),
                     height_cm = c(165, 180),
                     weight_kg = c(60, 82))
people |>
  mutate(height_m = height_cm / 100,
         bmi = round(weight_kg / height_m^2, 1))`,
    output: "  name height_cm weight_kg height_m  bmi\n1  Ana       165        60     1.65 22.0\n2  Ben       180        82     1.80 25.3",
    mistakes: [
      "Forgetting to save the result: `df |> mutate(...)` only prints. Write `df <- df |> mutate(...)` to keep the new column.",
      "Using `==` instead of `=` to name the new column – `mutate(total == a + b)` creates a strangely named TRUE/FALSE column.",
    ],
    related: ["select", "case_when", "summarise", "ifelse"],
  },
  {
    name: "arrange",
    package: "dplyr",
    category: "dplyr",
    purpose: "Sorts the rows of a data frame by one or more columns – smallest first, or largest first with `desc()`. Extra columns break ties.",
    syntax: "arrange(.data, ...)",
    args: [
      { name: ".data", description: "A data frame." },
      { name: "...", description: "Columns to sort by; wrap one in `desc()` for descending order." },
    ],
    example: `library(dplyr)
people <- data.frame(name = c("Ana", "Ben", "Cleo", "Dev"),
                     age = c(34, 18, 52, 34),
                     score = c(88, 92, 75, 95))
arrange(people, age)
arrange(people, desc(score))
arrange(people, age, desc(score))`,
    output: "  name age score\n1  Ben  18    92\n2  Ana  34    88\n3  Dev  34    95\n4 Cleo  52    75\n  name age score\n1  Dev  34    95\n2  Ben  18    92\n3  Ana  34    88\n4 Cleo  52    75\n  name age score\n1  Ben  18    92\n2  Dev  34    95\n3  Ana  34    88\n4 Cleo  52    75",
    mistakes: [
      "Writing `arrange(df, -name)` for text columns – a minus sign does not work on text. Use `desc(name)`.",
      "Expecting the sort to stick – save the result if you need it later.",
    ],
    related: ["desc", "order", "sort", "filter"],
  },
  {
    name: "desc",
    package: "dplyr",
    category: "dplyr",
    purpose: "Marks a column for descending (largest-first) order inside `arrange()`. Works for numbers, text and dates.",
    syntax: "desc(x)",
    args: [{ name: "x", description: "The column (vector) to sort in descending order." }],
    example: `library(dplyr)
scores <- data.frame(name = c("Ana", "Ben", "Cleo"), points = c(12, 30, 21))
scores |> arrange(desc(points))
scores |> arrange(desc(name))`,
    output: "  name points\n1  Ben     30\n2 Cleo     21\n3  Ana     12\n  name points\n1 Cleo     21\n2  Ben     30\n3  Ana     12",
    mistakes: [
      "Using `desc()` outside `arrange()` and expecting sorting – on its own it only transforms the values for ordering.",
      "Putting a minus sign on a text column (`arrange(df, -name)`) – that fails with \"invalid argument to unary operator\"; `desc(name)` works for every type.",
    ],
    related: ["arrange", "order", "sort"],
  },
  {
    name: "summarise",
    package: "dplyr",
    category: "dplyr",
    purpose:
      "Collapses many rows into one row of summary values (means, counts, maxima, …). After `group_by()` it produces one row per group. `n()` counts rows. The spelling `summarize()` also works.",
    syntax: "summarise(.data, name = summary_function(col), ...)",
    args: [
      { name: ".data", description: "A data frame (or a grouped data frame from `group_by()`)." },
      { name: "name = …", description: "Each new column: a name and a function that returns one value, such as `mean(mpg)` or `n()`." },
    ],
    example: `library(dplyr)
mtcars |>
  summarise(avg_mpg = mean(mpg),
            max_hp = max(hp),
            n_cars = n())`,
    output: "   avg_mpg max_hp n_cars\n1 20.09062    335     32",
    mistakes: [
      "Using a function that returns several values (like `range()`) – each summary should return a single value.",
      "Forgetting `na.rm = TRUE` inside the summary functions when the column has missing values.",
      "Expecting the original rows to remain – `summarise()` replaces them with the summary. Use `mutate()` to add a column instead.",
    ],
    related: ["group_by", "mutate", "count", "aggregate"],
  },
  {
    name: "group_by",
    package: "dplyr",
    category: "dplyr",
    purpose:
      "Splits a data frame into groups so that the next step (usually `summarise()`) works on each group separately – \"split, apply, combine\". The result of a grouped summary is a tibble; `as.data.frame()` prints it as a plain data frame.",
    syntax: "group_by(.data, ...)",
    args: [
      { name: ".data", description: "A data frame." },
      { name: "...", description: "One or more grouping columns, e.g. `cyl` or `class, gender`." },
    ],
    example: `library(dplyr)
mtcars |>
  group_by(cyl) |>
  summarise(avg_mpg = mean(mpg), n_cars = n()) |>
  as.data.frame()`,
    output: "  cyl  avg_mpg n_cars\n1   4 26.66364     11\n2   6 19.74286      7\n3   8 15.10000     14",
    mistakes: [
      "Expecting `group_by()` alone to change the numbers – it only marks the groups. Something like `summarise()` or `mutate()` must follow.",
      "Forgetting that data stay grouped after `group_by()` + `mutate()`. Call `ungroup()` before unrelated calculations.",
    ],
    related: ["summarise", "count", "tapply", "aggregate"],
  },
  {
    name: "count",
    package: "dplyr",
    category: "dplyr",
    purpose: "Counts the rows for each value (or combination of values) of one or more columns. A shortcut for `group_by()` + `summarise(n = n())`.",
    syntax: "count(x, ..., sort = FALSE, name = \"n\")",
    args: [
      { name: "x", description: "A data frame." },
      { name: "...", description: "The columns to count by." },
      { name: "sort", description: "`TRUE` puts the most common values first." },
      { name: "name", description: "Name of the count column (default `n`)." },
    ],
    example: `library(dplyr)
mtcars |> count(cyl)
mtcars |> count(cyl, am, sort = TRUE)`,
    output: "  cyl  n\n1   4 11\n2   6  7\n3   8 14\n  cyl am  n\n1   8  0 12\n2   4  1  8\n3   6  0  4\n4   4  0  3\n5   6  1  3\n6   8  1  2",
    mistakes: [
      "Passing a vector instead of a data frame: `count(mtcars$cyl)` fails – use `count(mtcars, cyl)` (or `table(mtcars$cyl)`).",
      "Looking for a column called `count` – the new column is named `n`. Choose another name with `name = \"total\"`.",
    ],
    related: ["table", "group_by", "summarise", "distinct"],
  },
  {
    name: "distinct",
    package: "dplyr",
    category: "dplyr",
    purpose: "Removes duplicate rows. Given column names, it returns the unique combinations of those columns.",
    syntax: "distinct(.data, ..., .keep_all = FALSE)",
    args: [
      { name: ".data", description: "A data frame." },
      { name: "...", description: "Optional columns to consider; without them whole rows are compared." },
      { name: ".keep_all", description: "`TRUE` keeps the other columns (from the first matching row)." },
    ],
    example: `library(dplyr)
orders <- data.frame(customer = c("Ana", "Ben", "Ana", "Ana"),
                     city = c("Rome", "Oslo", "Rome", "Paris"))
distinct(orders)
distinct(orders, customer)`,
    output: "  customer  city\n1      Ana  Rome\n2      Ben  Oslo\n3      Ana Paris\n  customer\n1      Ana\n2      Ben",
    mistakes: [
      "Forgetting that `distinct(df, col)` drops the other columns – add `.keep_all = TRUE` to keep them.",
      "Expecting near-duplicates to be merged – `\"Ana\"` and `\"ana \"` are different until you clean them with `tolower()` and `trimws()`.",
    ],
    related: ["unique", "duplicated", "count"],
  },
  {
    name: "rename",
    package: "dplyr",
    category: "dplyr",
    purpose: "Renames columns, written as `new_name = old_name`. All other columns stay as they are.",
    syntax: "rename(.data, new_name = old_name, ...)",
    args: [
      { name: ".data", description: "A data frame." },
      { name: "new_name = old_name", description: "One or more renamings." },
    ],
    example: `library(dplyr)
df <- data.frame(n = c("Ana", "Ben"), a = c(28, 35))
rename(df, name = n, age = a)`,
    output: "  name age\n1  Ana  28\n2  Ben  35",
    mistakes: [
      "Writing it the wrong way round (`old = new`) – it is always **new = old**.",
      "Renaming to a name that already exists – dplyr stops with \"Names must be unique\".",
    ],
    related: ["select", "colnames", "mutate"],
  },
  {
    name: "left_join",
    package: "dplyr",
    category: "dplyr",
    purpose:
      "Adds columns from a second table to every row of the first, matching rows by a key column. Rows without a match get `NA`. `inner_join()` keeps only rows found in both.",
    syntax: "left_join(x, y, by = NULL)",
    args: [
      { name: "x", description: "The main table – all its rows are kept." },
      { name: "y", description: "The table whose columns are added." },
      { name: "by", description: "The key column(s), e.g. `\"id\"`, or `c(\"id\" = \"student_id\")` when the names differ." },
    ],
    example: `library(dplyr)
students <- data.frame(id = c(1, 2, 3), name = c("Ana", "Ben", "Cleo"))
grades <- data.frame(id = c(1, 2, 4), grade = c("A", "B", "C"))
left_join(students, grades, by = "id")
inner_join(students, grades, by = "id")`,
    output: "  id name grade\n1  1  Ana     A\n2  2  Ben     B\n3  3 Cleo  <NA>\n  id name grade\n1  1  Ana     A\n2  2  Ben     B",
    mistakes: [
      "Leaving out `by` – dplyr guesses the shared columns and prints a message. Say which key you mean.",
      "Duplicate keys in `y` multiply rows in the result; check with `count(y, id)`.",
      "Key columns of different types (number vs text) cannot be matched – convert one first.",
    ],
    related: ["merge", "mutate", "count"],
  },
  {
    name: "case_when",
    package: "dplyr",
    category: "dplyr",
    purpose:
      "Creates values from several conditions, checked from top to bottom: `condition ~ value`. The first true condition wins; a final `TRUE ~ value` catches everything else. Clearer than nested `ifelse()`.",
    syntax: "case_when(condition1 ~ value1, condition2 ~ value2, ..., TRUE ~ default)",
    args: [
      { name: "condition ~ value", description: "A test on the left of `~`, the result on the right." },
      { name: "TRUE ~ default", description: "Optional last line: the value when no other condition is true (otherwise `NA`)." },
    ],
    example: `library(dplyr)
scores <- c(95, 82, 67, 45)
case_when(
  scores >= 90 ~ "A",
  scores >= 80 ~ "B",
  scores >= 60 ~ "C",
  TRUE ~ "F"
)`,
    output: "[1] \"A\" \"B\" \"C\" \"F\"",
    mistakes: [
      "Putting the conditions in the wrong order – `scores >= 60` first would label 95 as \"C\". Go from most specific to least specific.",
      "Mixing result types (`\"A\"` and `1`) – all results must be the same type.",
    ],
    related: ["ifelse", "mutate", "cut", "switch"],
  },

  /* ---------------------------------------------------------------- */
  /* tidyr                                                            */
  /* ---------------------------------------------------------------- */
  {
    name: "pivot_longer",
    package: "tidyr",
    category: "tidyr",
    purpose:
      "Reshapes data from wide to long format: several columns (such as one column per subject) become two columns – one holding the old column names, one holding the values. Long data are what ggplot2 and dplyr like best.",
    syntax: "pivot_longer(data, cols, names_to = \"name\", values_to = \"value\")",
    args: [
      { name: "data", description: "A data frame." },
      { name: "cols", description: "The columns to stack, e.g. `c(math, art)` or `-name` (all except name)." },
      { name: "names_to", description: "Name of the new column that holds the old column names." },
      { name: "values_to", description: "Name of the new column that holds the values." },
    ],
    example: `library(tidyr)
scores <- data.frame(name = c("Ana", "Ben"),
                     math = c(90, 75),
                     art = c(80, 95))
long <- pivot_longer(scores, cols = c(math, art),
                     names_to = "subject", values_to = "score")
as.data.frame(long)`,
    output: "  name subject score\n1  Ana    math    90\n2  Ana     art    80\n3  Ben    math    75\n4  Ben     art    95",
    mistakes: [
      "Forgetting `cols` or including the ID column in it, so names get stacked together with scores.",
      "Stacking columns of different types (numbers and text) – R stops because one value column cannot hold both.",
    ],
    related: ["pivot_wider", "separate", "ggplot"],
  },
  {
    name: "pivot_wider",
    package: "tidyr",
    category: "tidyr",
    purpose: "The opposite of `pivot_longer()`: spreads long data into wide format, creating one column for each value of a names column.",
    syntax: "pivot_wider(data, names_from, values_from, values_fill = NULL)",
    args: [
      { name: "data", description: "A data frame in long format." },
      { name: "names_from", description: "The column whose values become the new column names." },
      { name: "values_from", description: "The column whose values fill the new columns." },
      { name: "values_fill", description: "What to put in empty cells (default `NA`), e.g. `0`." },
    ],
    example: `library(tidyr)
long <- data.frame(name = c("Ana", "Ana", "Ben", "Ben"),
                   subject = c("math", "art", "math", "art"),
                   score = c(90, 80, 75, 95))
wide <- pivot_wider(long, names_from = subject, values_from = score)
as.data.frame(wide)`,
    output: "  name math art\n1  Ana   90  80\n2  Ben   75  95",
    mistakes: [
      "Having two values for the same name/column combination – instead of numbers you get list-columns and a warning \"Values from `score` are not uniquely identified\". Summarise duplicates first.",
      "Leaving gaps as `NA` when a missing combination really means zero – add `values_fill = 0`.",
    ],
    related: ["pivot_longer", "count"],
  },
  {
    name: "drop_na",
    package: "tidyr",
    category: "tidyr",
    purpose: "Removes rows with missing values – in all columns, or only in the columns you name.",
    syntax: "drop_na(data, ...)",
    args: [
      { name: "data", description: "A data frame." },
      { name: "...", description: "Optional columns to check; without them every column is checked." },
    ],
    example: `library(tidyr)
nrow(airquality)
nrow(drop_na(airquality))
nrow(drop_na(airquality, Ozone))`,
    output: "[1] 153\n[1] 111\n[1] 116",
    mistakes: [
      "Dropping more rows than needed – name only the columns your analysis uses.",
      "Not saving the result: `df <- drop_na(df)`.",
    ],
    related: ["na.omit", "replace_na", "is.na"],
  },
  {
    name: "replace_na",
    package: "tidyr",
    category: "tidyr",
    purpose: "Replaces missing values with a value you choose – per column, given as a named list, or directly on one vector.",
    syntax: "replace_na(data, replace)",
    args: [
      { name: "data", description: "A data frame or a vector." },
      { name: "replace", description: "For a data frame: `list(col = value, …)`. For a vector: a single value." },
    ],
    example: `library(tidyr)
df <- data.frame(name = c("Ana", "Ben", NA), visits = c(3, NA, 5))
replace_na(df, list(name = "unknown", visits = 0))
replace_na(c(1, NA, 3), 0)`,
    output: "     name visits\n1     Ana      3\n2     Ben      0\n3 unknown      5\n[1] 1 0 3",
    mistakes: [
      "Replacing missing numbers with 0 when 0 is not true – it changes means and other statistics. Only do it when \"missing\" really means zero.",
      "Using a replacement of the wrong type (text into a numeric column) – R stops with an error.",
    ],
    related: ["drop_na", "is.na", "ifelse"],
  },
  {
    name: "separate",
    package: "tidyr",
    category: "tidyr",
    purpose: "Splits one text column into several columns at a separator – for example `\"2024-03\"` into year and month.",
    syntax: "separate(data, col, into, sep = \"[^[:alnum:]]+\", convert = FALSE)",
    args: [
      { name: "data", description: "A data frame." },
      { name: "col", description: "The column to split." },
      { name: "into", description: "Names of the new columns, e.g. `c(\"year\", \"month\")`." },
      { name: "sep", description: "The separator, e.g. `\"-\"`." },
      { name: "convert", description: "`TRUE` turns number-like pieces into numbers." },
    ],
    example: `library(tidyr)
visits <- data.frame(id = 1:2, period = c("2024-03", "2023-11"))
separate(visits, period, into = c("year", "month"), sep = "-", convert = TRUE)`,
    output: "  id year month\n1  1 2024     3\n2  2 2023    11",
    mistakes: [
      "Giving too few names in `into` – the extra pieces are dropped with a warning.",
      "Forgetting `convert = TRUE`, so the new columns stay text.",
    ],
    related: ["strsplit", "pivot_longer", "substr"],
  },

  /* ---------------------------------------------------------------- */
  /* ggplot2                                                          */
  /* ---------------------------------------------------------------- */
  {
    name: "ggplot",
    package: "ggplot2",
    category: "ggplot2",
    purpose:
      "Starts a ggplot2 chart: you give it the data and the aesthetics (which column goes on which axis), then add layers with `+` – geoms for shapes, `labs()` for labels, themes for style.",
    syntax: "ggplot(data, aes(x = ..., y = ...)) + geom_...()",
    args: [
      { name: "data", description: "A data frame." },
      { name: "mapping", description: "`aes(...)`: which columns map to x, y, colour, size, …" },
    ],
    example: `library(ggplot2)
ggplot(mtcars, aes(x = wt, y = mpg)) +
  geom_point()`,
    output: "",
    plot: true,
    mistakes: [
      "Forgetting a geom: `ggplot(mtcars, aes(wt, mpg))` alone draws an empty panel with axes.",
      "Using the pipe `|>` between layers instead of `+`. Layers are always added with `+`.",
      "Putting the `+` at the start of the next line – R thinks the command ended. Keep `+` at the *end* of each line.",
    ],
    related: ["aes", "geom_point", "labs", "theme_minimal"],
  },
  {
    name: "aes",
    package: "ggplot2",
    category: "ggplot2",
    purpose:
      "Describes the *aesthetic mappings*: which columns control position (`x`, `y`) and appearance (`colour`, `size`, `shape`, `fill`). Inside `aes()` you use column names; fixed settings go outside it.",
    syntax: "aes(x, y, colour, fill, size, shape, ...)",
    args: [
      { name: "x, y", description: "Columns for the horizontal and vertical position." },
      { name: "colour / fill", description: "A column that sets the outline / fill colour." },
      { name: "size, shape", description: "Columns that set the point size or symbol." },
    ],
    example: `library(ggplot2)
ggplot(mtcars, aes(x = wt, y = mpg, colour = factor(cyl))) +
  geom_point(size = 3)`,
    output: "",
    plot: true,
    mistakes: [
      "Putting a fixed colour inside `aes()`: `aes(colour = \"blue\")` creates a legend entry called \"blue\" with a default colour. Write `geom_point(colour = \"blue\")` instead.",
      "Mapping a numeric code (like `cyl`) to colour gives a colour gradient; wrap it in `factor()` for distinct colours.",
    ],
    related: ["ggplot", "geom_point", "labs"],
  },
  {
    name: "geom_point",
    package: "ggplot2",
    category: "ggplot2",
    purpose: "Draws points – a scatter plot. Each row of the data becomes one point.",
    syntax: "geom_point(mapping = NULL, size, colour, alpha, shape)",
    args: [
      { name: "size", description: "Point size (fixed value)." },
      { name: "colour", description: "Point colour (fixed value), or map a column with `aes(colour = col)`." },
      { name: "alpha", description: "Transparency from 0 (invisible) to 1 (solid) – helps when points overlap." },
    ],
    example: `library(ggplot2)
ggplot(mtcars, aes(x = hp, y = mpg)) +
  geom_point(colour = "steelblue", size = 2, alpha = 0.7)`,
    output: "",
    plot: true,
    mistakes: [
      "Using `geom_point()` with a categorical x axis and many rows – points pile on top of each other. Try `geom_boxplot()` or `alpha`.",
      "Writing `color` vs `colour` – both are accepted, so either is fine; just be consistent.",
    ],
    related: ["ggplot", "aes", "geom_smooth", "plot"],
  },
  {
    name: "geom_line",
    package: "ggplot2",
    category: "ggplot2",
    purpose: "Connects points with lines in order of x – ideal for values over time.",
    syntax: "geom_line(mapping = NULL, colour, linewidth, linetype)",
    args: [
      { name: "colour", description: "Line colour." },
      { name: "linewidth", description: "Line thickness." },
      { name: "linetype", description: "`\"solid\"`, `\"dashed\"`, `\"dotted\"`, …" },
    ],
    example: `library(ggplot2)
sales <- data.frame(month = 1:6, units = c(120, 135, 128, 150, 162, 170))
ggplot(sales, aes(x = month, y = units)) +
  geom_line(colour = "darkgreen", linewidth = 1) +
  geom_point()`,
    output: "",
    plot: true,
    mistakes: [
      "Plotting several groups without `group` or `colour` in `aes()` – ggplot2 joins all points into one zig-zag line.",
      "Using dates stored as text on the x axis – convert them with `as.Date()` so they are spaced correctly.",
    ],
    related: ["ggplot", "geom_point", "lines"],
  },
  {
    name: "geom_col",
    package: "ggplot2",
    category: "ggplot2",
    purpose: "Draws bars whose heights are values already in your data (for example a total per region). Use `geom_bar()` instead when ggplot2 should count rows for you.",
    syntax: "geom_col(mapping = NULL, fill, colour, width)",
    args: [
      { name: "fill", description: "Bar fill colour." },
      { name: "width", description: "Bar width (0–1)." },
    ],
    example: `library(ggplot2)
totals <- data.frame(region = c("North", "South", "East"), revenue = c(120, 95, 140))
ggplot(totals, aes(x = region, y = revenue)) +
  geom_col(fill = "orange")`,
    output: "",
    plot: true,
    mistakes: [
      "Using `geom_bar()` with a `y` value – it fails, because `geom_bar()` counts rows. Use `geom_col()` for given heights.",
      "Leaving out `y` – `geom_col()` needs bar heights and stops with \"requires the following missing aesthetics: y\". To count rows use `geom_bar()`.",
    ],
    related: ["geom_bar", "barplot", "ggplot"],
  },
  {
    name: "geom_bar",
    package: "ggplot2",
    category: "ggplot2",
    purpose: "Draws a bar chart of counts: ggplot2 counts the rows in each category for you. Only an `x` aesthetic is needed.",
    syntax: "geom_bar(mapping = NULL, fill, position = \"stack\")",
    args: [
      { name: "fill", description: "Bar colour, or map a second variable with `aes(fill = col)`." },
      { name: "position", description: "`\"stack\"` (default), `\"dodge\"` (side by side) or `\"fill\"` (proportions)." },
    ],
    example: `library(ggplot2)
ggplot(mtcars, aes(x = factor(cyl))) +
  geom_bar(fill = "steelblue")`,
    output: "",
    plot: true,
    mistakes: [
      "Giving both `x` and `y` – `geom_bar()` makes the y axis itself (the count). For your own heights use `geom_col()`.",
      "Using a numeric code on the x axis without `factor()`, which can produce odd gaps and a continuous axis.",
    ],
    related: ["geom_col", "geom_histogram", "count", "barplot"],
  },
  {
    name: "geom_histogram",
    package: "ggplot2",
    category: "ggplot2",
    purpose: "Draws a histogram of one numeric variable. Choose `bins` (how many bars) or `binwidth` (how wide each bar is).",
    syntax: "geom_histogram(mapping = NULL, bins = 30, binwidth, fill, colour)",
    args: [
      { name: "bins", description: "Number of bars. Without `bins` or `binwidth` ggplot2 uses 30 and prints a message." },
      { name: "binwidth", description: "Width of each bar in data units." },
      { name: "fill, colour", description: "Fill colour and outline colour of the bars." },
    ],
    example: `library(ggplot2)
ggplot(mtcars, aes(x = mpg)) +
  geom_histogram(bins = 8, fill = "lightblue", colour = "black")`,
    output: "",
    plot: true,
    mistakes: [
      "Giving a categorical variable – histograms need numbers. Use `geom_bar()` for categories.",
      "Keeping the default 30 bins for small data, which makes a gappy, spiky chart. Pick `bins` or `binwidth` yourself.",
    ],
    related: ["hist", "geom_bar", "geom_boxplot"],
  },
  {
    name: "geom_boxplot",
    package: "ggplot2",
    category: "ggplot2",
    purpose: "Draws box plots, usually one per group, to compare medians and spread. Outliers appear as separate points.",
    syntax: "geom_boxplot(mapping = NULL, fill, outlier.colour)",
    args: [
      { name: "fill", description: "Box fill colour." },
      { name: "outlier.colour", description: "Colour of the outlier points." },
    ],
    example: `library(ggplot2)
ggplot(mtcars, aes(x = factor(cyl), y = mpg)) +
  geom_boxplot(fill = "lightgreen")`,
    output: "",
    plot: true,
    mistakes: [
      "Using a numeric grouping variable without `factor()` – ggplot2 then draws one box for everything (with a warning about continuous x).",
      "Reading the middle line as the mean – it is the median.",
    ],
    related: ["boxplot", "geom_histogram", "ggplot"],
  },
  {
    name: "geom_smooth",
    package: "ggplot2",
    category: "ggplot2",
    purpose:
      "Adds a trend line to a plot. `method = \"lm\"` draws a straight regression line; the grey band is its confidence interval (`se = FALSE` hides it).",
    syntax: "geom_smooth(method = NULL, formula = NULL, se = TRUE, colour)",
    args: [
      { name: "method", description: "`\"lm\"` for a straight line; `\"loess\"` for a flexible curve." },
      { name: "formula", description: "The model formula; `y ~ x` is the usual one (giving it avoids a message)." },
      { name: "se", description: "`FALSE` hides the confidence band." },
    ],
    example: `library(ggplot2)
ggplot(mtcars, aes(x = wt, y = mpg)) +
  geom_point() +
  geom_smooth(method = "lm", formula = y ~ x, se = FALSE, colour = "red")`,
    output: "",
    plot: true,
    mistakes: [
      "Leaving out `method` and being surprised by a curvy line – the default for small data is a flexible \"loess\" curve.",
      "Thinking the line proves cause and effect – it only summarises the trend.",
    ],
    related: ["geom_point", "lm", "abline"],
  },
  {
    name: "labs",
    package: "ggplot2",
    category: "ggplot2",
    purpose: "Sets the title, subtitle, axis labels, legend titles and caption of a ggplot chart.",
    syntax: "labs(title, subtitle, x, y, colour, fill, caption)",
    args: [
      { name: "title, subtitle", description: "Text above the plot." },
      { name: "x, y", description: "Axis labels." },
      { name: "colour / fill", description: "Legend title for that aesthetic." },
      { name: "caption", description: "Small text below the plot, e.g. the data source." },
    ],
    example: `library(ggplot2)
ggplot(mtcars, aes(x = wt, y = mpg, colour = factor(cyl))) +
  geom_point() +
  labs(title = "Heavier cars use more fuel",
       x = "Weight (1000 lbs)", y = "Miles per gallon",
       colour = "Cylinders")`,
    output: "",
    plot: true,
    mistakes: [
      "Forgetting the `+` before `labs()` – then it is a separate command and the labels never reach the plot.",
      "Setting the wrong legend title: the argument must match the aesthetic, e.g. `labs(fill = \"Region\")` for a `fill` mapping – `colour =` would not change it.",
    ],
    related: ["ggplot", "theme_minimal", "aes"],
  },
  {
    name: "facet_wrap",
    package: "ggplot2",
    category: "ggplot2",
    purpose: "Splits one plot into small panels, one for each value of a categorical variable, so groups can be compared side by side.",
    syntax: "facet_wrap(~ variable, nrow, ncol, scales = \"fixed\")",
    args: [
      { name: "~ variable", description: "The grouping column after a tilde, e.g. `~ cyl`." },
      { name: "nrow, ncol", description: "Layout of the panels." },
      { name: "scales", description: "`\"free\"` lets each panel have its own axis ranges." },
    ],
    example: `library(ggplot2)
ggplot(mtcars, aes(x = wt, y = mpg)) +
  geom_point() +
  facet_wrap(~ cyl)`,
    output: "",
    plot: true,
    mistakes: [
      "Leaving out the tilde: `facet_wrap(cyl)` fails because `cyl` is looked up as a variable. Write `facet_wrap(~ cyl)` (or `vars(cyl)`).",
      "Faceting by a numeric variable with many different values, which creates dozens of tiny panels. Group it first, e.g. with `cut()`.",
    ],
    related: ["ggplot", "geom_point", "group_by"],
  },
  {
    name: "theme_minimal",
    package: "ggplot2",
    category: "ggplot2",
    purpose: "Applies a clean theme with no background box and light grid lines. Other complete themes: `theme_bw()`, `theme_classic()`, `theme_light()`.",
    syntax: "theme_minimal(base_size = 11)",
    args: [{ name: "base_size", description: "Base font size; increase it for presentations." }],
    example: `library(ggplot2)
ggplot(mtcars, aes(x = hp, y = mpg)) +
  geom_point() +
  theme_minimal(base_size = 14)`,
    output: "",
    plot: true,
    mistakes: [
      "Adding `theme()` tweaks *before* a complete theme – the complete theme then overwrites them. Put `theme_minimal()` first, then `theme(...)`.",
      "Expecting a theme to change the colours of points or bars – themes style the non-data parts (background, grid, fonts). Use `scale_colour_manual()` and friends for data colours.",
    ],
    related: ["ggplot", "labs"],
  },
];
