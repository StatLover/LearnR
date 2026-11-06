import type { Lesson } from "../../types";

export const importingAndExploringLesson: Lesson = {
  id: "importing-and-exploring-csv",
  module: 5,
  title: "Importing and Exploring CSV Files",
  summary: "Read a CSV file into R with read.csv() and take a first look at it with head(), str(), summary(), table() and unique().",
  minutes: 30,
  objectives: [
    "Import a CSV file into a data frame with read.csv()",
    "Explain what a CSV file is and how a file path like \"data/students.csv\" points to it",
    "Check that an import worked with head(), tail(), str(), dim(), nrow(), ncol() and names()",
    "Get a quick overview of a dataset with summary(), table() and unique()",
  ],
  intro: `Until now you typed your data straight into R with \`c()\` and \`data.frame()\`. Real data almost never arrives that way. It comes as a **file** – exported from a spreadsheet, a survey tool, a shop's database or a lab machine. The most common format for such files is **CSV**.

In this lesson you will learn to **import** a file (copy its contents into R as a data frame) with one function, \`read.csv()\`. Then you will **explore** it: look at the first rows, check the column types, count the categories and summarise the numbers. This first look is like walking around a used car before you buy it – you check that everything is there and nothing looks strange before you start the real work.`,
  sections: [
    {
      id: "what-is-a-csv",
      title: "What is a CSV file?",
      blocks: [
        {
          kind: "definition",
          term: "CSV file",
          md: "A **CSV** (*comma-separated values*) file is a plain text file that stores a table. Each line of the file is one row of the table, and the values inside a line are separated by commas. The first line usually holds the column names (the **header**).",
        },
        {
          kind: "text",
          md: `Here are the first four lines of the file \`students.csv\`, exactly as they are stored on disk:

\`\`\`
student_id,name,gender,age,class,study_hours,attendance,math,reading,science
S001,Amara,Female,16,C,6,82,86,82,83
S002,Ben,Male,17,A,1,93,54,53,46
S003,Chloe,Female,19,B,12,93,99,99,100
\`\`\`

Read it like a table: the first line says which columns exist, and every following line is one student (one **observation**). Because a CSV file is just text, any program can open it – Excel, Google Sheets, a text editor and, of course, R. That is why CSV is the favourite format for sharing data.`,
        },
        {
          kind: "table",
          caption: "How the parts of a CSV file become a data frame",
          headers: ["In the CSV file", "In the R data frame"],
          rows: [
            ["The first line (header)", "The column names"],
            ["Every other line", "One row (an observation)"],
            ["The values between commas", "The cells; each column becomes a vector"],
            ["An empty value or the text NA", "A missing value, NA"],
          ],
        },
      ],
    },
    {
      id: "read-csv",
      title: "Reading a CSV file with read.csv()",
      blocks: [
        {
          kind: "text",
          md: "The function `read.csv()` reads a CSV file and gives you back a **data frame**. You tell it *where* the file is with a **file path** – the file's address, written as text in quotes.",
        },
        {
          kind: "code",
          example: {
            id: "read-students",
            title: "Import the students file",
            code: `students <- read.csv("data/students.csv")

class(students)
nrow(students)`,
            explanation: [
              { code: `students <- read.csv("data/students.csv")`, text: "`read.csv()` opens the file, reads every line and builds a data frame. `<-` stores that data frame in a new variable called `students`. Nothing is printed, because the result is saved instead of shown." },
              { code: `"data/students.csv"`, text: "The file path, in quotes. It means: *inside the folder `data`, the file `students.csv`*. The `/` separates a folder name from the file name." },
              { code: "class(students)", text: "Confirms what kind of object we got: a `data.frame`, the same table structure you built yourself with `data.frame()`." },
              { code: "nrow(students)", text: "Counts the rows – one per student." },
            ],
            output: `[1] "data.frame"
[1] 60`,
            outputNote: "The file had 61 lines: one header line plus 60 students. `read.csv()` used the header for the column names, so the data frame has **60 rows**.",
            tryIt: "Change the path to `\"data/patients.csv\"` (and the variable name to `patients`). How many rows does that file have?",
          },
        },
        {
          kind: "definition",
          term: "File path",
          md: "A **file path** is the address of a file: the folders you go through, separated by `/`, followed by the file name. A path like `\"data/students.csv\"` is *relative*: R starts looking from its current folder, the **working directory**.",
        },
        {
          kind: "callout",
          tone: "info",
          title: "Where is the data/ folder?",
          md: "On R Academy, every R session starts in a folder that contains a sub-folder called `data/` with the course's sample files, so `read.csv(\"data/students.csv\")` works in every lesson, exercise and the playground. On your own computer, the path is relative to your working directory – you can see it with `getwd()`. In RStudio, the easiest way is to keep your script and a `data` folder together in one project folder.",
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Use your own data",
          md: "Want to explore a file of your own? On the **Playground** page you can upload your own CSV file. It is saved in the same `data/` folder, so you read it exactly like the sample files – for example `read.csv(\"data/my_file.csv\")` (use your file's real name). Uploaded files live only in your browser session, so upload them again after reloading the page.",
        },
        {
          kind: "table",
          caption: "Sample CSV files you can use anywhere on R Academy",
          headers: ["Path", "What is inside"],
          rows: [
            ["`data/students.csv`", "60 students: class, study hours, attendance and math / reading / science scores"],
            ["`data/survey.csv`", "200 survey answers: age group, region, satisfaction (1–5), hours online"],
            ["`data/sales.csv`", "Monthly units and revenue for four regions, 2022–2024"],
            ["`data/patients.csv`", "150 patients: age, BMI, blood pressure, cholesterol, smoker, diabetes"],
            ["`data/customers_messy.csv`", "A deliberately messy customer list for practising cleaning"],
            ["`data/housing.csv`", "200 house sales with size, rooms and price"],
            ["`data/weather.csv`", "Daily temperatures and rainfall for 2023"],
          ],
        },
      ],
    },
    {
      id: "strings-as-factors",
      title: "Text columns and stringsAsFactors",
      blocks: [
        {
          kind: "text",
          md: "When `read.csv()` meets a column of text (like `name` or `region`), it keeps it as a **character** vector. Sometimes you want text columns that hold a few repeated categories to become **factors** instead (a factor stores categories and their levels, as you saw in Stage 1). The argument `stringsAsFactors = TRUE` does exactly that for every text column.",
        },
        {
          kind: "code",
          example: {
            id: "strings-as-factors",
            title: "Turn text columns into factors while importing",
            code: `survey <- read.csv("data/survey.csv", stringsAsFactors = TRUE)

class(survey$region)
levels(survey$region)`,
            explanation: [
              { code: `read.csv("data/survey.csv", stringsAsFactors = TRUE)`, text: "Reads the survey file. The extra argument `stringsAsFactors = TRUE` (\"strings as factors\") converts every text column into a factor." },
              { code: "class(survey$region)", text: "`survey$region` takes the `region` column. Its class is now `factor` instead of `character`." },
              { code: "levels(survey$region)", text: "Lists the categories R found, sorted alphabetically." },
            ],
            output: `[1] "factor"
[1] "East"  "North" "South" "West" `,
            outputNote: "The region column now has four **levels**. Without `stringsAsFactors = TRUE`, `class(survey$region)` would be `\"character\"`.",
            tryIt: "Remove `, stringsAsFactors = TRUE` and run the code again. What does `levels()` return for a character column?",
          },
        },
        {
          kind: "callout",
          tone: "note",
          title: "The default changed in R 4.0",
          md: "Since R 4.0 (2020) the default is `stringsAsFactors = FALSE`, so text stays text. Older tutorials sometimes write `stringsAsFactors = FALSE` explicitly – that was needed in old versions of R and does no harm today.",
        },
        {
          kind: "table",
          caption: "Other useful read.csv() arguments",
          headers: ["Argument", "What it does", "Example"],
          rows: [
            ["`header`", "Is the first line the column names? (default `TRUE`)", "`read.csv(path, header = FALSE)`"],
            ["`stringsAsFactors`", "Turn text columns into factors (default `FALSE`)", "`read.csv(path, stringsAsFactors = TRUE)`"],
            ["`na.strings`", "Which texts mean \"missing\" (default `\"NA\"`)", "`read.csv(path, na.strings = c(\"\", \"N/A\"))`"],
            ["`sep`", "The separator between values (default `\",\"`)", "`read.csv(path, sep = \";\")`"],
          ],
        },
      ],
    },
    {
      id: "checking-the-import",
      title: "Checking the import: head(), str() and dim()",
      blocks: [
        {
          kind: "text",
          md: "After every import, check that R read the file the way you expected. Three quick looks catch almost every problem: the **first rows**, the **structure** (column types) and the **size**.",
        },
        {
          kind: "code",
          example: {
            id: "head-tail",
            title: "Look at the first and last rows",
            code: `students <- read.csv("data/students.csv")

head(students, 3)
tail(students, 3)`,
            explanation: [
              { code: "head(students, 3)", text: "`head()` shows the first rows of a data frame. The second argument says how many – without it you get 6." },
              { code: "tail(students, 3)", text: "`tail()` shows the last rows. Looking at the end of the file is a good way to spot a broken last line or a \"Total\" row that does not belong in the data." },
            ],
            output: `  student_id  name gender age class study_hours attendance math reading science
1       S001 Amara Female  16     C           6         82   86      82      83
2       S002   Ben   Male  17     A           1         93   54      53      46
3       S003 Chloe Female  19     B          12         93   99      99     100
   student_id   name gender age class study_hours attendance math reading
58       S058   Gina Female  18     A          11         87   83      87
59       S059 Hassan   Male  17     B           2         89   59      51
60       S060   Ines Female  19     B          10         78   59      60
   science
58      87
59      55
60      57`,
            outputNote: "The numbers on the left (`1 2 3`, `58 59 60`) are **row names** – the row numbers. In the second table the rows did not fit in 80 characters, so R printed the last column, `science`, underneath. It is still one table.",
            tryIt: "Try `head(students)` without a number, then `head(students, 10)`.",
          },
        },
        {
          kind: "code",
          example: {
            id: "str-students",
            title: "Check the structure with str()",
            code: `students <- read.csv("data/students.csv")

str(students)`,
            explanation: [
              { code: "str(students)", text: "`str()` (short for *structure*) prints a compact overview: the size, then one line per column with its name, its type and its first values." },
            ],
            output: `'data.frame':	60 obs. of  10 variables:
 $ student_id : chr  "S001" "S002" "S003" "S004" ...
 $ name       : chr  "Amara" "Ben" "Chloe" "Daniel" ...
 $ gender     : chr  "Female" "Male" "Female" "Male" ...
 $ age        : int  16 17 19 19 17 16 19 18 18 16 ...
 $ class      : chr  "C" "A" "B" "B" ...
 $ study_hours: int  6 1 12 10 13 11 5 2 13 10 ...
 $ attendance : int  82 93 93 86 79 83 78 78 84 86 ...
 $ math       : int  86 54 99 68 90 78 77 81 70 74 ...
 $ reading    : int  82 53 99 62 86 85 70 76 78 90 ...
 $ science    : int  83 46 100 63 84 88 NA 63 84 77 ...`,
            outputNote: "`60 obs. of 10 variables` means 60 rows (observations) and 10 columns (variables). After each `$` comes a column name and its type: `chr` = character (text), `int` = integer (whole numbers), `num` = numeric (numbers with decimals). Notice the `NA` in `science`: a missing score. If a column of numbers showed up as `chr`, that would tell you something in the file is not a clean number.",
          },
        },
        {
          kind: "code",
          example: {
            id: "size-and-names",
            title: "Size and column names",
            code: `patients <- read.csv("data/patients.csv")

dim(patients)
nrow(patients)
ncol(patients)
names(patients)`,
            explanation: [
              { code: "dim(patients)", text: "`dim()` (dimensions) returns two numbers: rows, then columns." },
              { code: "nrow(patients)", text: "Just the number of rows." },
              { code: "ncol(patients)", text: "Just the number of columns." },
              { code: "names(patients)", text: "The column names as a character vector – handy for copying the exact spelling." },
            ],
            output: `[1] 150   9
[1] 150
[1] 9
[1] "patient_id"    "age"           "sex"           "bmi"
[5] "systolic_bp"   "cholesterol"   "smoker"        "exercise_days"
[9] "diabetes"     `,
            outputNote: "The patient file has 150 rows and 9 columns. The column names are printed over three lines; `[5]` and `[9]` tell you the position of the first name on each line.",
            tryIt: "Use `names()` on `read.csv(\"data/sales.csv\")`. Which four columns does the sales file have?",
          },
        },
        {
          kind: "callout",
          tone: "tip",
          title: "See the whole table",
          md: "On R Academy, `View(students)` opens the data frame in the **Data viewer** tab, where you can scroll through all rows. It is great for browsing, but `head()` and `str()` are faster for checking.",
        },
        {
          kind: "steps",
          title: "Your import checklist",
          items: [
            "Does `dim()` show the number of rows and columns you expected?",
            "Are the column names in `names()` spelled the way you thought (capital letters matter)?",
            "Does `str()` show numbers as `int` or `num`, and text as `chr`?",
            "Are there `NA` values? Note which columns have them – you will deal with them in a later lesson.",
          ],
        },
        {
          kind: "question",
          question: {
            id: "m5-import-q-inline1",
            type: "multiple-choice",
            prompt: "`str(df)` shows `$ price : chr \"12.50\" \"8.99\" \"$15.00\" ...`. What does this tell you?",
            options: [
              "The import worked perfectly – prices are numbers",
              "The price column was read as text, probably because some values contain non-number characters such as `$`",
              "The file has no header line",
              "The price column contains only missing values",
            ],
            answer: 1,
            optionFeedback: [
              "`chr` means character (text). A real number column would show `num`.",
              "Right! One value like `\"$15.00\"` is enough to make R read the whole column as text. You will learn to fix this in the cleaning lesson.",
              "The column has a name (`price`), so the header was read.",
              "The values are shown, so they are not missing.",
            ],
            explanation: "`chr` means the column is text. R reads a column as numbers only if *every* value looks like a number, so a single `$` turns the whole column into text.",
            concept: "checking-imports",
          },
        },
      ],
    },
    {
      id: "summaries",
      title: "Quick summaries: summary(), table() and unique()",
      blocks: [
        {
          kind: "text",
          md: "Once the data is in, a few summary functions give you a feel for it. `summary()` describes number columns, `table()` counts categories and `unique()` lists the different values in a column.",
        },
        {
          kind: "code",
          example: {
            id: "summary-numbers",
            title: "summary() of number columns",
            code: `students <- read.csv("data/students.csv")

summary(students$math)
summary(students[, c("age", "study_hours", "math", "science")])`,
            explanation: [
              { code: "summary(students$math)", text: "For one numeric column, `summary()` gives six numbers: the smallest value, the first quartile, the median, the mean, the third quartile and the largest value." },
              { code: `students[, c("age", "study_hours", "math", "science")]`, text: "Picks four columns by name (you will practise this in the next lesson). `summary()` of a data frame summarises every column side by side." },
            ],
            output: `   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.
  53.00   67.00   74.00   74.65   82.25   99.00
      age         study_hours         math          science
 Min.   :16.00   Min.   : 1.00   Min.   :53.00   Min.   : 46.0
 1st Qu.:16.00   1st Qu.: 6.00   1st Qu.:67.00   1st Qu.: 66.0
 Median :17.50   Median :10.00   Median :74.00   Median : 74.0
 Mean   :17.42   Mean   : 8.95   Mean   :74.65   Mean   : 74.3
 3rd Qu.:18.00   3rd Qu.:11.25   3rd Qu.:82.25   3rd Qu.: 83.0
 Max.   :19.00   Max.   :20.00   Max.   :99.00   Max.   :100.0
                                                 NAs    :3      `,
            outputNote: "Math scores go from 53 to 99, and the average (mean) is 74.65. *1st Qu.* means a quarter of the students scored 67 or less; *3rd Qu.* means a quarter scored more than 82.25. The `science` column has an extra line, `NAs :3` – three students have no science score. `summary()` is a quick way to find missing values and impossible numbers (an age of 230 would stand out immediately).",
            tryIt: "Run `summary(students)` on the whole data frame. Text columns get a short description (how many values there are) instead of numbers.",
          },
        },
        {
          kind: "definition",
          term: "Frequency table",
          md: "A **frequency table** counts how often each value appears. In R, `table()` builds one: the top line shows the values, the line below shows how many times each occurs.",
        },
        {
          kind: "code",
          example: {
            id: "table-counts",
            title: "Count categories with table()",
            code: `students <- read.csv("data/students.csv")

table(students$class)
table(students$gender, students$class)`,
            explanation: [
              { code: "table(students$class)", text: "Counts how many students are in each class." },
              { code: "table(students$gender, students$class)", text: "With two columns, `table()` makes a *two-way table*: one row per gender, one column per class, and in each cell the number of students with that combination." },
            ],
            output: `
 A  B  C
18 22 20

          A  B  C
  Female 11 11  9
  Male    7 11 11`,
            outputNote: "Class B is the biggest, with 22 students. In the two-way table you can read, for example, that class A has 11 female and 7 male students. The counts in each table add up to 60.",
            tryIt: "Count the age groups in the survey: `table(read.csv(\"data/survey.csv\")$age_group)`.",
          },
        },
        {
          kind: "code",
          example: {
            id: "unique-values",
            title: "List the different values with unique()",
            code: `survey <- read.csv("data/survey.csv")

unique(survey$age_group)
length(unique(survey$age_group))
table(survey$age_group)`,
            explanation: [
              { code: "unique(survey$age_group)", text: "`unique()` removes repeats and shows each different value once, in the order it first appears in the data." },
              { code: "length(unique(survey$age_group))", text: "Wrapping `unique()` in `length()` counts how many different values there are." },
              { code: "table(survey$age_group)", text: "`table()` shows the same values sorted, together with how often each occurs." },
            ],
            output: `[1] "18-24" "45-54" "25-34" "55+"   "35-44"
[1] 5

18-24 25-34 35-44 45-54   55+
   42    40    45    41    32 `,
            outputNote: "There are 5 age groups. `unique()` lists them in order of first appearance (`\"18-24\"` was the first answer in the file), while `table()` sorts them and adds counts. `unique()` is very useful for spotting spelling variants – you will see `\"Boston\"`, `\"boston\"` and `\"BOSTON\"` in the cleaning lesson.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m5-import-q-inline2",
            type: "predict-output",
            prompt: "What does this code print?",
            code: `table(c("a", "b", "a", "a"))`,
            options: [
              `
a b
3 1 `,
              `[1] "a" "b"`,
              `[1] 3 1`,
              `
a b a a
1 1 1 1 `,
            ],
            answer: 0,
            optionFeedback: [
              "Correct – `\"a\"` appears 3 times and `\"b\"` once.",
              "That is what `unique()` would print.",
              "`table()` also prints the values above the counts.",
              "`table()` groups identical values together.",
            ],
            explanation: "`table()` counts each distinct value: `a` appears three times and `b` once. The values are printed on the first line and the counts below them.",
            concept: "exploring-data",
          },
        },
      ],
    },
    {
      id: "first-look-routine",
      title: "A first-look routine for any dataset",
      blocks: [
        {
          kind: "text",
          md: "Data analysts call this first look **exploratory data analysis** (EDA): getting to know the data before asking it serious questions. Put the pieces together and you have a routine you can use on any new file.",
        },
        {
          kind: "code",
          example: {
            id: "first-look-patients",
            title: "First look at the patient records",
            code: `patients <- read.csv("data/patients.csv")

dim(patients)
table(patients$smoker)
summary(patients$bmi)`,
            explanation: [
              { code: `patients <- read.csv("data/patients.csv")`, text: "Import the file and store it." },
              { code: "dim(patients)", text: "How big is it?" },
              { code: "table(patients$smoker)", text: "How many smokers and non-smokers are there?" },
              { code: "summary(patients$bmi)", text: "What range do the BMI (body mass index) values cover, and are any missing?" },
            ],
            output: `[1] 150   9

 No Yes
119  31
   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.     NAs
  17.00   23.50   25.80   26.26   29.00   37.00       5 `,
            outputNote: "In three short lines you learn that there are 150 patients, 31 of them smoke, BMI values lie between 17 and 37 (all plausible), and 5 BMI values are missing.",
            tryIt: "Do the same first look for `data/sales.csv`: its size, `table()` of the `region` column and `summary()` of `revenue`.",
          },
        },
        {
          kind: "diagram",
          name: "data-pipeline",
          caption: "Importing and exploring are the first steps of every analysis: import → clean → explore → model → communicate.",
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Forgetting the quotes around the file path",
      wrong: `students <- read.csv(data/students.csv)`,
      error: "not found",
      why: "Without quotes, R thinks `data/students.csv` is a calculation (`data` divided by `students.csv`) and looks for objects with those names. A file path is text, so it must be in quotes.",
      right: `students <- read.csv("data/students.csv")`,
    },
    {
      title: "Leaving out the folder in the path",
      wrong: `students <- read.csv("students.csv")`,
      error: "cannot open file 'students.csv': No such file or directory",
      why: "R looks for `students.csv` in the working directory, but the file is inside the `data` folder. *cannot open the connection* is R's way of saying it could not find or open the file. Check the folder, the spelling and the file extension.",
      right: `students <- read.csv("data/students.csv")`,
    },
    {
      title: "Reading the file without saving it",
      wrong: `read.csv("data/students.csv")
nrow(students)`,
      error: "object 'students' not found",
      why: "`read.csv()` on its own only *prints* the data (all 60 rows!). To use the data later you must store it in a variable with `<-`.",
      right: `students <- read.csv("data/students.csv")
nrow(students)`,
    },
    {
      title: "Getting a column name's capitals wrong",
      wrong: `students <- read.csv("data/students.csv")
table(students$Class)`,
      why: "R is case-sensitive: the column is called `class`, not `Class`. `students$Class` silently returns `NULL` (nothing), so `table()` prints `< table of extent 0 >` – an empty table – instead of an error. Copy names from `names(students)` to be sure.",
      right: `students <- read.csv("data/students.csv")
table(students$class)`,
    },
  ],
  exerciseIds: ["m5-import-explore"],
  quiz: [
    {
      id: "m5-import-q1",
      type: "multiple-choice",
      prompt: "What is a CSV file?",
      options: [
        "A special R file that only R can open",
        "A plain text file where each line is a row and values are separated by commas",
        "A picture of a table",
        "An Excel workbook with several sheets",
      ],
      answer: 1,
      optionFeedback: [
        "CSV files are plain text – any program can open them.",
        "Correct! CSV means comma-separated values.",
        "A CSV file contains the actual values as text, not an image.",
        "Excel files (.xlsx) are a different format; a CSV holds just one table.",
      ],
      explanation: "CSV stands for *comma-separated values*: a text file with one row per line and commas between the values. The first line usually holds the column names.",
      concept: "csv-files",
    },
    {
      id: "m5-import-q2",
      type: "fill-blank",
      prompt: "Complete the code to import the sales file into a data frame called `sales`.",
      code: `sales <- ___("data/sales.csv")`,
      accept: ["read.csv"],
      hint: "The function's name is \"read\" and the file type, joined by a dot.",
      explanation: "`read.csv()` reads a CSV file and returns a data frame, which `<-` stores in `sales`.",
      concept: "read-csv",
    },
    {
      id: "m5-import-q3",
      type: "predict-output",
      prompt: "`students.csv` has 60 students and 10 columns. What does this print?",
      code: `students <- read.csv("data/students.csv")
ncol(students)`,
      options: ["[1] 60", "[1] 10", "[1] 60 10", "[1] 600"],
      answer: 1,
      optionFeedback: [
        "60 is the number of rows – `nrow()` would print that.",
        "Correct – `ncol()` counts the columns.",
        "That is what `dim()` prints.",
        "`ncol()` does not multiply rows by columns.",
      ],
      explanation: "`ncol()` returns the number of columns. Use `nrow()` for rows and `dim()` for both.",
      concept: "checking-imports",
    },
    {
      id: "m5-import-q4",
      type: "true-false",
      prompt: "In current versions of R, `read.csv()` turns text columns into factors unless you say otherwise.",
      answer: false,
      explanation: "Since R 4.0 the default is `stringsAsFactors = FALSE`: text columns stay character vectors. Add `stringsAsFactors = TRUE` if you want factors.",
      concept: "read-csv",
    },
    {
      id: "m5-import-q5",
      type: "find-error",
      prompt: "This code stops with an error. Click the line that causes it.",
      code: `survey <- read.csv("data/survey.csv")
head(Survey)
table(survey$region)`,
      errorLine: 2,
      errorKind: "error",
      fix: `survey <- read.csv("data/survey.csv")
head(survey)
table(survey$region)`,
      explanation: "The variable is called `survey` with a lower-case *s*. R is case-sensitive, so `Survey` is a different (non-existent) name: `object 'Survey' not found`.",
      concept: "read-csv",
    },
    {
      id: "m5-import-q6",
      type: "multiple-choice",
      prompt: "Which function counts how many times each category appears in a column?",
      options: ["`unique()`", "`table()`", "`str()`", "`head()`"],
      answer: 1,
      optionFeedback: [
        "`unique()` lists each value once but does not count them.",
        "Correct – `table()` builds a frequency table.",
        "`str()` shows the structure and types of the columns.",
        "`head()` shows the first rows.",
      ],
      explanation: "`table(df$column)` counts each distinct value. `unique()` only lists the distinct values; combine it with `length()` to count *how many* different values there are.",
      concept: "exploring-data",
    },
  ],
  keyPoints: [
    "A CSV file is a plain text table: one row per line, values separated by commas, column names on the first line.",
    "`read.csv(\"data/file.csv\")` imports a CSV file as a data frame; store it with `<-`.",
    "A file path is text in quotes; `data/students.csv` means the file `students.csv` inside the folder `data`.",
    "Text columns stay character by default; `stringsAsFactors = TRUE` turns them into factors.",
    "Check every import with `head()`, `str()` and `dim()` – look at the size, the column names and the column types.",
    "`summary()` describes number columns (and counts NAs), `table()` counts categories and `unique()` lists the distinct values.",
  ],
  concepts: ["csv-files", "read-csv", "checking-imports", "exploring-data"],
  glossary: ["csv", "file-path", "working-directory", "dataset", "data-frame", "observation", "frequency-table", "eda"],
  datasets: ["students", "survey", "patients"],
  playground: `# Import a CSV file and take a first look
students <- read.csv("data/students.csv")

head(students)
str(students)
table(students$class)
summary(students$math)`,
};
