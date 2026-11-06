import type { Lesson } from "../../types";

export const datesStringsLesson: Lesson = {
  id: "dates-strings-and-regex",
  module: 8,
  title: "Dates, Strings and Regular Expressions",
  summary:
    "Turn text into real dates and calculate with them, then clean, split, search and replace text using string functions and regular expressions.",
  minutes: 55,
  objectives: [
    "Convert text to dates with `as.Date()`, using format codes for non-standard layouts.",
    "Calculate with dates: differences, `difftime()`, sequences of dates, `months()` and `weekdays()`.",
    "Group daily data by month using `cut()` on a date column of a real dataset.",
    "Build and tidy text with `paste()`, `paste0()`, `sprintf()`, `nchar()`, `substr()`, `toupper()`, `tolower()` and `trimws()`.",
    "Split, search and replace text with `strsplit()`, `grepl()`, `sub()`, `gsub()` and `regmatches()`.",
    "Write basic regular expressions using `^`, `$`, `.`, `*`, `+`, `[0-9]` and `\\\\d`.",
  ],
  intro: `Real datasets are full of **dates** ("2023-07-17") and **text** (names, cities, product codes). When R reads a CSV file, both arrive as plain character strings. A string that *looks* like a date is not yet a date to R: you cannot subtract two of them, and they may sort in the wrong order.

In the first half of this lesson you will convert text into proper **Date** values and then calculate with them – how many days between two dates, which weekday, the average temperature per month in a year of weather data.

In the second half you will learn to **clean and search text**: remove stray spaces, fix capital letters, split full names, and find or replace patterns with **regular expressions** – a tiny language for describing text patterns such as "a digit" or "starts with A".`,
  sections: [
    {
      id: "dates-basics",
      title: "Dates are not just text",
      blocks: [
        {
          kind: "definition",
          term: "Date",
          md: "An R data type for calendar days. Internally a `Date` is the number of days since 1 January 1970, which is why R can add, subtract and compare dates – but it always *prints* in the readable form `\"2023-03-15\"`.",
        },
        {
          kind: "code",
          example: {
            id: "as-date-basic",
            title: "From text to a Date",
            code: `text_date <- "2023-03-15"
class(text_date)

d <- as.Date(text_date)
class(d)
d + 30
as.numeric(d)`,
            explanation: [
              { code: `text_date <- "2023-03-15"`, text: "A character string that happens to look like a date." },
              { code: `d <- as.Date(text_date)`, text: "`as.Date()` converts the text into a real `Date`. Text in the standard *year-month-day* layout (ISO format) needs no extra information." },
              { code: `d + 30`, text: "Adding a number to a date adds that many **days**." },
              { code: `as.numeric(d)`, text: "Shows what R stores behind the scenes: the number of days since 1970-01-01." },
            ],
            output: String.raw`[1] "character"
[1] "Date"
[1] "2023-04-14"
[1] 19431`,
            outputNote: "30 days after 15 March is 14 April. The number 19431 is the day count R stores – you rarely need it, but it explains why date arithmetic works.",
          },
        },
        {
          kind: "code",
          example: {
            id: "today",
            title: "Today's date",
            code: `today <- Sys.Date()
today
format(today, "%A")`,
            explanation: [
              { code: `today <- Sys.Date()`, text: "`Sys.Date()` returns the current date of your computer as a `Date`." },
              { code: `format(today, "%A")`, text: "Formats the date as the full weekday name (format codes are explained next)." },
            ],
            output: String.raw`[1] "2026-11-06"
[1] "Friday"`,
            verify: false,
            outputNote: "This output was produced on the day this lesson was written. When you run it, you will see **today's** date and weekday instead.",
          },
        },
      ],
    },
    {
      id: "date-formats",
      title: "Format codes: reading and writing dates",
      blocks: [
        {
          kind: "text",
          md: "Dates are written in many layouts: `15/03/2023`, `03-15-23`, `March 15, 2023`. To read them, you tell `as.Date()` the layout with a `format` string built from **format codes**. The same codes work the other way round in `format()`, to print a date the way you like.",
        },
        {
          kind: "table",
          caption: "The most useful date format codes (for 15 March 2023)",
          headers: ["Code", "Meaning", "Example"],
          rows: [
            ["`%Y`", "4-digit year", "2023"],
            ["`%y`", "2-digit year", "23"],
            ["`%m`", "month as a number (01–12)", "03"],
            ["`%d`", "day of the month (01–31)", "15"],
            ["`%B`", "full month name", "March"],
            ["`%b`", "abbreviated month name", "Mar"],
            ["`%A`", "full weekday name", "Wednesday"],
            ["`%a`", "abbreviated weekday name", "Wed"],
            ["`%j`", "day of the year (001–366)", "074"],
          ],
        },
        {
          kind: "code",
          example: {
            id: "parse-formats",
            title: "Reading dates in other layouts",
            code: `as.Date("15/03/2023", format = "%d/%m/%Y")
as.Date("03-15-23", format = "%m-%d-%y")
as.Date("March 15, 2023", format = "%B %d, %Y")`,
            explanation: [
              { code: `as.Date("15/03/2023", format = "%d/%m/%Y")`, text: "The format string mirrors the text exactly: day, slash, month, slash, 4-digit year." },
              { code: `as.Date("03-15-23", format = "%m-%d-%y")`, text: "American order (month first) with dashes and a 2-digit year." },
              { code: `as.Date("March 15, 2023", format = "%B %d, %Y")`, text: "Month names, spaces and the comma are all part of the pattern." },
            ],
            output: String.raw`[1] "2023-03-15"
[1] "2023-03-15"
[1] "2023-03-15"`,
            outputNote: "Three different layouts, one and the same date. Once converted, R always prints dates in the ISO layout year-month-day.",
          },
        },
        {
          kind: "code",
          example: {
            id: "format-output",
            title: "Printing dates the way you want",
            code: `d <- as.Date("2023-03-15")

format(d, "%d %B %Y")
format(d, "%d/%m/%y")
format(d, "%A")
format(d, "%j")`,
            explanation: [
              { code: `format(d, "%d %B %Y")`, text: "Day, full month name, year – nice for reports." },
              { code: `format(d, "%d/%m/%y")`, text: "A short European-style layout." },
              { code: `format(d, "%A")`, text: "Just the weekday." },
              { code: `format(d, "%j")`, text: "The day of the year: 15 March is the 74th day of 2023." },
            ],
            output: String.raw`[1] "15 March 2023"
[1] "15/03/23"
[1] "Wednesday"
[1] "074"`,
            outputNote: "`format()` always returns **text**. Use it for display or for grouping labels, but keep the original `Date` column for calculations.",
            tryIt: "Print the date as `\"Wed, 15 Mar\"` using `%a`, `%d` and `%b`.",
          },
        },
      ],
    },
    {
      id: "date-arithmetic",
      title: "Calculating with dates",
      blocks: [
        {
          kind: "code",
          example: {
            id: "date-difference",
            title: "Differences between dates",
            code: `start <- as.Date("2023-01-15")
end <- as.Date("2023-03-01")

end - start
as.numeric(end - start)
difftime(end, start, units = "weeks")
end > start`,
            explanation: [
              { code: `end - start`, text: "Subtracting two dates gives a *time difference* object, printed with its unit." },
              { code: `as.numeric(end - start)`, text: "Converts the difference into a plain number of days, ready for further calculations." },
              { code: `difftime(end, start, units = "weeks")`, text: "`difftime()` lets you choose the unit: `\"days\"`, `\"weeks\"`, `\"hours\"`, …" },
              { code: `end > start`, text: "Dates can be compared: a later date is \"greater\"." },
            ],
            output: String.raw`Time difference of 45 days
[1] 45
Time difference of 6.428571 weeks
[1] TRUE`,
          },
        },
        {
          kind: "code",
          example: {
            id: "seq-dates",
            title: "Sequences of dates",
            code: `seq(as.Date("2023-01-01"), by = "month", length.out = 4)
seq(as.Date("2023-01-01"), as.Date("2023-01-29"), by = "week")`,
            explanation: [
              { code: `seq(as.Date("2023-01-01"), by = "month", length.out = 4)`, text: "Four dates, one month apart – useful for building a calendar of month starts." },
              { code: `seq(as.Date("2023-01-01"), as.Date("2023-01-29"), by = "week")`, text: "Every 7 days from the first date up to the last one." },
            ],
            output: String.raw`[1] "2023-01-01" "2023-02-01" "2023-03-01" "2023-04-01"
[1] "2023-01-01" "2023-01-08" "2023-01-15" "2023-01-22" "2023-01-29"`,
          },
        },
        {
          kind: "code",
          example: {
            id: "months-weekdays",
            title: "Pulling out parts of a date",
            code: `d <- as.Date(c("2023-01-01", "2023-07-14", "2023-12-25"))

months(d)
weekdays(d)
format(d, "%Y")
as.numeric(format(d, "%m"))`,
            explanation: [
              { code: `months(d)`, text: "The month name of each date." },
              { code: `weekdays(d)`, text: "The weekday name of each date." },
              { code: `format(d, "%Y")`, text: "The year, as text." },
              { code: `as.numeric(format(d, "%m"))`, text: "The month as a number: format it as `\"01\"`–`\"12\"`, then convert the text to numbers." },
            ],
            output: String.raw`[1] "January"  "July"     "December"
[1] "Sunday" "Friday" "Monday"
[1] "2023" "2023" "2023"
[1]  1  7 12`,
          },
        },
        {
          kind: "question",
          question: {
            id: "m8-dates-q1",
            type: "predict-output",
            prompt: "2023 is not a leap year. What does this print?",
            code: `as.Date("2023-03-01") - as.Date("2023-02-01")`,
            options: ["Time difference of 28 days", "Time difference of 29 days", "[1] 28", "Time difference of 1 months"],
            answer: 0,
            optionFeedback: [
              "Correct – February 2023 had 28 days.",
              "2023 is not a leap year, so February had 28 days.",
              "Subtracting dates gives a time difference, which prints with \"Time difference of\" and a unit. Wrap it in `as.numeric()` to get a plain number.",
              "Date subtraction counts days, not months.",
            ],
            explanation: "Subtracting two `Date`s counts the days between them and prints a time difference. From 1 February to 1 March 2023 is 28 days.",
            concept: "date-arithmetic",
          },
        },
      ],
    },
    {
      id: "weather-dates",
      title: "Dates in a real dataset",
      blocks: [
        {
          kind: "text",
          md: "The file `data/weather.csv` has one row per day of 2023 with the maximum and minimum temperature (°C) and the rainfall (mm). Its `date` column arrives as text, so the first job is always the conversion.",
        },
        {
          kind: "code",
          example: {
            id: "weather-convert",
            title: "Converting a date column",
            code: `weather <- read.csv("data/weather.csv")
class(weather$date)

weather$date <- as.Date(weather$date)
class(weather$date)
range(weather$date)
weather$date[1] + 364`,
            explanation: [
              { code: `class(weather$date)`, text: "Straight from the CSV file the column is `\"character\"`." },
              { code: `weather$date <- as.Date(weather$date)`, text: "Converts the whole column at once and stores it back in the data frame." },
              { code: `range(weather$date)`, text: "Now date functions work: the first and last day in the data." },
              { code: `weather$date[1] + 364`, text: "Date arithmetic on a value from the column." },
            ],
            output: String.raw`[1] "character"
[1] "Date"
[1] "2023-01-01" "2023-12-31"
[1] "2023-12-31"`,
          },
        },
        {
          kind: "code",
          example: {
            id: "weather-filter",
            title: "Filtering a date range",
            code: `weather <- read.csv("data/weather.csv")
weather$date <- as.Date(weather$date)

july <- weather[weather$date >= as.Date("2023-07-01") & weather$date <= as.Date("2023-07-31"), ]
nrow(july)
round(mean(july$temp_max), 1)
weather[which.max(weather$temp_max), ]`,
            explanation: [
              { code: `july <- weather[weather$date >= as.Date("2023-07-01") & weather$date <= as.Date("2023-07-31"), ]`, text: "Compares every date with the start and end of July and keeps the rows where both conditions are `TRUE`." },
              { code: `nrow(july)`, text: "July has 31 days, so 31 rows." },
              { code: `weather[which.max(weather$temp_max), ]`, text: "`which.max()` finds the row number of the hottest day; the row is printed in full." },
            ],
            output: String.raw`[1] 31
[1] 27.6
          date temp_max temp_min rain_mm
198 2023-07-17     37.9     28.7       0`,
            outputNote: "The average July maximum was about 27.6 °C, and the hottest day of the year was 17 July with 37.9 °C.",
          },
        },
        {
          kind: "text",
          md: "To summarise **by month**, you need a grouping variable. `months()` gives month names, but names sort alphabetically (April, August, December…). `cut(dates, breaks = \"month\")` instead creates a factor whose groups stay in calendar order.",
        },
        {
          kind: "code",
          example: {
            id: "weather-monthly",
            title: "Monthly summaries: months() versus cut()",
            code: `weather <- read.csv("data/weather.csv")
weather$date <- as.Date(weather$date)

round(tapply(weather$temp_max, months(weather$date), mean), 1)

weather$month <- cut(weather$date, breaks = "month")
monthly <- aggregate(temp_max ~ month, data = weather, FUN = mean)
head(monthly, 3)`,
            explanation: [
              { code: `round(tapply(weather$temp_max, months(weather$date), mean), 1)`, text: "Average maximum temperature per month name – correct numbers, but in **alphabetical** order." },
              { code: `weather$month <- cut(weather$date, breaks = "month")`, text: "`cut()` on a `Date` with `breaks = \"month\"` labels each day with the first day of its month (`2023-01-01`, `2023-02-01`, …). These groups sort in time order." },
              { code: `monthly <- aggregate(temp_max ~ month, data = weather, FUN = mean)`, text: "One row per month with the average maximum temperature, as a data frame. `head(monthly, 3)` shows the first three months." },
            ],
            output: String.raw`    April    August  December  February   January      July      June     March
     17.9      25.8       8.2       7.8       5.9      27.6      27.4      10.8
      May  November   October September
     23.9      12.3      18.0      22.3
       month  temp_max
1 2023-01-01  5.912903
2 2023-02-01  7.753571
3 2023-03-01 10.790323`,
            outputNote: "The first table starts with April and August – alphabetical order. The `cut()` version keeps January, February, March in order, which is what you want for tables and charts over time. Try `FUN = sum` with `rain_mm ~ month` to get the total rainfall of each month.",
          },
        },
        {
          kind: "code",
          example: {
            id: "weather-plot",
            title: "Dates on a chart axis",
            code: `weather <- read.csv("data/weather.csv")
weather$date <- as.Date(weather$date)

plot(weather$date, weather$temp_max, type = "l", col = "firebrick",
     xlab = "Date", ylab = "Max temperature (°C)",
     main = "Daily maximum temperature, 2023")`,
            explanation: [
              { code: `plot(weather$date, weather$temp_max, type = "l", col = "firebrick",`, text: "Because `date` is a real `Date`, R spaces the x-axis by time and labels it with months. `type = \"l\"` draws a line." },
            ],
            plot: true,
            tryIt: "Plot `weather$rain_mm` instead, with `type = \"h\"` (vertical bars for each day).",
          },
        },
        {
          kind: "callout",
          tone: "info",
          title: "Optional: the lubridate package",
          md: "The tidyverse package **lubridate** has short, memorable date functions. `ymd()`, `dmy()` and `mdy()` read dates by naming the order of the parts, so you need no format codes.",
        },
        {
          kind: "code",
          example: {
            id: "lubridate-intro",
            title: "The same ideas with lubridate",
            code: `library(lubridate)

d <- dmy("17/07/2023")
d
year(d)
wday(d, label = TRUE)
d + months(1)`,
            packages: ["lubridate"],
            explanation: [
              { code: `d <- dmy("17/07/2023")`, text: "`dmy()` = day-month-year. lubridate figures out the separators itself." },
              { code: `year(d)`, text: "Extracts the year as a number." },
              { code: `wday(d, label = TRUE)`, text: "The weekday as an ordered factor (the `Levels:` line shows the order)." },
              { code: `d + months(1)`, text: "Adds one calendar month, not just 30 days." },
            ],
            output: String.raw`[1] "2023-07-17"
[1] 2023
[1] Mon
Levels: Sun < Mon < Tue < Wed < Thu < Fri < Sat
[1] "2023-08-17"`,
          },
        },
      ],
    },
    {
      id: "string-basics",
      title: "Building and tidying text",
      blocks: [
        {
          kind: "text",
          md: "A **string** is a piece of text, written between quotes. R has many functions to build strings and to tidy them up.",
        },
        {
          kind: "code",
          example: {
            id: "paste-sprintf",
            title: "Building strings with paste() and sprintf()",
            code: `first <- "Ada"
score <- 92.456

paste("Student:", first)
paste0("ID-", 1:3)
paste(c("a", "b", "c"), collapse = " + ")
sprintf("%s scored %.1f points", first, score)
sprintf("Item %03d", 7)`,
            explanation: [
              { code: `paste("Student:", first)`, text: "`paste()` joins its arguments with a space between them." },
              { code: `paste0("ID-", 1:3)`, text: "`paste0()` joins with *no* space. It is vectorised: one string per number." },
              { code: `paste(c("a", "b", "c"), collapse = " + ")`, text: "`collapse` squeezes a whole vector into a single string, with the given text between the pieces." },
              { code: `sprintf("%s scored %.1f points", first, score)`, text: "`sprintf()` fills a template: `%s` is replaced by a string and `%.1f` by a number with 1 decimal place." },
              { code: `sprintf("Item %03d", 7)`, text: "`%03d` prints a whole number with at least 3 digits, padded with zeros." },
            ],
            output: String.raw`[1] "Student: Ada"
[1] "ID-1" "ID-2" "ID-3"
[1] "a + b + c"
[1] "Ada scored 92.5 points"
[1] "Item 007"`,
          },
        },
        {
          kind: "table",
          caption: "Common sprintf() placeholders",
          headers: ["Placeholder", "Replaced by", "Example", "Result"],
          rows: [
            ["`%s`", "a string (or anything, as text)", "`sprintf(\"Hi %s\", \"Sam\")`", "`Hi Sam`"],
            ["`%d`", "a whole number", "`sprintf(\"%d items\", 3L)`", "`3 items`"],
            ["`%.2f`", "a number with 2 decimals", "`sprintf(\"%.2f\", pi)`", "`3.14`"],
            ["`%03d`", "a whole number padded to 3 digits", "`sprintf(\"%03d\", 7L)`", "`007`"],
            ["`%%`", "a literal percent sign", "`sprintf(\"%d%%\", 50L)`", "`50%`"],
          ],
        },
        {
          kind: "code",
          example: {
            id: "string-functions",
            title: "Measuring and tidying strings",
            code: `city <- "  new York  "

nchar(city)
trimws(city)
nchar(trimws(city))
toupper(city)
tolower("HELLO")
substr("Statistics", 1, 4)`,
            explanation: [
              { code: `nchar(city)`, text: "Counts the characters – including the invisible spaces at both ends." },
              { code: `trimws(city)`, text: "*Trim white space*: removes spaces at the start and the end (not in the middle)." },
              { code: `toupper(city)`, text: "Converts every letter to upper case; `tolower()` does the opposite. Very useful for making messy categories consistent." },
              { code: `substr("Statistics", 1, 4)`, text: "Takes the characters from position 1 to position 4." },
            ],
            output: String.raw`[1] 12
[1] "new York"
[1] 8
[1] "  NEW YORK  "
[1] "hello"
[1] "Stat"`,
            outputNote: "The raw city name has 12 characters, but only 8 once the spaces are trimmed. Hidden spaces like these are a classic reason why `\"Boston\"` and `\" Boston \"` are counted as different cities.",
          },
        },
      ],
    },
    {
      id: "split-and-search",
      title: "Splitting, searching and replacing",
      blocks: [
        {
          kind: "code",
          example: {
            id: "strsplit-names",
            title: "Splitting strings with strsplit()",
            code: `full_names <- c("Ada Lovelace", "Grace Hopper", "Alan Turing")

parts <- strsplit(full_names, " ")
parts
sapply(parts, function(p) p[2])`,
            explanation: [
              { code: `parts <- strsplit(full_names, " ")`, text: "Splits each name at the space. Because each string could split into a different number of pieces, the result is a **list** with one element per name." },
              { code: `sapply(parts, function(p) p[2])`, text: "The apply family from the previous lesson: for each element of the list, take the second piece – the surname." },
            ],
            output: String.raw`[[1]]
[1] "Ada"      "Lovelace"

[[2]]
[1] "Grace"  "Hopper"

[[3]]
[1] "Alan"   "Turing"

[1] "Lovelace" "Hopper"   "Turing"`,
          },
        },
        {
          kind: "code",
          example: {
            id: "grepl-sub-gsub",
            title: "Searching with grepl(), replacing with sub() and gsub()",
            code: `products <- c("apple juice", "orange juice", "Apple pie", "banana bread")

grepl("apple", products)
grepl("apple", products, ignore.case = TRUE)
products[grepl("juice", products)]
sub("a", "A", "banana")
gsub("a", "A", "banana")`,
            explanation: [
              { code: `grepl("apple", products)`, text: "`grepl()` asks, for each string, \"does it contain this pattern?\" and answers `TRUE`/`FALSE`. Matching is **case-sensitive**: `\"Apple pie\"` does not match `\"apple\"`." },
              { code: `grepl("apple", products, ignore.case = TRUE)`, text: "`ignore.case = TRUE` makes the search ignore capital letters." },
              { code: `products[grepl("juice", products)]`, text: "The `TRUE`/`FALSE` answers can be used directly to filter a vector (or the rows of a data frame)." },
              { code: `sub("a", "A", "banana")`, text: "`sub()` replaces only the **first** match." },
              { code: `gsub("a", "A", "banana")`, text: "`gsub()` (global substitution) replaces **every** match." },
            ],
            output: String.raw`[1]  TRUE FALSE FALSE FALSE
[1]  TRUE FALSE  TRUE FALSE
[1] "apple juice"  "orange juice"
[1] "bAnana"
[1] "bAnAnA"`,
            tryIt: "Use `gsub(\" \", \"_\", products)` to replace spaces with underscores.",
          },
        },
      ],
    },
    {
      id: "regex",
      title: "Regular expressions",
      blocks: [
        {
          kind: "definition",
          term: "Regular expression (regex)",
          md: "A pattern that describes text. Instead of searching for the exact text `\"7\"`, a regular expression can search for \"any digit\", \"a word at the start\" or \"one or more letters\". `grepl()`, `sub()`, `gsub()` and `regmatches()` all understand regular expressions.",
        },
        {
          kind: "table",
          caption: "Basic regular-expression symbols",
          headers: ["Pattern", "Matches", "Example pattern", "Matches in"],
          rows: [
            ["`^`", "the start of the string", "`^A`", "\"**A**100\" but not \"XA7\""],
            ["`$`", "the end of the string", "`5$`", "\"B20**5**\""],
            ["`.`", "any single character", "`b.t`", "\"**bat**\", \"**bit**\""],
            ["`*`", "the previous item, zero or more times", "`ab*`", "\"**a**\", \"**abbb**\""],
            ["`+`", "the previous item, one or more times", "`[0-9]+`", "\"Order **66**\""],
            ["`[0-9]`", "one character from the set (here: a digit)", "`[A-C]`", "\"**B**12\""],
            ["`\\\\d`", "a digit (same as `[0-9]`)", "`\\\\d+`", "\"room **12**\""],
            ["`\\\\.`", "a real dot (a plain `.` means *any* character)", "`\\\\.csv$`", "\"data**.csv**\""],
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Why two backslashes?",
          md: "In regular expressions `\\d` means \"a digit\". But inside an R string the backslash is itself special (as in `\"\\n\"` for a new line), so you must write it twice: `\"\\\\d\"`. R reads `\"\\\\d\"` as the two characters `\\d` and passes them to the regex engine.",
        },
        {
          kind: "code",
          example: {
            id: "regex-anchors",
            title: "Start, end and repetition",
            code: `codes <- c("A100", "B205", "A3", "XA77")

grepl("^A", codes)
grepl("5$", codes)
grepl("^A[0-9]+$", codes)`,
            explanation: [
              { code: `grepl("^A", codes)`, text: "Starts with A. `\"XA77\"` contains an A, but not at the start." },
              { code: `grepl("5$", codes)`, text: "Ends with 5." },
              { code: `grepl("^A[0-9]+$", codes)`, text: "From start to end: an A followed by one or more digits and nothing else – a precise description of a valid code." },
            ],
            output: String.raw`[1]  TRUE FALSE  TRUE FALSE
[1] FALSE  TRUE FALSE FALSE
[1]  TRUE FALSE  TRUE FALSE`,
          },
        },
        {
          kind: "code",
          example: {
            id: "regex-digits",
            title: "Finding and extracting numbers",
            code: String.raw`phone <- c("Call 555-1234", "No number here", "Office: 555-9876")

grepl("[0-9]", phone)
gsub("[0-9]", "#", phone)
regmatches(phone, regexpr("\\d+-\\d+", phone))`,
            explanation: [
              { code: `grepl("[0-9]", phone)`, text: "Does the string contain at least one digit?" },
              { code: `gsub("[0-9]", "#", phone)`, text: "Replaces every digit with `#` – a simple way to hide numbers." },
              { code: String.raw`regmatches(phone, regexpr("\\d+-\\d+", phone))`, text: "`regexpr()` finds the first match of \"digits, dash, digits\" in each string and `regmatches()` pulls out the matched text. Strings with no match are left out." },
            ],
            output: String.raw`[1]  TRUE FALSE  TRUE
[1] "Call ###-####"    "No number here"   "Office: ###-####"
[1] "555-1234" "555-9876"`,
          },
        },
        {
          kind: "code",
          example: {
            id: "regex-clean-money",
            title: "Cleaning messy numbers",
            code: `amounts <- c("$1,200.50", "$85", " 430.10 ")

clean <- gsub("[$, ]", "", amounts)
clean
as.numeric(clean)`,
            explanation: [
              { code: `clean <- gsub("[$, ]", "", amounts)`, text: "The set `[$, ]` matches a dollar sign, a comma or a space. Each of them is replaced by nothing, i.e. removed." },
              { code: `as.numeric(clean)`, text: "Only digits and the decimal point remain, so the text converts cleanly to numbers." },
            ],
            output: String.raw`[1] "1200.50" "85"      "430.10"
[1] 1200.5   85.0  430.1`,
            outputNote: "This is exactly the kind of cleaning you will need for the `total_spent` column in the [Cleaning messy customer data project](/projects/clean-messy-customers).",
          },
        },
        {
          kind: "code",
          example: {
            id: "regex-dot-star",
            title: "The dot, the star and escaping",
            code: String.raw`files <- c("report_2023.csv", "notes.txt", "data_2024.csv", "csv_list.pdf")

grepl("\\.csv$", files)
sub("_.*", "", files)`,
            explanation: [
              { code: String.raw`grepl("\\.csv$", files)`, text: "`\\\\.` is a real dot, and `$` the end: \"ends with .csv\". `\"csv_list.pdf\"` contains `csv` but does not end with `.csv`." },
              { code: `sub("_.*", "", files)`, text: "`.*` means \"any characters, as many as possible\". So `_.*` matches from the first underscore to the end, and removing it leaves the part before the underscore." },
            ],
            output: String.raw`[1]  TRUE FALSE  TRUE FALSE
[1] "report"    "notes.txt" "data"      "csv"`,
          },
        },
        {
          kind: "code",
          example: {
            id: "regmatches-all",
            title: "Extracting every match",
            code: `text <- "Orders: 12 apples, 7 pears and 30 plums"

found <- regmatches(text, gregexpr("[0-9]+", text))
found
sum(as.numeric(found[[1]]))`,
            explanation: [
              { code: `found <- regmatches(text, gregexpr("[0-9]+", text))`, text: "`gregexpr()` (the *g* means global) finds **all** runs of digits; `regmatches()` extracts them. The result is a list with one element per input string." },
              { code: `sum(as.numeric(found[[1]]))`, text: "`[[1]]` takes the matches for the first (only) string; converting and summing gives the total number of fruits." },
            ],
            output: String.raw`[[1]]
[1] "12" "7"  "30"

[1] 49`,
          },
        },
        {
          kind: "question",
          question: {
            id: "m8-dates-q2",
            type: "multiple-choice",
            prompt: "Which pattern matches strings that **start** with a digit?",
            options: ["`\"^[0-9]\"`", "`\"[0-9]$\"`", "`\"[0-9]\"`", "`\"^digit\"`"],
            answer: 0,
            optionFeedback: [
              "Correct – `^` anchors the pattern to the start and `[0-9]` is one digit.",
              "`$` anchors to the end, so this matches strings that *end* with a digit.",
              "Without `^`, this matches a digit anywhere in the string.",
              "This looks for the literal letters d-i-g-i-t at the start.",
            ],
            explanation: "`^` means \"start of the string\" and `[0-9]` means \"one digit\", so `\"^[0-9]\"` matches `\"7 dwarfs\"` but not `\"room 7\"`.",
            concept: "regular-expressions",
          },
        },
        {
          kind: "text",
          md: "**Optional – stringr.** The tidyverse package **stringr** offers the same tools with consistent names that all start with `str_` and always take the text first.",
        },
        {
          kind: "code",
          example: {
            id: "stringr-equivalents",
            title: "stringr equivalents",
            code: String.raw`library(stringr)

products <- c("apple juice", "orange juice", "apple pie")

str_detect(products, "apple")
str_replace_all(products, " ", "_")
str_extract("Order 66 shipped", "\\d+")
str_to_title(products)`,
            packages: ["stringr"],
            explanation: [
              { code: `str_detect(products, "apple")`, text: "Same as `grepl(\"apple\", products)`." },
              { code: `str_replace_all(products, " ", "_")`, text: "Same as `gsub(\" \", \"_\", products)`; `str_replace()` is the `sub()` version." },
              { code: String.raw`str_extract("Order 66 shipped", "\\d+")`, text: "Extracts the first match – simpler than `regmatches()` + `regexpr()`." },
              { code: `str_to_title(products)`, text: "Capitalises the first letter of each word." },
            ],
            output: String.raw`[1]  TRUE FALSE  TRUE
[1] "apple_juice"  "orange_juice" "apple_pie"
[1] "66"
[1] "Apple Juice"  "Orange Juice" "Apple Pie"`,
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Reading a non-standard date without a format",
      wrong: `as.Date("15/03/2023")`,
      why: "Without `format`, R tries the layouts year-month-day and year/month/day. It reads \"15\" as the year 15 and returns a nonsense date in the year 0015 – with no error or warning!",
      right: `as.Date("15/03/2023", format = "%d/%m/%Y")`,
    },
    {
      title: "Doing arithmetic with dates that are still text",
      wrong: `"2023-03-01" - "2023-01-15"`,
      error: "non-numeric argument to binary operator",
      why: "Both values are character strings, and R cannot subtract text. Convert them with `as.Date()` first.",
      right: `as.Date("2023-03-01") - as.Date("2023-01-15")`,
    },
    {
      title: "Writing a single backslash in a pattern",
      wrong: String.raw`grepl("\d", "room 12")`,
      error: "is an unrecognized escape",
      why: "Inside an R string a backslash starts an *escape sequence* such as `\\n`. `\\d` is not one R knows, so the code does not even run. Double the backslash so the regex engine receives `\\d`.",
      right: String.raw`grepl("\\d", "room 12")`,
    },
    {
      title: "Forgetting that . means \"any character\"",
      wrong: `grepl(".csv", c("data.csv", "mycsvfile"))`,
      why: "In a regular expression `.` matches any character, so `\".csv\"` also matches `\"ycsv\"` inside `\"mycsvfile\"`. Both results are `TRUE`. Escape the dot and anchor the end to mean \"ends with .csv\".",
      right: String.raw`grepl("\\.csv$", c("data.csv", "mycsvfile"))`,
    },
    {
      title: "Using sub() when you meant gsub()",
      wrong: `sub(" ", "_", "monthly sales report")`,
      why: "`sub()` replaces only the first space, giving `\"monthly_sales report\"`. Use `gsub()` to replace every match.",
      right: `gsub(" ", "_", "monthly sales report")`,
    },
  ],
  exerciseIds: ["m8-weather-dates", "m8-clean-codes"],
  quiz: [
    {
      id: "m8-dates-q3",
      type: "fill-blank",
      prompt: "Complete the format string so that R reads this European date (day/month/4-digit year) correctly.",
      code: `as.Date("25/12/2023", format = "___")`,
      accept: ["%d/%m/%Y"],
      hint: "Use `%d` for the day, `%m` for the month and `%Y` for a 4-digit year, with the same separators as the text.",
      explanation: "The format string must mirror the text: `%d/%m/%Y` = day, slash, month, slash, 4-digit year. R then returns `\"2023-12-25\"`.",
      concept: "date-formats",
    },
    {
      id: "m8-dates-q4",
      type: "predict-output",
      prompt: "What does this print?",
      code: `gsub("[0-9]", "", "R2D2")`,
      options: ["[1] \"RD\"", "[1] \"RD2\"", "[1] \"22\"", "[1] \"R2D2\""],
      answer: 0,
      optionFeedback: [
        "Correct – every digit is removed.",
        "That is what `sub()` would do (only the first digit). `gsub()` replaces all matches.",
        "That would *keep* the digits. Here they are replaced with an empty string.",
        "`[0-9]` matches the digits 2, so the string does change.",
      ],
      explanation: "`[0-9]` matches any digit and `gsub()` replaces **every** match with `\"\"` (nothing), leaving `\"RD\"`.",
      concept: "regular-expressions",
    },
    {
      id: "m8-dates-q5",
      type: "true-false",
      prompt: "`trimws(\"  Boston  \")` returns `\"Boston\"`.",
      answer: true,
      explanation: "`trimws()` removes white space from both ends of a string, so the leading and trailing spaces disappear. Spaces in the middle of a string are kept.",
      concept: "string-functions",
    },
    {
      id: "m8-dates-q6",
      type: "find-error",
      prompt: "This code stops with an error. Click the line where R stops.",
      code: `codes <- c("A-1", "B-22", "C-305")
numbers <- sub("[A-Z]-", "", codes)
total <- sum(numbers)`,
      errorLine: 3,
      errorKind: "error",
      fix: `codes <- c("A-1", "B-22", "C-305")
numbers <- sub("[A-Z]-", "", codes)
total <- sum(as.numeric(numbers))`,
      explanation: "`sub()` always returns **text**: `\"1\"`, `\"22\"`, `\"305\"`. `sum()` cannot add text, so line 3 fails with \"invalid 'type' (character) of argument\". Convert with `as.numeric()` before summing.",
      concept: "string-functions",
    },
    {
      id: "m8-dates-q7",
      type: "multiple-choice",
      prompt: "You want monthly averages from daily data and need the months in **calendar order** in the result. Which grouping is best?",
      options: [
        "`cut(dates, breaks = \"month\")`",
        "`months(dates)`",
        "`format(dates, \"%B\")`",
        "`weekdays(dates)`",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – the groups are labelled by each month's first day and sort chronologically.",
        "Month names sort alphabetically (April, August, …).",
        "Same problem: full month names sort alphabetically.",
        "That groups by day of the week, not by month.",
      ],
      explanation: "`cut()` on a Date with `breaks = \"month\"` creates a factor whose levels are the first day of each month (`2023-01-01`, `2023-02-01`, …), which keeps calendar order in tables and plots.",
      concept: "date-arithmetic",
    },
  ],
  keyPoints: [
    "Dates read from a CSV file are text; convert them with `as.Date()` before calculating.",
    "Format codes such as `%d`, `%m`, `%Y`, `%B` and `%A` describe how a date is written – use them in `as.Date(format = )` and `format()`.",
    "Subtracting dates gives a time difference in days; `difftime()` chooses the unit and `seq(by = \"month\")` builds date sequences.",
    "`cut(dates, breaks = \"month\")` groups daily data by month while keeping calendar order.",
    "`paste()`, `paste0()` and `sprintf()` build text; `nchar()`, `substr()`, `toupper()`, `tolower()` and `trimws()` measure and tidy it.",
    "`strsplit()` splits text into a list, `grepl()` searches, `sub()` replaces the first match and `gsub()` every match.",
    "Regular expressions describe patterns: `^` start, `$` end, `.` any character, `*`/`+` repetition, `[0-9]` or `\\\\d` a digit; write backslashes twice in R strings.",
  ],
  concepts: ["dates", "date-formats", "date-arithmetic", "string-functions", "string-splitting", "regular-expressions"],
  glossary: ["date", "string", "character", "type-conversion", "regular-expression", "case-sensitive", "factor"],
  playground: `weather <- read.csv("data/weather.csv")
weather$date <- as.Date(weather$date)

# Rainiest day of the year, nicely formatted
wettest <- weather[which.max(weather$rain_mm), ]
sprintf("Wettest day: %s with %.1f mm", format(wettest$date, "%d %B %Y"), wettest$rain_mm)

# Tidy some messy text
cities <- c(" boston", "BOSTON ", "Boston")
table(tolower(trimws(cities)))
`,
  prerequisites: ["apply-family-and-data-transformations"],
  datasets: ["weather"],
};
