import type { Exercise } from "../../types";

export const module01Exercises: Exercise[] = [
  {
    id: "m1-calculator",
    title: "R as a calculator",
    difficulty: "easy",
    module: 1,
    lesson: "what-is-programming",
    concepts: ["running-code"],
    prompt: `Use R as a calculator. Write each calculation **on its own line**, then press **Run & Test**:

1. Add **125** and **378**.
2. Multiply **12** by **15**.
3. Divide **900** by **4**.`,
    starterCode: `# Write each calculation on its own line below, then press Run.
# 1. Add 125 and 378

# 2. Multiply 12 by 15

# 3. Divide 900 by 4

`,
    expected: `The output shows three answers:

\`\`\`
[1] 503
[1] 180
[1] 225
\`\`\``,
    hints: [
      "Type the two numbers with the operator between them, just like on a calculator – for example `2 + 3`.",
      "In R, multiplication uses the star `*` and division uses the slash `/`.",
      "The three lines are `125 + 378`, `12 * 15` and `900 / 4`.",
    ],
    solution: `# 1. Add 125 and 378
125 + 378
# 2. Multiply 12 by 15
12 * 15
# 3. Divide 900 by 4
900 / 4`,
    explanation: `- \`125 + 378\` uses \`+\` to add, giving \`[1] 503\`.
- \`12 * 15\` uses \`*\` (the star) to multiply, giving \`[1] 180\`. R does not use \`x\` for multiplication.
- \`900 / 4\` uses \`/\` to divide, giving \`[1] 225\`.

Each line is a separate instruction, so R prints one answer per line, in order. The comments (lines starting with \`#\`) are ignored by R.`,
    tests: [
      { name: "The output shows 503 (125 + 378)", check: `grepl("[1] 503", .out, fixed = TRUE)`, failMessage: "I can't see 503 in the output. Did you write `125 + 378` on its own line (not after a `#`)?" },
      { name: "The output shows 180 (12 × 15)", check: `grepl("[1] 180", .out, fixed = TRUE)`, failMessage: "I can't see 180. Remember that R multiplies with `*`, e.g. `12 * 15`." },
      { name: "The output shows 225 (900 ÷ 4)", check: `grepl("[1] 225", .out, fixed = TRUE)`, failMessage: "I can't see 225. R divides with the slash `/`, e.g. `900 / 4`." },
    ],
  },
  {
    id: "m1-script-order",
    title: "Your first script",
    difficulty: "easy",
    module: 1,
    lesson: "console-and-scripts",
    concepts: ["scripts", "reading-output"],
    prompt: `Write a three-line script that shows, **in this order**:

1. the text \`"Start of my script"\`
2. the result of **45 + 55**
3. the text \`"End of my script"\`

Use \`print()\` with quotes for the text lines.`,
    starterCode: `# Line 1: print the text "Start of my script"

# Line 2: calculate 45 + 55

# Line 3: print the text "End of my script"

`,
    expected: `\`\`\`
[1] "Start of my script"
[1] 100
[1] "End of my script"
\`\`\``,
    hints: [
      "A script runs from top to bottom, so write the three lines in the order you want the output.",
      "Text goes inside quotes inside `print()`, like `print(\"Hello\")`. The sum is just `45 + 55`.",
      "The three lines are `print(\"Start of my script\")`, `45 + 55` and `print(\"End of my script\")`.",
    ],
    solution: `print("Start of my script")
45 + 55
print("End of my script")`,
    explanation: `- \`print("Start of my script")\` shows the first line of text.
- \`45 + 55\` is a calculation; R shows its answer, \`[1] 100\`.
- \`print("End of my script")\` shows the last line of text.

Because R runs a script from top to bottom, the output appears in exactly the same order as the code.`,
    tests: [
      { name: "Shows \"Start of my script\"", check: `grepl("Start of my script", .out, fixed = TRUE)`, failMessage: "I can't find the text Start of my script. Check the spelling and put it inside quotes in `print()`." },
      { name: "Shows 100 (45 + 55)", check: `grepl("[1] 100", .out, fixed = TRUE)`, failMessage: "I can't see the answer 100. Add a line with `45 + 55`." },
      { name: "Shows \"End of my script\"", check: `grepl("End of my script", .out, fixed = TRUE)`, failMessage: "I can't find the text End of my script. Check the spelling and the quotes." },
      {
        name: "The three results appear in the right order",
        check: `{ s <- regexpr("Start of my script", .out, fixed = TRUE); m <- regexpr("[1] 100", .out, fixed = TRUE); e <- regexpr("End of my script", .out, fixed = TRUE); s > 0 && m > s && e > m }`,
        failMessage: "All three parts must appear in order: start text, then 100, then end text. Check the order of your lines.",
      },
    ],
  },
  {
    id: "m1-time-facts",
    title: "Time facts script",
    difficulty: "challenge",
    module: 1,
    lesson: "console-and-scripts",
    concepts: ["scripts", "running-code"],
    prompt: `Write a small script that works out some facts about time. Work out the calculations yourself – do not type the answers directly!

1. Print a title, such as \`"Time facts"\`.
2. Calculate the number of **hours in a week** (7 days, 24 hours each).
3. Calculate the number of **minutes in a day** (24 hours, 60 minutes each).
4. Calculate the number of **minutes in a year** (365 days).

Tip: you can multiply more than two numbers in one line, like \`2 * 3 * 4\`.`,
    starterCode: `# 1. Print a title

# 2. Hours in a week

# 3. Minutes in a day

# 4. Minutes in a year (365 days)

`,
    expected: `A title followed by three answers:

\`\`\`
[1] "Time facts"
[1] 168
[1] 1440
[1] 525600
\`\`\``,
    hints: [
      "Each fact is a multiplication. Think about which numbers you need: days, hours, minutes.",
      "Hours in a week is `7 * 24`. Minutes in a day is `24 * 60`.",
      "Minutes in a year multiplies days × hours × minutes: `365 * 24 * 60`. The title is `print(\"Time facts\")`.",
    ],
    solution: `# 1. Print a title
print("Time facts")
# 2. Hours in a week
7 * 24
# 3. Minutes in a day
24 * 60
# 4. Minutes in a year (365 days)
365 * 24 * 60`,
    explanation: `- \`print("Time facts")\` shows a title so the output is easy to read.
- \`7 * 24\` gives \`[1] 168\`: 7 days with 24 hours each.
- \`24 * 60\` gives \`[1] 1440\`: 24 hours with 60 minutes each.
- \`365 * 24 * 60\` gives \`[1] 525600\`: R multiplies from left to right, first 365 × 24 = 8760 hours, then × 60 minutes.

Letting R do the multiplication (instead of typing the answers) means you can easily change the script later – for a leap year you would only change 365 to 366.`,
    tests: [
      { name: "A title (some text) is printed", check: `grepl("[1] \\"", .out, fixed = TRUE)`, failMessage: "Start with a title in quotes inside `print()`, for example `print(\"Time facts\")`." },
      { name: "Hours in a week: 168", check: `grepl("[1] 168", .out, fixed = TRUE)`, failMessage: "I can't see 168. A week has 7 days of 24 hours: `7 * 24`." },
      { name: "Minutes in a day: 1440", check: `grepl("[1] 1440", .out, fixed = TRUE)`, failMessage: "I can't see 1440. A day has 24 hours of 60 minutes: `24 * 60`." },
      { name: "Minutes in a year: 525600", check: `grepl("[1] 525600", .out, fixed = TRUE)`, failMessage: "I can't see 525600. Multiply days, hours and minutes: `365 * 24 * 60`." },
      { name: "R does the multiplication", check: `grepl("*", .code, fixed = TRUE)`, failMessage: "Let R calculate the answers with `*` instead of typing the results directly." },
    ],
  },
  {
    id: "m1-hello-world",
    title: "Hello, world!",
    difficulty: "easy",
    module: 1,
    lesson: "first-r-program",
    concepts: ["print", "strings-and-numbers"],
    prompt: `Write the classic first program. Use \`print()\` to show:

1. the text **Hello, world!**
2. on the next line, the text **I am learning R**`,
    starterCode: `# Print "Hello, world!" on the next line

# Then print "I am learning R"

`,
    expected: `\`\`\`
[1] "Hello, world!"
[1] "I am learning R"
\`\`\``,
    hints: [
      "Use the `print()` function, and put the text inside double quotes.",
      "The first line is `print(\"Hello, world!\")`.",
      "Add a second line: `print(\"I am learning R\")`.",
    ],
    solution: `# Print "Hello, world!"
print("Hello, world!")
# Then print "I am learning R"
print("I am learning R")`,
    explanation: `- \`print("Hello, world!")\` calls the \`print()\` function with the string \`"Hello, world!"\` as its argument. The quotes tell R it is text.
- \`print("I am learning R")\` does the same with a second string.

R shows each string with quotes and the \`[1]\` label, one per line, in the order of the code.`,
    tests: [
      { name: "Prints Hello, world!", check: `grepl("hello, world", tolower(.out), fixed = TRUE)`, failMessage: "I can't find Hello, world! in the output. Write `print(\"Hello, world!\")` – check the quotes and the comma." },
      { name: "Prints I am learning R", check: `grepl("i am learning r", tolower(.out), fixed = TRUE)`, failMessage: "I can't find I am learning R. Add a second line: `print(\"I am learning R\")`." },
      { name: "Uses print()", check: `grepl("print(", .code, fixed = TRUE)`, failMessage: "Use the `print()` function to show the text." },
    ],
  },
  {
    id: "m1-comment-out",
    title: "Fix it with comments",
    difficulty: "medium",
    module: 1,
    lesson: "first-r-program",
    concepts: ["comments"],
    prompt: `Someone wrote this program about the cost of a cinema trip, but they wrote their notes as plain English sentences – so R stops with an error.

Turn the **two English sentences** into comments so that the program runs. Keep the notes (as comments) – do not delete them!`,
    starterCode: `This program shows the cost of a cinema trip
print("Cinema trip")
12 + 4.5
Ticket plus popcorn
`,
    expected: `The program runs without an error and shows:

\`\`\`
[1] "Cinema trip"
[1] 16.5
\`\`\``,
    hints: [
      "Run the code and read the error: R does not understand the English sentence on line 1.",
      "A comment starts with the `#` symbol. R ignores everything after `#` on that line.",
      "Put `# ` at the start of line 1 and line 4: `# This program shows the cost of a cinema trip` and `# Ticket plus popcorn`.",
    ],
    solution: `# This program shows the cost of a cinema trip
print("Cinema trip")
12 + 4.5
# Ticket plus popcorn`,
    explanation: `- Line 1 becomes \`# This program shows the cost of a cinema trip\`. With \`#\` in front, R skips it.
- \`print("Cinema trip")\` and \`12 + 4.5\` are real code, so they stay as they are and run normally: \`[1] "Cinema trip"\` and \`[1] 16.5\`.
- The last line becomes \`# Ticket plus popcorn\` – a note explaining the calculation.

Comments let you keep explanations right next to your code without confusing R.`,
    tests: [
      { name: "The program runs without an error", check: `is.null(.error)`, failMessage: "R still stops with an error. Make sure both English sentences start with `#`." },
      { name: "Shows the title Cinema trip", check: `grepl("Cinema trip", .out, fixed = TRUE)`, failMessage: "Keep the line `print(\"Cinema trip\")` as real code (no `#` in front of it)." },
      { name: "Shows the total 16.5", check: `grepl("[1] 16.5", .out, fixed = TRUE)`, failMessage: "Keep the calculation `12 + 4.5` as real code so its answer is shown." },
      {
        name: "The two notes are kept as comments",
        check: `sum(startsWith(trimws(strsplit(.code, "\\n", fixed = TRUE)[[1]]), "#")) >= 2`,
        failMessage: "Keep both notes, but put a `#` at the start of each one instead of deleting them.",
      },
    ],
  },
  {
    id: "m1-about-me",
    title: "Your \"about me\" program",
    difficulty: "medium",
    module: 1,
    lesson: "first-r-program",
    concepts: ["first-program", "print", "comments"],
    prompt: `Write your own "about me" program. It should:

1. start with a **comment** that says what the program does,
2. print your **name** as text,
3. print **one fact** about you as text (a hobby, your city, your favourite food…),
4. print a **number that R calculates** – for example your age (\`2026 - 1995\`) or the number of days in 3 weeks (\`3 * 7\`).

Feel free to use a made-up person if you prefer!`,
    starterCode: `# Write a comment here that says what this program does

# Print your name

# Print a fact about you

# Print a number that R calculates

`,
    expected: `At least two lines of text and one number, for example:

\`\`\`
[1] "My name is Sam"
[1] "I love hiking"
[1] 28
\`\`\``,
    hints: [
      "Each part is one line. Text goes inside quotes inside `print()`; calculations do not need quotes.",
      "Your name line could be `print(\"My name is Sam\")`. A fact could be `print(\"I love hiking\")`.",
      "For the number, use a calculation without quotes, such as `print(2026 - 1998)`. Make sure your first line starts with `#`.",
    ],
    solution: `# About me: a short program that introduces me
print("My name is Sam")
print("I love hiking")
print(2026 - 1998)`,
    explanation: `- \`# About me: ...\` is a comment describing the program. R ignores it.
- \`print("My name is Sam")\` and \`print("I love hiking")\` print two strings – note the quotes.
- \`print(2026 - 1998)\` has **no** quotes, so R calculates the subtraction and prints \`[1] 28\`.

This is a complete, well-commented R program: code that runs from top to bottom and produces a result.`,
    tests: [
      { name: "The program runs without an error", check: `is.null(.error)`, failMessage: "R stopped with an error. Check that every text has opening and closing quotes and every `(` has a `)`." },
      { name: "The code has a comment", check: `grepl("#", .code, fixed = TRUE)`, failMessage: "Add a comment (a line starting with `#`) explaining what the program does." },
      { name: "At least two lines of text are printed", check: `sum(gregexpr("[1] \\"", .out, fixed = TRUE)[[1]] > 0) >= 2`, failMessage: "Print at least two pieces of text (your name and a fact), each inside quotes in `print()`." },
      { name: "A number is printed", check: `grepl("\\\\[1\\\\] -?[0-9]", .out)`, failMessage: "Print a number that R calculates, for example `print(2026 - 1998)` – without quotes around it." },
    ],
  },
];
