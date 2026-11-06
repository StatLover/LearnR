import type { CheatSheet } from "../types";

/** Cheat sheets – dplyr, ggplot2, basic statistics, strings & dates, common errors. */
export const analysisCheatSheets: CheatSheet[] = [
  {
    id: "dplyr",
    title: "dplyr",
    description: "Filter, select, create, sort, summarise and join data with dplyr verbs chained together by the pipe.",
    sections: [
      {
        title: "Getting started",
        items: [
          { code: "library(dplyr)\nstudents <- read.csv(\"data/students.csv\")", description: "Load dplyr once per session, then read your data." },
          { code: "students |> filter(class == \"A\") |> nrow()", description: "The pipe `|>` passes the result on the left into the next function." },
          { code: "top <- students |> filter(math > 90)", description: "Verbs never change the original – assign the result to keep it." },
        ],
      },
      {
        title: "Rows",
        items: [
          { code: "filter(students, class == \"A\", math > 80)", description: "Keep rows where *all* conditions are `TRUE`." },
          { code: "filter(students, class == \"A\" | class == \"B\")\nfilter(students, class %in% c(\"A\", \"B\"))", description: "\"Or\" conditions, and the shorter `%in%` form." },
          { code: "filter(students, !is.na(science))", description: "Drop rows with a missing value in one column." },
          { code: "arrange(students, math)\narrange(students, desc(math))", description: "Sort rows, ascending or descending." },
          { code: "distinct(students, class, gender)", description: "Unique combinations of columns." },
          { code: "slice_head(students, n = 5)\nslice_max(students, math, n = 3)", description: "First rows, or the rows with the largest values." },
        ],
      },
      {
        title: "Columns",
        items: [
          { code: "select(students, name, math, reading)", description: "Keep these columns, in this order." },
          { code: "select(students, -student_id)\nselect(students, starts_with(\"s\"))", description: "Drop a column; select by a name pattern." },
          { code: "rename(students, maths = math)", description: "Rename: `new_name = old_name`." },
          { code: "mutate(students, total = math + reading + science)", description: "Add a calculated column (or overwrite one)." },
          { code: "mutate(students, level = case_when(\n  math >= 90 ~ \"top\",\n  math >= 60 ~ \"pass\",\n  TRUE ~ \"fail\"\n))", description: "Categories from several conditions – the first true one wins." },
        ],
      },
      {
        title: "Summaries",
        items: [
          { code: "summarise(students, avg_math = mean(math), n = n())", description: "Collapse all rows into one row of summaries; `n()` counts rows." },
          { code: "students |>\n  group_by(class) |>\n  summarise(avg_math = mean(math), n = n())", description: "One summary row per group." },
          { code: "summarise(students, avg_science = mean(science, na.rm = TRUE))", description: "Remember `na.rm = TRUE` when a column has missing values." },
          { code: "count(students, class)\ncount(students, class, gender, sort = TRUE)", description: "Count rows per group." },
          { code: "summarise(students, classes = n_distinct(class))", description: "Number of different values." },
        ],
      },
      {
        title: "Joins",
        items: [
          { code: "people <- data.frame(id = 1:3, name = c(\"Ana\", \"Ben\", \"Cleo\"))\ncities <- data.frame(id = c(1, 3), city = c(\"Rome\", \"Oslo\"))", description: "Two tables sharing a key column `id`." },
          { code: "left_join(people, cities, by = \"id\")", description: "Keep every row of the first table; no match gives `NA`." },
          { code: "inner_join(people, cities, by = \"id\")", description: "Keep only rows found in both." },
          { code: "full_join(people, cities, by = \"id\")\nanti_join(people, cities, by = \"id\")", description: "Keep all rows of both / rows of the first with no match." },
        ],
      },
      {
        title: "A full pipeline",
        items: [
          { code: "students |>\n  filter(!is.na(science)) |>\n  mutate(average = (math + reading + science) / 3) |>\n  group_by(class) |>\n  summarise(best = max(average), mean_avg = mean(average)) |>\n  arrange(desc(mean_avg))", description: "Clean → calculate → group → summarise → sort, read top to bottom." },
        ],
      },
    ],
  },
  {
    id: "ggplot2",
    title: "ggplot2",
    description: "Build charts in layers: data, aesthetics, geoms, labels, facets and themes.",
    sections: [
      {
        title: "The template",
        items: [
          { code: "library(ggplot2)\nggplot(mtcars, aes(x = wt, y = mpg)) +\n  geom_point()", description: "Data + aesthetic mapping + at least one geom. Layers are added with `+` at the end of each line." },
          { code: "p <- ggplot(mtcars, aes(x = wt, y = mpg))\np + geom_point()", description: "A plot can be stored in a variable and extended later." },
        ],
      },
      {
        title: "Common geoms",
        items: [
          { code: "ggplot(mtcars, aes(x = wt, y = mpg)) + geom_point()", description: "Scatter plot – two numeric variables." },
          { code: "ggplot(economics, aes(x = date, y = unemploy)) + geom_line()", description: "Line chart – values over time." },
          { code: "ggplot(mtcars, aes(x = mpg)) + geom_histogram(bins = 10)", description: "Histogram – distribution of one numeric variable." },
          { code: "ggplot(mtcars, aes(x = factor(cyl))) + geom_bar()", description: "Bar chart of counts – ggplot2 counts the rows." },
          { code: "totals <- data.frame(region = c(\"N\", \"S\"), sales = c(120, 95))\nggplot(totals, aes(x = region, y = sales)) + geom_col()", description: "Bar chart of values you already have." },
          { code: "ggplot(mtcars, aes(x = factor(cyl), y = mpg)) + geom_boxplot()", description: "Box plots – compare distributions between groups." },
          { code: "ggplot(mtcars, aes(x = wt, y = mpg)) +\n  geom_point() +\n  geom_smooth(method = \"lm\", formula = y ~ x)", description: "Add a regression line with its confidence band." },
        ],
      },
      {
        title: "Aesthetics",
        items: [
          { code: "aes(x = wt, y = mpg, colour = factor(cyl))", description: "Map a column to colour (use `factor()` for distinct colours)." },
          { code: "aes(x = factor(cyl), fill = factor(am))", description: "`fill` colours the inside of bars and boxes." },
          { code: "aes(size = hp, shape = factor(gear))", description: "Size and point shape can show data too." },
          { code: "geom_point(colour = \"steelblue\", size = 3, alpha = 0.6)", description: "Fixed settings go *outside* `aes()`, inside the geom." },
          { code: "geom_bar(position = \"dodge\")", description: "Bars side by side instead of stacked (`\"fill\"` shows proportions)." },
        ],
      },
      {
        title: "Labels, scales & themes",
        items: [
          { code: "labs(title = \"Fuel use\", x = \"Weight\", y = \"MPG\", colour = \"Cylinders\")", description: "Title, axis labels and legend title." },
          { code: "theme_minimal()\ntheme_bw()\ntheme_classic()", description: "Complete themes that change the overall look." },
          { code: "theme(legend.position = \"bottom\")", description: "Fine-tune one element (add after a complete theme)." },
          { code: "scale_colour_manual(values = c(\"red\", \"blue\", \"darkgreen\"))", description: "Choose the colours yourself." },
          { code: "scale_y_continuous(limits = c(0, NA))", description: "Start the y axis at 0." },
          { code: "coord_flip()", description: "Swap the axes – handy for long category names." },
        ],
      },
      {
        title: "Facets & saving",
        items: [
          { code: "ggplot(mtcars, aes(x = wt, y = mpg)) +\n  geom_point() +\n  facet_wrap(~ cyl)", description: "One small panel per group." },
          { code: "facet_grid(am ~ cyl)", description: "A grid of panels: rows by one variable, columns by another." },
          { code: "ggsave(\"my_plot.png\", width = 6, height = 4)", description: "Save the last plot to a file (on your own computer)." },
        ],
      },
    ],
  },
  {
    id: "statistics",
    title: "Basic statistics",
    description: "Describe data with measures of centre and spread, count categories, look at relationships and run the most common tests.",
    sections: [
      {
        title: "Centre",
        items: [
          { code: "mean(mtcars$mpg)", description: "The average." },
          { code: "median(mtcars$mpg)", description: "The middle value – robust to outliers." },
          { code: "mean(airquality$Ozone, na.rm = TRUE)", description: "Ignore missing values." },
          { code: "counts <- table(mtcars$cyl)\nnames(counts)[which.max(counts)]", description: "The mode (most common value) – R has no built-in function for it." },
        ],
      },
      {
        title: "Spread & position",
        items: [
          { code: "sd(mtcars$mpg)\nvar(mtcars$mpg)", description: "Standard deviation and variance (sample versions)." },
          { code: "range(mtcars$mpg)\ndiff(range(mtcars$mpg))", description: "Minimum and maximum; the range as one number." },
          { code: "quantile(mtcars$mpg)\nquantile(mtcars$mpg, 0.9)", description: "Quartiles, or any percentile." },
          { code: "IQR(mtcars$mpg)", description: "Interquartile range: the spread of the middle 50%." },
          { code: "summary(mtcars$mpg)", description: "Min, quartiles, median, mean and max in one go." },
          { code: "as.vector(scale(mtcars$mpg))", description: "Z-scores: distance from the mean in standard deviations." },
        ],
      },
      {
        title: "Categories",
        items: [
          { code: "table(mtcars$cyl)", description: "Frequency table: counts per category." },
          { code: "prop.table(table(mtcars$cyl))", description: "Proportions instead of counts." },
          { code: "table(mtcars$am, mtcars$cyl)", description: "Cross-table of two categorical variables." },
          { code: "cut(c(15, 30, 70), breaks = c(0, 18, 65, 100))", description: "Turn numbers into groups (bins)." },
        ],
      },
      {
        title: "Relationships",
        items: [
          { code: "cor(mtcars$wt, mtcars$mpg)", description: "Correlation from −1 to +1." },
          { code: "cor(mtcars[, c(\"mpg\", \"wt\", \"hp\")])", description: "Correlation matrix of several numeric columns." },
          { code: "model <- lm(mpg ~ wt, data = mtcars)\nsummary(model)", description: "Linear regression: coefficients, p-values and R²." },
          { code: "coef(model)\nsummary(model)$r.squared", description: "Just the coefficients, or just R²." },
          { code: "predict(model, newdata = data.frame(wt = 3))", description: "Predict the outcome for new values." },
        ],
      },
      {
        title: "Tests",
        items: [
          { code: "t.test(mtcars$mpg, mu = 20)", description: "One-sample t-test: is the mean different from 20?" },
          { code: "t.test(mpg ~ am, data = mtcars)", description: "Two-sample t-test: do two groups have different means?" },
          { code: "t.test(extra ~ group, data = sleep)$p.value", description: "Pull out just the p-value." },
          { code: "chisq.test(table(mtcars$am, mtcars$vs))", description: "Chi-square test: are two categorical variables related?" },
          { code: "summary(aov(weight ~ group, data = PlantGrowth))", description: "ANOVA: do three or more group means differ?" },
          { code: "shapiro.test(mtcars$mpg)", description: "Are the data plausibly normal? (small p = probably not)" },
        ],
      },
      {
        title: "Reading results",
        items: [
          { code: "p <- t.test(mpg ~ am, data = mtcars)$p.value\np < 0.05", description: "If p is below the significance level (usually 0.05), reject the null hypothesis." },
          { code: "t.test(mtcars$mpg)$conf.int", description: "A 95% confidence interval: a range of plausible values for the population mean." },
          { code: "set.seed(42)\nsample(1:100, 5)", description: "Set a seed so random results are reproducible." },
        ],
      },
    ],
  },
  {
    id: "strings-dates",
    title: "Strings & dates",
    description: "Build, clean and search text, and turn text into real dates you can calculate with.",
    sections: [
      {
        title: "Building text",
        items: [
          { code: "paste(\"Hello\", \"world\")\npaste0(\"ID-\", 7)", description: "Join pieces with a space, or with nothing in between." },
          { code: "paste(c(\"a\", \"b\", \"c\"), collapse = \", \")", description: "Collapse a vector into one string." },
          { code: "sprintf(\"%s scored %.1f\", \"Ana\", 87.46)", description: "Templates: `%s` text, `%d` whole number, `%.1f` one decimal." },
          { code: "format(1234567, big.mark = \",\")\nformat(3.5, nsmall = 2)", description: "Thousands separators and fixed decimals." },
        ],
      },
      {
        title: "Inspecting & cleaning",
        items: [
          { code: "nchar(\"hello\")", description: "Number of characters." },
          { code: "toupper(\"abc\")\ntolower(\"ABC\")", description: "Change case." },
          { code: "trimws(\"  Boston  \")", description: "Remove spaces at both ends." },
          { code: "substr(\"2024-03-15\", 1, 4)", description: "Characters 1 to 4." },
          { code: "tolower(trimws(c(\" Yes\", \"YES \", \"yes\")))", description: "Typical clean-up: trim, then make case consistent." },
        ],
      },
      {
        title: "Patterns",
        items: [
          { code: "grepl(\"@\", c(\"ana@mail.com\", \"ben\"))", description: "Does each string contain the pattern? (`TRUE`/`FALSE`)" },
          { code: "sub(\"a\", \"A\", \"banana\")\ngsub(\"a\", \"A\", \"banana\")", description: "Replace the first match / every match." },
          { code: "as.numeric(gsub(\"[$,]\", \"\", \"$1,200\"))", description: "Remove `$` and `,` before converting to a number." },
          { code: "strsplit(\"a,b,c\", \",\")[[1]]", description: "Split at a separator (the result is a list, hence `[[1]]`)." },
          { code: "grepl(\"^A\", c(\"Apple\", \"Banana\"))\ngrepl(\"[0-9]\", c(\"R2\", \"R\"))", description: "Regex basics: `^` start, `$` end, `[0-9]` any digit, `.` any character." },
          { code: "gsub(\".\", \"-\", \"a.b.c\", fixed = TRUE)", description: "`fixed = TRUE` treats the pattern as plain text." },
        ],
      },
      {
        title: "Dates",
        items: [
          { code: "d <- as.Date(\"2024-03-15\")", description: "Text in `YYYY-MM-DD` form becomes a date." },
          { code: "as.Date(\"15/03/2024\", format = \"%d/%m/%Y\")", description: "Other layouts need a format: `%d` day, `%m` month, `%Y` 4-digit year, `%y` 2-digit year, `%B` month name." },
          { code: "d + 30\nas.Date(\"2024-12-25\") - d", description: "Add days; subtract dates to get the days between them." },
          { code: "difftime(as.Date(\"2024-12-25\"), d, units = \"weeks\")", description: "Time between dates in a chosen unit." },
          { code: "weekdays(d)\nmonths(d)\nformat(d, \"%Y\")", description: "Day name, month name, and any part of the date as text." },
          { code: "seq(as.Date(\"2024-01-01\"), by = \"month\", length.out = 3)", description: "A sequence of dates." },
          { code: "Sys.Date()", description: "Today's date (changes every day)." },
        ],
      },
      {
        title: "stringr & lubridate",
        items: [
          { code: "library(stringr)\nstr_detect(\"banana\", \"an\")\nstr_to_title(\"hello world\")", description: "stringr: consistent `str_` functions for text." },
          { code: "library(lubridate)\nymd(\"2024-03-15\")\ndmy(\"15/03/2024\")", description: "lubridate: read dates by naming the order of year, month and day." },
          { code: "library(lubridate)\nyear(ymd(\"2024-03-15\"))\nmonth(ymd(\"2024-03-15\"), label = TRUE)", description: "Extract parts of a date." },
        ],
      },
    ],
  },
  {
    id: "errors",
    title: "Common error messages & fixes",
    description: "The error and warning messages beginners see most often, what they mean and how to fix them. Each snippet shows the message as a comment, followed by working code.",
    sections: [
      {
        title: "Not found",
        items: [
          { code: "# Error: object 'Scores' not found\nscores <- c(80, 90)\nmean(scores)", description: "R cannot find a variable with that name. Check spelling and capitals, and make sure you ran the line that creates it." },
          { code: "# Error in ggplot(mtcars, aes(wt, mpg)) : could not find function \"ggplot\"\nlibrary(ggplot2)\nggplot(mtcars, aes(wt, mpg)) + geom_point()", description: "The function lives in a package that is not loaded (or the name is misspelled). Run `library()` first." },
          { code: "# Error in library(dplr) : there is no package called ‘dplr’\nlibrary(dplyr)", description: "The package name is misspelled or the package is not installed." },
          { code: "# Error in file(file, \"rt\") : cannot open the connection\nfile.exists(\"data/students.csv\")\nstudents <- read.csv(\"data/students.csv\")", description: "The file path is wrong. Check the folder and file name with `list.files()`." },
        ],
      },
      {
        title: "Syntax errors",
        items: [
          { code: "# Error: unexpected symbol\nx <- c(1, 2, 3)", description: "Usually a missing comma, bracket or operator between two names or values." },
          { code: "# Error: unexpected ')'\nmean(c(1, 2))", description: "Brackets do not match – count the opening and closing ones." },
          { code: "# Error: unexpected string constant\npaste(\"a\", \"b\")", description: "A comma is missing between two pieces of text." },
          { code: "# Error: unexpected '=' in \"if (x =\"\nx <- 5\nif (x == 5) print(\"five\")", description: "A single `=` inside a condition. Use `==` to compare and `<-` to assign." },
          { code: "# Error: unexpected 'else'\nif (x > 5) {\n  \"big\"\n} else {\n  \"small\"\n}", description: "`else` must be on the same line as the closing `}` of the `if`." },
        ],
      },
      {
        title: "Wrong type",
        items: [
          { code: "# Error in \"5\" + 1 : non-numeric argument to binary operator\nas.numeric(\"5\") + 1", description: "You are calculating with text. Convert it with `as.numeric()` first." },
          { code: "# Error in sum(x) : invalid 'type' (character) of argument\nsum(as.numeric(c(\"1\", \"2\")))", description: "A summary function received text instead of numbers." },
          { code: "# Error in log(\"a\") : non-numeric argument to mathematical function\nlog(10)", description: "Maths functions need numbers. Check the column with `class()`." },
        ],
      },
      {
        title: "Data frames & indexing",
        items: [
          { code: "# Error in `[.data.frame`(df, df$age > 30) : undefined columns selected\ndf <- data.frame(age = c(25, 40))\ndf[df$age > 30, ]", description: "You forgot the comma: rows go *before* the comma, columns after." },
          { code: "# Error in data.frame(...) : arguments imply differing number of rows: 3, 2\ndata.frame(a = 1:3, b = 4:6)", description: "All columns of a data frame must have the same length." },
          { code: "# Error in if (x > 5) ... : the condition has length > 1\nx <- c(3, 8)\nifelse(x > 5, \"big\", \"small\")", description: "`if` takes a single `TRUE`/`FALSE`. Use `ifelse()` for vectors, or `any()`/`all()`." },
          { code: "# Error in if (x > 5) ... : missing value where TRUE/FALSE needed\nx <- NA\nif (isTRUE(x > 5)) \"big\"", description: "The condition is `NA`. Handle missing values first or use `isTRUE()`." },
          { code: "# Error in x[[5]] : subscript out of bounds\nx <- list(1, 2, 3)\nlength(x)", description: "You asked for an element that does not exist. Check the length first." },
        ],
      },
      {
        title: "Warnings worth reading",
        items: [
          { code: "# Warning: NAs introduced by coercion\nas.numeric(gsub(\"[$,]\", \"\", c(\"$1,200\", \"950\")))", description: "Some text could not become a number. Clean it (symbols, commas, \"N/A\") before converting." },
          { code: "# Warning: longer object length is not a multiple of shorter object length\n# (from c(1, 2, 3) + c(10, 20))\nc(1, 2, 3) + c(10, 20, 30)", description: "Two vectors of awkward lengths were recycled. Usually a sign that one of them is the wrong length." },
          { code: "# Warning: argument is not numeric or logical: returning NA\n# (from mean(c(\"2\", \"4\")))\nmean(as.numeric(c(\"2\", \"4\")))", description: "`mean()` of text gives `NA` with this warning – convert to numbers first." },
          { code: "# Warning in sqrt(-1) : NaNs produced\nsqrt(abs(-1))", description: "The maths has no real answer (square root or log of a negative number)." },
          { code: "# Warning: invalid factor level, NA generated\nf <- factor(c(\"a\", \"b\"), levels = c(\"a\", \"b\", \"c\"))\nf[1] <- \"c\"", description: "You assigned a value that is not one of the factor's levels. Add the level first." },
          { code: "# Warning: Removed 37 rows containing missing values (`geom_point()`).\nsum(is.na(airquality$Ozone))", description: "ggplot2 skipped rows with `NA`. Usually harmless, but check how much data is missing." },
        ],
      },
    ],
  },
];
