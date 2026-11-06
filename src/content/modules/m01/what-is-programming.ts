import type { Lesson } from "../../types";

export const whatIsProgrammingLesson: Lesson = {
  id: "what-is-programming",
  module: 1,
  title: "What Is Programming? Meet R",
  summary:
    "Learn what programming means, what R is, why people use it, and run your very first line of R code – right here in your browser.",
  minutes: 15,
  objectives: [
    "Explain in your own words what a program is and what programming means.",
    "Describe what R is and why it is so popular for working with data.",
    "Give real examples of how R is used in health, business, science and social research.",
    "Run a line of R code on this website and read the result.",
  ],
  intro: `A **program** is a list of instructions that a computer follows, one step at a time. **Programming** simply means writing those instructions. If you have ever followed a recipe – "boil the water, add the pasta, wait 10 minutes" – you already understand the big idea: clear steps, in the right order, that lead to a result.

**R** is a programming language: a special, exact way of writing instructions so that a computer can understand them. R was designed for working with **data** – numbers, survey answers, measurements, sales figures – so it is brilliant at calculating, summarising and drawing charts.

You do not need any experience to start. On this website R runs **right in your browser**, so there is nothing to install. By the end of this lesson you will have run real R code yourself.`,
  sections: [
    {
      id: "what-programming-means",
      title: "What does programming mean?",
      blocks: [
        {
          kind: "text",
          md: `Computers are incredibly fast, but they are also very literal. They never guess what you *meant* – they do exactly what you *wrote*. So to get a computer to do something useful, you give it precise instructions. That set of instructions is a program.`,
        },
        {
          kind: "definition",
          term: "Program",
          md: `A list of instructions that tells a computer what to do, step by step. The computer carries out (or *runs*) the instructions from top to bottom.`,
        },
        {
          kind: "definition",
          term: "Programming language",
          md: `A language with exact rules for writing instructions a computer can follow. R, Python and JavaScript are all programming languages. The instructions you write in one are called **code**, and the language's grammar rules are called its **syntax**.`,
        },
        {
          kind: "text",
          md: `A cooking recipe is a great way to picture a program:`,
        },
        {
          kind: "table",
          caption: "A recipe and a program have a lot in common",
          headers: ["A recipe", "A program"],
          rows: [
            ["A list of ingredients", "The data (numbers, text) the program works with"],
            ["Numbered steps, done in order", "Lines of code, run from top to bottom"],
            ["A cook follows the steps", "The computer follows the code"],
            ["A finished dish", "The result (an answer, a table, a chart)"],
            ["\"Add a pinch of salt\" – a person can guess", "Instructions must be exact – a computer cannot guess"],
          ],
        },
        {
          kind: "text",
          md: `Here is your very first piece of R code. It is a single instruction: *add 2 and 3*. Press **Run** to see what R answers.`,
        },
        {
          kind: "code",
          example: {
            id: "first-taste",
            title: "Your first instruction",
            code: `2 + 3`,
            explanation: [
              {
                code: "2 + 3",
                text: "An instruction asking R to add the number `2` and the number `3`. The `+` sign means *add*, exactly like on a calculator.",
              },
            ],
            output: "[1] 5",
            outputNote:
              "R answers `5`. The `[1]` at the start is R's way of saying \"this is the first value of the answer\". You will see `[1]` in front of almost every result – it is just a label, not part of the answer.",
            tryIt: "Change the numbers – try `20 + 22` or `1000 + 1` – and press Run again.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m1-prog-q6",
            type: "true-false",
            prompt: "If an instruction is slightly wrong, the computer will usually guess what you meant and do that instead.",
            answer: false,
            explanation:
              "Computers do exactly what the code says – no more, no less. That is why programming languages have exact rules (syntax), and why a tiny typo can stop your code. The good news: R tells you when it does not understand something, so you can fix it.",
            concept: "programming",
          },
        },
      ],
    },
    {
      id: "what-is-r",
      title: "What is R?",
      blocks: [
        {
          kind: "definition",
          term: "R",
          md: `A free programming language made especially for working with data, statistics and charts. It was created in the 1990s by two statisticians, Ross Ihaka and Robert Gentleman, at the University of Auckland in New Zealand, and is now used by millions of people around the world.`,
        },
        {
          kind: "text",
          md: `Why do so many people choose R?

- **It is built for data.** Calculating an average, comparing groups or drawing a chart often takes just one line.
- **It is free and open source.** Anyone can download it and use it for any purpose, on Windows, macOS or Linux.
- **It has thousands of add-ons.** Extra toolkits called *packages* (more than 20,000 of them!) add new abilities, from beautiful charts to machine learning.
- **Your work can be repeated.** Because the steps are written down as code, you (or a colleague) can run the same analysis again next month with new data and get results in seconds.
- **It has a friendly community.** There are countless free tutorials, forums and books for R learners.`,
        },
        {
          kind: "text",
          md: `Let's start with the simplest thing R can do: be a very powerful calculator. Each line below is a separate instruction, and R answers each one in turn.`,
        },
        {
          kind: "code",
          example: {
            id: "r-calculator",
            title: "R as a calculator",
            code: `10 + 5
10 - 5
10 * 5
10 / 5`,
            explanation: [
              { code: "10 + 5", text: "Addition: `+` adds two numbers." },
              { code: "10 - 5", text: "Subtraction: `-` takes the second number away from the first." },
              { code: "10 * 5", text: "Multiplication: R uses the star `*` (not `x`) to multiply." },
              { code: "10 / 5", text: "Division: R uses the slash `/` to divide." },
            ],
            output: `[1] 15
[1] 5
[1] 50
[1] 2`,
            outputNote:
              "There are four lines of code, so there are four answers, in the same order as the code. Each answer starts with the label `[1]`.",
            tryIt: "Add a fifth line that multiplies your age by 365 to estimate how many days old you are.",
          },
        },
        {
          kind: "text",
          md: `R really shines when you give it *many* numbers at once. Here R calculates the average (the *mean*) of five test scores. Don't worry about the details yet – you will learn exactly how this works in the coming modules. For now, just notice how short the code is.`,
        },
        {
          kind: "code",
          example: {
            id: "taste-of-data",
            title: "A taste of data analysis",
            code: `mean(c(72, 85, 90, 64, 88))`,
            explanation: [
              {
                code: "c(72, 85, 90, 64, 88)",
                text: "`c()` *combines* the five scores into one group of numbers. The scores are separated by commas.",
              },
              {
                code: "mean( ... )",
                text: "`mean()` is a ready-made R command (a *function*) that calculates the average of the numbers you give it.",
              },
            ],
            output: "[1] 79.8",
            outputNote:
              "The average score is 79.8 (the five scores add up to 399, and 399 ÷ 5 = 79.8). R did the adding and dividing for you.",
            tryIt: "Replace the scores with five numbers of your own – for example, how many hours you slept each night this week.",
          },
        },
        {
          kind: "callout",
          tone: "tip",
          title: "No need to memorise anything",
          md: `You are not expected to remember every command you see in this first lesson. Each one is explained properly later. Right now the goal is simply to get a feel for what R code looks like and what it can do.`,
        },
      ],
    },
    {
      id: "r-in-the-real-world",
      title: "What is R used for?",
      blocks: [
        {
          kind: "text",
          md: `R is used wherever people need to make sense of data. Here are some real-world examples:`,
        },
        {
          kind: "table",
          caption: "Where R is used",
          headers: ["Field", "A typical question", "What R does"],
          rows: [
            [
              "Health and medicine",
              "Does a new medicine lower blood pressure more than the old one?",
              "Compares patient groups in clinical trials and tracks the spread of diseases",
            ],
            [
              "Business",
              "Which months bring the most sales, and what will next month look like?",
              "Summarises sales data, builds forecasts and creates reports and dashboards",
            ],
            [
              "Science",
              "Is the average temperature in this region rising?",
              "Analyses measurements from experiments, weather stations, ecology field work and genetics labs",
            ],
            [
              "Social research",
              "Do students who study more get better grades? What do survey answers tell us?",
              "Analyses surveys, polls and education data, and tests whether patterns are real or just chance",
            ],
            [
              "Journalism and government",
              "How has unemployment changed over ten years?",
              "Turns official statistics into clear charts for the public",
            ],
          ],
        },
        {
          kind: "text",
          md: `Here is a tiny business example. A small shop sold 120 items on Monday, 95 on Tuesday and 143 on Wednesday. How many did it sell in total, and how many per day on average?`,
        },
        {
          kind: "code",
          example: {
            id: "shop-sales",
            title: "A small business question",
            code: `120 + 95 + 143
(120 + 95 + 143) / 3`,
            explanation: [
              { code: "120 + 95 + 143", text: "Adds the three daily sales together to get the total for the three days." },
              {
                code: "(120 + 95 + 143) / 3",
                text: "The parentheses `( )` tell R to do the adding *first*, then divide the total by 3 days. This gives the average per day.",
              },
            ],
            output: `[1] 358
[1] 119.3333`,
            outputNote:
              "The shop sold 358 items in total – about 119.3 per day. R shows up to 7 significant digits by default, which is why you see `119.3333`.",
            tryIt: "Add Thursday's sales (say, 160) to both lines. Remember to divide by 4 days instead of 3!",
          },
        },
        {
          kind: "text",
          md: `R can also turn numbers into a picture with a single line. The code below draws a bar chart of the same three days of sales.`,
        },
        {
          kind: "code",
          example: {
            id: "first-chart",
            title: "A chart in one line",
            code: `barplot(c(120, 95, 143), names.arg = c("Mon", "Tue", "Wed"))`,
            explanation: [
              { code: "barplot( ... )", text: "`barplot()` is a ready-made R command that draws a bar chart." },
              { code: "c(120, 95, 143)", text: "The heights of the bars: one number for each day." },
              {
                code: `names.arg = c("Mon", "Tue", "Wed")`,
                text: "The labels written under the bars. Words are written inside quotes `\" \"` so R knows they are text.",
              },
            ],
            plot: true,
            outputNote: "Instead of text, you get a chart with three bars. Wednesday's bar is the tallest because it had the most sales.",
            tryIt: "Change one of the numbers – for example make Tuesday 200 – and run it again to watch the bar grow.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m1-prog-q7",
            type: "multiple-choice",
            prompt: "Which of these tasks is R especially well suited for?",
            options: [
              "Analysing the results of a survey of 500 customers",
              "Sending text messages from your phone",
              "Editing holiday photos",
              "Playing music",
            ],
            answer: 0,
            optionFeedback: [
              "Correct! Survey results are data, and R was built for analysing data.",
              "R is not a messaging app – it is a language for working with data.",
              "Photo editors are better for that. R is designed for data, statistics and charts.",
              "A music player is the right tool here. R focuses on data analysis.",
            ],
            explanation:
              "R is a language for data: calculating, summarising, testing and visualising. Survey analysis is a classic R task.",
            concept: "r-applications",
          },
        },
      ],
    },
    {
      id: "running-code-here",
      title: "Running R code on this website",
      blocks: [
        {
          kind: "callout",
          tone: "info",
          title: "Nothing to install",
          md: `On R Academy, R runs **inside your web browser** (using a technology called *webR*). You can run every example, exercise and project without installing anything. When you want to use R on your own computer later, the next lesson explains what to install.`,
        },
        {
          kind: "steps",
          title: "How to run an example",
          items: [
            "Find a code box like the ones above.",
            "Press the **Run** button (or click inside the code and press **Ctrl + Enter** on Windows/Linux, **Cmd + Enter** on a Mac).",
            "Read the answer that appears under the code – this is R's **output**.",
            "Change something in the code (a number, a word) and run it again to see what changes.",
            "Press **Open in playground** to copy the code into the R playground on the right, where you can experiment freely.",
          ],
        },
        {
          kind: "code",
          example: {
            id: "your-turn",
            title: "Your turn: change and run",
            code: `100 - 58
7 * 6`,
            explanation: [
              { code: "100 - 58", text: "Subtracts 58 from 100." },
              { code: "7 * 6", text: "Multiplies 7 by 6." },
            ],
            output: `[1] 42
[1] 42`,
            outputNote: "Two different calculations, the same answer: 42. Each line of code gets its own line of output.",
            tryIt: "Edit the first line to calculate how many minutes are in a day: `24 * 60`.",
          },
        },
        {
          kind: "callout",
          tone: "tip",
          title: "You can't break anything",
          md: `Experimenting is the fastest way to learn. If something goes wrong, R prints a message explaining the problem – nothing on your computer is harmed. Just fix the code (or reload the example) and try again.`,
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Typing words without quotes",
      wrong: `Hello`,
      error: "object 'Hello' not found",
      why: "When R sees a word without quotes, it thinks it is the *name* of something you stored earlier, and complains that it cannot find it. Text must always go inside quotes.",
      right: `"Hello"`,
    },
    {
      title: "Using x to multiply",
      wrong: `5 x 3`,
      error: "unexpected symbol",
      why: "In R the letter `x` is just a letter, not a multiplication sign. R does not know what to do with a number followed by a letter.",
      right: `5 * 3`,
    },
    {
      title: "Leaving a calculation unfinished",
      wrong: `10 +`,
      error: "unexpected end of input",
      why: "The code ends before the calculation is complete – R is still waiting for the number after `+`. \"End of input\" means R reached the end of your code too early.",
      right: `10 + 5`,
    },
  ],
  exerciseIds: ["m1-calculator"],
  quiz: [
    {
      id: "m1-prog-q1",
      type: "multiple-choice",
      prompt: "What is a program?",
      options: [
        "A list of exact instructions that a computer follows step by step",
        "A type of computer screen",
        "A website you visit to download files",
        "Any file saved on your computer",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – a program is a set of step-by-step instructions, like a recipe for the computer.",
        "A screen is hardware. A program is the set of instructions the computer follows.",
        "A website might offer programs to download, but a program itself is a list of instructions.",
        "Not every file is a program – photos and documents are data, not instructions.",
      ],
      explanation:
        "A program is a list of instructions the computer carries out in order. Programming means writing those instructions in a programming language such as R.",
      concept: "programming",
    },
    {
      id: "m1-prog-q2",
      type: "true-false",
      prompt: "R is free to download and use.",
      answer: true,
      explanation:
        "R is free and open-source software. Anyone can download it and use it for study, research or business, on Windows, macOS or Linux.",
      concept: "what-is-r",
    },
    {
      id: "m1-prog-q3",
      type: "predict-output",
      prompt: "What does R print when you run this code?",
      code: `6 * 7`,
      options: ["[1] 42", "42", "6 * 7", "[1] 67"],
      answer: 0,
      optionFeedback: [
        "Correct – R multiplies 6 by 7 and labels the answer with `[1]`.",
        "The answer is 42, but R always puts the `[1]` label in front of a printed result.",
        "R does not repeat your code – it calculates the answer.",
        "`*` means multiply in R. It does not glue the digits together.",
      ],
      explanation: "`*` is R's multiplication sign. 6 × 7 = 42, and R shows it as `[1] 42` – the `[1]` labels the first value of the result.",
      concept: "running-code",
    },
    {
      id: "m1-prog-q4",
      type: "multiple-choice",
      prompt: "A hospital wants to find out whether patients who exercise more have lower blood pressure. How could R help?",
      options: [
        "By analysing the patients' exercise and blood-pressure data and drawing charts",
        "By measuring each patient's blood pressure with a machine",
        "By booking appointments for the patients",
        "R cannot help – it only works with business data",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – once the data has been collected, R can summarise it, compare groups and visualise the pattern.",
        "R works with data after it has been measured – it does not take measurements itself.",
        "That is a job for booking software, not a data-analysis language.",
        "R is used in many fields, including health and medicine, science and social research.",
      ],
      explanation:
        "R is a tool for analysing data. In health research it is used to compare groups of patients, look for patterns and test whether differences are real.",
      concept: "r-applications",
    },
    {
      id: "m1-prog-q5",
      type: "find-error",
      prompt: "This code should do three calculations, but R stops with an error. Click the line with the mistake.",
      code: `15 + 3
4 x 2
100 / 4`,
      errorLine: 2,
      errorKind: "error",
      fix: `15 + 3
4 * 2
100 / 4`,
      explanation:
        "R does not use `x` for multiplication – `x` is just a letter. The multiplication sign in R is the star `*`, so the line should be `4 * 2`.",
      concept: "running-code",
    },
  ],
  keyPoints: [
    "A program is a list of exact instructions that a computer follows from top to bottom, like a recipe.",
    "Programming means writing those instructions in a programming language; the instructions are called code.",
    "R is a free programming language designed for data, statistics and charts.",
    "R is used in health, business, science, social research, journalism and government to make sense of data.",
    "On this website R runs in your browser: press Run (or Ctrl/Cmd + Enter) and the output appears below the code.",
    "R labels each printed answer with [1], which means \"the first value of the result\".",
  ],
  concepts: ["programming", "what-is-r", "r-applications", "running-code"],
  glossary: ["program", "code", "programming-language", "syntax", "r"],
  playground: `# Welcome to the R playground!
# Use R as a calculator: change the numbers and press Run.
2 + 3
10 * 4
100 / 8
`,
};
