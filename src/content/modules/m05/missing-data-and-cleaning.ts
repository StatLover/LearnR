import type { Lesson } from "../../types";

export const missingDataAndCleaningLesson: Lesson = {
  id: "missing-data-and-cleaning",
  module: 5,
  title: "Handling Missing Data and Cleaning Datasets",
  summary: "Find, remove and replace missing values, then clean a messy dataset: stray spaces, inconsistent capitals, wrong types, bad column names and duplicated rows.",
  minutes: 40,
  objectives: [
    "Find missing values with `is.na()`, `sum(is.na())` and `colSums(is.na())`",
    "Ignore missing values with `na.rm = TRUE`, or remove incomplete rows with `complete.cases()` and `na.omit()`",
    "Replace missing values with a chosen value such as 0 or the median",
    "Clean text with `trimws()`, `tolower()` and `toupper()`, and fix column types with `as.numeric()`",
    "Rename columns and remove duplicated rows with `duplicated()`",
  ],
  intro: `Real data is rarely tidy and complete. A survey question was skipped, a sensor broke for a day, someone typed " boston " with spaces, another typed "BOSTON", and the same customer was exported twice. If you analyse such data as it is, you get wrong answers – often without any error message.

**Data cleaning** means finding and fixing these problems *before* the analysis. Analysts often say it takes most of their time. In this lesson you first learn to handle **missing values** (\`NA\`), then you clean a deliberately messy customer list step by step. Every fix uses tools you already know – vectors, conditions and assignment – combined in new ways.`,
  sections: [
    {
      id: "finding-na",
      title: "Finding missing values",
      blocks: [
        {
          kind: "definition",
          term: "Missing data",
          md: "**Missing data** are values that should be there but are not – a skipped question, an unreadable measurement. R stores a missing value as `NA` (*not available*). In a CSV file, an empty cell or the text `NA` becomes `NA` when you import it.",
        },
        {
          kind: "text",
          md: "`is.na()` asks *is this value missing?* for every element and answers with `TRUE` or `FALSE`. Because `TRUE` counts as 1, `sum(is.na(x))` counts the missing values.",
        },
        {
          kind: "code",
          example: {
            id: "is-na-vector",
            title: "is.na() on a vector",
            code: `scores <- c(85, NA, 72, 90, NA)

is.na(scores)
sum(is.na(scores))
mean(scores)
mean(scores, na.rm = TRUE)`,
            explanation: [
              { code: "is.na(scores)", text: "One answer per value: positions 2 and 5 are missing." },
              { code: "sum(is.na(scores))", text: "Adds up the TRUEs: two missing values." },
              { code: "mean(scores)", text: "One unknown value makes the whole average unknown, so R returns `NA`." },
              { code: "mean(scores, na.rm = TRUE)", text: "`na.rm = TRUE` (*NA remove*) tells `mean()` to ignore the missing values and average the other three." },
            ],
            output: `[1] FALSE  TRUE FALSE FALSE  TRUE
[1] 2
[1] NA
[1] 82.33333`,
            outputNote: "The average of 85, 72 and 90 is 82.33. `na.rm = TRUE` works in `mean()`, `median()`, `sum()`, `min()`, `max()`, `sd()` and many more.",
          },
        },
        {
          kind: "code",
          example: {
            id: "na-per-column",
            title: "Count missing values in every column",
            code: `patients <- read.csv("data/patients.csv")

sum(is.na(patients$bmi))
colSums(is.na(patients))`,
            explanation: [
              { code: "sum(is.na(patients$bmi))", text: "Missing values in one column." },
              { code: "is.na(patients)", text: "On a whole data frame, `is.na()` returns a table of TRUE/FALSE with the same shape as the data." },
              { code: "colSums(...)", text: "`colSums()` adds up each column, giving the number of missing values per column." },
            ],
            output: `[1] 5
   patient_id           age           sex           bmi   systolic_bp
            0             0             0             5             0
  cholesterol        smoker exercise_days      diabetes
            6             0             0             0 `,
            outputNote: "Only two columns have gaps: 5 missing BMI values and 6 missing cholesterol values. Running `colSums(is.na(df))` right after importing is an excellent habit.",
            tryIt: "Try it on `read.csv(\"data/survey.csv\")`. Which column has missing values?",
          },
        },
        {
          kind: "code",
          example: {
            id: "show-na-rows",
            title: "Look at the rows with a missing value",
            code: `patients <- read.csv("data/patients.csv")

patients[is.na(patients$cholesterol), c("patient_id", "age", "cholesterol")]`,
            explanation: [
              { code: "is.na(patients$cholesterol)", text: "TRUE for the rows where cholesterol is missing – a condition like the ones in the previous lesson." },
              { code: "patients[..., c(\"patient_id\", \"age\", \"cholesterol\")]", text: "Keeps those rows and three columns, so you can see who is affected." },
            ],
            output: `    patient_id age cholesterol
5         P005  69          NA
29        P029  80          NA
77        P077  68          NA
88        P088  64          NA
120       P120  46          NA
144       P144  59          NA`,
            outputNote: "Six patients have no cholesterol value. Looking at them helps you decide what to do – for example, whether the gaps seem random.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m5-clean-q-inline1",
            type: "predict-output",
            prompt: "What does this code print?",
            code: `x <- c(4, NA, 6)
sum(x)
sum(x, na.rm = TRUE)`,
            options: [
              `[1] 10
[1] 10`,
              `[1] NA
[1] 10`,
              `[1] NA
[1] NA`,
              `[1] 10
[1] NA`,
            ],
            answer: 1,
            optionFeedback: [
              "Without `na.rm = TRUE`, an unknown value makes the sum unknown.",
              "Correct!",
              "`na.rm = TRUE` removes the NA before adding.",
              "It is the other way round.",
            ],
            explanation: "4 + unknown + 6 is unknown, so the first sum is `NA`. With `na.rm = TRUE` the NA is ignored and the sum is 10.",
            concept: "missing-values",
          },
        },
      ],
    },
    {
      id: "removing-na",
      title: "Removing incomplete rows",
      blocks: [
        {
          kind: "text",
          md: "Sometimes you want a dataset with **no** missing values at all, for example before building a model. A row is **complete** when none of its values is `NA`.\n\n- `complete.cases(df)` returns `TRUE` for every complete row.\n- `na.omit(df)` returns the data frame without the incomplete rows.",
        },
        {
          kind: "code",
          example: {
            id: "complete-cases",
            title: "Which rows are complete?",
            code: `patients <- read.csv("data/patients.csv")

complete <- complete.cases(patients)
sum(complete)
sum(!complete)

patients[!complete, c("patient_id", "bmi", "cholesterol")]`,
            explanation: [
              { code: "complete.cases(patients)", text: "One TRUE/FALSE per row: TRUE when the row has no NA in any column." },
              { code: "sum(complete)", text: "The number of complete rows." },
              { code: "sum(!complete)", text: "`!` flips TRUE and FALSE, so this counts the incomplete rows." },
              { code: "patients[!complete, ...]", text: "Shows the incomplete rows. Each has a missing BMI or a missing cholesterol value." },
            ],
            output: `[1] 139
[1] 11
    patient_id  bmi cholesterol
5         P005 31.7          NA
12        P012   NA         227
29        P029 31.9          NA
37        P037   NA         218
64        P064   NA         217
77        P077 22.7          NA
88        P088 20.8          NA
98        P098   NA         183
120       P120 20.7          NA
131       P131   NA         166
144       P144 28.2          NA`,
            outputNote: "139 rows are complete and 11 are not (5 without BMI + 6 without cholesterol – no patient lacks both).",
          },
        },
        {
          kind: "code",
          example: {
            id: "na-omit",
            title: "Drop incomplete rows with na.omit()",
            code: `patients <- read.csv("data/patients.csv")

clean <- na.omit(patients)
nrow(patients)
nrow(clean)`,
            explanation: [
              { code: "na.omit(patients)", text: "Returns a copy of `patients` without any row that contains an NA. The original is unchanged." },
              { code: "nrow(clean)", text: "150 − 11 = 139 rows remain. `patients[complete.cases(patients), ]` gives exactly the same result." },
            ],
            output: `[1] 150
[1] 139`,
            outputNote: "Eleven rows were removed.",
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Think before you delete",
          md: "`na.omit()` removes a row if **any** column is missing – even a column you do not need. If you only study blood pressure, removing patients because their BMI is missing throws away good data. Often it is better to use `na.rm = TRUE` in the calculation, or to remove rows based only on the columns you use: `patients[!is.na(patients$bmi), ]`.",
        },
      ],
    },
    {
      id: "replacing-na",
      title: "Replacing missing values",
      blocks: [
        {
          kind: "text",
          md: "Another option is to **replace** (fill in) missing values. The pattern combines a condition with assignment:\n\n`df$col[is.na(df$col)] <- new_value`\n\nRead it as: *in column `col`, at the positions where the value is missing, put `new_value`*.",
        },
        {
          kind: "code",
          example: {
            id: "replace-with-zero",
            title: "Replace NA with 0",
            code: `df <- data.frame(name = c("Ana", "Ben", "Cy", "Dee"),
                 score = c(90, NA, 75, NA))

df$score[is.na(df$score)] <- 0
df`,
            explanation: [
              { code: "is.na(df$score)", text: "`FALSE TRUE FALSE TRUE` – Ben's and Dee's scores are missing." },
              { code: "df$score[...] <- 0", text: "Square brackets on the left of `<-` mean *change these positions*. Both missing scores become 0." },
            ],
            output: `  name score
1  Ana    90
2  Ben     0
3   Cy    75
4  Dee     0`,
            outputNote: "Replacing with 0 makes sense only when missing really means zero – for example *no purchases*. For a test that someone did not take, 0 would unfairly lower the average.",
          },
        },
        {
          kind: "code",
          example: {
            id: "replace-with-median",
            title: "Replace NA with the median",
            code: `survey <- read.csv("data/survey.csv")

med <- median(survey$hours_online, na.rm = TRUE)
med

survey$hours_online[is.na(survey$hours_online)] <- med
sum(is.na(survey$hours_online))
summary(survey$hours_online)`,
            explanation: [
              { code: "median(survey$hours_online, na.rm = TRUE)", text: "The middle value of the hours that *are* known (with `na.rm = TRUE`, otherwise the median would be NA)." },
              { code: "survey$hours_online[is.na(survey$hours_online)] <- med", text: "Puts the median into the 8 empty spots." },
              { code: "sum(is.na(survey$hours_online))", text: "Checks the result: no missing values left." },
            ],
            output: `[1] 3.5
[1] 0
   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.
  0.200   2.400   3.500   3.409   4.225   7.400 `,
            outputNote: "The 8 missing values became 3.5 hours, and `summary()` no longer shows an `NAs` column. Filling with the median (or mean) keeps typical values typical – this is called **imputation**.",
            tryIt: "Replace the missing values with the **mean** instead: `mean(survey$hours_online, na.rm = TRUE)`.",
          },
        },
        {
          kind: "callout",
          tone: "note",
          title: "Be honest about filled-in values",
          md: "Filled-in values are guesses, not measurements. Write down what you replaced and why, and keep the original data file unchanged. With only a few gaps (8 of 200 here), the choice hardly changes the results; with many gaps it can matter a lot.",
        },
      ],
    },
    {
      id: "cleaning-text",
      title: "Meet a messy dataset: cleaning text",
      blocks: [
        {
          kind: "text",
          md: "The file `data/customers_messy.csv` is a customer list exported from a badly maintained system. Look at the first rows and the `gender` and `city` columns:",
        },
        {
          kind: "code",
          example: {
            id: "messy-first-look",
            title: "How messy is it?",
            code: `customers <- read.csv("data/customers_messy.csv")

head(customers, 8)
table(customers$gender)`,
            explanation: [
              { code: "head(customers, 8)", text: "The first eight rows." },
              { code: "table(customers$gender)", text: "Counts each different spelling in the `gender` column." },
            ],
            output: `  customer_id          name age gender       city signup_date total_spent
1        C001    Hugo Smith  67      M  New York   2023-05-15      339.39
2        C002 Olivia Garcia  47 Female     Boston  2022-03-18      463.51
3        C003   Vera Garcia  60 female    chicago  2023-07-09      368.13
4        C004  Carlos Smith  61   male    Boston   01/16/2023      539.64
5        C004  Carlos Smith  61   male    Boston   01/16/2023      539.64
6        C005    Julia Khan  34 female   Chicago   2024-05-14     $412.27
7        C006    Ravi Smith  71      M     BOSTON  2023-05-06      157.92
8        C007      Yara Kim  44 female     Boston  2023-09-08      112.97

     f      F Female      M  MALE    Male female   male
     5      8     11      6      4     13      6      7 `,
            outputNote: "Plenty of problems: row 5 repeats row 4, cities have extra spaces and mixed capitals (`\" Boston \"`, `\"BOSTON\"`), one amount has a `$` sign, two date formats are mixed, and gender is written in **eight** different ways. For R, `\"Male\"`, `\"male\"` and `\"MALE\"` are three different values, because text comparison is **case-sensitive**.",
          },
        },
        {
          kind: "steps",
          title: "A cleaning plan",
          items: [
            "Remove extra spaces at the start and end of text with `trimws()`.",
            "Make capitals consistent with `tolower()` (or `toupper()`).",
            "Recode abbreviations such as `\"f\"` and `\"m\"` into full words.",
            "Convert number columns stored as text into real numbers with `as.numeric()`.",
            "Set impossible values (an age of 230) to `NA`.",
            "Give columns clear names and remove duplicated rows.",
          ],
        },
        {
          kind: "code",
          example: {
            id: "trimws-tolower",
            title: "trimws(), tolower() and toupper()",
            code: `x <- c("  Boston ", "boston", "BOSTON")

trimws(x)
tolower(trimws(x))
toupper("hello")`,
            explanation: [
              { code: "trimws(x)", text: "`trimws()` (*trim white space*) removes spaces at the beginning and end of each text. Spaces in the middle, as in `\"New York\"`, are kept." },
              { code: "tolower(trimws(x))", text: "First trim, then `tolower()` turns every letter into lower case. The inner function runs first." },
              { code: `toupper("hello")`, text: "`toupper()` does the opposite: all capitals." },
            ],
            output: `[1] "Boston" "boston" "BOSTON"
[1] "boston" "boston" "boston"
[1] "HELLO"`,
            outputNote: "After trimming and lower-casing, the three spellings are identical, so R will count them as one city.",
          },
        },
        {
          kind: "code",
          example: {
            id: "clean-city",
            title: "Clean the city column",
            code: `customers <- read.csv("data/customers_messy.csv")

customers$city <- tolower(trimws(customers$city))
table(customers$city)`,
            explanation: [
              { code: "customers$city <- tolower(trimws(customers$city))", text: "Cleans all 60 cities at once (functions on vectors work on every element) and **stores the result back** into the same column. Without `customers$city <-`, the cleaned text would only be printed and then lost." },
              { code: "table(customers$city)", text: "Counts the cleaned values." },
            ],
            output: `
  boston  chicago  houston new york  seattle
      16       12       12       10       10 `,
            outputNote: "Before cleaning, `table(customers$city)` listed 17 different spellings. Now there are exactly five cities.",
            tryIt: "Run `table(customers$city)` *before* the cleaning line to see all 17 versions.",
          },
        },
        {
          kind: "code",
          example: {
            id: "recode-gender",
            title: "Recode abbreviations",
            code: `customers <- read.csv("data/customers_messy.csv")

customers$gender <- tolower(trimws(customers$gender))
customers$gender[customers$gender == "f"] <- "female"
customers$gender[customers$gender == "m"] <- "male"
table(customers$gender)`,
            explanation: [
              { code: "tolower(trimws(customers$gender))", text: "Turns `F`, `Female`, `MALE` … into lower case, leaving four versions: `f`, `female`, `m`, `male`." },
              { code: `customers$gender[customers$gender == "f"] <- "female"`, text: "The *replace by condition* pattern from the NA section: wherever the value is `\"f\"`, write `\"female\"`." },
              { code: `customers$gender[customers$gender == "m"] <- "male"`, text: "The same for `\"m\"`." },
            ],
            output: `
female   male
    30     30 `,
            outputNote: "Eight spellings became two clean categories: 30 female and 30 male customers (duplicated rows are still included – we remove them soon).",
          },
        },
      ],
    },
    {
      id: "fixing-types",
      title: "Fixing column types",
      blocks: [
        {
          kind: "text",
          md: "`str(customers)` shows that `age` and `total_spent` were imported as `chr` (text), because a few cells contain things like `\"unknown\"` or `\"$412.27\"`. You cannot calculate an average of text, so these columns need converting with `as.numeric()`. Converting from one type to another is called **type conversion** (or *coercion*).",
        },
        {
          kind: "code",
          example: {
            id: "as-numeric-warning",
            title: "as.numeric() and the coercion warning",
            code: `x <- c("12", "7.5", "abc")

as.numeric(x)`,
            explanation: [
              { code: "as.numeric(x)", text: "Converts each text to a number. `\"12\"` and `\"7.5\"` look like numbers and convert fine. `\"abc\"` cannot become a number, so it becomes `NA`." },
            ],
            output: `[1] 12.0  7.5   NA
Warning message:
NAs introduced by coercion`,
            outputNote: "The warning *NAs introduced by coercion* means: some values could not be converted and became NA. It is not an error – the code finished – but always check which values were lost.",
          },
        },
        {
          kind: "code",
          example: {
            id: "fix-age",
            title: "Convert age and remove impossible values",
            code: `customers <- read.csv("data/customers_messy.csv")

age <- as.numeric(customers$age)
customers$age[is.na(age)]

age[age < 0 | age > 120]
age[age < 0 | age > 120] <- NA
range(age, na.rm = TRUE)`,
            explanation: [
              { code: "age <- as.numeric(customers$age)", text: "Converts the text ages into numbers. Values that are not numbers become NA (hence the warning)." },
              { code: "customers$age[is.na(age)]", text: "Shows the original texts that became NA: an empty cell, `\"unknown\"` and `\"N/A\"` – all honest *missing* values." },
              { code: "age[age < 0 | age > 120]", text: "Looks for impossible ages. The NAs appear too, because `NA < 0` is unknown." },
              { code: "age[age < 0 | age > 120] <- NA", text: "An age of −4 or 230 is a typing error. We cannot guess the real value, so we mark it as missing." },
              { code: "range(age, na.rm = TRUE)", text: "The smallest and largest remaining age." },
            ],
            output: `Warning message:
NAs introduced by coercion
[1] ""        "unknown" "N/A"
[1]  NA  NA  -4 230  NA
[1] 19 74`,
            outputNote: "The warning comes right after the `as.numeric()` line. After cleaning, all ages lie between 19 and 74 – believable for customers.",
          },
        },
        {
          kind: "code",
          example: {
            id: "fix-money",
            title: "Remove $ signs and commas before converting",
            code: `x <- c("$1,026.94", "412.27", "N/A")

x <- gsub("$", "", x, fixed = TRUE)
x
x <- gsub(",", "", x, fixed = TRUE)
x
as.numeric(x)`,
            explanation: [
              { code: `gsub("$", "", x, fixed = TRUE)`, text: "`gsub()` is *find and replace*: find `\"$\"`, replace it with `\"\"` (nothing), in every element of `x`. `fixed = TRUE` means *search for exactly this character* – without it, `$` would have a special meaning." },
              { code: `gsub(",", "", x, fixed = TRUE)`, text: "Removes the thousands comma, so `\"1,026.94\"` becomes `\"1026.94\"`." },
              { code: "as.numeric(x)", text: "Now the clean texts convert to numbers. Only `\"N/A\"` becomes NA." },
            ],
            output: `[1] "1,026.94" "412.27"   "N/A"
[1] "1026.94" "412.27"  "N/A"
[1] 1026.94  412.27      NA
Warning message:
NAs introduced by coercion`,
            outputNote: "The warning is expected here: `\"N/A\"` really is a missing value.",
          },
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Tell read.csv() what \"missing\" looks like",
          md: "If you know in advance which texts mean *missing*, list them when importing: `read.csv(\"data/customers_messy.csv\", na.strings = c(\"\", \"NA\", \"N/A\", \"unknown\"))`. Those cells become `NA` straight away, and a column like `age` is then imported as numbers.",
        },
      ],
    },
    {
      id: "rename-and-duplicates",
      title: "Renaming columns, removing duplicates and a full cleaning script",
      blocks: [
        {
          kind: "text",
          md: "Column names are easiest to work with when they are short, lower case and use `_` instead of spaces. `names(df)` returns the names, and – like a column – you can assign new values to it.",
        },
        {
          kind: "code",
          example: {
            id: "rename-columns",
            title: "Rename one column or all of them",
            code: `customers <- read.csv("data/customers_messy.csv")

names(customers)[names(customers) == "total_spent"] <- "spent"
names(customers)

df <- data.frame(a = 1:3, b = c("x", "y", "z"))
names(df) <- c("id", "letter")
df`,
            explanation: [
              { code: `names(customers) == "total_spent"`, text: "TRUE only at the position of the column called `total_spent` (the 7th)." },
              { code: `names(customers)[...] <- "spent"`, text: "Changes just that one name. Using the old name instead of a position (`[7]`) keeps working even if the columns are reordered." },
              { code: `names(df) <- c("id", "letter")`, text: "Assigning a whole vector renames all columns at once – you must give exactly one name per column." },
            ],
            output: `[1] "customer_id" "name"        "age"         "gender"      "city"
[6] "signup_date" "spent"
  id letter
1  1      x
2  2      y
3  3      z`,
            outputNote: "The last column of `customers` is now called `spent`, and `df` has two brand-new column names.",
          },
        },
        {
          kind: "code",
          example: {
            id: "duplicated-rows",
            title: "Find and remove duplicated rows",
            code: `duplicated(c("a", "b", "a", "c", "b"))

customers <- read.csv("data/customers_messy.csv")
sum(duplicated(customers))
customers[duplicated(customers), c("customer_id", "name")]

customers <- customers[!duplicated(customers), ]
nrow(customers)`,
            explanation: [
              { code: `duplicated(c("a", "b", "a", "c", "b"))`, text: "`duplicated()` marks a value TRUE if it has **already appeared earlier**. The first `\"a\"` is FALSE; the second is TRUE." },
              { code: "duplicated(customers)", text: "On a data frame it compares whole rows: TRUE for a row identical to an earlier row." },
              { code: "customers[duplicated(customers), ...]", text: "Shows the repeated rows." },
              { code: "customers[!duplicated(customers), ]", text: "Keeps every row that is *not* a repeat – the first copy of each customer stays." },
            ],
            output: `[1] FALSE FALSE  TRUE FALSE  TRUE
[1] 4
   customer_id           name
5         C004   Carlos Smith
19        C017    Ines Müller
32        C029  Ximena Garcia
46        C042   Diego Okafor
[1] 56`,
            outputNote: "Four customers were exported twice (rows 5, 19, 32 and 46 repeat the row just before them). After removing the repeats, 56 unique rows remain. `unique(customers)` gives the same result.",
          },
        },
        {
          kind: "code",
          example: {
            id: "cleaning-script",
            title: "The complete cleaning script",
            code: `customers <- read.csv("data/customers_messy.csv")

customers <- customers[!duplicated(customers), ]
customers$name <- trimws(customers$name)
customers$city <- tolower(trimws(customers$city))
customers$gender <- tolower(trimws(customers$gender))
customers$gender[customers$gender == "f"] <- "female"
customers$gender[customers$gender == "m"] <- "male"
customers$age <- as.numeric(customers$age)
customers$age[customers$age < 0 | customers$age > 120] <- NA
names(customers)[names(customers) == "total_spent"] <- "spent"

str(customers)`,
            explanation: [
              { code: "customers[!duplicated(customers), ]", text: "Removes the 4 repeated rows first, so they are not cleaned (or counted) twice." },
              { code: "customers$name <- trimws(customers$name)", text: "Removes stray spaces around names such as `\"  Ravi Smith\"`." },
              { code: "customers$city <- tolower(trimws(customers$city))", text: "Five clean city names." },
              { code: "customers$gender ...", text: "Three lines turn eight spellings into `\"female\"` and `\"male\"`." },
              { code: "customers$age <- as.numeric(customers$age)", text: "Text to numbers; the warning reminds us that `\"\"`, `\"unknown\"` and `\"N/A\"` became NA." },
              { code: "customers$age[customers$age < 0 | customers$age > 120] <- NA", text: "Impossible ages become NA." },
              { code: "str(customers)", text: "Checks the result: 56 rows, `age` is now `num`." },
            ],
            output: `Warning message:
NAs introduced by coercion
'data.frame':	56 obs. of  7 variables:
 $ customer_id: chr  "C001" "C002" "C003" "C004" ...
 $ name       : chr  "Hugo Smith" "Olivia Garcia" "Vera Garcia" "Carlos Smith" ...
 $ age        : num  67 47 60 61 34 71 44 NA 27 24 ...
 $ gender     : chr  "male" "female" "female" "male" ...
 $ city       : chr  "new york" "boston" "chicago" "boston" ...
 $ signup_date: chr  "2023-05-15" "2022-03-18" "2023-07-09" "01/16/2023" ...
 $ spent      : chr  "339.39" "463.51" "368.13" "539.64" ...`,
            outputNote: "56 unique customers with clean names, cities, genders and ages. The `spent` column is still text – cleaning it (and the mixed date formats) is your job in the challenge exercise. A cleaning script like this is valuable: you can re-run it any time the raw file is updated.",
            tryIt: "Add the two `gsub()` lines from the money example and `as.numeric()` to turn `spent` into numbers, then run `summary(customers$spent)`.",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Forgetting na.rm = TRUE",
      wrong: `patients <- read.csv("data/patients.csv")
mean(patients$bmi)`,
      why: "Five BMI values are missing, so the mean is unknown and R prints `NA`. There is no error, which makes it easy to miss.",
      right: `patients <- read.csv("data/patients.csv")
mean(patients$bmi, na.rm = TRUE)`,
    },
    {
      title: "Testing for missing values with == NA",
      wrong: `scores <- c(85, NA, 72)
scores == NA`,
      why: "Comparing anything with an unknown value gives an unknown answer, so `scores == NA` is `NA NA NA` – even for 85. Use the special function `is.na()`.",
      right: `scores <- c(85, NA, 72)
is.na(scores)`,
    },
    {
      title: "Converting text with symbols straight to numbers",
      wrong: `as.numeric("$412.27")`,
      error: "NAs introduced by coercion",
      why: "`\"$412.27\"` is not a valid number because of the `$`, so it silently becomes NA – a real amount is lost. Remove the symbols with `gsub()` first.",
      right: `as.numeric(gsub("$", "", "$412.27", fixed = TRUE))`,
    },
    {
      title: "Cleaning without saving the result",
      wrong: `customers <- read.csv("data/customers_messy.csv")
tolower(trimws(customers$city))
table(customers$city)`,
      why: "The second line prints the cleaned cities but does not store them, so `customers$city` is still messy and the table still shows 17 spellings. Assign the result back: `customers$city <- ...`.",
      right: `customers <- read.csv("data/customers_messy.csv")
customers$city <- tolower(trimws(customers$city))
table(customers$city)`,
    },
  ],
  exerciseIds: ["m5-missing-patients", "m5-clean-customers"],
  quiz: [
    {
      id: "m5-clean-q1",
      type: "multiple-choice",
      prompt: "Which code counts the missing values in **every** column of the data frame `df`?",
      options: ["`sum(is.na(df))`", "`colSums(is.na(df))`", "`is.na(df) == TRUE`", "`complete.cases(df)`"],
      answer: 1,
      optionFeedback: [
        "This gives one total for the whole data frame, not per column.",
        "Correct – one count per column.",
        "This returns a big TRUE/FALSE table, not counts.",
        "This returns TRUE/FALSE per **row**.",
      ],
      explanation: "`is.na(df)` gives a TRUE/FALSE table and `colSums()` adds up each column, so you get the number of NAs per column.",
      concept: "missing-values",
    },
    {
      id: "m5-clean-q2",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `x <- c(" Red", "red ", "RED")
unique(tolower(trimws(x)))`,
      options: [`[1] "red"`, `[1] " red" "red " "red"`, `[1] "Red" "red" "RED"`, `[1] "red" "red" "red"`],
      answer: 0,
      optionFeedback: [
        "Correct – after trimming and lower-casing, all three are `\"red\"`, and `unique()` keeps one.",
        "`trimws()` removes the spaces first.",
        "`tolower()` makes all letters lower case.",
        "`unique()` removes the repeats.",
      ],
      explanation: "`trimws()` removes the spaces, `tolower()` lowers the capitals, and `unique()` keeps one copy of the identical results.",
      concept: "text-cleaning",
    },
    {
      id: "m5-clean-q3",
      type: "fill-blank",
      prompt: "Complete the code so every missing score is replaced by 0.",
      code: `scores <- c(10, NA, 7, NA)
scores[___(scores)] <- 0`,
      accept: ["is.na"],
      hint: "Which function answers *is this value missing?*",
      explanation: "`is.na(scores)` is TRUE at the missing positions, and assigning to `scores[is.na(scores)]` replaces only those values.",
      concept: "replacing-na",
    },
    {
      id: "m5-clean-q4",
      type: "true-false",
      prompt: "`na.omit(df)` removes a row if **any** of its columns contains `NA`.",
      answer: true,
      explanation: "`na.omit()` keeps only complete rows. That is why it can remove more data than you expect – a missing value in a column you never use still removes the row.",
      concept: "missing-values",
    },
    {
      id: "m5-clean-q5",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `ids <- c("A1", "B2", "A1", "C3")
duplicated(ids)`,
      options: ["[1]  TRUE FALSE  TRUE FALSE", "[1] FALSE FALSE  TRUE FALSE", "[1] FALSE FALSE FALSE FALSE", "[1] 3"],
      answer: 1,
      optionFeedback: [
        "The *first* \"A1\" is not a duplicate – only later copies are marked.",
        "Correct – only the second \"A1\" has appeared before.",
        "\"A1\" appears twice, so one copy is a duplicate.",
        "`duplicated()` returns TRUE/FALSE for every element, not a position.",
      ],
      explanation: "`duplicated()` marks an element TRUE when the same value has already appeared earlier. The first `\"A1\"` is FALSE, the second (position 3) is TRUE.",
      concept: "duplicates",
    },
    {
      id: "m5-clean-q6",
      type: "find-error",
      prompt: "This code should give the average amount, but it prints `NA` and a warning. Which line is the problem?",
      code: `amounts <- c("$20.00", "$35.50", "$12.25")
values <- as.numeric(amounts)
mean(values)`,
      errorLine: 2,
      errorKind: "logic",
      fix: `amounts <- c("$20.00", "$35.50", "$12.25")
values <- as.numeric(gsub("$", "", amounts, fixed = TRUE))
mean(values)`,
      explanation: "The `$` signs make every value impossible to convert, so `as.numeric()` turns them all into NA. Remove the `$` with `gsub(\"$\", \"\", amounts, fixed = TRUE)` before converting; the mean is then 22.58333.",
      concept: "type-fixing",
    },
  ],
  keyPoints: [
    "`is.na()` finds missing values; `sum(is.na(x))` counts them and `colSums(is.na(df))` counts them per column.",
    "Most summary functions return NA if any value is missing – add `na.rm = TRUE` to ignore them.",
    "`complete.cases(df)` marks complete rows and `na.omit(df)` drops every row with an NA – think before deleting data.",
    "`df$col[is.na(df$col)] <- value` replaces missing values; choose the value (0, mean, median) carefully and document it.",
    "`trimws()` removes surrounding spaces and `tolower()`/`toupper()` make capitals consistent – text comparisons are case-sensitive.",
    "Convert text numbers with `as.numeric()` after removing symbols with `gsub()`; the warning *NAs introduced by coercion* tells you values were lost.",
    "Rename with `names(df)[names(df) == \"old\"] <- \"new\"` and drop repeated rows with `df[!duplicated(df), ]`.",
  ],
  concepts: ["missing-values", "replacing-na", "text-cleaning", "type-fixing", "duplicates", "renaming-columns"],
  glossary: ["na", "missing-data", "data-cleaning", "type-conversion", "coercion", "case-sensitive", "string"],
  datasets: ["patients", "survey", "customers_messy", "students"],
  prerequisites: ["filtering-sorting-selecting"],
  playground: `# Clean the messy customer list
customers <- read.csv("data/customers_messy.csv")

colSums(is.na(customers))
table(customers$city)

customers$city <- tolower(trimws(customers$city))
table(customers$city)`,
};
