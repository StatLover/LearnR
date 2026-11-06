import type { Lesson } from "../../types";

export const filteringSortingSelectingLesson: Lesson = {
  id: "filtering-sorting-selecting",
  module: 5,
  title: "Filtering, Sorting and Selecting Data",
  summary: "Keep only the rows and columns you need with logical indexing and subset(), and sort rows with order().",
  minutes: 35,
  objectives: [
    "Filter rows of a data frame with a logical condition, e.g. `students[students$math > 90, ]`",
    "Select columns by name, and drop columns you do not need",
    "Combine conditions with `&`, `|` and `%in%`, and avoid the NA trap",
    "Use `subset()` to filter and select in one readable step",
    "Sort rows with `order()`, including largest-first and sorting by two columns",
  ],
  intro: `A dataset usually holds far more than you need for one question. To answer *"Which students scored above 90 in math?"* you only need **some rows** (the students above 90) and **some columns** (their names and scores), perhaps **sorted** from best to worst.

These three moves – **filtering** rows, **selecting** columns and **sorting** – are the everyday tools of data work. In this lesson you do them with base R (the functions that come with R itself). In the last lesson of this module you will meet dplyr, which does the same with friendlier names. Learning the base R way first helps you understand what is happening underneath.`,
  sections: [
    {
      id: "rows-and-columns",
      title: "The [rows, columns] address",
      blocks: [
        {
          kind: "text",
          md: "In Stage 1 you learned that square brackets pick parts of a data frame: `df[rows, columns]`. Whatever you write **before the comma** chooses rows; whatever you write **after the comma** chooses columns. Leaving one side empty means *all*.",
        },
        {
          kind: "code",
          example: {
            id: "row-col-address",
            title: "Pick rows and columns by position and by name",
            code: `students <- read.csv("data/students.csv")

students[1:3, c("name", "class", "math")]
students[5, "name"]`,
            explanation: [
              { code: `students[1:3, c("name", "class", "math")]`, text: "Before the comma, `1:3` means rows 1, 2 and 3. After the comma, `c(\"name\", \"class\", \"math\")` lists the columns we want, by name." },
              { code: `students[5, "name"]`, text: "Row 5, column `name`: a single value. When you ask for just one column, R returns a plain vector instead of a table." },
            ],
            output: `   name class math
1 Amara     C   86
2   Ben     A   54
3 Chloe     B   99
[1] "Elena"`,
            outputNote: "The first result is a small data frame (3 rows, 3 columns). The second is the single text value `\"Elena\"` – the name of the fifth student.",
            tryIt: "Show rows 10 to 12 with the columns `name` and `attendance`.",
          },
        },
        {
          kind: "diagram",
          name: "data-frame",
          caption: "A data frame is a table of columns (vectors). df[rows, columns] picks a part of it.",
        },
      ],
    },
    {
      id: "selecting-columns",
      title: "Selecting columns",
      blocks: [
        {
          kind: "text",
          md: "There are three common ways to get columns, and they return slightly different things:\n\n- `df$col` – one column as a **vector** (good for calculations).\n- `df[, c(\"a\", \"b\")]` – several columns as a **data frame**.\n- `df[\"col\"]` – one column, but kept as a **data frame** with one column.",
        },
        {
          kind: "code",
          example: {
            id: "select-columns",
            title: "Keep only the columns you need",
            code: `students <- read.csv("data/students.csv")

scores <- students[, c("name", "math", "reading")]
head(scores, 3)
ncol(scores)`,
            explanation: [
              { code: `students[, c("name", "math", "reading")]`, text: "Nothing before the comma, so all 60 rows are kept. After the comma, a character vector of column names chooses three columns." },
              { code: "scores <- ...", text: "The smaller table is stored as `scores`. The original `students` is not changed." },
              { code: "head(scores, 3)", text: "Shows the first three rows of the new table." },
            ],
            output: `   name math reading
1 Amara   86      82
2   Ben   54      53
3 Chloe   99      99
[1] 3`,
            outputNote: "`scores` has the same 60 students but only 3 columns, in the order you listed them.",
            tryIt: "Change the order inside `c()` to `c(\"math\", \"name\")`. The columns come out in the new order.",
          },
        },
        {
          kind: "code",
          example: {
            id: "dollar-vs-bracket",
            title: "Vector or data frame?",
            code: `students <- read.csv("data/students.csv")

math_scores <- students$math
class(math_scores)
length(math_scores)

one_col <- students["math"]
class(one_col)
dim(one_col)`,
            explanation: [
              { code: "students$math", text: "The `$` operator takes one column out as a vector of 60 numbers." },
              { code: `students["math"]`, text: "Single brackets with no comma keep the data frame shape: a table with 60 rows and 1 column." },
            ],
            output: `[1] "integer"
[1] 60
[1] "data.frame"
[1] 60  1`,
            outputNote: "`math_scores` is an integer vector you can pass to `mean()` or `max()`. `one_col` is a one-column data frame. Use `$` when you want to calculate with a column, brackets when you want to keep a table.",
          },
        },
        {
          kind: "code",
          example: {
            id: "drop-columns",
            title: "Drop columns you do not need",
            code: `students <- read.csv("data/students.csv")

no_ids <- students[, -c(1, 4)]
names(no_ids)

small <- subset(students, select = -c(student_id, age))
names(small)`,
            explanation: [
              { code: "students[, -c(1, 4)]", text: "A minus sign in front of positions means *everything except*. Columns 1 (`student_id`) and 4 (`age`) are dropped." },
              { code: "subset(students, select = -c(student_id, age))", text: "The same with `subset()` (explained below), using column names instead of positions – safer, because positions change if the file changes." },
            ],
            output: `[1] "name"        "gender"      "class"       "study_hours" "attendance"
[6] "math"        "reading"     "science"
[1] "name"        "gender"      "class"       "study_hours" "attendance"
[6] "math"        "reading"     "science"    `,
            outputNote: "Both ways give the same eight columns.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m5-filter-q-inline1",
            type: "multiple-choice",
            prompt: "You want the **average** reading score. Which expression gives you a vector you can pass straight to `mean()`?",
            options: ["`students[\"reading\"]`", "`students$reading`", "`students[, c(\"name\", \"reading\")]`", "`names(students)`"],
            answer: 1,
            optionFeedback: [
              "This is a one-column data frame. `mean()` of a data frame gives a warning and `NA`.",
              "Correct – `$` returns the column as a numeric vector.",
              "This is a two-column data frame, including text.",
              "This gives the column names, not the values.",
            ],
            explanation: "`students$reading` is a vector of numbers, so `mean(students$reading)` works. Brackets without a comma keep the data frame shape.",
            concept: "selecting-columns",
          },
        },
      ],
    },
    {
      id: "logical-filtering",
      title: "Filtering rows with conditions",
      blocks: [
        {
          kind: "text",
          md: "To keep only *some* rows, put a **condition** before the comma. A condition such as `students$math > 90` compares every value in the column and gives one `TRUE` or `FALSE` per row. The brackets then keep the rows where the answer is `TRUE`. This is called **logical indexing**.",
        },
        {
          kind: "code",
          example: {
            id: "logical-index",
            title: "From a condition to a filtered table",
            code: `students <- read.csv("data/students.csv")

high <- students$math > 90
head(high, 10)
sum(high)

students[high, c("name", "math")]`,
            explanation: [
              { code: "high <- students$math > 90", text: "Compares all 60 math scores with 90. The result is a logical vector of 60 `TRUE`/`FALSE` values, stored in `high`." },
              { code: "head(high, 10)", text: "The first ten answers: only the third student scored above 90." },
              { code: "sum(high)", text: "`TRUE` counts as 1 and `FALSE` as 0, so `sum()` counts how many rows meet the condition." },
              { code: `students[high, c("name", "math")]`, text: "Keeps the rows where `high` is `TRUE`, and only the columns `name` and `math`." },
            ],
            output: ` [1] FALSE FALSE  TRUE FALSE FALSE FALSE FALSE FALSE FALSE FALSE
[1] 6
     name math
3   Chloe   99
14   Noah   98
21   Umar   93
28 Bianca   95
50   Yara   93
51   Zane   94`,
            outputNote: "Six students scored above 90. The row names on the left (3, 14, 21, …) are their **original** row numbers – R keeps them so you can see where each row came from.",
            tryIt: "Change `> 90` to `< 60` to find students who may need help in math.",
          },
        },
        {
          kind: "text",
          md: "Usually you write the condition directly inside the brackets. To combine conditions, use the logical operators you know from Stage 1:",
        },
        {
          kind: "table",
          headers: ["Operator", "Meaning", "Example"],
          rows: [
            ["`==`", "is equal to", "`students$class == \"A\"`"],
            ["`!=`", "is not equal to", "`students$gender != \"Male\"`"],
            ["`>` `>=` `<` `<=`", "greater / less than (or equal)", "`students$age >= 18`"],
            ["`&`", "AND – both must be TRUE", "`students$class == \"A\" & students$math > 80`"],
            ["`|`", "OR – at least one must be TRUE", "`students$math > 95 | students$reading > 95`"],
            ["`!`", "NOT – flips TRUE and FALSE", "`!(students$class == \"A\")`"],
            ["`%in%`", "is one of these values", "`students$class %in% c(\"A\", \"C\")`"],
          ],
        },
        {
          kind: "code",
          example: {
            id: "and-condition",
            title: "Two conditions with & (AND)",
            code: `students <- read.csv("data/students.csv")

students[students$gender == "Female" & students$study_hours >= 15,
         c("name", "study_hours", "math")]`,
            explanation: [
              { code: `students$gender == "Female"`, text: "TRUE for every female student. Note the double `==` for comparing; a single `=` would be a syntax error here." },
              { code: "& students$study_hours >= 15", text: "`&` keeps a row only if **both** conditions are TRUE: female *and* studying 15 hours or more." },
              { code: `c("name", "study_hours", "math")`, text: "The columns to show. A long line can continue on the next line – R waits for the closing bracket." },
            ],
            output: `     name study_hours math
24 Ximena          15   81
34   Hana          15   68`,
            outputNote: "Only two female students study 15 hours or more per week.",
          },
        },
        {
          kind: "code",
          example: {
            id: "or-and-in",
            title: "OR with | and lists of values with %in%",
            code: `students <- read.csv("data/students.csv")

students[students$math > 95 | students$reading > 95, c("name", "math", "reading")]

students[students$class %in% c("A", "C") & students$reading > 90,
         c("name", "class", "reading")]`,
            explanation: [
              { code: "students$math > 95 | students$reading > 95", text: "`|` keeps a row if **at least one** condition is TRUE: above 95 in math, in reading, or in both." },
              { code: `students$class %in% c("A", "C")`, text: "`%in%` asks *is the value one of these?* – TRUE for classes A and C. It is shorter than `students$class == \"A\" | students$class == \"C\"`." },
            ],
            output: `    name math reading
3  Chloe   99      99
14  Noah   98     100
21  Umar   93     100
26   Zoe   84      96
31 Ethan   85      96
50  Yara   93      98
51  Zane   94      96
    name class reading
21  Umar     C     100
31 Ethan     C      96
46   Uma     C      91
50  Yara     A      98
51  Zane     A      96`,
            outputNote: "Seven students are above 95 in at least one subject. Only Chloe and Noah are above 95 in math; the other five got in through their reading score. The second table lists the strong readers (above 90) in classes A and C.",
            tryIt: "Change the `|` in the first condition to `&`. How many students are above 95 in *both* subjects?",
          },
        },
      ],
    },
    {
      id: "na-trap",
      title: "Watch out: missing values in conditions",
      blocks: [
        {
          kind: "text",
          md: "Three students have no science score (`NA`). Is `NA > 95` TRUE or FALSE? R cannot know, so the answer is `NA`. When a condition contains `NA`, square brackets give you a strange row full of `NA`s for each unknown.",
        },
        {
          kind: "code",
          example: {
            id: "na-rows",
            title: "The NA trap and two fixes",
            code: `students <- read.csv("data/students.csv")

students[students$science > 95, c("name", "science")]

students[which(students$science > 95), c("name", "science")]`,
            explanation: [
              { code: "students[students$science > 95, ...]", text: "For the three missing scores the condition is `NA`, and R returns a row of `NA`s for each – labelled `NA`, `NA.1` and `NA.2`." },
              { code: "which(students$science > 95)", text: "`which()` turns the logical vector into the **positions** that are TRUE and ignores NAs, so only real matches remain." },
            ],
            output: `      name science
3    Chloe     100
NA    <NA>      NA
14    Noah      99
21    Umar      96
NA.1  <NA>      NA
NA.2  <NA>      NA
51    Zane      98
    name science
3  Chloe     100
14  Noah      99
21  Umar      96
51  Zane      98`,
            outputNote: "The first table contains three fake rows. The second is correct: four students scored above 95 in science. Another fix is to add `!is.na(students$science) &` to the condition, and `subset()` (next section) avoids the problem automatically.",
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Rows full of NA are a warning sign",
          md: "If a filtered table shows row names like `NA`, `NA.1` or values `<NA>`, your condition met missing values. Use `which()`, `!is.na()` or `subset()` to drop them.",
        },
      ],
    },
    {
      id: "subset-function",
      title: "subset(): filtering made readable",
      blocks: [
        {
          kind: "text",
          md: "Writing `students$` again and again is tiring. The function `subset()` lets you use the column names directly. Its form is `subset(data, condition, select = columns)`. It also drops rows where the condition is `NA`.",
        },
        {
          kind: "code",
          example: {
            id: "subset-example",
            title: "Filter and select in one call",
            code: `students <- read.csv("data/students.csv")

subset(students, class == "A" & study_hours >= 12,
       select = c(name, study_hours, math))

subset(students, science > 95, select = c(name, science))`,
            explanation: [
              { code: "subset(students, ...)", text: "The first argument is the data frame. Inside `subset()`, R looks up names like `class` and `study_hours` as columns of `students`, so no `students$` is needed." },
              { code: `class == "A" & study_hours >= 12`, text: "The condition: students in class A who study 12 hours or more." },
              { code: "select = c(name, study_hours, math)", text: "The columns to keep. Inside `subset()` you may write column names without quotes." },
              { code: "subset(students, science > 95, ...)", text: "The same NA question as before – but `subset()` quietly leaves out the missing scores." },
            ],
            output: `   name study_hours math
9  Isla          13   70
34 Hana          15   68
50 Yara          14   93
    name science
3  Chloe     100
14  Noah      99
21  Umar      96
51  Zane      98`,
            outputNote: "Three hard-working students in class A, and the four top science scores without any fake NA rows.",
            tryIt: "Use `subset()` to find the students older than 18 who attend less than 80% of classes. Show their `name`, `age` and `attendance`.",
          },
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Which one should I use?",
          md: "`subset()` is easier to read and great for exploring. Square brackets work everywhere (also inside your own functions and for changing values, as you will do in the cleaning lesson). Knowing both is useful.",
        },
      ],
    },
    {
      id: "sorting",
      title: "Sorting rows with order()",
      blocks: [
        {
          kind: "text",
          md: "You may remember `sort()`, which sorts a single vector. A data frame needs something different: all columns must move **together**, so each student keeps their own scores. The function `order()` returns the **positions** of the values in sorted order. Put those positions before the comma and the whole rows are rearranged.",
        },
        {
          kind: "code",
          example: {
            id: "order-vs-sort",
            title: "What order() returns",
            code: `x <- c(30, 10, 20)

sort(x)
order(x)
x[order(x)]`,
            explanation: [
              { code: "sort(x)", text: "Returns the values themselves, smallest first." },
              { code: "order(x)", text: "Returns *positions*: the smallest value is at position 2, then position 3, then position 1." },
              { code: "x[order(x)]", text: "Using those positions as an index gives the sorted values – the same result as `sort(x)`." },
            ],
            output: `[1] 10 20 30
[1] 2 3 1
[1] 10 20 30`,
            outputNote: "`order()` tells you *where* to find the values in sorted order. That is exactly what you need to reorder rows.",
          },
        },
        {
          kind: "code",
          example: {
            id: "order-rows",
            title: "Sort students by math score, best first",
            code: `students <- read.csv("data/students.csv")

ranked <- students[order(students$math, decreasing = TRUE), c("name", "math")]
head(ranked, 5)`,
            explanation: [
              { code: "order(students$math, decreasing = TRUE)", text: "The row positions sorted by math score, largest first (`decreasing = TRUE`). Without it, `order()` sorts from smallest to largest." },
              { code: "students[order(...), c(\"name\", \"math\")]", text: "The positions go **before the comma**, so whole rows are rearranged. After the comma we keep two columns." },
              { code: "head(ranked, 5)", text: "The top five." },
            ],
            output: `     name math
3   Chloe   99
14   Noah   98
28 Bianca   95
51   Zane   94
21   Umar   93`,
            outputNote: "Chloe has the best math score (99). Umar and Yara both have 93; only Umar fits in the top five because he comes first in the file.",
            tryIt: "Sort by `name` instead: `students[order(students$name), c(\"name\", \"class\")]`. Text is sorted alphabetically.",
          },
        },
        {
          kind: "code",
          example: {
            id: "order-two-columns",
            title: "Sort by two columns",
            code: `students <- read.csv("data/students.csv")

by_class <- students[order(students$class, -students$math),
                     c("name", "class", "math")]
head(by_class, 8)`,
            explanation: [
              { code: "order(students$class, -students$math)", text: "Sorts first by `class` (A, B, C). Within the same class, ties are broken by the second column. The minus sign in `-students$math` flips the numbers, so the highest math score comes first." },
              { code: "head(by_class, 8)", text: "Shows the first eight rows – all from class A, best first." },
            ],
            output: `     name class math
51   Zane     A   94
50   Yara     A   93
20   Tara     A   88
38   Lena     A   87
58   Gina     A   83
32 Fatima     A   82
36  Julia     A   79
6   Farid     A   78`,
            outputNote: "Class A's students appear first, from the best math score down. Further down (not shown) come class B and then class C, each sorted the same way. The minus trick works for numbers only – for text, use `decreasing = TRUE`.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m5-filter-q-inline2",
            type: "predict-output",
            prompt: "What does this code print?",
            code: `prices <- c(4.5, 1.2, 3.8)
order(prices, decreasing = TRUE)`,
            options: ["[1] 4.5 3.8 1.2", "[1] 1 3 2", "[1] 2 3 1", "[1] 3 1 2"],
            answer: 1,
            optionFeedback: [
              "These are the sorted *values*. `order()` returns positions.",
              "Correct – the largest value (4.5) is at position 1, then 3.8 at position 3, then 1.2 at position 2.",
              "That is the order from smallest to largest.",
              "Look again: which position holds the largest price?",
            ],
            explanation: "`order()` returns positions. Largest first: 4.5 is at position 1, 3.8 at position 3 and 1.2 at position 2, so the result is `1 3 2`.",
            concept: "sorting",
          },
        },
      ],
    },
    {
      id: "putting-it-together",
      title: "Putting it together: answering a question",
      blocks: [
        {
          kind: "text",
          md: "Real questions usually need all three moves. *Among smokers over 70, who has the highest blood pressure?* Filter the smokers over 70, sort them by blood pressure, then select the columns worth showing.",
        },
        {
          kind: "code",
          example: {
            id: "patients-question",
            title: "Older smokers with the highest blood pressure",
            code: `patients <- read.csv("data/patients.csv")

older_smokers <- subset(patients, smoker == "Yes" & age > 70)
nrow(older_smokers)

sorted <- older_smokers[order(older_smokers$systolic_bp, decreasing = TRUE), ]
head(sorted[, c("patient_id", "age", "systolic_bp")], 3)`,
            explanation: [
              { code: `subset(patients, smoker == "Yes" & age > 70)`, text: "**Filter**: keep smokers older than 70 (all columns)." },
              { code: "nrow(older_smokers)", text: "How many patients matched." },
              { code: "older_smokers[order(older_smokers$systolic_bp, decreasing = TRUE), ]", text: "**Sort**: highest systolic blood pressure first. The empty space after the comma keeps all columns." },
              { code: `sorted[, c("patient_id", "age", "systolic_bp")]`, text: "**Select**: only the three columns we want to report, then `head(..., 3)` shows the top three." },
            ],
            output: `[1] 8
    patient_id age systolic_bp
121       P121  79         171
72        P072  77         168
71        P071  73         159`,
            outputNote: "Eight patients are smokers over 70. Patient P121 (age 79) has the highest systolic blood pressure, 171 mmHg.",
            tryIt: "Answer a new question: which three non-smokers exercise 6 or more days a week and have the lowest BMI?",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Forgetting the comma inside the brackets",
      wrong: `students <- read.csv("data/students.csv")
students[students$math > 90]`,
      error: "undefined columns selected",
      why: "Without a comma, R treats the condition as a choice of **columns**, not rows – and there are no columns called TRUE or FALSE. To filter rows, the condition goes before a comma: `df[condition, ]`.",
      right: `students <- read.csv("data/students.csv")
students[students$math > 90, ]`,
    },
    {
      title: "Using = instead of == in a condition",
      wrong: `students <- read.csv("data/students.csv")
students[students$class = "A", ]`,
      error: "unexpected '='",
      why: "A single `=` assigns a value (like `<-`); it does not compare. To ask *is it equal?* you need the double `==`.",
      right: `students <- read.csv("data/students.csv")
students[students$class == "A", ]`,
    },
    {
      title: "Forgetting `df$` inside the brackets",
      wrong: `students <- read.csv("data/students.csv")
students[math > 90, ]`,
      error: "object 'math' not found",
      why: "Inside square brackets, R does not look inside the data frame for column names, so `math` on its own is unknown. Write `students$math`, or use `subset(students, math > 90)`, which does look up column names.",
      right: `students <- read.csv("data/students.csv")
students[students$math > 90, ]`,
    },
    {
      title: "Sorting one column with sort() instead of reordering rows",
      wrong: `students <- read.csv("data/students.csv")
students$math <- sort(students$math)
head(students[, c("name", "math")], 3)`,
      why: "`sort()` sorts only the math column and puts it back – now Amara gets the lowest score in the class! The other columns did not move, so the rows are scrambled. No error appears, which makes this mistake dangerous. Use `order()` before the comma to move whole rows.",
      right: `students <- read.csv("data/students.csv")
sorted <- students[order(students$math), ]
head(sorted[, c("name", "math")], 3)`,
    },
  ],
  exerciseIds: ["m5-filter-select", "m5-sort-and-filter"],
  quiz: [
    {
      id: "m5-filter-q1",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `df <- data.frame(name = c("A", "B", "C"), score = c(70, 95, 82))
df[df$score > 80, "name"]`,
      options: [`[1] "B" "C"`, `[1] "B"`, `[1] 95 82`, `[1] "A" "B" "C"`],
      answer: 0,
      optionFeedback: [
        "Correct – B (95) and C (82) are above 80, and we asked for the name column.",
        "82 is also greater than 80.",
        "We selected the `name` column, not `score`.",
        "A has 70, which is not above 80.",
      ],
      explanation: "The condition `df$score > 80` is `FALSE TRUE TRUE`, so rows 2 and 3 are kept. After the comma, `\"name\"` selects one column, which comes back as a vector.",
      concept: "logical-indexing",
    },
    {
      id: "m5-filter-q2",
      type: "multiple-choice",
      prompt: "Which code keeps the students in class A **or** class B?",
      options: [
        "`students[students$class == c(\"A\", \"B\"), ]`",
        "`students[students$class %in% c(\"A\", \"B\"), ]`",
        "`students[students$class == \"A\" & students$class == \"B\", ]`",
        "`students[, students$class %in% c(\"A\", \"B\")]`",
      ],
      answer: 1,
      optionFeedback: [
        "`==` with two values compares element by element in turns (recycling), so it silently misses rows.",
        "Correct – `%in%` checks whether each class is one of the listed values.",
        "No student can be in class A *and* class B at the same time, so this returns no rows.",
        "The condition is after the comma, so it tries to choose columns.",
      ],
      explanation: "`%in%` asks *is this value one of these?* for every row. `students$class == \"A\" | students$class == \"B\"` would also work.",
      concept: "logical-indexing",
    },
    {
      id: "m5-filter-q3",
      type: "fill-blank",
      prompt: "Complete the code so the students are sorted from the highest reading score to the lowest.",
      code: `students <- read.csv("data/students.csv")
ranked <- students[order(students$reading, ___ = TRUE), ]`,
      accept: ["decreasing"],
      hint: "The argument's name means \"getting smaller\".",
      explanation: "`order(x, decreasing = TRUE)` returns positions from the largest value to the smallest. You could also write `order(-students$reading)` for numbers.",
      concept: "sorting",
    },
    {
      id: "m5-filter-q4",
      type: "find-error",
      prompt: "This code should list the students who study more than 15 hours. Which line causes the error?",
      code: `students <- read.csv("data/students.csv")
busy <- students[study_hours > 15, ]
nrow(busy)`,
      errorLine: 2,
      errorKind: "error",
      fix: `students <- read.csv("data/students.csv")
busy <- students[students$study_hours > 15, ]
nrow(busy)`,
      explanation: "Inside square brackets you must write `students$study_hours`; on its own, `study_hours` is not a variable, so R reports `object 'study_hours' not found`. Alternatively use `subset(students, study_hours > 15)`.",
      concept: "logical-indexing",
    },
    {
      id: "m5-filter-q5",
      type: "true-false",
      prompt: "`subset(students, science > 90)` leaves out students whose science score is `NA`.",
      answer: true,
      explanation: "`subset()` keeps only rows where the condition is `TRUE`, so rows where it is `NA` are dropped. Square brackets with a plain condition would instead return rows full of `NA`.",
      concept: "subset-function",
    },
    {
      id: "m5-filter-q6",
      type: "multiple-choice",
      prompt: "What does `students[, c(\"name\", \"math\")]` return?",
      options: [
        "The first two rows",
        "A data frame with all rows and only the columns `name` and `math`",
        "A vector of names",
        "An error, because the space before the comma is empty",
      ],
      answer: 1,
      optionFeedback: [
        "The part before the comma (rows) is empty, which means *all rows*.",
        "Correct.",
        "Two columns are selected, so the result is a data frame.",
        "An empty space before the comma is allowed and means all rows.",
      ],
      explanation: "In `df[rows, columns]`, leaving the rows part empty keeps every row. The column part chooses `name` and `math`.",
      concept: "selecting-columns",
    },
  ],
  keyPoints: [
    "`df[rows, columns]`: conditions or positions before the comma choose rows, names after the comma choose columns; an empty side means all.",
    "A condition like `df$math > 90` gives one TRUE/FALSE per row; `df[condition, ]` keeps the TRUE rows (logical indexing).",
    "Combine conditions with `&` (and), `|` (or), `!` (not) and `%in%` (is one of).",
    "Conditions that meet NA produce rows full of NA – use `which()`, `!is.na()` or `subset()`.",
    "`subset(df, condition, select = c(col1, col2))` filters and selects using bare column names.",
    "`order()` returns positions in sorted order; `df[order(df$col, decreasing = TRUE), ]` sorts whole rows.",
  ],
  concepts: ["selecting-columns", "logical-indexing", "subset-function", "sorting"],
  glossary: ["subsetting", "index", "comparison-operator", "logical-operator", "boolean", "dollar-operator", "row", "column"],
  datasets: ["students", "patients"],
  prerequisites: ["importing-and-exploring-csv"],
  playground: `# Filter, select and sort
students <- read.csv("data/students.csv")

top <- subset(students, math > 85, select = c(name, class, math))
top[order(top$math, decreasing = TRUE), ]`,
};
