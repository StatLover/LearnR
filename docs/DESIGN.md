# R Academy – Design System

R Academy should feel **clean, calm and professional** – a serious R course that is still friendly and motivating. Colour comes from a soft, warm palette; structure comes from clear typography, generous spacing and consistent cards. Avoid excessive colour, gradients, motion and decoration.

**Identity:** the R community's hex stickers. The mascot **Hexy** is a minimal hexagon mark (no limbs, no speech bubbles, no animation). It is a brand element, not an assistant: use it sparingly – page heroes, empty states, the lesson-complete screen.

## 1. Palette

| Name | Hex | Used for |
| --- | --- | --- |
| Latte | `#F7F1E8` | page background (lightened), secondary surfaces |
| Wisteria | `#E6E3F7` | soft panels (`grape-soft`), deep shade for text |
| Milk shake | `#FCEDED` | error/danger panels (`coral-soft`) |
| Attic window | `#98C1E9` | brand blue: deep shade `#2D6597` in light mode, the colour itself in dark mode |
| Butter yellow | `#FED57D` | XP, highlights, the "sun" accent (always with dark text) |
| Clover | `#5BA881` | success, Run/Check buttons (deep shade `#2D7A55` in light mode) |
| Seafoam | `#E7F5F9` | info panels (`sky-soft`) |
| Apricot jam | `#F0A351` | streaks, the "tangerine" accent |
| Rainy day | `#B3DFE8` | the "sky" accent in dark mode |
| Matcha | `#9CA362` | the "teal" accent (statistics) |
| Ballet slipper | `#FDD0D0` | the "pink" accent (visualisation) |
| Cherry | `#C62A29` | errors and destructive actions |

Pastels are surfaces; **deeper shades of the same hues carry text and filled buttons**, so every pairing meets WCAG AA (4.5:1) in both themes. In dark mode the palette's own tones are used as accents on a dark neutral background, and text on coloured fills turns dark.

## 2. Tokens (use these, never raw hex)

All tokens live in `src/app/globals.css` (`:root` and `.dark`).

- **Surfaces:** `bg-background`, `bg-surface`, `bg-surface-2`, `bg-surface-3`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `border-border-strong`.
- **Brand:** `primary` (attic-window blue) with `primary-soft`.
- **Accents** (token name → palette hue), each with `-soft`: `mint` → clover, `sun` → butter yellow, `coral` → cherry, `sky` → rainy day, `grape` → wisteria, `tangerine` → apricot jam, `pink` → ballet slipper, `teal` → matcha.
- **Text on fills:** `text-on-accent` on any coloured fill (white in light mode, dark in dark mode); `text-on-sun` on butter yellow.
- **Semantic:** `success`, `warning`, `danger`, `info`, each with `-soft`.
- **Worlds:** `src/lib/game/worlds.ts` gives each world `color.main / .soft / .shadow` as CSS `var()` strings.

## 3. Typography

- `font-display` – **Plus Jakarta Sans**: headings and large numbers, `font-bold` or `font-semibold`, slightly tight tracking.
- `font-sans` – **Inter**: body text at regular weight; `font-semibold` only for labels and emphasis.
- `font-mono` – JetBrains Mono (ligatures off) for code.
- Section eyebrows: `text-xs font-semibold uppercase tracking-[0.14em]` in an accent colour.

## 4. Shape and surfaces

- Cards: `rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]` (the radius scale is reduced in `@theme`, so `rounded-3xl` is 14px).
- 1px borders; quiet shadows (`--shadow-card`, `--shadow-pop` on hover via `.lift`).
- Page heroes (`PageHeader`) use a flat soft accent band – no gradients.
- Buttons (`@/components/ui/button`): solid fills for actions (`primary`, `success`, `sun`, `danger`, …), `outline`/`ghost` for secondary actions. `.press` adds a subtle hover/press feedback.

## 5. Motion

- Only short, functional transitions: `animate-fade-up`, `animate-pop-in`, `animate-slide-up`, `animate-shake` (wrong answer).
- Decorative looping motion (`float`, `bob`, `wiggle`, `pulse-ring`) is switched off in the theme.
- Confetti is brief and capped, only on real achievements, and respects the Celebrations and reduced-motion settings.

## 6. Components

| Need | Component |
| --- | --- |
| Page hero | `PageHeader` (`@/components/layout/page-header`): `title`, `description`, `icon`, `color`, `eyebrow`, `art` |
| Mascot | `Hexy`, `HexyAvatar` (`@/components/brand/mascot`); moods only change the face slightly |
| Illustrations | `TopicArt kind=… bg=…` (`@/components/brand/topic-art`), drawn in palette tones |
| Cards / badges / progress | `@/components/ui/card`, `badge` (`Badge`, `DifficultyBadge`, `XpBadge`), `progress` (`ProgressBar`, `ProgressRing`) |
| Code | `CodeRunner`, `CodeBlock`, `StaticCode`, `CodeEditor` |
| Exercises & quizzes | `ExerciseCard`, `QuestionCard`, `Quiz` |
| Gamification data | `useGame()` (`@/components/game/outline-context`) |

## 7. Writing

- Clear, encouraging and specific. Explain mistakes; never blame.
- No emoji in headings or labels.
- Never fake anything: every button works, every output shown as R output comes from real R (webR), and illustrations are labelled as illustrations.

## 8. Accessibility

- Real buttons and links with a visible focus ring; icon-only buttons need an `aria-label`.
- Tiles that act as radio buttons use `role="radio"` and `aria-checked`; results are announced with live regions.
- Check contrast when adding colour: text must reach 4.5:1 in both themes.
- Every page must work from 320px phones to wide desktops.
