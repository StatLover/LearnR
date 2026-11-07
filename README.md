# R Academy – Learn R from Zero

An interactive website that teaches R programming to complete beginners and takes them to an intermediate level. It combines an R textbook, a coding classroom, a beginner-friendly RStudio and a personal AI tutor.

R code runs **in the learner's browser**, using [webR](https://docs.r-wasm.org/webr/latest/) (R compiled to WebAssembly). Every Run button executes real R. No output is simulated.

The site is designed as a playful coding adventure ("Duolingo meets DataCamp"): a learning map of seven worlds, bite-sized lesson steps, XP, levels, streaks, badges, daily challenges and a friendly hexagon mascot called **Hexy** – on top of a serious, fully tested R course. See [docs/DESIGN.md](docs/DESIGN.md) for the design system.

## What's inside

| Area | What it does |
| --- | --- |
| **Learning map** | **7 worlds** (R Explorer → Data Adventurer → Logic Builder → Data Wizard → Visualization Creator → Statistics Detective → R Pro) group the 10 modules. Each world has goals, progress and a winding path of lesson nodes (completed / current / locked), module checkpoints and – in R Pro – the projects. Completed lessons stay open for review. |
| **Lesson player** | Every lesson is split into short cards in six steps: **Learn → Watch it work → Try it yourself → Challenge → Get feedback → Earn XP**. Next / Previous / Skip, Hint, Retry and Ask AI buttons, Alt+←/→ shortcuts, an outline drawer, a docked AI tutor, and resume-where-you-left-off. Finishing a lesson celebrates with confetti and shows the XP earned. |
| **Gamification** | XP for lessons, challenges, correct answers, checkpoints, projects and the daily challenge; levels; a daily XP goal; streaks; 27 badges; level-up and badge celebrations. XP is *derived* from real progress (`src/lib/game/xp.ts`), so it can't be double-counted and needs no extra storage. |
| **Curriculum** | 3 stages, 10 modules, **34 lessons**. Each lesson has objectives, a plain-English explanation, detailed sections, runnable examples with line-by-line notes and expected output, common mistakes, exercises, a quiz and a summary. Each module ends with a checkpoint. |
| **Code editor** | CodeMirror 6 with R highlighting, line numbers, auto-indent, bracket and quote closing, autocomplete, search and RStudio-style shortcuts (`Alt+-` inserts `<-`, `Ctrl+Shift+M` inserts `|>`). Buttons: Run, Stop, Reset, Copy, Format, Download `.R`, Save, Clear. Output has Console, Plots (PNG export), Data viewer (`View(df)`) and Environment tabs. |
| **R Error Detective** (`/error-checker`) | Paste code (or pick a classic beginner "case") and press **Find My Error**: the code runs in real R and the result is a case report with numbered clues – error type, R's exact message, where it happened (only when R or a deterministic check supports it, with a "How we know" note), what went wrong (with "Explain more simply"), how to fix it, the corrected code, why the correction works, and **Apply fix & test**. Corrected code is only shown after R has run it, with a before/after diff and R's real output. Also: **Check without running**, **Explain with AI** and **Fix it for me** (AI fixes are also run in R before they are shown), and Restore my original code. "Find my mistake" buttons elsewhere hand code over and start the check automatically. |
| **AI tutor ("Hexy")** | Six modes: beginner, step-by-step, debugging, practice, quiz and statistics. One-tap actions: **Explain This Code, Make It Simpler, Give Me a Hint, Find My Mistake, Give Me Another Example, Quiz Me** (plus Explain This Lesson and Send My Code). It knows which lesson or exercise you are on and has a `run_r_code` tool: when it wants to show what code prints, the code runs in your browser and the model sees the real output. Docked in every lesson and exercise; `/tutor?q=…` pre-fills a question (`&mode=…` picks a mode). |
| **Practice** | **68 exercises** (easy, medium, challenge) with automated R tests that check results rather than exact code text, so any correct solution passes. Each has progressive hints, a solution, an explanation and a compare-with-solution diff. The practice arena filters by world, difficulty and status. A **daily challenge** (`/challenge`) picks one exercise per day from the worlds you have reached, for +50 bonus XP. |
| **Projects** | **6 guided projects** (49 tested steps) on realistic datasets, shown as quests (beginner, intermediate and a "boss level" capstone exploratory data analysis). |
| **Reference** | Function reference with **167 entries** (searchable collectible cards, each with a runnable example), **10 printable cheat sheets**, a glossary of **137 terms** and sample datasets. **R Labs** (`/visualize`): a chart builder plus interactive normal-distribution, sampling/central-limit-theorem, correlation and regression labs whose sliders write and run real R code. |
| **Progress** | Dashboard ("My adventure"): level and XP, streak, daily goal, continue learning, the daily challenge, XP this week, world progress, badges, quiz scores, activity calendar, recent items, saved code, bookmarks, notes, and suggested revision based on quiz mistakes. |
| **Everything else** | Light and dark themes (both designed; follows the system, smooth toggle, remembered), global search (`Ctrl+K`), onboarding with a daily XP goal, optional guided unlocking, notes, bookmarks, font size, celebrations and reduced-motion settings, and keyboard and screen-reader support. |

