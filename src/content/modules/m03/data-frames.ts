import type { Lesson } from "../../types";

export const dataFramesLesson: Lesson = {
  id: "data-frames",
  module: 3,
  title: "Data Frames: Tables of Data",
  summary: "Create data tables, read single columns, pick rows and cells, add and change columns, and filter rows with conditions.",
  minutes: 40,
  objectives: [
    "Create a data frame with data.frame() and explain how its columns relate to vectors",
    "Get a column with $ and use it like any vector",
    "Select rows, columns and single cells with [row, column]",
    "Add new columns and change existing values",
    "Keep only the rows that meet a condition",
  ],
  intro:
    "A **data frame** is R's version of a spreadsheet table, and it is the structure you will use most as a data analyst. Each **row** describes one thing – one student, one pet, one sale – and each **column** stores one piece of information about all of them, such as name, age or price.\n\n" +
    "The secret behind data frames is simple: **each column is a vector**. Everything you learned about vectors – `mean()`, indexing, conditions – works on a column. A data frame just keeps several vectors of the same length side by side, so that row 1 of every column belongs to the same person.\n\n" +
    "Unlike a matrix, the columns of a data frame can have **different types**: names can be text while ages are numbers.",
  sections: [
    {
      id: "creating-data-frames",
      title: "Creating a data frame",
      blocks: [
        {
          kind: "definition",
          term: "Data frame",
          md: "A table in which each **column is a vector** (one type per column) and all columns have the **same length**. Each **row** is one *observation* – one person, thing or event.",
        },
        {
          kind: "code",
          example: {
            id: "create-df",
            title: "A small table of pets",
            code: `pets <- data.frame(
  name = c("Milo", "Bella", "Coco", "Max"),
  species = c("cat", "dog", "cat", "rabbit"),
  age = c(4, 7, 2, 1),
  vaccinated = c(TRUE, TRUE, FALSE, TRUE)
)
pets`,
            explanation: [
              { code: "pets <- data.frame(", text: "`data.frame()` builds a table; we store it in `pets`. The command continues over several lines until the closing bracket – R waits for it." },
              { code: `name = c("Milo", "Bella", "Coco", "Max"),`, text: "Each argument creates one column: the column **name** goes before `=`, and the column's values are a vector. This column is text." },
              { code: `species = c("cat", "dog", "cat", "rabbit"),`, text: "A second text column." },
              { code: "age = c(4, 7, 2, 1),", text: "A numeric column. Its values are in the same order as the names: Milo is 4, Bella is 7, …" },
              { code: "vaccinated = c(TRUE, TRUE, FALSE, TRUE)", text: "A logical column. Each column has exactly 4 values, one per pet." },
              { code: "pets", text: "Print the whole table." },
            ],
            output: `   name species age vaccinated
1  Milo     cat   4       TRUE
2 Bella     dog   7       TRUE
3  Coco     cat   2      FALSE
4   Max  rabbit   1       TRUE`,
            outputNote: "The first line holds the **column names**. The numbers on the left (1 to 4) are **row names** – by default just the row numbers. Every row is one pet.",
            tryIt: "Add a fifth pet: put one more value at the end of every column (all four columns must stay the same length).",
          },
        },
        { kind: "diagram", name: "data-frame", caption: "A data frame is a set of column vectors of equal length; each row is one observation." },
        {
          kind: "text",
          md: "Three functions tell you the size of a table: `nrow()` counts rows, `ncol()` counts columns and `names()` lists the column names. `str()` shows each column's type. You will use these a lot in the next lesson.",
        },
        {
          kind: "code",
          example: {
            id: "df-size",
            title: "How big is the table?",
            code: `pets <- data.frame(
  name = c("Milo", "Bella", "Coco", "Max"),
  species = c("cat", "dog", "cat", "rabbit"),
  age = c(4, 7, 2, 1),
  vaccinated = c(TRUE, TRUE, FALSE, TRUE)
)
nrow(pets)
ncol(pets)
names(pets)
str(pets)`,
            explanation: [
              { code: "nrow(pets)", text: "Number of rows (pets)." },
              { code: "ncol(pets)", text: "Number of columns (pieces of information per pet)." },
              { code: "names(pets)", text: "The column names." },
              { code: "str(pets)", text: "The structure: one line per column with its type and first values." },
            ],
            output: `[1] 4
[1] 4
[1] "name"       "species"    "age"        "vaccinated"
'data.frame':	4 obs. of  4 variables:
 $ name      : chr  "Milo" "Bella" "Coco" "Max"
 $ species   : chr  "cat" "dog" "cat" "rabbit"
 $ age       : num  4 7 2 1
 $ vaccinated: logi  TRUE TRUE FALSE TRUE`,
            outputNote: "`str()` calls rows *obs.* (observations) and columns *variables*. `chr` means character (text), `num` numeric and `logi` logical. Each line starts with `$` – a hint of how you get a column out, coming next.",
          },
        },
      ],
    },
    {
      id: "columns",
      title: "Columns are vectors: the $ operator",
      blocks: [
        {
          kind: "text",
          md: "Just like with lists, `$` followed by a column name gives you that column – as an ordinary **vector**. So you can use every vector skill on it.",
        },
        {
          kind: "code",
          example: {
            id: "df-dollar",
            title: "Working with one column",
            code: `pets <- data.frame(
  name = c("Milo", "Bella", "Coco", "Max"),
  age = c(4, 7, 2, 1)
)
pets$age
mean(pets$age)
max(pets$age)
pets$name[2]`,
            explanation: [
              { code: "pets$age", text: "The `age` column of `pets`, as a numeric vector." },
              { code: "mean(pets$age)", text: "The average age of the pets." },
              { code: "max(pets$age)", text: "The oldest age." },
              { code: "pets$name[2]", text: "First take the `name` column (a vector), then pick position 2 from it." },
            ],
            output: `[1] 4 7 2 1
[1] 3.5
[1] 7
[1] "Bella"`,
            tryIt: "How many pets are older than 2? Try `sum(pets$age > 2)`.",
          },
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Column names are case-sensitive",
          md: "`pets$age` works, but `pets$Age` does not find anything: R returns `NULL` (nothing) without an error, and a function such as `mean(pets$Age)` then gives `NA` with a warning. Check the exact spelling with `names(pets)`.",
        },
      ],
    },
    {
      id: "row-column-indexing",
      title: "Rows, columns and cells with [row, column]",
      blocks: [
        {
          kind: "text",
          md: "A data frame has two dimensions, just like a matrix, so square brackets take **two** positions: `[row, column]`. Row first, column second. Leave a side empty to get all rows or all columns. Columns can be chosen by number **or by name**.",
        },
        {
          kind: "code",
          example: {
            id: "df-index",
            title: "Selecting parts of the table",
            code: `pets <- data.frame(
  name = c("Milo", "Bella", "Coco", "Max"),
  species = c("cat", "dog", "cat", "rabbit"),
  age = c(4, 7, 2, 1),
  vaccinated = c(TRUE, TRUE, FALSE, TRUE)
)
pets[2, 3]
pets[1, ]
pets[, 1]
pets[c(1, 3), c("name", "age")]`,
            explanation: [
              { code: "pets[2, 3]", text: "Row 2, column 3: Bella's age." },
              { code: "pets[1, ]", text: "Row 1 and **all** columns – everything about Milo. The result is still a (one-row) data frame." },
              { code: "pets[, 1]", text: "**All** rows of column 1. A single column comes back as a vector." },
              { code: `pets[c(1, 3), c("name", "age")]`, text: "Rows 1 and 3, and the columns called `name` and `age`. You can mix numbers for rows and names for columns." },
            ],
            output: `[1] 7
  name species age vaccinated
1 Milo     cat   4       TRUE
[1] "Milo"  "Bella" "Coco"  "Max"
  name age
1 Milo   4
3 Coco   2`,
            outputNote: "Notice the row names in the last result: 1 and 3. R keeps the original row numbers so you can see where each row came from.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m3-df-q1",
            type: "multiple-choice",
            prompt: "Which code shows **all columns** of the **third** row of `pets`?",
            options: ["pets[3]", "pets[, 3]", "pets[3, ]", "pets$3"],
            answer: 2,
            explanation: "The row goes before the comma. Leaving the column side empty means \"all columns\".",
            optionFeedback: [
              "With a single number and no comma, R picks a **column** of a data frame, not a row.",
              "This is all rows of column 3 – the comma is on the wrong side.",
              "Correct!",
              "`$` needs a column **name**, such as `pets$age`.",
            ],
            concept: "data-frame-indexing",
          },
        },
      ],
    },
    {
      id: "modifying-data-frames",
      title: "Adding and changing columns",
      blocks: [
        {
          kind: "text",
          md: "To **add** a column, assign a vector to a new name with `$`. The vector must have one value per row – or be a single value, which R repeats for every row. Calculations on existing columns are the most common way to make a new column.",
        },
        {
          kind: "code",
          example: {
            id: "add-column",
            title: "Adding new columns",
            code: `pets <- data.frame(
  name = c("Milo", "Bella", "Coco", "Max"),
  age = c(4, 7, 2, 1)
)
pets$age_months <- pets$age * 12
pets$owner <- c("Ana", "Ben", "Ana", "Dev")
pets$clinic <- "Northside"
pets`,
            explanation: [
              { code: "pets$age_months <- pets$age * 12", text: "Multiply every age by 12 (vectorized!) and store the result as a new column `age_months`." },
              { code: `pets$owner <- c("Ana", "Ben", "Ana", "Dev")`, text: "A new column from a vector of 4 values – one per row." },
              { code: `pets$clinic <- "Northside"`, text: "A single value is repeated for every row." },
            ],
            output: `   name age age_months owner    clinic
1  Milo   4         48   Ana Northside
2 Bella   7         84   Ben Northside
3  Coco   2         24   Ana Northside
4   Max   1         12   Dev Northside`,
          },
        },
        {
          kind: "text",
          md: "To **change** values, use the same tools on the left of `<-`: `$` with a position, `[row, column]`, or a whole column. Assigning `NULL` to a column removes it.",
        },
        {
          kind: "code",
          example: {
            id: "change-values",
            title: "Changing and removing",
            code: `pets <- data.frame(
  name = c("Milo", "Bella", "Coco", "Max"),
  age = c(4, 7, 2, 1),
  owner = c("Ana", "Ben", "Ana", "Dev")
)
pets$age[3] <- 3
pets[4, "owner"] <- "Eva"
pets$age <- pets$age + 1
pets$owner <- NULL
pets`,
            explanation: [
              { code: "pets$age[3] <- 3", text: "Change position 3 of the `age` column: Coco is actually 3." },
              { code: `pets[4, "owner"] <- "Eva"`, text: "Change the cell in row 4, column `owner`." },
              { code: "pets$age <- pets$age + 1", text: "Replace the whole column: a year has passed for every pet." },
              { code: "pets$owner <- NULL", text: "`NULL` means \"nothing\" – assigning it deletes the column." },
            ],
            output: `   name age
1  Milo   5
2 Bella   8
3  Coco   4
4   Max   2`,
          },
        },
        {
          kind: "text",
          md: "To add a **row**, combine the table with a one-row data frame that has the same column names, using `rbind()` – the same function you used to stack matrix rows.",
        },
        {
          kind: "code",
          example: {
            id: "add-row",
            title: "Adding a row with rbind()",
            code: `pets <- data.frame(name = c("Milo", "Bella"), age = c(4, 7))
new_pet <- data.frame(name = "Luna", age = 3)
pets <- rbind(pets, new_pet)
pets`,
            explanation: [
              { code: `new_pet <- data.frame(name = "Luna", age = 3)`, text: "A one-row table with the **same column names**." },
              { code: "pets <- rbind(pets, new_pet)", text: "Stack it under the existing rows and save the result." },
            ],
            output: `   name age
1  Milo   4
2 Bella   7
3  Luna   3`,
          },
        },
      ],
    },
    {
      id: "filtering-rows",
      title: "Filtering rows with conditions",
      blocks: [
        {
          kind: "text",
          md: "Remember logical indexing on vectors, `scores[scores > 80]`? Data frames work the same way, with one addition: the condition goes on the **row** side of the comma. `pets[pets$age > 2, ]` means \"the rows where age is greater than 2, and all columns\".",
        },
        {
          kind: "code",
          example: {
            id: "filter-basic",
            title: "Keeping the rows you want",
            code: `pets <- data.frame(
  name = c("Milo", "Bella", "Coco", "Max"),
  species = c("cat", "dog", "cat", "rabbit"),
  age = c(4, 7, 2, 1)
)
pets$age > 2
pets[pets$age > 2, ]`,
            explanation: [
              { code: "pets$age > 2", text: "First the condition on its own: one TRUE/FALSE per row." },
              { code: "pets[pets$age > 2, ]", text: "Use it on the row side: keep rows 1 and 2 (TRUE), drop rows 3 and 4 (FALSE). The empty space after the comma means \"all columns\"." },
            ],
            output: `[1]  TRUE  TRUE FALSE FALSE
   name species age
1  Milo     cat   4
2 Bella     dog   7`,
          },
        },
        {
          kind: "code",
          example: {
            id: "filter-text",
            title: "Conditions on text columns",
            code: `pets <- data.frame(
  name = c("Milo", "Bella", "Coco", "Max"),
  species = c("cat", "dog", "cat", "rabbit"),
  age = c(4, 7, 2, 1)
)
pets[pets$species == "cat", ]
pets[pets$species == "cat", "name"]
nrow(pets[pets$species != "cat", ])`,
            explanation: [
              { code: `pets[pets$species == "cat", ]`, text: "`==` (two equals signs) asks \"is equal to?\". Keep the rows where the species is \"cat\"." },
              { code: `pets[pets$species == "cat", "name"]`, text: "Same rows, but only the `name` column – a vector of the cats' names." },
              { code: `nrow(pets[pets$species != "cat", ])`, text: "`!=` means \"is not equal to\". `nrow()` counts the rows that are left: the pets that are not cats." },
            ],
            output: `  name species age
1 Milo     cat   4
3 Coco     cat   2
[1] "Milo" "Coco"
[1] 2`,
          },
        },
        {
          kind: "text",
          md: "To combine two conditions, use `&` (**and**: both must be TRUE) or `|` (**or**: at least one must be TRUE). You will practise these much more in Module 4.",
        },
        {
          kind: "code",
          example: {
            id: "filter-and-or",
            title: "Two conditions at once",
            code: `pets <- data.frame(
  name = c("Milo", "Bella", "Coco", "Max"),
  species = c("cat", "dog", "cat", "rabbit"),
  age = c(4, 7, 2, 1)
)
pets[pets$species == "cat" & pets$age > 3, ]
pets[pets$species == "dog" | pets$age < 2, ]`,
            explanation: [
              { code: `pets$species == "cat" & pets$age > 3`, text: "Cats **and** older than 3: only Milo." },
              { code: `pets$species == "dog" | pets$age < 2`, text: "Dogs **or** younger than 2: Bella (a dog) and Max (age 1)." },
            ],
            output: `  name species age
1 Milo     cat   4
   name species age
2 Bella     dog   7
4   Max  rabbit   1`,
          },
        },
        {
          kind: "text",
          md: "Now let's try it on real data. R Academy comes with a file of 60 students' test results. `read.csv()` reads a CSV file (a plain-text table with commas between the values) into a data frame.",
        },
        {
          kind: "code",
          example: {
            id: "students-filter",
            title: "Filtering the students dataset",
            code: `students <- read.csv("data/students.csv")
nrow(students)
students[1:3, c("name", "class", "math")]
mean(students$math)
students[students$math >= 95, c("name", "math")]`,
            explanation: [
              { code: `students <- read.csv("data/students.csv")`, text: "Read the file `students.csv` from the `data` folder into a data frame called `students`." },
              { code: "nrow(students)", text: "60 rows: one per student." },
              { code: `students[1:3, c("name", "class", "math")]`, text: "The first three rows, showing just three of the ten columns." },
              { code: "mean(students$math)", text: "The average math score of all 60 students." },
              { code: `students[students$math >= 95, c("name", "math")]`, text: "Who scored 95 or more in math?" },
            ],
            output: `[1] 60
   name class math
1 Amara     C   86
2   Ben     A   54
3 Chloe     B   99
[1] 74.65
     name math
3   Chloe   99
14   Noah   98
28 Bianca   95`,
            outputNote: "Three students scored 95 or more. Their row names (3, 14, 28) tell you where they are in the full table.",
            tryIt: "Who studies more than 15 hours a week? Filter on the `study_hours` column.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m3-df-q2",
            type: "predict-output",
            prompt: "What does this code print?",
            code: `shop <- data.frame(item = c("pen", "book", "bag"), price = c(1.5, 12, 25))
shop[shop$price > 10, "item"]`,
            options: ["[1] \"book\" \"bag\"", "[1] 12 25", "[1] \"pen\"", "[1] FALSE  TRUE  TRUE"],
            answer: 0,
            explanation: "The condition keeps rows 2 and 3 (price above 10), and `\"item\"` selects only the item column, which comes back as a character vector.",
            optionFeedback: [
              "Correct!",
              "Those are the prices; the column side asks for `\"item\"`.",
              "The pen costs 1.5, so its row is dropped.",
              "That is just the condition `shop$price > 10`. Inside the brackets it is used to keep rows.",
            ],
            concept: "filtering-rows",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Columns of different lengths",
      wrong: `pets <- data.frame(name = c("Milo", "Bella"), age = c(4, 7, 2))`,
      error: "arguments imply differing number of rows",
      why: "Every column needs one value per row. Here there are 2 names but 3 ages, so R cannot build the table. Count the values in each `c()`.",
      right: `pets <- data.frame(name = c("Milo", "Bella", "Coco"), age = c(4, 7, 2))`,
    },
    {
      title: "Forgetting the comma when filtering rows",
      wrong: `shop <- data.frame(item = c("pen", "book", "bag"), price = c(1.5, 12, 25))
shop[shop$price > 10]`,
      error: "undefined columns selected",
      why: "Without a comma, R treats the condition as a choice of **columns**, not rows. The table has only 2 columns, so asking for a third fails. Put a comma after the condition: `[condition, ]`.",
      right: `shop <- data.frame(item = c("pen", "book", "bag"), price = c(1.5, 12, 25))
shop[shop$price > 10, ]`,
    },
    {
      title: "Using = instead of == in a condition",
      wrong: `pets <- data.frame(name = c("Milo", "Bella", "Coco"), species = c("cat", "dog", "cat"))
pets[pets$species = "cat", ]`,
      error: "unexpected '='",
      why: "A single `=` means \"set this to\" (like `<-`). To **ask** whether two things are equal you need two equals signs, `==`.",
      right: `pets <- data.frame(name = c("Milo", "Bella", "Coco"), species = c("cat", "dog", "cat"))
pets[pets$species == "cat", ]`,
    },
    {
      title: "Misspelling a column name",
      wrong: `pets <- data.frame(name = c("Milo", "Bella", "Coco"), age = c(4, 7, 2))
mean(pets$Age)`,
      error: "argument is not numeric or logical",
      why: "R is case-sensitive: the column is `age`, not `Age`. `pets$Age` silently returns `NULL`, and `mean()` of nothing gives `NA` with a warning. Check the names with `names(pets)`.",
      right: `pets <- data.frame(name = c("Milo", "Bella", "Coco"), age = c(4, 7, 2))
mean(pets$age)`,
    },
  ],
  exerciseIds: ["m3-data-frame-basics", "m3-data-frame-filter"],
  quiz: [
    {
      id: "m3-df-q3",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `df <- data.frame(x = c(5, 10, 15), y = c("a", "b", "c"))
df$x[2]`,
      options: ["[1] 10", "[1] \"b\"", "[1] 5 10 15", "[1] 2"],
      answer: 0,
      explanation: "`df$x` is the vector `5 10 15`, and `[2]` picks its second value.",
      optionFeedback: [
        "Correct!",
        "`\"b\"` is in column `y`; we asked for column `x`.",
        "That is the whole column; `[2]` then picks one value.",
        "`[2]` is a position; R returns the value stored there.",
      ],
      concept: "dollar-operator",
    },
    {
      id: "m3-df-q4",
      type: "fill-blank",
      prompt: "Complete the code so that it keeps only the pets **younger than 3**.",
      code: `pets <- data.frame(name = c("Milo", "Coco", "Max"), age = c(4, 2, 1))
young <- pets[pets$age ___ 3, ]
young`,
      accept: ["<"],
      hint: "Which comparison operator means \"less than\"?",
      explanation: "`pets$age < 3` is TRUE for Coco and Max, so those rows are kept.",
      concept: "filtering-rows",
    },
    {
      id: "m3-df-q5",
      type: "true-false",
      prompt: "In a data frame, different columns can hold different types of data (for example text in one column and numbers in another).",
      answer: true,
      explanation: "Yes – this is the big difference from a matrix. Each **column** has one type, but columns can differ.",
      concept: "data-frames",
    },
    {
      id: "m3-df-q6",
      type: "find-error",
      prompt: "This code should show the rows of items that cost more than 10. Click the line with the mistake.",
      code: `shop <- data.frame(item = c("pen", "book", "bag"), price = c(1.5, 12, 25))
expensive <- shop[shop$price > 10]
expensive`,
      errorLine: 2,
      errorKind: "error",
      fix: `shop <- data.frame(item = c("pen", "book", "bag"), price = c(1.5, 12, 25))
expensive <- shop[shop$price > 10, ]
expensive`,
      explanation: "The comma is missing. `shop[condition, ]` filters rows; without the comma R tries to select columns and stops with *undefined columns selected*.",
      concept: "filtering-rows",
    },
    {
      id: "m3-df-q7",
      type: "multiple-choice",
      prompt: "`pets` has a column `age`. Which line adds a new column with every age doubled?",
      options: [
        "pets$age * 2",
        "pets$double_age <- pets$age * 2",
        "double_age <- pets$age * 2",
        "pets[double_age] <- age * 2",
      ],
      answer: 1,
      explanation: "Assigning to `pets$new_name` creates a new column inside the data frame.",
      optionFeedback: [
        "This only prints the doubled ages; nothing is stored.",
        "Correct!",
        "This creates a separate vector called `double_age`, outside the table.",
        "`age` on its own is not a variable (it lives inside `pets`), and the column name would need quotes.",
      ],
      concept: "adding-columns",
    },
  ],
  keyPoints: [
    "A data frame is a table whose columns are vectors of equal length; each row is one observation.",
    "Create one with `data.frame(column = vector, ...)` or read one from a file with `read.csv()`.",
    "`df$column` gives a column as a vector, so `mean(df$column)` and `df$column[2]` work.",
    "`df[row, column]` selects rows, columns or cells – row first; an empty side means \"all\".",
    "Assign to `df$new_column` to add a column; assign to a cell or column to change it; assign `NULL` to remove a column.",
    "`df[condition, ]` keeps the rows where the condition is TRUE – do not forget the comma.",
  ],
  concepts: [
    "data-frames",
    "creating-data-frames",
    "dollar-operator",
    "data-frame-indexing",
    "adding-columns",
    "modifying-data",
    "filtering-rows",
  ],
  glossary: ["data-frame", "observation", "dataset", "csv", "null"],
  prerequisites: ["lists-matrices-factors"],
  datasets: ["students"],
  playground: `# Explore the students dataset
students <- read.csv("data/students.csv")

students[1:5, c("name", "class", "math")]
mean(students$reading)
students[students$class == "B" & students$math > 85, c("name", "math")]
`,
};
