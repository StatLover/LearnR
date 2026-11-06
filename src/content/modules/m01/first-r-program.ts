import type { Lesson } from "../../types";

export const firstRProgramLesson: Lesson = {
  id: "first-r-program",
  module: 1,
  title: "Your First R Program: print() and Comments",
  summary:
    "Write your first real R program: show text and numbers with print(), learn why text needs quotes, and explain your code with comments.",
  minutes: 20,
  objectives: [
    "Use print() to show text and numbers in the output.",
    "Explain why text must be written inside quotes and numbers must not.",
    "Write comments with # to explain what your code does, and use them to switch lines off.",
    "Write and run a short program of several lines of your own.",
  ],
  intro: `Every programmer's first program is a tradition: make the computer say **"Hello, world!"**. In R that takes just one line, using a command called \`print()\`.

In this lesson you will learn how to show text and numbers with \`print()\`, why text always goes inside quotes, and how to leave notes for yourself (and others) inside your code using **comments**. At the end you will write a small "about me" program – your very own R program.`,
  sections: [
    {
      id: "hello-world",
      title: "Hello, world!",
      blocks: [
        {
          kind: "code",
          example: {
            id: "hello-world",
            title: "The classic first program",
            code: `print("Hello, world!")`,
            explanation: [
              { code: "print", text: "`print` is the name of a *function* – a ready-made command that does one job. Its job is to show something in the output." },
              { code: "( )", text: "The parentheses hold the thing you want the function to work on. Every function call has them, even when they are empty." },
              {
                code: `"Hello, world!"`,
                text: "The text to show. The double quotes `\" \"` tell R \"this is text, not code\". Everything between the quotes is shown exactly as written, including the comma and the exclamation mark.",
              },
            ],
            output: `[1] "Hello, world!"`,
            outputNote:
              "R shows the text **with** quotes so you can see that it is text. The `[1]` means this is the first (and only) value in the result.",
            tryIt: "Change the message to greet yourself, for example `print(\"Hello, Maria!\")`.",
          },
        },
        {
          kind: "definition",
          term: "Function",
          md: `A named command that does a specific job. You *call* (use) a function by writing its name followed by parentheses: \`print( )\`. R has thousands of built-in functions – \`print()\`, \`mean()\` and \`barplot()\` are three you have already met.`,
        },
        {
          kind: "definition",
          term: "Argument",
          md: `The input you give to a function, written inside its parentheses. In \`print("Hello, world!")\` the argument is \`"Hello, world!"\` – the thing you want printed.`,
        },
      ],
    },
    {
      id: "text-and-numbers",
      title: "Printing text and numbers",
      blocks: [
        {
          kind: "text",
          md: `\`print()\` can show text **and** numbers. The only rule: text goes inside quotes, numbers do not.`,
        },
        {
          kind: "definition",
          term: "String",
          md: `A piece of text in R, written inside quotes, such as \`"Hello"\` or \`"R is fun"\`. Programmers call text values *strings* (as in "a string of characters").`,
        },
        {
          kind: "code",
          example: {
            id: "text-and-numbers",
            title: "Text and numbers",
            code: `print("R is fun")
print(42)
print(3.14)`,
            explanation: [
              { code: `print("R is fun")`, text: "Prints a string (text). The quotes are needed." },
              { code: "print(42)", text: "Prints a whole number. Numbers are written without quotes." },
              { code: "print(3.14)", text: "Prints a decimal number. R uses a dot `.` (not a comma) for decimals." },
            ],
            output: `[1] "R is fun"
[1] 42
[1] 3.14`,
            outputNote: "The text appears in quotes; the numbers do not. That is how you can tell text from numbers in R's output.",
            tryIt: "Print the year you were born, then print the name of your favourite food.",
          },
        },
        {
          kind: "text",
          md: `Quotes change the meaning of your code completely. Compare these two lines:`,
        },
        {
          kind: "code",
          example: {
            id: "quotes-matter",
            title: "Quotes make all the difference",
            code: `print("7 + 3")
print(7 + 3)`,
            explanation: [
              { code: `print("7 + 3")`, text: "With quotes, `\"7 + 3\"` is just text – four characters to display. R does no maths." },
              { code: "print(7 + 3)", text: "Without quotes, `7 + 3` is a calculation. R works it out first, then prints the answer." },
            ],
            output: `[1] "7 + 3"
[1] 10`,
            outputNote: "The first line shows the text exactly as typed; the second shows the answer of the calculation.",
            tryIt: "Try `print(\"100 / 4\")` and `print(100 / 4)`. Predict both outputs before you press Run.",
          },
        },
        {
          kind: "callout",
          tone: "note",
          title: "Single or double quotes?",
          md: `R accepts both \`"double"\` and \`'single'\` quotes for text – \`print('Hi')\` works just like \`print("Hi")\`. R always *displays* text with double quotes. In this course we use double quotes, which is the most common style.`,
        },
        {
          kind: "question",
          question: {
            id: "m1-first-q7",
            type: "predict-output",
            prompt: "What does this line print?",
            code: `print("2 * 5")`,
            options: [`[1] "2 * 5"`, "[1] 10", `[1] "10"`, "[1] 2 * 5"],
            answer: 0,
            optionFeedback: [
              "Correct – inside quotes, `2 * 5` is just text, so R shows it unchanged.",
              "R would print 10 for `print(2 * 5)`, but here the calculation is inside quotes.",
              "R does not calculate anything inside quotes – it keeps the text exactly as typed.",
              "Text is always displayed with its quotes.",
            ],
            explanation: "Anything inside quotes is text. R does not calculate it – it prints the characters exactly as written, with quotes around them.",
            concept: "strings-and-numbers",
          },
        },
      ],
    },
    {
      id: "print-or-not",
      title: "Do I always need print()?",
      blocks: [
        {
          kind: "text",
          md: `You may have noticed that \`7 + 8\` showed its answer without \`print()\`. When you run a line that produces a value, R shows the value automatically. So why does \`print()\` exist?

- It makes your intention clear: "show this".
- Later in the course you will write code *inside* loops and functions. There, a value sitting on its own line is **not** shown automatically, and \`print()\` is the way to display it.
- When RStudio runs a whole script file with its **Source** button, only results you \`print()\` are shown.

For now, both styles work on this website.`,
        },
        {
          kind: "code",
          example: {
            id: "auto-print",
            title: "Automatic printing vs print()",
            code: `"Hello without print"
print("Hello with print")
5 + 5`,
            explanation: [
              { code: `"Hello without print"`, text: "A value on its own line. R shows it automatically." },
              { code: `print("Hello with print")`, text: "The same idea, but asking R to show it explicitly." },
              { code: "5 + 5", text: "A calculation on its own. R shows its answer automatically." },
            ],
            output: `[1] "Hello without print"
[1] "Hello with print"
[1] 10`,
            outputNote: "The three results look identical in style. On this website, any value on its own line is shown, with or without `print()`.",
            tryIt: "Wrap the last line in `print()` – does the output change?",
          },
        },
      ],
    },
    {
      id: "comments",
      title: "Comments: notes for humans",
      blocks: [
        {
          kind: "definition",
          term: "Comment",
          md: `A note inside your code that R ignores. In R a comment starts with the hash symbol \`#\`: everything from \`#\` to the end of that line is skipped when the code runs.`,
        },
        {
          kind: "text",
          md: `Comments are for people – including future you. They explain *what* a piece of code does and *why*. Good comments make code much easier to understand when you come back to it next week.`,
        },
        {
          kind: "code",
          example: {
            id: "comments-demo",
            title: "Three ways to use comments",
            code: `# This program greets the world
print("Hello, world!")  # show a friendly message
# print("This line is switched off")`,
            explanation: [
              { code: "# This program greets the world", text: "A **whole-line comment**: the line starts with `#`, so R skips all of it. Comments like this often describe what the code below does." },
              { code: `print("Hello, world!")  # show a friendly message`, text: "Code followed by an **end-of-line comment**. R runs the code and ignores everything after `#`." },
              {
                code: `# print("This line is switched off")`,
                text: "**Commented-out code**: real code with a `#` in front, so it does not run. Programmers use this to switch a line off temporarily without deleting it.",
              },
            ],
            output: `[1] "Hello, world!"`,
            outputNote: "Only one line of output: the comments produced nothing, and the switched-off `print()` never ran.",
            tryIt: "Delete the `#` at the start of the last line and run again – now you get two lines of output.",
          },
        },
        {
          kind: "callout",
          tone: "tip",
          title: "A handy shortcut",
          md: `In RStudio you can comment or un-comment the selected lines with **Ctrl + Shift + C** (Windows/Linux) or **Cmd + Shift + C** (Mac).`,
        },
        {
          kind: "text",
          md: `One detail: a \`#\` **inside quotes** is just a character in the text, not the start of a comment.`,
        },
        {
          kind: "code",
          example: {
            id: "hash-in-text",
            title: "A # inside text",
            code: `print("Item #1: notebook")  # the first # is part of the text`,
            explanation: [
              {
                code: `"Item #1: notebook"`,
                text: "This `#` is between quotes, so it is part of the string and is printed.",
              },
              { code: "# the first # is part of the text", text: "This `#` is outside the quotes, so it starts a real comment." },
            ],
            output: `[1] "Item #1: notebook"`,
            outputNote: "The `#1` inside the quotes appears in the output; the comment after the code does not.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m1-first-q8",
            type: "multiple-choice",
            prompt: "Which line is the most helpful comment for the code `print(60 * 60 * 24)`?",
            options: [
              "# number of seconds in one day",
              "# print",
              "# 60 times 60 times 24 is printed by the print function using numbers",
              "print # seconds",
            ],
            answer: 0,
            optionFeedback: [
              "Correct – it explains *what the result means*, which the code alone does not tell you.",
              "This only repeats the function name and adds no information.",
              "This repeats the code in words. A good comment explains the meaning or purpose instead.",
              "This line starts with code (`print`), not `#`, so R would try to run it.",
            ],
            explanation: "The best comments explain *why* or *what it means*. \"Number of seconds in one day\" tells the reader the purpose of the calculation.",
            concept: "comments",
          },
        },
      ],
    },
    {
      id: "about-me",
      title: "Putting it together: an \"about me\" program",
      blocks: [
        {
          kind: "text",
          md: `You now know everything you need to write a complete little program. Here is an "about me" program for a learner called Sam. It starts with a comment, prints two lines of text, and lets R calculate Sam's age.`,
        },
        {
          kind: "code",
          example: {
            id: "about-me",
            title: "An \"about me\" program",
            code: `# About me – a short program that introduces Sam
print("My name is Sam")
print("I live in Manchester and I love hiking")
print(2026 - 1998)  # my age: this year minus my birth year`,
            explanation: [
              { code: "# About me – a short program that introduces Sam", text: "A comment saying what the whole program is for. R skips it." },
              { code: `print("My name is Sam")`, text: "Prints a line of text." },
              { code: `print("I live in Manchester and I love hiking")`, text: "Prints a second line of text. Text can be as long as you like." },
              {
                code: "print(2026 - 1998)  # my age: this year minus my birth year",
                text: "R calculates 2026 − 1998 and prints the answer. The comment explains what the number means.",
              },
            ],
            output: `[1] "My name is Sam"
[1] "I live in Manchester and I love hiking"
[1] 28`,
            outputNote: "Three lines of output: two strings and one number. Your first complete R program!",
            tryIt: "Turn it into *your* program: change the name, the sentence and the birth year.",
          },
        },
        {
          kind: "steps",
          title: "How programmers build a program",
          items: [
            "Decide what the program should do (here: introduce yourself).",
            "Write **one** line and run it.",
            "If it works, add the next line and run again. If not, read the message and fix that one line.",
            "Add comments so that anyone can understand the code later.",
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "print() shows one thing at a time",
          md: `\`print("My age is", 28)\` does **not** print both parts – \`print()\` only shows its first argument, and here R even stops with an error. For now, print each thing on its own line, or write it all as one piece of text: \`print("My age is 28")\`. In Module 2 you will learn \`paste()\`, which glues text and numbers together.`,
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Forgetting the quotes around text",
      wrong: `print(Hello)`,
      error: "object 'Hello' not found",
      why: "Without quotes, R thinks `Hello` is the name of something stored in memory and looks for it. Nothing called `Hello` exists, so R stops.",
      right: `print("Hello")`,
    },
    {
      title: "Forgetting the closing quote",
      wrong: `print("Hello)`,
      error: "unexpected INCOMPLETE_STRING",
      why: "A string must start *and* end with a quote. Without the closing quote, R thinks the text never ends. \"INCOMPLETE_STRING\" is R's way of saying \"this text is not finished\".",
      right: `print("Hello")`,
    },
    {
      title: "Forgetting the closing parenthesis",
      wrong: `print("Hello"`,
      error: "unexpected end of input",
      why: "Every `(` needs a matching `)`. R reached the end of the code while still waiting for the closing parenthesis.",
      right: `print("Hello")`,
    },
    {
      title: "Capital letter in the function name",
      wrong: `Print("Hello")`,
      error: `could not find function "Print"`,
      why: "R is *case-sensitive*: capital and small letters are different. The function is called `print` with a small p; `Print` does not exist.",
      right: `print("Hello")`,
    },
    {
      title: "Writing a note without #",
      wrong: `This prints a greeting
print("Hi")`,
      error: "unexpected symbol",
      why: "R tries to run every line that is not a comment. An English sentence is not valid R code, so R stops. Put `#` in front of notes.",
      right: `# This prints a greeting
print("Hi")`,
    },
    {
      title: "Giving print() two things at once",
      wrong: `print("My age is", 28)`,
      error: "invalid printing digits",
      why: "`print()` shows only its first argument. R treated `28` as a setting for how many digits to show, which is not allowed. Print one thing at a time (or use `paste()`, coming in Module 2).",
      right: `print("My age is 28")`,
    },
  ],
  exerciseIds: ["m1-hello-world", "m1-comment-out", "m1-about-me"],
  quiz: [
    {
      id: "m1-first-q1",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `print("Hi there")`,
      options: [`[1] "Hi there"`, "Hi there", `[1] Hi there`, `print("Hi there")`],
      answer: 0,
      optionFeedback: [
        "Correct – text is shown with quotes, after the `[1]` label.",
        "R adds the `[1]` label and shows text inside quotes.",
        "Text is displayed with its quotes.",
        "R runs the code; it does not repeat it.",
      ],
      explanation: "`print()` shows the string with its quotes, labelled with `[1]`.",
      concept: "print",
    },
    {
      id: "m1-first-q2",
      type: "multiple-choice",
      prompt: "What does R do with a line that starts with `#`?",
      options: ["It ignores the line – it is a comment", "It prints the line", "It stops with an error", "It runs the line twice"],
      answer: 0,
      optionFeedback: [
        "Correct – comments are notes for humans and are skipped by R.",
        "Comments are never printed; R skips them completely.",
        "Comments are perfectly valid – they never cause errors.",
        "R skips comments; it does not run them at all.",
      ],
      explanation: "`#` starts a comment. Everything from `#` to the end of the line is ignored when the code runs.",
      concept: "comments",
    },
    {
      id: "m1-first-q3",
      type: "fill-blank",
      prompt: "Complete the code so that R displays the text Good morning.",
      code: `___("Good morning")`,
      accept: ["print"],
      hint: "It is the function used to show things in the output.",
      explanation: "`print(\"Good morning\")` calls the `print()` function with the string `\"Good morning\"` as its argument.",
      concept: "print",
    },
    {
      id: "m1-first-q4",
      type: "find-error",
      prompt: "This program stops with an error. Click the line that causes it.",
      code: `# My first program
print("Hello")
print("Welcome to R)`,
      errorLine: 3,
      errorKind: "error",
      fix: `# My first program
print("Hello")
print("Welcome to R")`,
      explanation: "Line 3 is missing the closing quote after `R`, so the text never ends. R reports an `INCOMPLETE_STRING`. Adding the `\"` before `)` fixes it.",
      concept: "strings-and-numbers",
    },
    {
      id: "m1-first-q5",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `# print("one")
print("two")`,
      options: [`[1] "two"`, `[1] "one"
[1] "two"`, `[1] "one"`, `# print("one")
[1] "two"`],
      answer: 0,
      optionFeedback: [
        "Correct – the first line is a comment, so only the second line runs.",
        "The first line starts with `#`, so it is switched off and does not print.",
        "The comment is skipped – but the second line does run.",
        "Comments are never shown in the output.",
      ],
      explanation: "Putting `#` in front of a line \"comments it out\": R skips it. Only `print(\"two\")` runs.",
      concept: "comments",
    },
    {
      id: "m1-first-q6",
      type: "true-false",
      prompt: "`print(5 + 5)` and `print(\"5 + 5\")` show the same output.",
      answer: false,
      explanation: "`print(5 + 5)` calculates and shows `[1] 10`. `print(\"5 + 5\")` treats `5 + 5` as text and shows `[1] \"5 + 5\"`. Quotes turn code into text.",
      concept: "strings-and-numbers",
    },
  ],
  keyPoints: [
    "print() is a function that shows a value in the output; the value you give it inside the parentheses is its argument.",
    "Text (a string) must be written inside quotes; numbers are written without quotes and use a dot for decimals.",
    "Anything inside quotes is treated as text, so print(\"7 + 3\") shows the text while print(7 + 3) shows 10.",
    "On this website a value on its own line is shown automatically, but print() makes your intention clear and is needed inside loops and functions later.",
    "A comment starts with # – R ignores everything after it on that line.",
    "Use comments to explain what your code means, and put # in front of a line to switch it off.",
    "Build programs one line at a time: write, run, check, then add the next line.",
  ],
  concepts: ["print", "strings-and-numbers", "comments", "first-program"],
  glossary: ["function", "argument", "string", "comment"],
  playground: `# My first R program
print("Hello, world!")
print("I am learning R")
print(2026 - 2000)  # change 2000 to your birth year
`,
  prerequisites: ["console-and-scripts"],
};