## Quick start

Requirements: Node.js 20 or newer.

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000. `npm install` also copies the webR runtime (about 46 MB) from `node_modules/webr` into `public/webr/` (`scripts/copy-webr.mjs`), so the site serves R itself.

For production:

```bash
npm run build
```

```bash
npm start
```

## Configuration

Everything is optional. Without any configuration, the lessons, the R environment, exercises, projects and the rule-based Error Detective all work. Copy `.env.example` to `.env.local` to configure the rest.

### Still needed to switch on every feature

| Feature | What to configure |
| --- | --- |
| **AI tutor and "Explain My Error"** | Set `ANTHROPIC_API_KEY` on the server. Optional: `ANTHROPIC_MODEL` (default `claude-opus-5-5`), `AI_EFFORT` (`low`, `medium` or `high`; default `medium`), `AI_FALLBACKS` (`default` or `off`), `AI_RATE_LIMIT_PER_MINUTE` (default 12) and `AI_RATE_LIMIT_PER_DAY` (default 200). Without a key, the tutor and the AI buttons show a clear "not configured" notice. |
| **Accounts and sync across devices** | Create a Supabase project, run `supabase/schema.sql` (one row per learner, protected by row-level security), then set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Without them, learners use guest mode: progress lives in `localStorage` and can be exported and imported from Settings. |
| **R packages** | The learner's browser must be able to reach `https://repo.r-wasm.org/`. That is where packages such as dplyr and ggplot2 are downloaded the first time `library()` is called. Base R and the built-in datasets need no network access. Change it with `NEXT_PUBLIC_WEBR_REPO_URL`. |

### How the AI is connected

- `src/app/api/ai/chat/route.ts` streams responses as newline-delimited JSON. It uses the Anthropic SDK (`@anthropic-ai/sdk`) with adaptive thinking, a configurable effort level and server-side refusal fallback (`fallbacks: "default"`).
- The `run_r_code` tool is defined on the server and executed in the browser (`src/lib/ai/tutor-store.ts`). The tool result is sent back on the next request.
- `src/app/api/ai/analyze/route.ts` returns structured JSON validated with zod: error kind, location and its basis, explanation, fixed code, a list of changes and tips. The browser then **runs the suggested fix in webR** before showing it as working.
- The API key is read only on the server and never reaches the browser. Requests are validated (zod, size limits) and rate-limited per IP.
- The prompt is lesson-aware: the current lesson's objectives, sections and key points are included, along with the learner's self-reported level.

## Architecture

```
src/
  app/                    Next.js App Router pages (all content pages are statically generated)
    api/ai/…              AI endpoints (server only)
    api/search-index      static search index
  content/                The course as typed data (see docs/CONTENT_GUIDE.md)
    types.ts              Content model: lessons, exercises, quizzes, projects, …
    modules/mNN-*.ts      Modules 1–10 (one file per lesson in modules/mNN/)
    projects/, reference/ Projects, function reference, glossary, cheat sheets
  lib/
    r/runtime-r.ts        R helpers loaded into every R session (.ra_run, .ra_tests, …)
    r/session.ts          The browser R session (webR): queue, workspaces, packages, timeouts
    r/format.ts, tokens.ts  Code formatter and tokenizer
    errors/               Error analysis rules and the fix-verification loop
    ai/                   Prompts, config, rate limiting, browser tutor store
    game/                 Worlds, XP and levels, daily challenge, badges
    store/                Settings and progress (localStorage), streaks, unlocking
    sync/                 Optional Supabase sync and merge
  components/             UI (editor, runner, lesson player, map, quiz, exercise, tutor, dashboard, …)
    brand/                Hexy the mascot, topic illustrations, decorations
    game/                 Celebrations (XP pop-ups, level-ups, badges), confetti, hex badges
    learn/lesson-player   The six-step card-based lesson player (lesson-cards.ts builds the cards)
    path/world-map        The interactive learning map
scripts/
  generate-datasets.ts    Seeded generator for the sample CSV files in public/data
  verify-content.ts       Runs all course code through real R (see below)
tests/                    Unit tests (node:test)
```

