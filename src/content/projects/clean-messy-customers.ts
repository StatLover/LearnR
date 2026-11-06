import type { Project } from "../types";

export const cleanMessyCustomersProject: Project = {
  id: "clean-messy-customers",
  title: "Cleaning a Messy Customer List",
  level: "beginner",
  summary:
    "Turn a chaotic customer export – extra spaces, random capitals, numbers stored as text, two date formats and duplicated rows – into a clean table you can trust.",
  intro: `You have just started helping out at **Paper Lantern Books**, a small (fictional) online bookshop. The owner has exported the customer list from the shop's old system and wants answers to simple questions: *How many customers do we have? How old are they? Which city spends the most?*

The problem: the export is a mess. Names have random capitals and extra spaces, the same city is written in several different ways, ages and amounts are stored as text (some with \`$\` signs, some saying \`"unknown"\`), dates come in two different formats and a few customers appear twice. If you calculated anything now, the answers would be wrong – and nobody would notice.

In this project you clean the file step by step, exactly as a data analyst would: **inspect** the problems, **fix one problem at a time**, **check** that each fix worked, and finally **summarise** the clean data. *Data cleaning* (finding and fixing errors and inconsistencies in a dataset) often takes most of the time in a real analysis, and it is where careful work pays off most.

Each step runs after the previous ones, so the data frame \`customers\` that you create in Step 1 keeps improving as you go. If something goes wrong, run Step 1 again to start from the raw file and then redo the later steps in order.`,
  datasets: ["customers_messy"],
  skills: [
    "Inspecting a dataset with str(), head() and unique()",
    "Removing extra spaces with trimws()",
    "Standardising text with tolower(), toupper() and tools::toTitleCase()",
    "Recoding inconsistent labels with %in%",
    "Converting text to numbers with gsub() and as.numeric()",
    "Marking missing and impossible values as NA",
    "Parsing two date formats with as.Date()",
    "Finding and removing duplicated rows",
    "Summarising clean data with tapply()",
  ],
  minutes: 60,
  steps: [
    {
      id: "inspect",
      title: "Import the file and list its problems",
      instructions: `Never start fixing data you have not looked at. In this step you import the file and write down what is wrong with it.

1. Read \`data/customers_messy.csv\` into a data frame called \`customers\` with \`read.csv()\`.
2. Look at its structure with \`str(customers)\` and at the first 10 rows with \`head(customers, 10)\`.
3. Print every distinct spelling used in the gender column with \`unique(customers$gender)\`.
4. Store the **number** of distinct gender spellings in \`n_gender_labels\`.
5. Store the number of rows that are exact copies of an earlier row in \`n_duplicates\`. The function \`duplicated()\` returns \`TRUE\` for every row that repeats an earlier row, and \`sum()\` counts the \`TRUE\` values.`,
      starterCode: `# Step 1: import the raw file and list its problems

# Read the CSV file into a data frame called customers
customers <- read.csv("data/customers_messy.csv")

# Structure: number of rows, column names and column types
str(customers)

# Show the first 10 rows


# Print every distinct spelling used in the gender column


# Count the distinct gender spellings and store the number
n_gender_labels <- 0

# Count the rows that are exact copies of an earlier row
n_duplicates <- 0
`,
      hints: [
        "`head()` takes a second argument: the number of rows to show, e.g. `head(customers, 10)`.",
        "`unique(customers$gender)` returns each spelling once. Wrap it in `length()` to count how many there are.",
        "`n_gender_labels <- length(unique(customers$gender))` and `n_duplicates <- sum(duplicated(customers))`.",
      ],
      solution: `customers <- read.csv("data/customers_messy.csv")

str(customers)
head(customers, 10)

unique(customers$gender)

n_gender_labels <- length(unique(customers$gender))
n_gender_labels

n_duplicates <- sum(duplicated(customers))
n_duplicates
`,
      explanation: `- \`read.csv("data/customers_messy.csv")\` reads the file and returns a data frame; \`<-\` stores it under the name \`customers\`.
- \`str(customers)\` reports **60 obs. of 7 variables** – and every single column is \`chr\` (text). \`age\` and \`total_spent\` should be numbers, but because a few entries such as \`"unknown"\` or \`"$412.27"\` are not valid numbers, \`read.csv()\` had to store the whole column as text.
- \`head(customers, 10)\` shows the first ten rows. You can already spot many problems: \`DANIEL MÜLLER\` in capitals, \`chicago\` in lower case, \`BOSTON\` in upper case, a blank age for Felix Kim (C008), the date \`01/16/2023\` written month-first while others are \`2023-05-15\`, \`$412.27\` with a dollar sign, and rows 4 and 5 – Carlos Smith twice.
- \`unique(customers$gender)\` returns **8** spellings for just two categories: \`"M"\`, \`"Female"\`, \`"female"\`, \`"male"\`, \`"Male"\`, \`" f"\`, \`"MALE "\` and \`"F"\`. Look closely at \`" f"\` and \`"MALE "\`: they contain hidden spaces.
- \`length(unique(...))\` counts those spellings, so \`n_gender_labels\` is \`8\`.
- \`duplicated(customers)\` gives one \`TRUE\`/\`FALSE\` per row. \`sum()\` treats \`TRUE\` as 1 and \`FALSE\` as 0, so \`n_duplicates\` is **4**: four rows are exact copies of an earlier row.

Your problem list for the next steps: extra spaces, inconsistent capitals, 8 gender labels, numbers stored as text, missing and impossible values, two date formats and 4 duplicated rows.`,
      tests: [
        {
          name: "`customers` is a data frame with 60 rows and 7 columns",
          check: `is.data.frame(customers) && nrow(customers) == 60 && ncol(customers) == 7`,
          failMessage: "Create `customers` with `read.csv(\"data/customers_messy.csv\")` – check the spelling of the file path.",
        },
        {
          name: "`n_gender_labels` is 8",
          check: `isTRUE(n_gender_labels == 8)`,
          failMessage: "Count the distinct spellings with `length(unique(customers$gender))` and store the result in `n_gender_labels`.",
        },
        {
          name: "`n_duplicates` is 4",
          check: `isTRUE(n_duplicates == 4)`,
          failMessage: "`duplicated(customers)` marks repeated rows with TRUE – count them with `sum()` and store the result in `n_duplicates`.",
        },
      ],
    },
    {
      id: "trim-spaces",
      title: "Remove extra spaces",
      instructions: `A space is a character like any other, so for R \`" Boston "\` and \`"Boston"\` are two different cities. The function \`trimws()\` (*trim white space*) removes spaces at the **start and end** of each text value and leaves the spaces between words alone.

1. Print how many distinct spellings the \`city\` column has right now: \`length(unique(customers$city))\`.
2. Apply \`trimws()\` to the \`name\`, \`gender\` and \`city\` columns, storing each result back in the same column.
3. Print the number of distinct cities again, and a frequency table of the cities with \`table(customers$city)\`, to see what is left to fix.`,
      starterCode: `# Step 2: remove spaces at the start and end of text values

# How many different city spellings are there now?
length(unique(customers$city))

# Trim the name column (this line is done for you)
customers$name <- trimws(customers$name)

# Now trim the gender and city columns the same way


# Check again: how many city spellings are left, and which ones?

`,
      hints: [
        "Copy the `name` line and change the column name on **both** sides of `<-`.",
        "`customers$city <- trimws(customers$city)` replaces the column on the left with the trimmed version on the right.",
        "After trimming all three columns, run `length(unique(customers$city))` and `table(customers$city)`.",
      ],
      solution: `length(unique(customers$city))

customers$name <- trimws(customers$name)
customers$gender <- trimws(customers$gender)
customers$city <- trimws(customers$city)

length(unique(customers$city))
table(customers$city)
`,
      explanation: `- Before trimming, the \`city\` column has **17** distinct spellings for only five real cities.
- \`trimws(customers$name)\` returns a new text vector in which values like \`"  Ravi Smith"\` have become \`"Ravi Smith"\`. Assigning it to \`customers$name\` overwrites the old column. Spaces *inside* a value are kept, so \`"New York"\` stays two words.
- The same is done for \`gender\` (\`" f"\` becomes \`"f"\`, \`"MALE "\` becomes \`"MALE"\`) and \`city\` (\`" Boston "\` becomes \`"Boston"\`).
- After trimming, **13** city spellings remain. The table shows that the rest of the problem is capital letters: \`boston\` 3, \`Boston\` 9, \`BOSTON\` 4, \`chicago\` 2, \`Chicago\` 8, \`CHICAGO\` 2 … and \`New York\` 9 next to \`NEW YORK\` 1.

Why this matters: \`table()\`, \`tapply()\` and dplyr's \`group_by()\` treat every spelling as a separate group, so before cleaning, Boston's customers would have been spread over several "cities". Hidden spaces are especially sneaky because you cannot see them when the data are printed.`,
      tests: [
        {
          name: "No name starts or ends with a space",
          check: `all(customers$name == trimws(customers$name))`,
          failMessage: "Store `trimws(customers$name)` back in `customers$name`.",
        },
        {
          name: "No gender value starts or ends with a space",
          check: `all(customers$gender == trimws(customers$gender))`,
          failMessage: "Add the line `customers$gender <- trimws(customers$gender)`.",
        },
        {
          name: "No city starts or ends with a space",
          check: `all(customers$city == trimws(customers$city))`,
          failMessage: "Add the line `customers$city <- trimws(customers$city)`.",
        },
      ],
    },
    {
      id: "standardise-text",
      title: "Standardise capitals and gender labels",
      instructions: `R is *case-sensitive* (it treats upper- and lower-case letters as different), so \`"Boston"\`, \`"BOSTON"\` and \`"boston"\` are three different values. Make every spelling consistent:

1. **Names and cities** → *Title Case* (a capital letter at the start of each word). First make everything lower case with \`tolower()\`, then capitalise each word with \`tools::toTitleCase()\`. The \`::\` means "the function \`toTitleCase()\` from the *tools* package", which comes with R.
2. **Gender** → exactly two labels, \`"Female"\` and \`"Male"\`. Store an upper-case copy of the column in a helper vector \`gender_upper\` with \`toupper()\`. Then every value whose upper-case version is \`"F"\` or \`"FEMALE"\` becomes \`"Female"\`, and every \`"M"\` or \`"MALE"\` becomes \`"Male"\`. The \`%in%\` operator checks, for each value, whether it is one of several options.
3. Print \`table()\` of \`city\` and of \`gender\` to check the result.`,
      starterCode: `# Step 3: make capital letters consistent

# Names: lower case first, then a capital at the start of each word
customers$name <- tools::toTitleCase(tolower(customers$name))

# Cities: do the same for the city column


# Gender: compare upper-case versions, so "f", "F" and "female" look alike
gender_upper <- toupper(customers$gender)

# Replace every female spelling with "Female"
customers$gender[gender_upper %in% c("F", "FEMALE")] <- "Female"

# Now replace every male spelling with "Male"


# Check the results
table(customers$city)
table(customers$gender)
`,
      hints: [
        "For the cities, copy the `name` line and change `name` to `city` on both sides of `<-`.",
        "For the men, copy the `\"Female\"` line and change the options to `c(\"M\", \"MALE\")` and the new label to `\"Male\"`.",
        "`customers$city <- tools::toTitleCase(tolower(customers$city))` and `customers$gender[gender_upper %in% c(\"M\", \"MALE\")] <- \"Male\"`.",
      ],
      solution: `customers$name <- tools::toTitleCase(tolower(customers$name))
customers$city <- tools::toTitleCase(tolower(customers$city))
table(customers$city)

gender_upper <- toupper(customers$gender)
customers$gender[gender_upper %in% c("F", "FEMALE")] <- "Female"
customers$gender[gender_upper %in% c("M", "MALE")] <- "Male"
table(customers$gender)
`,
      explanation: `- \`tolower(customers$name)\` turns \`"GRACE GARCIA"\` into \`"grace garcia"\`. Then \`tools::toTitleCase()\` capitalises the first letter of each word: \`"Grace Garcia"\`. The order matters – \`toTitleCase()\` only *raises* first letters and never lowers the others, so on its own it would leave \`"DANIEL MÜLLER"\` in capitals. With both functions it becomes \`"Daniel Müller"\`.
- The same two functions fix the cities. The table now shows exactly five cities: **Boston 16, Chicago 12, Houston 12, New York 10, Seattle 10**.
- \`toupper(customers$gender)\` makes \`"f"\`, \`"F"\` and \`"female"\` all look like \`"F"\` or \`"FEMALE"\`, so you only need to list two options per group. It is stored in \`gender_upper\` so the original column is not changed yet.
- \`gender_upper %in% c("F", "FEMALE")\` returns \`TRUE\` for every female spelling. Using it inside \`customers$gender[ ... ] <- "Female"\` replaces **only those positions** with \`"Female"\`. The male line works the same way.
- \`table(customers$gender)\` confirms just two labels: **Female 30, Male 30**.

A note of caution: \`toTitleCase()\` keeps small English words such as "and" or "of" in lower case. That does not affect these names and cities, but always look at the result when you use it on other data.`,
      tests: [
        {
          name: "There are exactly five city spellings: Boston, Chicago, Houston, New York, Seattle",
          check: `setequal(customers$city, c("Boston", "Chicago", "Houston", "New York", "Seattle"))`,
          failMessage: "Apply `tools::toTitleCase(tolower(...))` to the city column as well, and store the result in `customers$city`.",
        },
        {
          name: "Gender only contains \"Female\" and \"Male\"",
          check: `all(customers$gender %in% c("Female", "Male"))`,
          failMessage: "Some gender values are still not \"Female\" or \"Male\" – did you add the line that recodes `c(\"M\", \"MALE\")` to \"Male\"?",
        },
        {
          name: "30 customers are Female and 30 are Male",
          check: `sum(customers$gender == "Female") == 30 && sum(customers$gender == "Male") == 30`,
          failMessage: "The counts are off. Compare the *upper-case* versions (`gender_upper`) with `c(\"F\", \"FEMALE\")` and `c(\"M\", \"MALE\")`.",
        },
        {
          name: "Names are in Title Case (e.g. \"Grace Garcia\", \"Rosa Novak\")",
          check: `all(c("Grace Garcia", "Rosa Novak", "Ivan Kim", "Samir Novak") %in% customers$name) && !any(customers$name == toupper(customers$name))`,
          failMessage: "Use `tools::toTitleCase(tolower(customers$name))` – lower-case first, then capitalise each word.",
        },
      ],
    },
    {
      id: "fix-age",
      title: "Turn age into numbers and mark bad values as NA",
      instructions: `The \`age\` column is text. Before converting it to numbers, deal with the entries that are not numbers at all, and then with numbers that cannot be real ages.

1. Print \`unique(customers$age)\` to see every value.
2. Replace the three ways of writing "missing" – empty text \`""\`, \`"unknown"\` and \`"N/A"\` – with \`NA\`, R's special *missing value* marker.
3. Convert the column to numbers with \`as.numeric()\` and look at \`summary(customers$age)\`.
4. An age below 0 or above 110 is impossible – a typing error. You cannot know the true age, so replace those values with \`NA\` as well. Put \`which()\` around the condition: it returns the positions where the condition is \`TRUE\` and skips the ages that are already \`NA\`.
5. Print \`summary(customers$age)\` again.`,
      starterCode: `# Step 4: turn age into numbers and mark missing / impossible ages as NA

# Every distinct value in the age column
unique(customers$age)

# 1. Words that mean "missing" become NA
customers$age[customers$age %in% c("", "unknown", "N/A")] <- NA

# 2. Convert the text to numbers


# 3. Ages below 0 or above 110 are impossible: make them NA
# customers$age[which( your condition here )] <- NA


# 4. Check the result
summary(customers$age)
`,
      hints: [
        "Convert with `customers$age <- as.numeric(customers$age)`.",
        "\"Below 0 **or** above 110\" is written `customers$age < 0 | customers$age > 110` – the `|` symbol means *or*.",
        "`customers$age[which(customers$age < 0 | customers$age > 110)] <- NA`, then `summary(customers$age)`.",
      ],
      solution: `unique(customers$age)

customers$age[customers$age %in% c("", "unknown", "N/A")] <- NA
customers$age <- as.numeric(customers$age)
summary(customers$age)

# Which customers have an impossible age?
customers[which(customers$age < 0 | customers$age > 110), c("customer_id", "name", "age")]

customers$age[which(customers$age < 0 | customers$age > 110)] <- NA
summary(customers$age)
`,
      explanation: `- \`unique(customers$age)\` lists 38 different values. Most are normal ages, but you also see \`""\` (empty), \`"unknown"\`, \`"N/A"\`, \`"-4"\` and \`"230"\`.
- \`customers$age %in% c("", "unknown", "N/A")\` is \`TRUE\` for the three "missing" spellings, and \`<- NA\` replaces them with a real missing value. You *could* skip this line – \`as.numeric()\` turns words into \`NA\` anyway – but then R warns "NAs introduced by coercion" and you cannot tell expected problems from unexpected ones. Being explicit documents your decision.
- \`as.numeric()\` converts \`"67"\` into the number \`67\`. Now \`summary()\` works and immediately reveals the impossible values: **Min. -4.00, Max. 230.00, Mean 48.79, 3 NAs**.
- The condition \`customers$age < 0 | customers$age > 110\` is \`TRUE\` for those two ages (and \`NA\` where the age is missing). \`which()\` keeps only the \`TRUE\` positions, so the rows printed are **C027 Jamal Rossi (-4)** and **C033 Alice Müller (230)**.
- After replacing them with \`NA\`, the summary is believable: **Min. 19, Max. 74, Mean 46.45, 5 NAs** (3 missing + 2 impossible).

Notice how much a single typing error moved the average: from 48.79 to 46.45 years. Impossible values must be found *before* you calculate anything.`,
      tests: [
        {
          name: "`age` is a numeric column",
          check: `is.numeric(customers$age)`,
          failMessage: "Convert the column with `customers$age <- as.numeric(customers$age)`.",
        },
        {
          name: "5 ages are NA (3 missing + 2 impossible)",
          check: `sum(is.na(customers$age)) == 5`,
          failMessage: "There should be 5 NA ages: the blank, \"unknown\" and \"N/A\" entries plus the impossible -4 and 230.",
        },
        {
          name: "The remaining ages range from 19 to 74",
          check: `isTRUE(min(customers$age, na.rm = TRUE) == 19 && max(customers$age, na.rm = TRUE) == 74)`,
          failMessage: "Replace ages below 0 or above 110 with NA: `customers$age[which(customers$age < 0 | customers$age > 110)] <- NA`.",
        },
      ],
    },
    {
      id: "fix-money",
      title: "Turn total_spent into numbers",
      instructions: `\`total_spent\` is also text, because some amounts are written like \`"$412.27"\` or \`"$1,026.94"\`. Clean a copy of the column and then store the numbers:

1. Copy the column into a helper vector: \`money <- customers$total_spent\`.
2. Remove the dollar signs with \`gsub("$", "", money, fixed = TRUE)\`. \`gsub()\` replaces every occurrence of its first argument with its second argument (here: with nothing). \`fixed = TRUE\` matters – the explanation shows why.
3. Remove the thousands commas the same way.
4. Turn \`""\` and \`"N/A"\` into \`NA\`.
5. Store \`as.numeric(money)\` in \`customers$total_spent\`, then check it with \`summary()\` and look at customer C010.`,
      starterCode: `# Step 5: turn total_spent into numbers

# Some values have "$" signs and thousands commas
head(customers$total_spent, 12)

# Work on a copy of the column
money <- customers$total_spent

# Remove the dollar signs (fixed = TRUE: treat "$" as a normal character)
money <- gsub("$", "", money, fixed = TRUE)

# Remove the commas


# Empty text and "N/A" mean missing


# Convert to numbers and store the result in the data frame


# Check
summary(customers$total_spent)
`,
      hints: [
        "Removing commas works exactly like removing dollar signs: `gsub(\",\", \"\", money, fixed = TRUE)`.",
        "Use the same trick as for age: `money[money %in% c(\"\", \"N/A\")] <- NA`.",
        "Finish with `customers$total_spent <- as.numeric(money)`, then `summary(customers$total_spent)` and `customers[customers$customer_id == \"C010\", ]`.",
      ],
      solution: `head(customers$total_spent, 12)

money <- customers$total_spent
money <- gsub("$", "", money, fixed = TRUE)
money <- gsub(",", "", money, fixed = TRUE)
money[money %in% c("", "N/A")] <- NA
customers$total_spent <- as.numeric(money)

summary(customers$total_spent)
customers[customers$customer_id == "C010", ]
`,
      explanation: `- \`head(customers$total_spent, 12)\` shows the problem: \`"339.39"\` next to \`"$412.27"\` and \`"$1,026.94"\`.
- Working on a copy (\`money\`) keeps the original column untouched until the cleaning is finished.
- \`gsub("$", "", money, fixed = TRUE)\` removes every \`$\`. Why \`fixed = TRUE\`? Without it, \`gsub()\` reads its pattern as a *regular expression* (a mini-language for text patterns) in which \`$\` means "the end of the text". \`gsub("$", "", money)\` would then replace "the end" with nothing – changing nothing at all – and \`as.numeric("$412.27")\` would silently become \`NA\` with the warning "NAs introduced by coercion". \`fixed = TRUE\` says "look for this exact character".
- The second \`gsub()\` removes the commas, so \`"1,026.94"\` becomes \`"1026.94"\`.
- \`money %in% c("", "N/A")\` finds the three missing amounts and sets them to \`NA\`.
- \`as.numeric(money)\` converts the clean text to numbers. \`summary()\` now gives **Min. 58.84, Median 407.92, Mean 433.35, Max. 1547.38, 3 NAs**.
- Customer **C010 (Keiko Garcia)** shows \`1026.94\` – the value that used to be \`"$1,026.94"\`.`,
      tests: [
        {
          name: "`total_spent` is a numeric column",
          check: `is.numeric(customers$total_spent)`,
          failMessage: "Finish with `customers$total_spent <- as.numeric(money)`.",
        },
        {
          name: "Exactly 3 amounts are NA",
          check: `sum(is.na(customers$total_spent)) == 3`,
          failMessage: "Only the blank and \"N/A\" amounts should be NA. If there are more, a \"$\" or \",\" was not removed – check that both `gsub()` calls use `fixed = TRUE`.",
        },
        {
          name: "Customer C010 spent 1026.94",
          check: `isTRUE(all.equal(customers$total_spent[customers$customer_id == "C010"], 1026.94))`,
          failMessage: "C010's value was \"$1,026.94\": remove both the dollar sign and the comma before converting.",
        },
        {
          name: "The amounts add up to 24701.08",
          check: `isTRUE(all.equal(sum(customers$total_spent, na.rm = TRUE), 24701.08))`,
          failMessage: "The total of all amounts should be 24701.08 – make sure every value was converted correctly.",
        },
      ],
    },
    {
      id: "parse-dates",
      title: "Parse the two date formats",
      instructions: `Signup dates arrive in two styles: most look like \`"2023-05-15"\` (year-month-day, the international *ISO* format), but some look like \`"01/16/2023"\` (month/day/year, common in the US). \`as.Date()\` converts text into real dates, and its \`format\` argument describes the pattern: \`%Y\` = 4-digit year, \`%m\` = month, \`%d\` = day.

1. Convert the column with \`format = "%Y-%m-%d"\` and store the result in \`iso_dates\`. Text in the other style cannot be read and becomes \`NA\`.
2. Convert it again with \`format = "%m/%d/%Y"\` and store the result in \`us_dates\`.
3. Count the \`NA\`s in each with \`sum(is.na(...))\`.
4. Combine them: start with \`signup <- iso_dates\`, then fill the \`NA\` positions of \`signup\` with the values of \`us_dates\` at the same positions.
5. Store \`signup\` in \`customers$signup_date\` and check it with \`range()\` and a table of signup years: \`table(format(customers$signup_date, "%Y"))\`.`,
      starterCode: `# Step 6: convert both date styles into real Date values

head(customers$signup_date, 6)

# Style 1: "2023-05-15" (year-month-day)
iso_dates <- as.Date(customers$signup_date, format = "%Y-%m-%d")

# Style 2: "01/16/2023" (month/day/year)
# us_dates <- as.Date(customers$signup_date, format = ...)


# How many values could each style not read?


# Start from the ISO dates and fill their gaps with the US-style dates
signup <- iso_dates
# signup[ positions where iso_dates is NA ] <- us_dates[ the same positions ]


# Store the result in the data frame and check it

`,
      hints: [
        "The US style is `format = \"%m/%d/%Y\"` – month first, slashes between the parts.",
        "`is.na(iso_dates)` is TRUE exactly where the US-style dates are. Use it to index both vectors: `signup[is.na(iso_dates)] <- us_dates[is.na(iso_dates)]`.",
        "Then `customers$signup_date <- signup`, `range(customers$signup_date)` and `table(format(customers$signup_date, \"%Y\"))`.",
      ],
      solution: `head(customers$signup_date, 6)

iso_dates <- as.Date(customers$signup_date, format = "%Y-%m-%d")
us_dates <- as.Date(customers$signup_date, format = "%m/%d/%Y")

sum(is.na(iso_dates))
sum(is.na(us_dates))

signup <- iso_dates
signup[is.na(iso_dates)] <- us_dates[is.na(iso_dates)]
customers$signup_date <- signup

str(customers$signup_date)
range(customers$signup_date)
table(format(customers$signup_date, "%Y"))
`,
      explanation: `- \`as.Date(..., format = "%Y-%m-%d")\` reads year-month-day text. It cannot read \`"01/16/2023"\`, so those positions become \`NA\`: **15** of them.
- \`as.Date(..., format = "%m/%d/%Y")\` reads month/day/year. It fails on the other **45** values. 15 + 45 = 60, so every date is readable by exactly one of the two formats.
- \`signup[is.na(iso_dates)] <- us_dates[is.na(iso_dates)]\` uses the same \`TRUE\`/\`FALSE\` vector on both sides: for the 15 positions where the ISO reading failed, it copies in the US reading. Customer C004's \`"01/16/2023"\` becomes \`2023-01-16\`.
- \`str()\` confirms the column is now a real \`Date\` vector. Real dates can be sorted, compared and subtracted, which text cannot do correctly.
- \`range()\` shows the first and last signup: **2022-01-20** and **2024-12-15**.
- \`format(customers$signup_date, "%Y")\` extracts the year as text, and \`table()\` counts signups per year: **2022: 15, 2023: 29, 2024: 16**.

Why not \`ifelse(is.na(iso_dates), us_dates, iso_dates)\`? \`ifelse()\` drops the Date "class", so you would get plain numbers such as \`19373\` (days since 1970-01-01) instead of dates. Also be careful with dates like \`"03/04/2023"\`: it could be 4 March or 3 April. You must know the source's convention – here \`"01/16/2023"\` proves the month comes first, because there is no month 16.`,
      tests: [
        {
          name: "`signup_date` is a Date column",
          check: `inherits(customers$signup_date, "Date")`,
          failMessage: "Store the combined dates with `customers$signup_date <- signup`.",
        },
        {
          name: "No signup date is missing",
          check: `!anyNA(customers$signup_date)`,
          failMessage: "Some dates are still NA – fill the gaps of `iso_dates` with `us_dates`: `signup[is.na(iso_dates)] <- us_dates[is.na(iso_dates)]`.",
        },
        {
          name: "Customer C004 signed up on 2023-01-16",
          check: `all(customers$signup_date[customers$customer_id == "C004"] == as.Date("2023-01-16"))`,
          failMessage: "C004's date was \"01/16/2023\" (month/day/year). Check the format \"%m/%d/%Y\".",
        },
        {
          name: "Dates range from 2022-01-20 to 2024-12-15",
          check: `all(range(customers$signup_date) == as.Date(c("2022-01-20", "2024-12-15")))`,
          failMessage: "The earliest date should be 2022-01-20 and the latest 2024-12-15. Did you swap %m and %d?",
        },
      ],
    },
    {
      id: "remove-duplicates",
      title: "Remove duplicated rows",
      instructions: `Four customers were exported twice. Duplicate rows would count those customers twice in every total and average, so remove them.

1. Count the duplicated rows again with \`sum(duplicated(customers))\` and print the \`customer_id\` of those rows: \`customers$customer_id[duplicated(customers)]\`.
2. Keep only the rows that are **not** duplicates: \`customers[!duplicated(customers), ]\`. The \`!\` operator turns \`TRUE\` into \`FALSE\` and \`FALSE\` into \`TRUE\`.
3. Reset the row names with \`rownames(customers) <- NULL\`, so the rows are numbered 1, 2, 3, … again.
4. Check that \`nrow(customers)\` is 56 and that no \`customer_id\` appears twice (\`anyDuplicated()\` returns 0 when there are no duplicates).`,
      starterCode: `# Step 7: remove duplicated rows

# How many rows are copies of an earlier row?
sum(duplicated(customers))

# Which customers are they?


# Keep only the rows that are NOT duplicates
# customers <- customers[ ... , ]


# Number the rows 1, 2, 3, ... again
rownames(customers) <- NULL

# Check the number of rows and that every id is unique
nrow(customers)
`,
      hints: [
        "`duplicated(customers)` is a TRUE/FALSE vector – you can use it inside `[ ]` to pick rows, just like any condition.",
        "`!duplicated(customers)` is TRUE for every row you want to keep. Put it before the comma: `customers[!duplicated(customers), ]`.",
        "`customers <- customers[!duplicated(customers), ]`, then `rownames(customers) <- NULL`, `nrow(customers)` and `anyDuplicated(customers$customer_id)`.",
      ],
      solution: `sum(duplicated(customers))
customers$customer_id[duplicated(customers)]

customers <- customers[!duplicated(customers), ]
rownames(customers) <- NULL

nrow(customers)
anyDuplicated(customers$customer_id)
`,
      explanation: `- \`sum(duplicated(customers))\` is still **4** after all the cleaning.
- \`customers$customer_id[duplicated(customers)]\` shows which ones: **C004, C017, C029, C042**. Only the *second* copy is marked \`TRUE\` – the first one is kept.
- \`customers[!duplicated(customers), ]\` selects rows with the condition before the comma; the empty space after the comma means "all columns". Assigning the result back to \`customers\` removes the four copies: **60 → 56 rows**.
- After removing rows, the row names would jump (… 4, 6, 7 …). \`rownames(customers) <- NULL\` renumbers them.
- \`anyDuplicated(customers$customer_id)\` returns **0**: every customer now appears exactly once.

Why remove duplicates *after* standardising the text? Two copies of the same customer that differ only by a stray space or a capital letter are not "exact" copies, so \`duplicated()\` would miss them in the raw file. After cleaning they become identical and are caught. In real projects, also look for rows that share an id but differ in other columns – those need a human decision, not automatic deletion.`,
      tests: [
        {
          name: "`customers` has 56 rows",
          check: `nrow(customers) == 56`,
          failMessage: "Remove the 4 duplicated rows: `customers <- customers[!duplicated(customers), ]`.",
        },
        {
          name: "No row is a duplicate",
          check: `!any(duplicated(customers))`,
          failMessage: "Some rows are still duplicated. Keep only the rows where `duplicated(customers)` is FALSE.",
        },
        {
          name: "Every customer_id appears once",
          check: `anyDuplicated(customers$customer_id) == 0`,
          failMessage: "A customer id still appears twice – did you assign the filtered data back to `customers`?",
        },
      ],
    },
    {
      id: "final-summary",
      title: "Summarise the clean data",
      instructions: `The data are clean – now answer the owner's questions.

1. Print \`str(customers)\` and the number of missing values per column with \`colSums(is.na(customers))\`.
2. Store the number of customers in \`n_customers\`.
3. Store the average age in \`avg_age\` (remember \`na.rm = TRUE\`, which tells \`mean()\` to ignore missing values).
4. Store the average amount spent per city in \`spend_by_city\` with \`tapply(customers$total_spent, customers$city, mean, na.rm = TRUE)\`. \`tapply()\` splits the first vector into groups defined by the second and applies a function to each group.
5. Print your answers (rounded for reading) and \`table(customers$gender)\`. Then look closely at the city with the highest average – is the headline as simple as it looks?`,
      starterCode: `# Step 8: summarise the clean data

# Column types and missing values per column
str(customers)
colSums(is.na(customers))

# How many customers are there?
n_customers <- 0

# Average age (ignore missing ages)


# Average total spent per city
# spend_by_city <- tapply(...)


# Print your answers (round them for reading)

`,
      hints: [
        "`nrow(customers)` counts the rows, and `mean(customers$age, na.rm = TRUE)` averages the known ages.",
        "`tapply(customers$total_spent, customers$city, mean, na.rm = TRUE)` – the extra `na.rm = TRUE` is passed on to `mean()`.",
        "`round(sort(spend_by_city, decreasing = TRUE), 2)` lists the cities from highest to lowest average. To look closer, print the New York customers: `customers[customers$city == \"New York\", c(\"name\", \"total_spent\")]`.",
      ],
      solution: `str(customers)
colSums(is.na(customers))

n_customers <- nrow(customers)
avg_age <- mean(customers$age, na.rm = TRUE)
spend_by_city <- tapply(customers$total_spent, customers$city, mean, na.rm = TRUE)

n_customers
round(avg_age, 1)
round(sort(spend_by_city, decreasing = TRUE), 2)
table(customers$gender)

# Look closer at the "winner"
customers[customers$city == "New York", c("name", "total_spent")]
round(tapply(customers$total_spent, customers$city, median, na.rm = TRUE), 2)
`,
      explanation: `- \`str(customers)\` now shows the right types: \`age\` and \`total_spent\` are \`num\`, \`signup_date\` is \`Date\`, and there are **56 obs.**
- \`colSums(is.na(customers))\` counts missing values per column: **age 5, total_spent 3**, all others 0. These rows are kept on purpose – the customers exist, we just do not know every detail. Calculations use \`na.rm = TRUE\` to skip the gaps.
- \`n_customers\` is **56** and the average age is **46.9** years.
- \`spend_by_city\` (sorted): **New York 516.32, Seattle 457.08, Houston 445.38, Boston 428.37, Chicago 399.36**. Gender is balanced: **28 Female, 28 Male**.
- But look closer at New York: it has only 9 customers, and one of them, **Tara Garcia, spent 1547.38** – three times more than a typical customer. That single customer pulls the average up. The *median* (middle value), which is not affected by one extreme value, tells a different story: New York 414.94, close to Boston (424.46) and Houston (414.42). Without Tara Garcia, New York's average would be about 387.

So the honest answer to "which city spends the most?" is: *the cities are fairly similar; New York's high average comes from one big customer.* Checking a surprising result before reporting it is part of good analysis.`,
      tests: [
        {
          name: "`n_customers` is 56",
          check: `isTRUE(n_customers == 56)`,
          failMessage: "Count the rows of the cleaned data with `nrow(customers)`.",
        },
        {
          name: "`avg_age` is about 46.94",
          check: `isTRUE(all.equal(as.numeric(avg_age), 46.94118, tolerance = 1e-4))`,
          failMessage: "Use `mean(customers$age, na.rm = TRUE)` – without `na.rm = TRUE` the result is NA.",
        },
        {
          name: "`spend_by_city` has the average for all 5 cities (New York ≈ 516.32)",
          check: `length(spend_by_city) == 5 && isTRUE(all.equal(as.numeric(spend_by_city[["New York"]]), 516.3189, tolerance = 1e-4))`,
          failMessage: "Use `tapply(customers$total_spent, customers$city, mean, na.rm = TRUE)` and store it in `spend_by_city`.",
        },
      ],
    },
  ],
  wrapUp: `You turned a file that would have produced wrong answers into a clean, trustworthy table. Along the way you:

- **inspected** the data with \`str()\`, \`head()\` and \`unique()\` before changing anything;
- removed hidden spaces with \`trimws()\` and made capitals consistent with \`tolower()\`, \`toupper()\` and \`tools::toTitleCase()\`;
- recoded 8 gender spellings into 2 labels with \`%in%\`;
- converted text to numbers with \`gsub(..., fixed = TRUE)\` and \`as.numeric()\`;
- marked missing and impossible values as \`NA\` instead of guessing;
- combined two date formats into one real \`Date\` column;
- removed 4 duplicated rows, and checked every fix with a quick count or summary.

The most important habit is the rhythm **inspect → fix one thing → check**. And remember the last step: a surprising headline ("New York spends the most!") deserves a second look before you report it.

**Ideas to go further**

- Save the clean data: \`write.csv(customers, "customers_clean.csv", row.names = FALSE)\`.
- Wrap all the cleaning steps in one function, \`clean_customers <- function(path) { ... }\`, so next month's export can be cleaned with a single line.
- Redo the cleaning with dplyr's \`mutate()\` and the stringr package (\`str_trim()\`, \`str_to_title()\`) and compare the two styles.
- Count signups per month with \`format(customers$signup_date, "%Y-%m")\` and draw a bar chart of them.`,
};
