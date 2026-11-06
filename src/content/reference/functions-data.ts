import type { RFunction } from "../types";

/**
 * Function reference – "Data frames", "Import & export", "Text (strings)"
 * and "Dates". Every `output` is the real console output of `example`.
 */
export const dataFunctions: RFunction[] = [
  /* ---------------------------------------------------------------- */
  /* Data frames (and other containers)                               */
  /* ---------------------------------------------------------------- */
  {
    name: "list",
    package: "base",
    category: "Data frames",
    purpose:
      "Creates a list: one container that can hold things of different types and lengths – numbers, text, vectors, even data frames. Think of it as a labelled bag of items.",
    syntax: "list(...)",
    args: [{ name: "...", description: "The items to store, usually with names: `list(name = \"Ada\", age = 36)`." }],
    example: `person <- list(name = "Ada", age = 36, languages = c("R", "Python"))
person$name
person[["age"]]
length(person)
str(person)`,
    output: "[1] \"Ada\"\n[1] 36\n[1] 3\nList of 3\n $ name     : chr \"Ada\"\n $ age      : num 36\n $ languages: chr [1:2] \"R\" \"Python\"",
    mistakes: [
      "Using single brackets to get an item: `person[\"age\"]` returns a smaller *list*, not the number. Use `person[[\"age\"]]` or `person$age`.",
      "Using `c()` when you need different types – `c(\"Ada\", 36)` turns 36 into text. A list keeps each item's type.",
    ],
    related: ["c", "str", "lapply", "data.frame"],
  },
  {
    name: "matrix",
    package: "base",
    category: "Data frames",
    purpose:
      "Creates a matrix: a grid of values with rows and columns, all of the same type. You pick a cell with `m[row, column]`.",
    syntax: "matrix(data, nrow, ncol, byrow = FALSE, dimnames = NULL)",
    args: [
      { name: "data", description: "The values to fill the grid with." },
      { name: "nrow, ncol", description: "Number of rows and columns (giving one is enough)." },
      { name: "byrow", description: "`TRUE` fills row by row; the default fills column by column." },
      { name: "dimnames", description: "Optional row and column names, as a list of two vectors." },
    ],
    example: `m <- matrix(1:6, nrow = 2)
m
matrix(1:6, nrow = 2, byrow = TRUE)
m[2, 3]
dim(m)`,
    output: "     [,1] [,2] [,3]\n[1,]    1    3    5\n[2,]    2    4    6\n     [,1] [,2] [,3]\n[1,]    1    2    3\n[2,]    4    5    6\n[1] 6\n[1] 2 3",
    mistakes: [
      "Forgetting that matrices fill column by column. Add `byrow = TRUE` to fill along the rows.",
      "Mixing numbers and text – everything becomes text. Use a data frame when columns have different types.",
      "Giving a number of values that does not fit the shape: `matrix(1:5, nrow = 2)` recycles values and warns \"data length [5] is not a sub-multiple or multiple of the number of rows [2]\".",
    ],
    related: ["dim", "apply", "cbind", "data.frame"],
  },
  {
    name: "data.frame",
    package: "base",
    category: "Data frames",
    purpose:
      "Creates a data frame – R's table. Each column is a vector (so one type per column) and each row is one observation, like a row in a spreadsheet.",
    syntax: "data.frame(..., stringsAsFactors = FALSE)",
    args: [
      { name: "...", description: "Columns written as `name = vector`. All columns must have the same length." },
      { name: "stringsAsFactors", description: "`TRUE` would turn text columns into factors (the default has been `FALSE` since R 4.0)." },
    ],
    example: `people <- data.frame(
  name = c("Ana", "Ben", "Cleo"),
  age = c(28, 35, 42),
  member = c(TRUE, FALSE, TRUE)
)
people
people$age
mean(people$age)`,
    output: "  name age member\n1  Ana  28   TRUE\n2  Ben  35  FALSE\n3 Cleo  42   TRUE\n[1] 28 35 42\n[1] 35",
    mistakes: [
      "Columns of different lengths: `data.frame(a = 1:3, b = 1:2)` stops with \"arguments imply differing number of rows: 3, 2\".",
      "Forgetting the commas between columns, which gives an \"unexpected symbol\" syntax error.",
      "Following old tutorials that expect text columns to become factors automatically – in R 4.0 and later they stay text.",
    ],
    related: ["head", "str", "summary", "nrow", "list"],
  },
  {
    name: "head",
    package: "utils",
    category: "Data frames",
    purpose: "Shows the first rows of a data frame (or the first elements of a vector) – 6 by default. The quickest way to peek at your data.",
    syntax: "head(x, n = 6)",
    args: [
      { name: "x", description: "A data frame or vector." },
      { name: "n", description: "How many rows to show. A negative number shows all *except* the last n." },
    ],
    example: `head(mtcars, 3)
alphabet <- letters[1:10]
head(alphabet)
head(alphabet, -2)`,
    output: "               mpg cyl disp  hp drat    wt  qsec vs am gear carb\nMazda RX4     21.0   6  160 110 3.90 2.620 16.46  0  1    4    4\nMazda RX4 Wag 21.0   6  160 110 3.90 2.875 17.02  0  1    4    4\nDatsun 710    22.8   4  108  93 3.85 2.320 18.61  1  1    4    1\n[1] \"a\" \"b\" \"c\" \"d\" \"e\" \"f\"\n[1] \"a\" \"b\" \"c\" \"d\" \"e\" \"f\" \"g\" \"h\"",
    mistakes: [
      "Thinking `head()` shows all of the data – it shows only the first 6 rows. Use `nrow()` to know how many there are.",
      "Expecting `head()` to change the data. It only shows a preview; assign the result (`small <- head(df, 10)`) if you want to keep it.",
    ],
    related: ["tail", "str", "summary", "nrow"],
  },
  {
    name: "tail",
    package: "utils",
    category: "Data frames",
    purpose: "Shows the last rows of a data frame or the last elements of a vector – 6 by default. Useful to check that a file was read completely.",
    syntax: "tail(x, n = 6)",
    args: [
      { name: "x", description: "A data frame or vector." },
      { name: "n", description: "How many rows to show from the end." },
    ],
    example: `tail(mtcars, 3)
scores <- c(70, 85, 90, 65, 88)
tail(scores, 2)`,
    output: "               mpg cyl disp  hp drat   wt qsec vs am gear carb\nFerrari Dino  19.7   6  145 175 3.62 2.77 15.5  0  1    5    6\nMaserati Bora 15.0   8  301 335 3.54 3.57 14.6  0  1    5    8\nVolvo 142E    21.4   4  121 109 4.11 2.78 18.6  1  1    4    2\n[1] 65 88",
    mistakes: [
      "Expecting the newest data to be at the end – that is only true if the data are sorted. Sort first with `order()` or `arrange()`.",
      "Using `tail(x, -1)` to get the last element – a negative `n` means \"everything except the first\". Use `tail(x, 1)`.",
    ],
    related: ["head", "nrow", "rev"],
  },
  {
    name: "str",
    package: "utils",
    category: "Data frames",
    purpose:
      "Shows the *structure* of an object in a compact way: for a data frame the number of rows and columns, and each column's type and first values. Run it right after importing data.",
    syntax: "str(object)",
    args: [{ name: "object", description: "Any R object – most often a data frame or list." }],
    example: `students <- read.csv("data/students.csv")
str(students)`,
    output: "'data.frame':\t60 obs. of  10 variables:\n $ student_id : chr  \"S001\" \"S002\" \"S003\" \"S004\" ...\n $ name       : chr  \"Amara\" \"Ben\" \"Chloe\" \"Daniel\" ...\n $ gender     : chr  \"Female\" \"Male\" \"Female\" \"Male\" ...\n $ age        : int  16 17 19 19 17 16 19 18 18 16 ...\n $ class      : chr  \"C\" \"A\" \"B\" \"B\" ...\n $ study_hours: int  6 1 12 10 13 11 5 2 13 10 ...\n $ attendance : int  82 93 93 86 79 83 78 78 84 86 ...\n $ math       : int  86 54 99 68 90 78 77 81 70 74 ...\n $ reading    : int  82 53 99 62 86 85 70 76 78 90 ...\n $ science    : int  83 46 100 63 84 88 NA 63 84 77 ...",
    mistakes: [
      "Thinking `str()` has to do with strings – it stands for *structure*.",
      "Overlooking a `chr` (text) next to a column you expected to be numeric. That usually means the column contains a stray symbol or word, and calculations will fail.",
    ],
    related: ["summary", "head", "class", "names"],
  },
  {
    name: "summary",
    package: "base",
    category: "Data frames",
    purpose:
      "Gives a quick statistical summary. For numbers: minimum, quartiles, median, mean, maximum and the count of `NA`s. For a data frame it summarises every column; for a model it shows the results.",
    syntax: "summary(object)",
    args: [{ name: "object", description: "A vector, data frame, factor or fitted model (e.g. from `lm()`)." }],
    example: `scores <- c(55, 70, 82, 90, 95, NA)
summary(scores)
summary(iris[, c("Sepal.Length", "Species")])`,
    output: "   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.     NAs\n   55.0    70.0    82.0    78.4    90.0    95.0       1\n  Sepal.Length         Species\n Min.   :4.300   setosa    :50\n 1st Qu.:5.100   versicolor:50\n Median :5.800   virginica :50\n Mean   :5.843\n 3rd Qu.:6.400\n Max.   :7.900",
    mistakes: [
      "Expecting counts for text columns – `summary()` shows only `Length`, `Class` and `Mode` for character columns. Convert them with `factor()` (or use `table()`) to see counts.",
      "Ignoring the count of missing values (the `NAs` entry; older R versions label it `NA's`). It tells you how many values are missing, which matters before you calculate anything.",
    ],
    related: ["str", "mean", "quantile", "table"],
  },
  {
    name: "nrow",
    package: "base",
    category: "Data frames",
    purpose: "Counts the rows of a data frame or matrix – for a dataset, the number of observations.",
    syntax: "nrow(x)",
    args: [{ name: "x", description: "A data frame or matrix." }],
    example: `nrow(mtcars)
students <- read.csv("data/students.csv")
nrow(students)
nrow(students[students$math > 90, ])`,
    output: "[1] 32\n[1] 60\n[1] 6",
    mistakes: [
      "Using `nrow()` on a vector – it returns `NULL`. Use `length()` for vectors.",
      "Using `length(df)` to count rows – that counts columns.",
    ],
    related: ["ncol", "dim", "length"],
  },
  {
    name: "ncol",
    package: "base",
    category: "Data frames",
    purpose: "Counts the columns of a data frame or matrix – for a dataset, the number of variables.",
    syntax: "ncol(x)",
    args: [{ name: "x", description: "A data frame or matrix." }],
    example: `ncol(mtcars)
ncol(iris)
names(iris)`,
    output: "[1] 11\n[1] 5\n[1] \"Sepal.Length\" \"Sepal.Width\"  \"Petal.Length\" \"Petal.Width\"  \"Species\"",
    mistakes: [
      "Using `ncol()` on a vector – it returns `NULL`. A vector has no columns; use `length()`.",
      "Using `length()` on a matrix to count columns – for a matrix `length()` counts every cell.",
    ],
    related: ["nrow", "dim", "names"],
  },
  {
    name: "dim",
    package: "base",
    category: "Data frames",
    purpose: "Returns the dimensions – number of rows and number of columns – in one go.",
    syntax: "dim(x)",
    args: [{ name: "x", description: "A data frame or matrix." }],
    example: `dim(mtcars)
dim(mtcars)[1]
m <- matrix(1:12, nrow = 3)
dim(m)`,
    output: "[1] 32 11\n[1] 32\n[1] 3 4",
    mistakes: [
      "Forgetting the order: the first number is rows, the second is columns.",
      "Calling `dim()` on a plain vector – it returns `NULL` because a vector has only a length.",
    ],
    related: ["nrow", "ncol", "length"],
  },
  {
    name: "names",
    package: "base",
    category: "Data frames",
    purpose: "Gets or sets the names of a vector's elements or a data frame's columns.",
    syntax: "names(x)\nnames(x) <- value",
    args: [
      { name: "x", description: "A named vector, list or data frame." },
      { name: "value", description: "A character vector of new names (same length as `x`)." },
    ],
    example: `scores <- c(math = 90, art = 75)
names(scores)
names(scores) <- c("Math", "Art")
scores
names(mtcars)[1:3]`,
    output: "[1] \"math\" \"art\"\nMath  Art\n  90   75\n[1] \"mpg\"  \"cyl\"  \"disp\"",
    mistakes: [
      "Giving fewer names than elements – the missing names become `NA`.",
      "Forgetting that names are case-sensitive: `df$Math` and `df$math` are different columns.",
    ],
    related: ["colnames", "rownames", "str"],
  },
  {
    name: "colnames",
    package: "base",
    category: "Data frames",
    purpose: "Gets or sets the column names of a data frame or matrix. You can rename all columns at once or just one by position.",
    syntax: "colnames(x)\ncolnames(x) <- value",
    args: [
      { name: "x", description: "A data frame or matrix." },
      { name: "value", description: "The new column names." },
    ],
    example: `people <- data.frame(n = c("Ana", "Ben"), a = c(28, 35))
colnames(people)
colnames(people) <- c("name", "age")
people
colnames(people)[2] <- "age_years"
colnames(people)`,
    output: "[1] \"n\" \"a\"\n  name age\n1  Ana  28\n2  Ben  35\n[1] \"name\"      \"age_years\"",
    mistakes: [
      "Giving the wrong number of new names – R stops with an error such as \"'names' attribute [3] must be the same length as the vector [2]\".",
      "Using names with spaces (`\"my score\"`). They work but need backticks everywhere (`` df$`my score` ``) – prefer `snake_case`.",
    ],
    related: ["names", "rownames", "rename"],
  },
  {
    name: "rownames",
    package: "base",
    category: "Data frames",
    purpose:
      "Gets or sets row names. Some built-in datasets (like `mtcars`) store important information, such as the car model, in the row names – you can move it into a real column.",
    syntax: "rownames(x)\nrownames(x) <- value",
    args: [
      { name: "x", description: "A data frame or matrix." },
      { name: "value", description: "New row names, or `NULL` to reset them to 1, 2, 3, …" },
    ],
    example: `rownames(mtcars)[1:3]
cars_small <- head(mtcars[, 1:2], 3)
cars_small$model <- rownames(cars_small)
rownames(cars_small) <- NULL
cars_small`,
    output: "[1] \"Mazda RX4\"     \"Mazda RX4 Wag\" \"Datsun 710\"\n   mpg cyl         model\n1 21.0   6     Mazda RX4\n2 21.0   6 Mazda RX4 Wag\n3 22.8   4    Datsun 710",
    mistakes: [
      "Losing row-name information: many tidyverse functions drop row names, so move them into a column first (as in the example).",
      "Expecting row names to renumber after filtering – they keep their old values (e.g. 2, 5, 9). Reset with `rownames(df) <- NULL`.",
    ],
    related: ["colnames", "names", "head"],
  },
  {
    name: "subset",
    package: "base",
    category: "Data frames",
    purpose:
      "Keeps the rows of a data frame that meet a condition and, optionally, only some columns. Inside `subset()` you can use column names directly, without `df$`.",
    syntax: "subset(x, subset, select)",
    args: [
      { name: "x", description: "The data frame." },
      { name: "subset", description: "A condition for the rows to keep, e.g. `math > 90`." },
      { name: "select", description: "Columns to keep, e.g. `c(name, math)`." },
    ],
    example: `students <- read.csv("data/students.csv")
top <- subset(students, math > 95, select = c(name, class, math))
top
nrow(top)`,
    output: "    name class math\n3  Chloe     B   99\n14  Noah     B   98\n[1] 2",
    mistakes: [
      "Writing `=` instead of `==`: `subset(students, class = \"A\")` does not filter at all – R warns \"extra argument 'class' will be disregarded\" and returns every row.",
      "Putting the column name in quotes: `subset(students, \"math\" > 90)` compares the *word* \"math\" with 90 and keeps every row.",
      "Not realising that rows where the condition is `NA` are dropped.",
    ],
    related: ["filter", "select", "which"],
  },
  {
    name: "merge",
    package: "base",
    category: "Data frames",
    purpose:
      "Joins two data frames by a shared key column (like an ID), so information about the same thing ends up in one row. By default only rows found in both tables are kept.",
    syntax: "merge(x, y, by, all = FALSE, all.x = FALSE, all.y = FALSE)",
    args: [
      { name: "x, y", description: "The two data frames." },
      { name: "by", description: "The name of the key column(s) that both have." },
      { name: "all.x", description: "`TRUE` keeps every row of `x`, filling missing matches with `NA` (a left join)." },
      { name: "all", description: "`TRUE` keeps all rows from both tables." },
    ],
    example: `students <- data.frame(id = c(1, 2, 3), name = c("Ana", "Ben", "Cleo"))
grades <- data.frame(id = c(1, 2, 4), grade = c("A", "B", "C"))
merge(students, grades, by = "id")
merge(students, grades, by = "id", all.x = TRUE)`,
    output: "  id name grade\n1  1  Ana     A\n2  2  Ben     B\n  id name grade\n1  1  Ana     A\n2  2  Ben     B\n3  3 Cleo  <NA>",
    mistakes: [
      "Losing rows without noticing: the default keeps only matching rows (Cleo disappears in the first result). Use `all.x = TRUE` to keep everyone.",
      "Key columns with different names in the two tables – use `by.x = \"id\", by.y = \"student_id\"`.",
      "Duplicate keys: if an ID appears twice in one table, its rows are repeated in the result.",
    ],
    related: ["left_join", "rbind", "cbind"],
  },
  {
    name: "rbind",
    package: "base",
    category: "Data frames",
    purpose: "Stacks data frames (or vectors) on top of each other – adds rows. The \"r\" stands for *rows*.",
    syntax: "rbind(...)",
    args: [{ name: "...", description: "Data frames with the same column names, or vectors of the same length." }],
    example: `jan <- data.frame(month = "Jan", sales = 120)
feb <- data.frame(month = "Feb", sales = 95)
rbind(jan, feb)
rbind(1:3, 4:6)`,
    output: "  month sales\n1   Jan   120\n2   Feb    95\n     [,1] [,2] [,3]\n[1,]    1    2    3\n[2,]    4    5    6",
    mistakes: [
      "Stacking data frames with different column names – R stops with \"names do not match previous names\".",
      "Growing a data frame with `rbind()` inside a long loop is slow. Collect pieces in a list and combine them once at the end.",
    ],
    related: ["cbind", "merge", "data.frame"],
  },
  {
    name: "cbind",
    package: "base",
    category: "Data frames",
    purpose: "Puts vectors or data frames side by side – adds columns. The \"c\" stands for *columns*.",
    syntax: "cbind(...)",
    args: [{ name: "...", description: "Vectors or data frames with the same number of rows; you can name new columns (`height = …`)." }],
    example: `names_vec <- c("Ana", "Ben")
ages <- c(28, 35)
cbind(ages, height = c(165, 180))
people <- data.frame(name = names_vec)
cbind(people, age = ages)`,
    output: "     ages height\n[1,]   28    165\n[2,]   35    180\n  name age\n1  Ana  28\n2  Ben  35",
    mistakes: [
      "Combining text and number *vectors* with `cbind()` – the result is a matrix, so everything becomes text. Combine into a data frame instead, as in the last line.",
      "Adding a column of the wrong length – R either recycles it or stops with an error about differing numbers of rows.",
    ],
    related: ["rbind", "data.frame", "merge"],
  },
  {
    name: "aggregate",
    package: "stats",
    category: "Data frames",
    purpose:
      "Calculates a summary (such as the mean) of a column for each group. The formula `value ~ group` reads \"summarise value by group\".",
    syntax: "aggregate(formula, data, FUN)",
    args: [
      { name: "formula", description: "`value ~ group` or `value ~ group1 + group2`." },
      { name: "data", description: "The data frame." },
      { name: "FUN", description: "The summary function to apply, e.g. `mean`, `max`, `length`." },
    ],
    example: `aggregate(mpg ~ cyl, data = mtcars, FUN = mean)
students <- read.csv("data/students.csv")
aggregate(math ~ class + gender, data = students, FUN = max)`,
    output: "  cyl      mpg\n1   4 26.66364\n2   6 19.74286\n3   8 15.10000\n  class gender math\n1     A Female   93\n2     B Female   99\n3     C Female   90\n4     A   Male   94\n5     B   Male   98\n6     C   Male   93",
    mistakes: [
      "Writing the formula the wrong way round (`cyl ~ mpg`) – the value you summarise goes on the left, the grouping on the right.",
      "Forgetting that the formula version silently drops rows with `NA` in the used columns.",
    ],
    related: ["tapply", "group_by", "summarise", "mean"],
  },
  {
    name: "na.omit",
    package: "stats",
    category: "Data frames",
    purpose: "Removes every row (or vector element) that contains a missing value, leaving only complete data.",
    syntax: "na.omit(object)",
    args: [{ name: "object", description: "A data frame or vector." }],
    example: `df <- data.frame(name = c("Ana", "Ben", "Cleo"), score = c(90, NA, 85))
na.omit(df)
nrow(airquality)
nrow(na.omit(airquality))`,
    output: "  name score\n1  Ana    90\n3 Cleo    85\n[1] 153\n[1] 111",
    mistakes: [
      "Throwing away too much: a row is removed if *any* column is `NA`, even one you do not need. Check `colSums(is.na(df))` first, or select the columns you need before calling it.",
      "Being surprised by extra lines (`attr(,\"na.action\")`) when printing `na.omit()` of a vector – they record what was removed; the values are fine.",
    ],
    related: ["is.na", "complete.cases", "drop_na"],
  },
  {
    name: "complete.cases",
    package: "stats",
    category: "Data frames",
    purpose: "Returns `TRUE` for every row that has no missing values. Use it to count complete rows or to keep them.",
    syntax: "complete.cases(...)",
    args: [{ name: "...", description: "A data frame (or several vectors of the same length)." }],
    example: `df <- data.frame(name = c("Ana", "Ben", "Cleo"), score = c(90, NA, 85))
complete.cases(df)
df[complete.cases(df), ]
sum(complete.cases(airquality))`,
    output: "[1]  TRUE FALSE  TRUE\n  name score\n1  Ana    90\n3 Cleo    85\n[1] 111",
    mistakes: [
      "Forgetting the comma: `df[complete.cases(df)]` selects columns, not rows.",
      "Checking all columns when only some matter – use `complete.cases(df$score)` or a subset of columns.",
    ],
    related: ["na.omit", "is.na", "drop_na"],
  },
  {
    name: "colMeans",
    package: "base",
    category: "Data frames",
    purpose: "Calculates the mean of every column at once (`colSums()` gives the column totals). All columns must be numeric.",
    syntax: "colMeans(x, na.rm = FALSE)",
    args: [
      { name: "x", description: "A numeric data frame or matrix." },
      { name: "na.rm", description: "`TRUE` to ignore missing values." },
    ],
    example: `scores <- data.frame(math = c(80, 90, 70), reading = c(85, 95, 75))
colMeans(scores)
colSums(scores)
colMeans(airquality[, 1:2], na.rm = TRUE)`,
    output: "   math reading\n     80      85\n   math reading\n    240     255\n    Ozone   Solar.R\n 42.12931 185.93151",
    mistakes: [
      "Including text columns: `colMeans(iris)` stops with \"'x' must be numeric\" because `Species` is not a number. Select the numeric columns first.",
      "Forgetting `na.rm = TRUE` – every column with an `NA` gets the mean `NA`.",
    ],
    related: ["rowSums", "mean", "apply", "sapply"],
  },
  {
    name: "rowSums",
    package: "base",
    category: "Data frames",
    purpose: "Adds up the values in each row (`rowMeans()` gives each row's mean). Perfect for totals such as a student's total score.",
    syntax: "rowSums(x, na.rm = FALSE)",
    args: [
      { name: "x", description: "A numeric data frame or matrix." },
      { name: "na.rm", description: "`TRUE` to ignore missing values." },
    ],
    example: `scores <- data.frame(math = c(80, 90, 70), reading = c(85, 95, 75))
rowSums(scores)
rowMeans(scores)
scores$total <- rowSums(scores)
scores`,
    output: "[1] 165 185 145\n[1] 82.5 92.5 72.5\n  math reading total\n1   80      85   165\n2   90      95   185\n3   70      75   145",
    mistakes: [
      "Including an ID or name column – the function needs only numeric columns: `rowSums(df[, c(\"math\", \"reading\")])`.",
      "Running it again after adding a total column, which adds the total to itself. Select the columns explicitly.",
    ],
    related: ["colMeans", "sum", "apply"],
  },

  /* ---------------------------------------------------------------- */
  /* Import & export                                                  */
  /* ---------------------------------------------------------------- */
  {
    name: "read.csv",
    package: "utils",
    category: "Import & export",
    purpose:
      "Reads a CSV file (a text file with comma-separated values, which any spreadsheet program can save) into a data frame. On R Academy the sample files live in the folder `data/`.",
    syntax: "read.csv(file, header = TRUE, sep = \",\", na.strings = \"NA\", stringsAsFactors = FALSE)",
    args: [
      { name: "file", description: "Path to the file, in quotes, e.g. `\"data/students.csv\"`." },
      { name: "header", description: "`TRUE` if the first line holds the column names." },
      { name: "sep", description: "The separator between values (`\";\"` for many European files)." },
      { name: "na.strings", description: "Which text means \"missing\", e.g. `c(\"\", \"NA\", \"N/A\")`." },
    ],
    example: `students <- read.csv("data/students.csv")
dim(students)
head(students[, 1:5], 3)`,
    output: "[1] 60 10\n  student_id  name gender age class\n1       S001 Amara Female  16     C\n2       S002   Ben   Male  17     A\n3       S003 Chloe Female  19     B",
    mistakes: [
      "Forgetting to assign the result: `read.csv(\"data/students.csv\")` only prints the data. Write `students <- read.csv(...)` to keep it.",
      "A wrong path or typo in the file name – R stops with \"cannot open file … No such file or directory\". Check with `list.files()`.",
      "Not checking the column types with `str()` afterwards; one odd value can turn a whole numeric column into text.",
    ],
    related: ["write.csv", "str", "head", "list.files"],
  },
  {
    name: "write.csv",
    package: "utils",
    category: "Import & export",
    purpose: "Saves a data frame as a CSV file, so you can open it in a spreadsheet or share it.",
    syntax: "write.csv(x, file, row.names = TRUE)",
    args: [
      { name: "x", description: "The data frame to save." },
      { name: "file", description: "The file name or path, in quotes." },
      { name: "row.names", description: "Set to `FALSE` to avoid an extra unnamed column of row numbers." },
    ],
    example: `results <- data.frame(name = c("Ana", "Ben"), score = c(91, 78))
write.csv(results, "results.csv", row.names = FALSE)
read.csv("results.csv")`,
    output: "  name score\n1  Ana    91\n2  Ben    78",
    mistakes: [
      "Leaving `row.names = TRUE` (the default) – the file then gets an extra first column with 1, 2, 3, … that shows up as `X` when you read it back.",
      "Overwriting a file by accident: `write.csv()` replaces an existing file with the same name without asking.",
    ],
    related: ["read.csv", "saveRDS", "file.exists"],
  },
  {
    name: "list.files",
    package: "base",
    category: "Import & export",
    purpose: "Lists the files in a folder. Use it to check a file name before reading it.",
    syntax: "list.files(path = \".\", pattern = NULL)",
    args: [
      { name: "path", description: "The folder to look in (default: the working directory)." },
      { name: "pattern", description: "Optional regular expression; only matching file names are listed." },
    ],
    example: `list.files("data")
list.files("data", pattern = "^s")`,
    output: "[1] \"customers_messy.csv\" \"housing.csv\"         \"patients.csv\"\n[4] \"sales.csv\"           \"students.csv\"        \"survey.csv\"\n[7] \"weather.csv\"\n[1] \"sales.csv\"    \"students.csv\" \"survey.csv\"",
    mistakes: [
      "Using `*.csv` as the pattern – `pattern` is a regular expression, so write `\"\\\\.csv$\"` (ends with .csv).",
      "Looking in the wrong folder: paths are relative to the working directory.",
    ],
    related: ["file.exists", "read.csv"],
  },
  {
    name: "file.exists",
    package: "base",
    category: "Import & export",
    purpose: "Checks whether a file exists and answers `TRUE` or `FALSE` – a polite way to avoid a \"cannot open file\" error.",
    syntax: "file.exists(...)",
    args: [{ name: "...", description: "One or more file paths, in quotes." }],
    example: `file.exists("data/students.csv")
file.exists("data/no_such_file.csv")`,
    output: "[1] TRUE\n[1] FALSE",
    mistakes: [
      "Forgetting the folder: `file.exists(\"students.csv\")` is `FALSE` because the file is inside `data/`.",
      "Checking only a folder: `file.exists(\"data\")` is `TRUE` because the folder exists, even if the file inside it does not.",
    ],
    related: ["list.files", "read.csv"],
  },
  {
    name: "saveRDS",
    package: "base",
    category: "Import & export",
    purpose:
      "Saves any single R object (a data frame, list, model, …) to an `.rds` file, keeping its exact types. Read it back with `readRDS()`.",
    syntax: "saveRDS(object, file)",
    args: [
      { name: "object", description: "The R object to save." },
      { name: "file", description: "The file name, usually ending in `.rds`." },
    ],
    example: `scores <- list(ana = c(90, 85), ben = c(70, 88))
saveRDS(scores, "scores.rds")
file.exists("scores.rds")`,
    output: "[1] TRUE",
    mistakes: [
      "Expecting to open an `.rds` file in a spreadsheet – it is an R-only format. Use `write.csv()` for sharing tables.",
      "Trying to save several objects in one call – `saveRDS()` saves exactly one object. Put them in a list first: `saveRDS(list(a = a, b = b), \"both.rds\")`.",
    ],
    related: ["readRDS", "write.csv"],
  },
  {
    name: "readRDS",
    package: "base",
    category: "Import & export",
    purpose: "Reads an object saved with `saveRDS()`. Assign the result to any name you like.",
    syntax: "readRDS(file)",
    args: [{ name: "file", description: "The `.rds` file to read." }],
    example: `scores <- list(ana = c(90, 85), ben = c(70, 88))
saveRDS(scores, "scores.rds")
restored <- readRDS("scores.rds")
identical(scores, restored)
restored$ben`,
    output: "[1] TRUE\n[1] 70 88",
    mistakes: [
      "Forgetting to assign: `readRDS(\"scores.rds\")` only prints the object.",
      "Trying to read a CSV with `readRDS()` – use `read.csv()` for CSV files.",
    ],
    related: ["saveRDS", "read.csv"],
  },

  /* ---------------------------------------------------------------- */
  /* Text (strings)                                                   */
  /* ---------------------------------------------------------------- */
  {
    name: "paste",
    package: "base",
    category: "Text (strings)",
    purpose:
      "Glues pieces of text (and numbers) together into one string, with a space in between by default. With `collapse` it joins all elements of a vector into one string.",
    syntax: "paste(..., sep = \" \", collapse = NULL)",
    args: [
      { name: "...", description: "The pieces to join. Vectors are joined element by element." },
      { name: "sep", description: "What goes between the pieces (default a space)." },
      { name: "collapse", description: "If given, all results are joined into one string with this in between." },
    ],
    example: `first <- "Ada"
last <- "Lovelace"
paste(first, last)
paste("Score:", 95)
paste("item", 1:3, sep = "_")
paste(c("a", "b", "c"), collapse = ", ")`,
    output: "[1] \"Ada Lovelace\"\n[1] \"Score: 95\"\n[1] \"item_1\" \"item_2\" \"item_3\"\n[1] \"a, b, c\"",
    mistakes: [
      "Mixing up `sep` and `collapse`: `sep` goes between pieces, `collapse` squashes a whole vector into one string.",
      "Getting unwanted spaces, e.g. `paste(\"ID\", 7)` gives `\"ID 7\"`. Use `paste0()` or `sep = \"\"` for no space.",
    ],
    related: ["paste0", "sprintf", "cat", "format"],
  },
  {
    name: "paste0",
    package: "base",
    category: "Text (strings)",
    purpose: "Like `paste()` but with nothing between the pieces. Ideal for IDs, file names and labels.",
    syntax: "paste0(..., collapse = NULL)",
    args: [
      { name: "...", description: "The pieces to join." },
      { name: "collapse", description: "Optional: join all results into one string with this in between." },
    ],
    example: `paste0("data/", "students", ".csv")
paste0("Q", 1:4)
id <- 7
paste0("ID-", id)`,
    output: "[1] \"data/students.csv\"\n[1] \"Q1\" \"Q2\" \"Q3\" \"Q4\"\n[1] \"ID-7\"",
    mistakes: [
      "Writing `paste0(\"a\", \"b\", sep = \"-\")` – `paste0()` has no `sep`; the `-` is just added as another piece (`\"ab-\"`). Use `paste()` with `sep`.",
      "Expecting missing values to be skipped – `NA` becomes the text `\"NA\"`: `paste0(\"ID-\", NA)` gives `\"ID-NA\"`.",
    ],
    related: ["paste", "sprintf", "as.character"],
  },
  {
    name: "nchar",
    package: "base",
    category: "Text (strings)",
    purpose: "Counts the characters in each string – letters, digits, spaces and punctuation all count.",
    syntax: "nchar(x)",
    args: [{ name: "x", description: "A character vector (numbers are converted to text first)." }],
    example: `nchar("hello")
nchar(c("R", "data", "science"))
nchar("hello world")
nchar(12345)`,
    output: "[1] 5\n[1] 1 4 7\n[1] 11\n[1] 5",
    mistakes: [
      "Using `length()` instead – `length(\"hello\")` is 1 (one string), while `nchar(\"hello\")` is 5.",
      "Forgetting that spaces count. Use `trimws()` first if stray spaces might be present.",
    ],
    related: ["length", "substr", "trimws"],
  },
  {
    name: "toupper",
    package: "base",
    category: "Text (strings)",
    purpose: "Converts text to UPPER CASE. Useful for codes such as country or state abbreviations.",
    syntax: "toupper(x)",
    args: [{ name: "x", description: "A character vector." }],
    example: `toupper("hello")
cities <- c("boston", "Chicago", "DENVER")
toupper(cities)
toupper("r is fun!")`,
    output: "[1] \"HELLO\"\n[1] \"BOSTON\"  \"CHICAGO\" \"DENVER\"\n[1] \"R IS FUN!\"",
    mistakes: [
      "Expecting it to change the variable: `toupper(x)` returns a new value; write `x <- toupper(x)` to keep it.",
      "Using it for Title Case – it capitalises every letter. For \"Title Case\" use `tools::toTitleCase()` or `stringr::str_to_title()`.",
    ],
    related: ["tolower", "trimws", "gsub"],
  },
  {
    name: "tolower",
    package: "base",
    category: "Text (strings)",
    purpose: "Converts text to lower case. The standard first step when cleaning categories typed in different ways (\"Yes\", \"YES\", \"yes\").",
    syntax: "tolower(x)",
    args: [{ name: "x", description: "A character vector." }],
    example: `tolower("HELLO World")
answers <- c("Yes", "YES", "yes", "No")
tolower(answers)
table(tolower(answers))`,
    output: "[1] \"hello world\"\n[1] \"yes\" \"yes\" \"yes\" \"no\"\n\n no yes\n  1   3",
    mistakes: [
      "Comparing text without fixing case: `\"Yes\" == \"yes\"` is `FALSE` because R is case-sensitive.",
      "Forgetting to assign the cleaned column back: `df$answer <- tolower(df$answer)`.",
    ],
    related: ["toupper", "trimws", "table"],
  },
  {
    name: "trimws",
    package: "base",
    category: "Text (strings)",
    purpose: "Removes spaces (and tabs/newlines) at the start and end of text. Inner spaces are kept. Essential when cleaning data typed by people.",
    syntax: "trimws(x, which = \"both\")",
    args: [
      { name: "x", description: "A character vector." },
      { name: "which", description: "`\"both\"`, `\"left\"` or `\"right\"` – which side to trim." },
    ],
    example: `trimws("   hello   ")
cities <- c(" Boston", "Chicago ", "  Denver  ")
trimws(cities)
trimws("  left and right  ", which = "left")`,
    output: "[1] \"hello\"\n[1] \"Boston\"  \"Chicago\" \"Denver\"\n[1] \"left and right  \"",
    mistakes: [
      "Expecting double spaces *inside* text to be fixed – `trimws()` only cleans the ends. Use `gsub(\" +\", \" \", x)` for inner spaces.",
      "Forgetting to save the cleaned values: `df$city <- trimws(df$city)`.",
    ],
    related: ["tolower", "gsub", "nchar"],
  },
  {
    name: "substr",
    package: "base",
    category: "Text (strings)",
    purpose: "Extracts part of a string by character positions – for example the year from `\"2024-03-15\"` (characters 1 to 4).",
    syntax: "substr(x, start, stop)",
    args: [
      { name: "x", description: "A character vector." },
      { name: "start", description: "Position of the first character to keep (counting from 1)." },
      { name: "stop", description: "Position of the last character to keep." },
    ],
    example: `substr("Statistics", 1, 4)
codes <- c("NY-2023", "CA-2024")
substr(codes, 1, 2)
substr(codes, 4, 7)
dates <- c("2024-03-15", "2023-11-02")
as.numeric(substr(dates, 1, 4))`,
    output: "[1] \"Stat\"\n[1] \"NY\" \"CA\"\n[1] \"2023\" \"2024\"\n[1] 2024 2023",
    mistakes: [
      "Giving a length instead of an end position: `substr(x, 4, 3)` returns an empty string because stop is before start.",
      "Using it on values of different lengths, where the positions do not line up. For patterns, use `sub()` or `strsplit()` instead.",
    ],
    related: ["strsplit", "nchar", "sub"],
  },
  {
    name: "strsplit",
    package: "base",
    category: "Text (strings)",
    purpose:
      "Splits text into pieces at a separator, e.g. `\"a,b,c\"` at the commas. The result is a *list* (one element per input string), so use `[[1]]` to get the pieces of a single string.",
    syntax: "strsplit(x, split, fixed = FALSE)",
    args: [
      { name: "x", description: "A character vector to split." },
      { name: "split", description: "The separator. It is a regular expression unless `fixed = TRUE`." },
      { name: "fixed", description: "`TRUE` to treat `split` as plain text (needed for `\".\"`)." },
    ],
    example: `strsplit("apple,banana,cherry", ",")
strsplit("2024-03-15", "-")[[1]]
words <- strsplit("R is really fun", " ")[[1]]
length(words)`,
    output: "[[1]]\n[1] \"apple\"  \"banana\" \"cherry\"\n\n[1] \"2024\" \"03\"   \"15\"\n[1] 4",
    mistakes: [
      "Forgetting that the result is a list – `length(strsplit(\"a b c\", \" \"))` is 1. Add `[[1]]`.",
      "Splitting at a dot without `fixed = TRUE`: in a regular expression `\".\"` means *any character*, so `strsplit(\"a.b\", \".\")` gives only empty strings.",
    ],
    related: ["substr", "paste", "gsub", "separate"],
  },
  {
    name: "sub",
    package: "base",
    category: "Text (strings)",
    purpose: "Replaces the **first** match of a pattern in each string. Use `gsub()` to replace all matches.",
    syntax: "sub(pattern, replacement, x, ignore.case = FALSE, fixed = FALSE)",
    args: [
      { name: "pattern", description: "What to look for (a regular expression unless `fixed = TRUE`)." },
      { name: "replacement", description: "The new text (use `\"\"` to delete)." },
      { name: "x", description: "The character vector to change." },
    ],
    example: `sub("cat", "dog", "cat and cat")
gsub("cat", "dog", "cat and cat")
files <- c("report_v1.txt", "data_v1.csv")
sub("_v1", "", files)`,
    output: "[1] \"dog and cat\"\n[1] \"dog and dog\"\n[1] \"report.txt\" \"data.csv\"",
    mistakes: [
      "Expecting every match to change – `sub()` changes only the first one in each string.",
      "Putting the arguments in the wrong order. It is always pattern, replacement, then the data.",
    ],
    related: ["gsub", "grepl", "strsplit"],
  },
  {
    name: "gsub",
    package: "base",
    category: "Text (strings)",
    purpose:
      "Replaces **every** match of a pattern (\"g\" = global). The go-to tool for cleaning text, such as removing `$` and `,` from prices before converting them to numbers.",
    syntax: "gsub(pattern, replacement, x, ignore.case = FALSE, fixed = FALSE)",
    args: [
      { name: "pattern", description: "What to look for – a regular expression, e.g. `\"[$,]\"` means \"a dollar sign or a comma\"." },
      { name: "replacement", description: "The new text (`\"\"` deletes the match)." },
      { name: "x", description: "The character vector to change." },
      { name: "fixed", description: "`TRUE` to match the pattern as plain text." },
    ],
    example: `gsub(" ", "_", "my data file")
prices <- c("$1,200", "$950", "$15,000")
as.numeric(gsub("[$,]", "", prices))
gsub("a", "A", "banana")
gsub(".", "-", "a.b.c", fixed = TRUE)`,
    output: "[1] \"my_data_file\"\n[1]  1200   950 15000\n[1] \"bAnAnA\"\n[1] \"a-b-c\"",
    mistakes: [
      "Forgetting that special characters (`.`, `$`, `(`, `+`, `?`) mean something in regular expressions. `gsub(\".\", \"-\", \"a.b\")` replaces *every* character. Use `fixed = TRUE` or put them in `[ ]`.",
      "Expecting a number back – `gsub()` always returns text, so wrap it in `as.numeric()`.",
    ],
    related: ["sub", "grepl", "trimws", "as.numeric"],
  },
  {
    name: "grepl",
    package: "base",
    category: "Text (strings)",
    purpose: "Checks whether each string contains a pattern and returns `TRUE`/`FALSE`. Perfect for filtering rows by text.",
    syntax: "grepl(pattern, x, ignore.case = FALSE, fixed = FALSE)",
    args: [
      { name: "pattern", description: "The text or regular expression to look for." },
      { name: "x", description: "The character vector to search." },
      { name: "ignore.case", description: "`TRUE` to ignore upper/lower case." },
    ],
    example: `emails <- c("ana@mail.com", "ben.example", "cleo@site.org")
grepl("@", emails)
sum(grepl("@", emails))
grepl("APPLE", c("apple pie", "Apple"), ignore.case = TRUE)`,
    output: "[1]  TRUE FALSE  TRUE\n[1] 2\n[1] TRUE TRUE",
    mistakes: [
      "Swapping the arguments: `grepl(emails, \"@\")` searches for the emails inside the text \"@\". The pattern comes first.",
      "Forgetting that matching is case-sensitive unless `ignore.case = TRUE`.",
    ],
    related: ["grep", "gsub", "filter", "subset"],
  },
  {
    name: "grep",
    package: "base",
    category: "Text (strings)",
    purpose: "Finds which strings contain a pattern. It returns their positions, or the matching strings themselves with `value = TRUE`.",
    syntax: "grep(pattern, x, ignore.case = FALSE, value = FALSE)",
    args: [
      { name: "pattern", description: "The text or regular expression to look for. `^` means \"starts with\", `$` means \"ends with\"." },
      { name: "x", description: "The character vector to search." },
      { name: "value", description: "`TRUE` returns the matching strings instead of positions." },
    ],
    example: `fruits <- c("apple", "banana", "grape", "pineapple")
grep("apple", fruits)
grep("apple", fruits, value = TRUE)
grep("^b", fruits, value = TRUE)`,
    output: "[1] 1 4\n[1] \"apple\"     \"pineapple\"\n[1] \"banana\"",
    mistakes: [
      "Using `grep()` inside `[ ]` for filtering data frame rows when you need `TRUE`/`FALSE` – `grepl()` is usually simpler.",
      "Forgetting `value = TRUE` and getting position numbers when you wanted the matching text.",
    ],
    related: ["grepl", "which", "sub"],
  },

  /* ---------------------------------------------------------------- */
  /* Dates                                                            */
  /* ---------------------------------------------------------------- */
  {
    name: "as.Date",
    package: "base",
    category: "Dates",
    purpose:
      "Converts text such as `\"2024-03-15\"` into a real date. Dates can be compared, sorted and used in arithmetic (`date + 30` is 30 days later).",
    syntax: "as.Date(x, format)",
    args: [
      { name: "x", description: "Text (or numbers) to convert." },
      { name: "format", description: "The pattern of the text if it is not `YYYY-MM-DD`, e.g. `\"%d/%m/%Y\"` for 15/03/2024." },
    ],
    example: `d <- as.Date("2024-03-15")
d
class(d)
d + 30
as.Date("15/03/2024", format = "%d/%m/%Y")
as.Date("2024-12-25") - as.Date("2024-01-01")`,
    output: "[1] \"2024-03-15\"\n[1] \"Date\"\n[1] \"2024-04-14\"\n[1] \"2024-03-15\"\nTime difference of 359 days",
    mistakes: [
      "Leaving out `format` for non-standard text: `as.Date(\"15/03/2024\")` does not fail – it silently reads the year as 15 and gives a wrong date. Describe the pattern: `%d` day, `%m` month number, `%Y` four-digit year, `%y` two-digit year, `%B` month name.",
      "Keeping dates as text – then sorting and subtracting do not work. Convert date columns right after importing.",
    ],
    related: ["Sys.Date", "difftime", "format", "weekdays"],
  },
  {
    name: "Sys.Date",
    package: "base",
    category: "Dates",
    purpose:
      "Returns today's date (according to the computer's clock) as a `Date`. Its value changes every day, so the example only shows things that are always true.",
    syntax: "Sys.Date()",
    args: [{ name: "(none)", description: "Called with empty parentheses." }],
    example: `today <- Sys.Date()
class(today)
today > as.Date("2020-01-01")
nchar(format(today))`,
    output: "[1] \"Date\"\n[1] TRUE\n[1] 10",
    mistakes: [
      "Forgetting the parentheses: `Sys.Date` shows the function instead of the date.",
      "Writing `sys.date()` – R is case-sensitive; the name is `Sys.Date` with capital S and D.",
    ],
    related: ["Sys.time", "as.Date", "difftime", "format"],
  },
  {
    name: "Sys.time",
    package: "base",
    category: "Dates",
    purpose:
      "Returns the current date *and* time (a `POSIXct` value). A common use is timing code: record the time before and after, then subtract.",
    syntax: "Sys.time()",
    args: [{ name: "(none)", description: "Called with empty parentheses." }],
    example: `now <- Sys.time()
class(now)
start <- Sys.time()
total <- sum(1:1000)
elapsed <- Sys.time() - start
class(elapsed)`,
    output: "[1] \"POSIXct\" \"POSIXt\"\n[1] \"difftime\"",
    mistakes: [
      "Comparing a date-time with a plain `Date` – convert one of them first (`as.Date(Sys.time())`).",
      "Reading a time difference without its unit – R picks seconds, minutes or hours automatically. Use `difftime(end, start, units = \"secs\")` to fix the unit.",
    ],
    related: ["Sys.Date", "difftime"],
  },
  {
    name: "difftime",
    package: "base",
    category: "Dates",
    purpose:
      "Calculates the time between two dates or times in the unit you choose (days, weeks, hours, …). Wrap it in `as.numeric()` to get a plain number.",
    syntax: "difftime(time1, time2, units = \"auto\")",
    args: [
      { name: "time1, time2", description: "The later and the earlier date (the result is time1 − time2)." },
      { name: "units", description: "`\"days\"`, `\"weeks\"`, `\"hours\"`, `\"mins\"`, `\"secs\"` or `\"auto\"`." },
    ],
    example: `start <- as.Date("2024-01-01")
end <- as.Date("2024-03-01")
difftime(end, start, units = "days")
difftime(end, start, units = "weeks")
as.numeric(difftime(end, start, units = "days"))`,
    output: "Time difference of 60 days\nTime difference of 8.571429 weeks\n[1] 60",
    mistakes: [
      "Passing the dates as text – convert them with `as.Date()` first, or R may misread them.",
      "Asking for `units = \"months\"` or `\"years\"` – those are not allowed because months and years have different lengths. Divide days by 365.25 for approximate years.",
    ],
    related: ["as.Date", "Sys.Date", "as.numeric"],
  },
  {
    name: "weekdays",
    package: "base",
    category: "Dates",
    purpose: "Returns the name of the day of the week for each date. Great for questions like \"are sales higher at weekends?\".",
    syntax: "weekdays(x, abbreviate = FALSE)",
    args: [
      { name: "x", description: "A `Date` vector." },
      { name: "abbreviate", description: "`TRUE` for short names such as \"Fri\"." },
    ],
    example: `d <- as.Date(c("2024-03-15", "2024-03-16"))
weekdays(d)
format(d, "%A %d %B")`,
    output: "[1] \"Friday\"   \"Saturday\"\n[1] \"Friday 15 March\"   \"Saturday 16 March\"",
    mistakes: [
      "Calling it on text – `weekdays(\"2024-03-15\")` fails; convert with `as.Date()` first.",
      "Sorting the day names alphabetically (Friday, Monday, …). Make them a factor with the levels in calendar order.",
    ],
    related: ["months", "as.Date", "format"],
  },
  {
    name: "months",
    package: "base",
    category: "Dates",
    purpose: "Returns the month name of each date. For the month *number*, use `format(d, \"%m\")`.",
    syntax: "months(x, abbreviate = FALSE)",
    args: [
      { name: "x", description: "A `Date` vector." },
      { name: "abbreviate", description: "`TRUE` for short names such as \"Jan\"." },
    ],
    example: `d <- as.Date(c("2024-01-10", "2024-06-05", "2024-12-31"))
months(d)
format(d, "%m")
as.numeric(format(d, "%m"))`,
    output: "[1] \"January\"  \"June\"     \"December\"\n[1] \"01\" \"06\" \"12\"\n[1]  1  6 12",
    mistakes: [
      "Expecting numbers – `months()` returns names. Use `as.numeric(format(d, \"%m\"))` for 1–12.",
      "Grouping by month name across several years mixes January 2023 with January 2024. Include the year, e.g. `format(d, \"%Y-%m\")`.",
    ],
    related: ["weekdays", "as.Date", "format"],
  },
];