### How code runs

`src/lib/r/runtime-r.ts` installs R helpers into an attached environment, so they never appear in the learner's `ls()`.

`.ra_run()` parses the code and evaluates it one top-level expression at a time. This records:

- the exact line range of any error or warning
- the call stack
- package start-up messages, shown dimmed
- data frames, for the Data viewer

Console output is formatted like the R console. Each part of the site runs in its own R environment (workspace), so variables don't leak between the playground, lessons and the Error Detective. Exercise tests are R expressions evaluated against the learner's variables, with helpers like `.out`, `.error`, `.plots` and `.has_geom()`.

## Security

- **Learner code never runs on the server.** It runs in the learner's own browser, inside webR's Web Worker sandbox, which has no access to the server or the local file system.
- **Long-running code is stopped.** There is a time limit (configurable, 30 s by default) and a Stop button. The page is cross-origin isolated (COOP/COEP headers in `next.config.ts`), so interrupts work. If R does not respond, the session is restarted.
- **Uploaded files are checked.** CSV, TSV and TXT only, up to 5 MB, valid UTF-8 text with no binary content, and a sanitised file name. They are written only to webR's in-memory file system.
- **The AI is protected.** The key stays on the server, requests are validated and limited in size, and there is per-IP rate limiting. The limiter keeps its counts in memory, so if you run several server instances, replace it with a shared store such as Redis.
- **Other headers:** `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy`.

Deploy behind a host that keeps the COOP/COEP headers. Without them, webR falls back to a slower mode that cannot be interrupted.

## Content quality: every example is run

```bash
npm run verify:content
```

This runs **every** lesson example, mistake, quiz output prediction, find-the-error question, exercise solution and test, project step, function-reference example and glossary example through real R, and compares the results with the content.

- **Base-R content** runs in webR in Node, the same R 4.6 the browser uses.
- **Content that needs packages** runs in a local R installation (`Rscript` with dplyr, tidyr, ggplot2, stringr and lubridate), because the webR package repository may not be reachable from CI.

The current result is **1,279 checks passed, 0 failed, 0 warnings**.

Options:

- `--module N` checks one module.
- `--file <path>` checks one content file.
- `--projects`, `--functions` and `--glossary` check those areas only.

## Development commands

```bash
npm run lint            # ESLint (Next.js + React hooks rules)
npm run typecheck       # TypeScript
npm test                # unit tests: error analyzer, formatter, tokenizer, sync merge, streaks
npm run verify:content  # run all course code through R
npm run datasets        # regenerate the sample CSV files (deterministic)
```

## Adding lessons

See [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md).

1. Add a `Lesson` object in `src/content/modules/mNN/`.
2. List it in the module file.
3. Run the verifier.

The lesson then appears automatically in navigation, search, the dashboard, the AI tutor's lesson context and the static build.

## Known limitations

- **Packages:** webR can only load packages that have been compiled for WebAssembly. Most popular packages are available. When a package isn't, learners see an explanation and are told to use desktop R.
- **Dark-mode plots:** dark-themed plots apply to base graphics and to ggplot2 plots that are auto-printed. A plot printed with an explicit `print(p)`, or one that sets its own colours, keeps those colours. Settings has an "Always light" option.
- **The AI can make mistakes.** The interface reduces this: the tutor runs code before reporting what it prints, and AI fixes are run before they are shown. Rule-based explanations always come from what R actually reported.
- **The sample datasets are synthetic** and meant for learning. The health data is not medical information.
