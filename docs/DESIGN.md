# R Academy – Design System ("Hex Adventure")

R Academy should feel like **Duolingo meets DataCamp**: a playful, colourful coding adventure that is still a serious, accurate R course. Inspiration for the illustration style is PhET's interactive simulations: bright illustrated thumbnails, hands-on play, friendly but never childish.

**Identity:** the R community's hex stickers. The mascot **Hexy** is a friendly hexagon. Hexagons appear in badges, the level chip, map nodes and decorations.

## 1. Foundations

- **Fonts**
  - `font-display` (Fredoka) for headings, buttons, numbers and badges.
  - `font-sans` (Nunito) for body text.
  - `font-mono` (JetBrains Mono, ligatures off) for code.
  - Body text is `font-semibold` or medium. Headings use `font-display font-bold`.
- **Colours:** always use tokens, never raw hex. They live in `src/app/globals.css` and are designed separately for light and dark.
  - Surfaces: `bg-background`, `bg-surface`, `bg-surface-2`, `bg-surface-3`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `border-border-strong`.
  - Brand: `primary` (indigo), plus `primary-soft`, `primary-strong` and `primary-shadow`.
  - Candy accents, each with `-soft` and `-shadow` variants: `mint`, `sun`, `coral`, `sky`, `grape`, `tangerine`, `pink`, `teal`. Example: `bg-mint-soft text-success`.
  - Semantic: `success`, `warning`, `danger`, `info`, each with `-soft`.
  - World colours come from `src/lib/game/worlds.ts`: `world.color.main`, `.soft` and `.shadow` are CSS `var()` strings, so use them in `style={{ background: world.color.main }}`.
- **Shape:**
  - Cards are `rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]`.
  - Inner panels are `rounded-2xl`; small chips are `rounded-xl` or `rounded-full`.
  - 2px borders everywhere, never hairlines.
- **3D press:** the `press` class gives a solid bottom edge and press-down. Set the edge colour with `[--press-shadow:var(--mint-shadow)]`. Buttons already do this. Use it for selectable tiles too, as in `question-card.tsx`.
- **Hover:**
  - The `lift` class makes a card rise on hover.
  - `animate-pop-in`, `animate-fade-up`, `animate-slide-up`, `animate-shake` (wrong answer), `animate-float`, `animate-bob` and `animate-wiggle` are available.
  - Always respect reduced motion. Global CSS handles this, so never force animations.
- **Backgrounds:**
  - `<PageHeader>` gives every page a coloured gradient hero.
  - `<FloatingHexes/>` adds decoration.
  - `.blob` gives blurred colour circles.
  - `.text-gradient` gives gradient headline text.
- **Spacing:** page container `mx-auto max-w-7xl px-5`, section gap `py-8` to `py-12`, card padding `p-5` or `p-6`.

## 2. Components to use

| Need | Component |
| --- | --- |
| Buttons | `@/components/ui/button`. Variants: `primary` (main action), `success` (Run / Check / Continue), `sun` (Hint, XP), `grape`, `accent`, `danger`, `outline` (secondary), `secondary`, `ghost`, `link`. Sizes: `sm`, `md`, `lg`, `xl`, `icon`, `icon-sm`. |
| Cards | `@/components/ui/card` (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`) |
| Badges | `Badge`, `DifficultyBadge`, `XpBadge` from `@/components/ui/badge` |
| Progress | `ProgressBar` (supports `color={world.color.main}`, size `sm`/`md`/`lg`) and `ProgressRing` from `@/components/ui/progress` |
| Page hero | `PageHeader` from `@/components/layout/page-header`: `title`, `description`, `icon`, `color` (accent name), `eyebrow`, `art` (e.g. `<Hexy mood="wave" size={120}/>`) |
| Mascot | `Hexy` and `HexyAvatar` from `@/components/brand/mascot`. Moods: `happy`, `wave`, `celebrate`, `think`, `oops`, `cool`, `sleep`, `point`. |
| Topic illustrations | `TopicArt kind=… bg=…` from `@/components/brand/topic-art`. Lesson kinds are in `LESSON_ART`, project kinds in `PROJECT_ART` (`src/lib/game/worlds.ts`). Use these as PhET-style card thumbnails. |
| Badges / medals | `HexBadge` from `@/components/game/hex-badge`. Definitions are in `src/lib/game/badges.ts`. |
| Decoration | `FloatingHexes`, `SectionTitle` from `@/components/brand/decor`; `Reveal` (scroll-in) from `@/components/brand/reveal` |
| Gamification data | `useGame()` from `@/components/game/outline-context` returns `xp`, `level`, `todayXp`, `goalXp`, `goalPct`, `week`, `streak` and `daily`. `useOutline()` returns the course outline. |
| Celebrations | `fireConfetti()` from `@/components/game/confetti`. XP gains, level-ups and badges are celebrated globally by `CelebrationLayer`, so don't duplicate them. |
| Code | `CodeRunner` (full editor, console, plots, data, variables), `CodeBlock` (read-only with Run), `StaticCode`, `CodeEditor` |
| Exercises & quizzes | `ExerciseCard`, `QuestionCard`, `Quiz` from `@/components/learn/*` |
| Copy | `praise()` and `encourage()` from `@/lib/game/xp` for friendly feedback |

## 3. Tone

- Friendly, encouraging and specific: "Almost! …", "Brilliant!". Celebrate success. After mistakes, encourage and explain; never blame.
- Never childish. Emojis only as small accents in labels, at most one per heading.
- Never fake anything:
  - Every button works.
  - Every output shown as "your output" comes from real R (webR).
  - Illustrative examples must be labelled as examples.

## 4. Accessibility

- All interactive elements are real buttons or links with visible focus. The global focus ring is 3px.
- Icon-only buttons need an `aria-label`.
- Tiles that act as radio buttons use `role="radio"` and `aria-checked`.
- Live regions announce results.
- Contrast: text on candy colours uses white, except `sun`, which uses dark text (`text-[#3b2600]`).
- Every page must work at phone width (320–430px). The mobile tab bar covers the bottom 64px, and the footer already pads for it.
