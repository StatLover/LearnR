"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  Bug,
  Check,
  ChevronDown,
  CircleHelp,
  Cloud,
  Coffee,
  Cpu,
  Database,
  Download,
  Dumbbell,
  Flame,
  Footprints,
  GraduationCap,
  Keyboard,
  Leaf,
  ListOrdered,
  LockOpen,
  LogOut,
  Monitor,
  Moon,
  Palette,
  PartyPopper,
  Play,
  RefreshCw,
  Rocket,
  RotateCcw,
  Route,
  Sigma,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Sun,
  TreeDeciduous,
  TriangleAlert,
  Upload,
  UserRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProgressBar } from "@/components/ui/progress";
import { toast } from "@/components/ui/toast";
import { HexyAvatar } from "@/components/brand/mascot";
import { StaticCode } from "@/components/code/static-code";
import { ShortcutTable } from "@/components/code/code-runner";
import { MODES } from "@/components/tutor/tutor-chat";
import { useGame } from "@/components/game/outline-context";
import { fireConfetti } from "@/components/game/confetti";
import { candy, INK, type Candy } from "@/components/reference/candy";
import { updateSettings, useSettings, defaultSettings, type Settings, type ThemePref } from "@/lib/store/settings";
import { progress, progressStore, useProgress, type Profile } from "@/lib/store/progress";
import { account, syncConfigured, useSyncState } from "@/lib/sync/sync-manager";
import { rSession } from "@/lib/r/session";
import { useRSession } from "@/hooks/use-r-session";
import { aiStatus } from "@/lib/ai/tutor-store";
import { cn, downloadText } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

const SECTIONS: { id: string; title: string; icon: LucideIcon; color: Candy }[] = [
  { id: "appearance", title: "Appearance", icon: Palette, color: "pink" },
  { id: "learning", title: "Learning", icon: GraduationCap, color: "mint" },
  { id: "editor", title: "Code editor", icon: Keyboard, color: "sky" },
  { id: "tutor", title: "AI tutor", icon: Sparkles, color: "grape" },
  { id: "r", title: "R in your browser", icon: Cpu, color: "teal" },
  { id: "account", title: "Account & sync", icon: Cloud, color: "primary" },
  { id: "data", title: "Your data", icon: Database, color: "coral" },
];
const section = (id: string) => SECTIONS.find((s) => s.id === id)!;

function Section({ id, description, children }: { id: string; description?: string; children: ReactNode }) {
  const s = section(id);
  return (
    <section id={id} aria-labelledby={`${id}-title`} style={candy(s.color)} className="scroll-mt-24 overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3.5 border-b-2 border-border bg-[var(--c-soft)] px-5 py-4 sm:px-6">
        <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--c)] text-[var(--c-fg)] shadow-[0_4px_0_var(--c-shadow)] [&_svg]:size-5">
          <s.icon />
        </span>
        <div className="min-w-0">
          <h2 id={`${id}-title`} className="font-display text-xl font-bold tracking-tight">
            {s.title}
          </h2>
          {description && <p className="text-sm font-semibold text-muted-foreground">{description}</p>}
        </div>
      </div>
      <div className="divide-y-2 divide-border/60">{children}</div>
    </section>
  );
}

/** One setting: label + hint on the left, control on the right (wraps on phones). */
function Row({ label, hint, htmlFor, children }: { label: string; hint?: ReactNode; htmlFor?: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4 sm:px-6">
      <div className="min-w-0 flex-1 basis-56">
        <Label htmlFor={htmlFor} className="font-display text-base font-semibold">
          {label}
        </Label>
        {hint && <p className="mt-0.5 text-sm font-semibold text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Block({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-5 py-5 sm:px-6", className)}>{children}</div>;
}

interface TileOption<T> {
  value: T;
  label: string;
  hint?: string;
  icon?: ReactNode;
  art?: ReactNode;
  /** Shown between the label and the hint. */
  extra?: ReactNode;
}

/** A group of big selectable tiles that behave like radio buttons (native radios inside). */
function TileGroup<T extends string | number>({
  legend,
  hint,
  value,
  options,
  onChange,
  className,
  align = "center",
}: {
  legend: string;
  hint?: ReactNode;
  value: T;
  options: TileOption<T>[];
  onChange: (v: T) => void;
  className?: string;
  align?: "center" | "start";
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className="font-display text-base font-semibold">{legend}</legend>
      {hint && <p className="mt-0.5 text-sm font-semibold text-muted-foreground">{hint}</p>}
      <div className={cn("mt-3 grid gap-3", className)}>
        {options.map((o) => {
          const on = o.value === value;
          return (
            <label
              key={String(o.value)}
              className={cn(
                "press relative flex min-w-0 cursor-pointer flex-col gap-1 rounded-2xl border-2 p-3 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                align === "center" ? "items-center text-center" : "items-start text-left",
                on ? "border-[var(--c)] bg-[var(--c-soft)] [--press-shadow:var(--c)]" : "border-border bg-surface [--press-shadow:var(--border)] hover:bg-surface-2",
              )}
            >
              <input type="radio" name={name} value={String(o.value)} checked={on} onChange={() => onChange(o.value)} className="sr-only" />
              {on && (
                <span aria-hidden className="absolute right-2 top-2 z-10 grid size-5 place-items-center rounded-full bg-[var(--c)] text-[var(--c-fg)] shadow-sm">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
              )}
              {o.art}
              {o.icon && <span className={cn("[&_svg]:size-6", on ? INK : "text-muted-foreground")}>{o.icon}</span>}
              <span className="font-display text-[15px] font-semibold leading-tight">{o.label}</span>
              {o.extra}
              {o.hint && <span className="text-xs font-semibold text-muted-foreground">{o.hint}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/* Little illustrations (SVG, so raw colours are fine here)            */
/* ------------------------------------------------------------------ */

const LIGHT = { bg: "#f5f6ff", card: "#ffffff", line: "#dde1f4", text: "#1b1e3d", primary: "#5b5bf6", mint: "#18b874", sun: "#ffbd14", pink: "#f2559d" };
const DARK = { bg: "#0c0f24", card: "#151937", line: "#2a3062", text: "#eef0ff", primary: "#7d7dff", mint: "#2fd68f", sun: "#ffcc3d", pink: "#ff74b5" };

function MiniSite({ c }: { c: typeof LIGHT }) {
  return (
    <g>
      <rect width="120" height="72" fill={c.bg} />
      <rect width="120" height="12" fill={c.card} />
      <path d="M8 2.5 l3.5 2 v4 l-3.5 2 -3.5 -2 v-4z" fill={c.primary} />
      <rect x="15" y="4.5" width="18" height="3" rx="1.5" fill={c.text} opacity="0.7" />
      <rect x="98" y="3.5" width="14" height="5" rx="2.5" fill={c.sun} />
      <rect x="8" y="18" width="64" height="46" rx="6" fill={c.card} stroke={c.line} strokeWidth="1.2" />
      <rect x="14" y="25" width="34" height="4.5" rx="2.2" fill={c.text} opacity="0.85" />
      <rect x="14" y="34" width="50" height="3" rx="1.5" fill={c.text} opacity="0.3" />
      <rect x="14" y="40" width="42" height="3" rx="1.5" fill={c.text} opacity="0.3" />
      <rect x="14" y="51" width="24" height="7" rx="3.5" fill={c.mint} />
      <rect x="78" y="18" width="34" height="21" rx="6" fill={c.card} stroke={c.line} strokeWidth="1.2" />
      <circle cx="87" cy="28.5" r="4.5" fill={c.pink} />
      <rect x="95" y="27" width="11" height="3" rx="1.5" fill={c.text} opacity="0.4" />
      <rect x="78" y="43" width="34" height="21" rx="6" fill={c.card} stroke={c.line} strokeWidth="1.2" />
      <rect x="84" y="52" width="22" height="3.5" rx="1.75" fill={c.primary} />
    </g>
  );
}

function ThemeArt({ kind }: { kind: ThemePref }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox="0 0 120 72" className="w-full overflow-hidden rounded-xl border-2 border-border" aria-hidden>
      {kind === "light" && <MiniSite c={LIGHT} />}
      {kind === "dark" && <MiniSite c={DARK} />}
      {kind === "system" && (
        <>
          <defs>
            <clipPath id={`l${id}`}>
              <path d="M0 0 H76 L44 72 H0z" />
            </clipPath>
            <clipPath id={`d${id}`}>
              <path d="M76 0 H120 V72 H44z" />
            </clipPath>
          </defs>
          <g clipPath={`url(#l${id})`}>
            <MiniSite c={LIGHT} />
          </g>
          <g clipPath={`url(#d${id})`}>
            <MiniSite c={DARK} />
          </g>
        </>
      )}
    </svg>
  );
}

function PlotArt({ mode }: { mode: Settings["plotTheme"] }) {
  const bars = (c: typeof LIGHT, x0: number) => (
    <g>
      <rect x={x0} width="60" height="48" fill={c.card} />
      <line x1={x0 + 8} y1="40" x2={x0 + 54} y2="40" stroke={c.text} strokeWidth="1.5" opacity="0.6" />
      {[18, 28, 22, 34].map((h, i) => (
        <rect key={i} x={x0 + 12 + i * 10} y={40 - h} width="7" height={h} rx="1.5" fill={[c.primary, c.mint, c.sun, c.pink][i]} />
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 120 48" className="w-full overflow-hidden rounded-xl border-2 border-border" aria-hidden>
      {mode === "auto" ? (
        <>
          {bars(LIGHT, 0)}
          {bars(DARK, 60)}
        </>
      ) : (
        <>
          {bars(LIGHT, 0)}
          {bars(LIGHT, 60)}
          <rect x="60" width="60" height="48" fill={DARK.bg} opacity="0.12" />
        </>
      )}
      <line x1="60" y1="0" x2="60" y2="48" stroke="#a0a6c8" strokeWidth="1" strokeDasharray="3 2" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Account & sync                                                      */
/* ------------------------------------------------------------------ */

function AccountSection() {
  const sync = useSyncState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!syncConfigured)
    return (
      <Section id="account" description="Optional: sync your progress across devices.">
        <Block className="flex items-start gap-4">
          <HexyAvatar size={48} mood="wave" />
          <div className="min-w-0 space-y-3">
            <p className="font-semibold">
              You are learning as a <strong className="font-extrabold">guest</strong>. All progress, notes and saved code are stored in this browser. Use <em>Export progress</em> below to move it to another device.
            </p>
            <p className="rounded-2xl bg-surface-2 p-3 text-xs font-semibold text-muted-foreground">
              Account sync is not configured on this server. To enable it, the site owner creates a Supabase project, runs <code className="font-mono">supabase/schema.sql</code> and sets <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
            </p>
          </div>
        </Block>
      </Section>
    );

  const submit = async (mode: "in" | "up") => {
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "up") {
        const r = await account.signUp(email, password);
        setMsg(r === "check-email" ? "Account created. Check your email to confirm it, then sign in." : "Account created and signed in. Your progress is syncing.");
      } else {
        await account.signIn(email, password);
        setMsg("Signed in. Your progress is syncing.");
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const statusText =
    sync.status === "syncing" ? "Syncing…" : sync.status === "synced" ? `Synced ${sync.lastSync ? new Date(sync.lastSync).toLocaleTimeString() : ""}` : sync.status === "error" ? `Sync problem: ${sync.message}` : "Ready to sync";

  return (
    <Section id="account" description="Create a free account to keep your progress in sync across devices. Guest progress in this browser is merged into your account.">
      {sync.email ? (
        <Block className="flex flex-wrap items-center gap-4">
          <HexyAvatar size={48} mood="happy" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              Signed in as <strong className="font-extrabold">{sync.email}</strong>
            </p>
            <p role="status" className={cn("mt-1 inline-flex items-center gap-1.5 text-sm font-bold", sync.status === "error" ? "text-danger" : "text-muted-foreground")}>
              <span aria-hidden className={cn("size-2.5 rounded-full", sync.status === "error" ? "bg-coral" : sync.status === "syncing" ? "animate-pulse bg-sky" : "bg-mint")} />
              {statusText}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => void account.syncNow()}>
              <RefreshCw /> Sync now
            </Button>
            <Button variant="outline" onClick={() => void account.signOut()}>
              <LogOut /> Sign out
            </Button>
          </div>
        </Block>
      ) : (
        <Block>
          <form
            className="grid gap-4 sm:max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              void submit("in");
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="acc-email">Email</Label>
              <Input id="acc-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="acc-pw">Password</Label>
              <Input id="acc-pw" type="password" autoComplete="current-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} aria-describedby="acc-pw-hint" />
              <p id="acc-pw-hint" className="text-xs font-semibold text-muted-foreground">
                At least 8 characters.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={busy}>
                Sign in
              </Button>
              <Button type="button" variant="outline" disabled={busy || password.length < 8} onClick={() => void submit("up")}>
                Create account
              </Button>
            </div>
            {msg && (
              <p role="status" className="rounded-2xl bg-surface-2 px-3 py-2 text-sm font-semibold">
                {msg}
              </p>
            )}
          </form>
        </Block>
      )}
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* The form                                                            */
/* ------------------------------------------------------------------ */

const GOALS: { xp: number; label: string; hint: string; icon: LucideIcon }[] = [
  { xp: 20, label: "Casual", hint: "≈ 5 min a day", icon: Coffee },
  { xp: 50, label: "Regular", hint: "≈ 15 min a day", icon: Footprints },
  { xp: 100, label: "Serious", hint: "≈ 30 min a day", icon: Flame },
  { xp: 150, label: "Intense", hint: "≈ 45 min a day", icon: Rocket },
];

const MODE_ICONS: Record<string, LucideIcon> = { beginner: Sprout, "step-by-step": ListOrdered, debugging: Bug, practice: Dumbbell, quiz: CircleHelp, statistics: Sigma };

const PROGRAMMING: TileOption<NonNullable<Profile["programming"]>>[] = [
  { value: "none", label: "Brand new to coding", icon: <Sprout /> },
  { value: "some", label: "I've tried a little", icon: <Leaf /> },
  { value: "experienced", label: "I already program", icon: <TreeDeciduous /> },
];
const STATS: TileOption<NonNullable<Profile["statistics"]>>[] = [
  { value: "none", label: "New to statistics", icon: <Sprout /> },
  { value: "some", label: "I know the basics", icon: <Leaf /> },
  { value: "confident", label: "Comfortable with stats", icon: <TreeDeciduous /> },
];

const PREVIEW_CODE = `scores <- c(80, 90, 100)
mean(scores) # 90`;

export function SettingsForm() {
  const s = useSettings();
  const p = useProgress();
  const r = useRSession();
  const game = useGame();
  const [ai, setAi] = useState<{ configured: boolean; model: string | null } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => {
    aiStatus().then(setAi);
  }, []);
  const set = (patch: Partial<Settings>) => updateSettings(patch);

  const setTheme = (theme: ThemePref) => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    set({ theme });
    window.setTimeout(() => root.classList.remove("theme-transition"), 450);
  };

  const exportData = () => {
    downloadText(`r-academy-progress-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ app: "r-academy", exportedAt: new Date().toISOString(), progress: progressStore.get(), settings: s }, null, 2), "application/json");
  };
  const importData = async (f?: File) => {
    if (!f) return;
    try {
      if (f.size > 5_000_000) throw new Error("File too large");
      const j = JSON.parse(await f.text());
      if (j?.app !== "r-academy" || typeof j.progress !== "object") throw new Error("This is not an R Academy progress file.");
      progress.importState(j.progress);
      if (j.settings) updateSettings(j.settings);
      toast("Progress imported");
    } catch (e) {
      toast("Import failed", { description: e instanceof Error ? e.message : String(e), tone: "warning" });
    }
  };

  const rDot = r.status === "ready" ? "bg-mint" : r.status === "busy" ? "bg-sky animate-pulse" : r.status === "loading" ? "bg-sun animate-pulse" : r.status === "error" ? "bg-coral" : "bg-border-strong";
  const motionOff = s.reduceMotion === "on";

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      {/* Section navigation */}
      <nav aria-label="Settings sections" className="min-w-0 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
        <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
          {SECTIONS.map((x) => (
            <li key={x.id} className="shrink-0">
              <a href={`#${x.id}`} style={candy(x.color)} className="group flex items-center gap-2.5 rounded-2xl border-2 border-border bg-card px-3 py-2 font-display text-[15px] font-semibold hover:border-[var(--c)] lg:border-transparent lg:bg-transparent lg:hover:bg-[var(--c-soft)]">
                <span aria-hidden className="grid size-8 place-items-center rounded-xl bg-[var(--c)] text-[var(--c-fg)] [&_svg]:size-4">
                  <x.icon />
                </span>
                {x.title}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 hidden items-center gap-2 rounded-2xl bg-mint-soft px-3 py-2.5 text-xs font-bold text-success lg:flex">
          <Check className="size-4 shrink-0" aria-hidden /> Changes are saved automatically.
        </p>
      </nav>

      <div className="min-w-0 space-y-6">
        {/* Appearance */}
        <Section id="appearance" description="Make R Academy look and feel right for you.">
          <Block>
            <TileGroup<ThemePref>
              legend="Theme"
              hint="System follows your device's light or dark setting."
              value={s.theme}
              onChange={setTheme}
              className="grid-cols-3"
              options={[
                { value: "light", label: "Light", icon: <Sun />, art: <ThemeArt kind="light" /> },
                { value: "dark", label: "Dark", icon: <Moon />, art: <ThemeArt kind="dark" /> },
                { value: "system", label: "System", icon: <Monitor />, art: <ThemeArt kind="system" /> },
              ]}
            />
          </Block>
          <Block>
            <TileGroup<Settings["fontSize"]>
              legend="Text size"
              value={s.fontSize}
              onChange={(v) => set({ fontSize: v })}
              className="grid-cols-2 sm:grid-cols-4"
              options={(
                [
                  ["sm", "Small", "text-sm"],
                  ["md", "Medium", "text-lg"],
                  ["lg", "Large", "text-2xl"],
                  ["xl", "Extra large", "text-3xl"],
                ] as const
              ).map(([value, label, size]) => ({
                value,
                label,
                art: (
                  <span aria-hidden className={cn("grid h-10 place-items-center font-display font-bold", size)}>
                    Aa
                  </span>
                ),
              }))}
            />
          </Block>
          <Block>
            <TileGroup<Settings["plotTheme"]>
              legend="Plot colours"
              hint="Dark plots in dark mode, or always the classic light style."
              value={s.plotTheme}
              onChange={(v) => set({ plotTheme: v })}
              className="grid-cols-2 sm:max-w-md"
              options={[
                { value: "auto", label: "Match theme", art: <PlotArt mode="auto" /> },
                { value: "light", label: "Always light", art: <PlotArt mode="light" /> },
              ]}
            />
          </Block>
          <Row label="Reduce motion" hint="Turn off animations. Your device's reduced-motion setting is always respected." htmlFor="reduce-motion">
            <Switch id="reduce-motion" checked={motionOff} onCheckedChange={(v) => set({ reduceMotion: v ? "on" : "system" })} />
          </Row>
          <Row
            label="Celebrations"
            hint={
              <>
                Confetti and party animations when you finish lessons, level up or earn badges.
                {s.celebrations && motionOff && " (Paused while Reduce motion is on.)"}
              </>
            }
            htmlFor="celebrations"
          >
            <div className="flex items-center gap-3">
              <Button variant="sun" size="sm" onClick={() => fireConfetti()} disabled={!s.celebrations || motionOff}>
                <PartyPopper /> Preview
              </Button>
              <Switch id="celebrations" checked={s.celebrations} onCheckedChange={(v) => set({ celebrations: v })} />
            </div>
          </Row>
        </Section>

        {/* Learning */}
        <Section id="learning" description="How the course unlocks, your daily goal and a little about you.">
          <Block>
            <TileGroup<Settings["learningMode"]>
              legend="Learning mode"
              value={s.learningMode}
              onChange={(v) => set({ learningMode: v })}
              className="sm:grid-cols-2"
              align="start"
              options={[
                { value: "guided", label: "Guided", hint: "Lessons unlock one by one, in order. Recommended for beginners.", icon: <Route /> },
                { value: "free", label: "Free", hint: "Everything is open – jump to any lesson you like.", icon: <LockOpen /> },
              ]}
            />
          </Block>
          <Block>
            <TileGroup<number>
              legend="Daily XP goal"
              hint="Small daily practice beats long weekend sessions."
              value={s.dailyGoalXp}
              onChange={(v) => set({ dailyGoalXp: v })}
              className="grid-cols-2 sm:grid-cols-4"
              options={GOALS.map((g) => ({
                value: g.xp,
                label: g.label,
                hint: g.hint,
                icon: <g.icon />,
                extra: (
                  <span className="inline-flex items-center gap-1 font-display text-xl font-bold">
                    <Zap className="size-4 fill-sun text-sun" aria-hidden /> {g.xp} XP
                  </span>
                ),
              }))}
            />
            <div className="mt-4 rounded-2xl bg-sun-soft px-4 py-3">
              <div className="flex items-center justify-between gap-3 text-sm font-bold">
                <span>Today</span>
                <span className="text-warning">
                  {game.todayXp} / {game.goalXp} XP
                </span>
              </div>
              <ProgressBar value={game.goalPct} tone="sun" size="sm" className="mt-2" label="Today's progress towards your daily goal" />
            </div>
          </Block>
          <Block className="space-y-5">
            <div className="max-w-sm space-y-1.5">
              <Label htmlFor="pname" className="font-display text-base font-semibold">
                Your name
              </Label>
              <Input id="pname" value={p.profile.name ?? ""} onChange={(e) => progress.setProfile({ name: e.target.value })} placeholder="Optional – Hexy uses it to cheer you on" />
            </div>
            <TileGroup<NonNullable<Profile["programming"]>>
              legend="Programming experience"
              value={p.profile.programming ?? ("" as never)}
              onChange={(v) => progress.setProfile({ programming: v })}
              className="grid-cols-1 sm:grid-cols-3"
              options={PROGRAMMING}
            />
            <TileGroup<NonNullable<Profile["statistics"]>>
              legend="Statistics experience"
              value={p.profile.statistics ?? ("" as never)}
              onChange={(v) => progress.setProfile({ statistics: v })}
              className="grid-cols-1 sm:grid-cols-3"
              options={STATS}
            />
          </Block>
        </Section>

        {/* Code editor */}
        <Section id="editor" description="Font, helpers and safety limits for the R code editor.">
          <Row label="Editor font size" htmlFor="ed-size">
            <Select id="ed-size" value={s.editorFontSize} onChange={(e) => set({ editorFontSize: Number(e.target.value) })}>
              {[12, 13, 14, 15, 16, 18, 20].map((n) => (
                <option key={n} value={n}>
                  {n}px
                </option>
              ))}
            </Select>
          </Row>
          <Block className="pt-0">
            <p className="mb-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Preview</p>
            <div style={{ fontSize: s.editorFontSize }}>
              <StaticCode code={PREVIEW_CODE} lineNumbers={s.lineNumbers} className="rounded-2xl border-2 border-border text-[1em]!" />
            </div>
          </Block>
          <Row label="Line numbers" htmlFor="ln">
            <Switch id="ln" checked={s.lineNumbers} onCheckedChange={(v) => set({ lineNumbers: v })} />
          </Row>
          <Row label="Close brackets and quotes automatically" htmlFor="ac">
            <Switch id="ac" checked={s.autoCloseBrackets} onCheckedChange={(v) => set({ autoCloseBrackets: v })} />
          </Row>
          <Row label="Time limit for running code" hint="Code that runs longer is stopped (protects against endless loops)." htmlFor="timeout">
            <Select id="timeout" value={s.runTimeout} onChange={(e) => set({ runTimeout: Number(e.target.value) })}>
              {[10, 20, 30, 60, 120].map((n) => (
                <option key={n} value={n}>
                  {n} seconds
                </option>
              ))}
            </Select>
          </Row>
          <Block className="py-0">
            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-display text-base font-semibold [&::-webkit-details-marker]:hidden">
                <Keyboard className={cn("size-5", INK)} aria-hidden /> Keyboard shortcuts
                <ChevronDown className="ml-auto size-4 transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <div className="mt-3 overflow-x-auto rounded-2xl bg-surface-2/60 px-4 py-1">
                <ShortcutTable />
              </div>
            </details>
          </Block>
        </Section>

        {/* AI tutor */}
        <Section id="tutor" description="How the tutor answers when you open it.">
          <Block>
            <TileGroup<Settings["tutorMode"]>
              legend="Default tutor mode"
              value={s.tutorMode}
              onChange={(v) => set({ tutorMode: v })}
              className="sm:grid-cols-2 xl:grid-cols-3"
              align="start"
              options={MODES.map((m) => {
                const Icon = MODE_ICONS[m.value] ?? Sparkles;
                return { value: m.value, label: m.label, hint: m.desc, icon: <Icon /> };
              })}
            />
          </Block>
          <Block className="space-y-3">
            <p className="flex flex-wrap items-center gap-2 text-sm font-bold">
              Status:
              {ai === null ? (
                <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-muted-foreground">checking…</span>
              ) : ai.configured ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-soft px-2.5 py-0.5 text-success">
                  <span aria-hidden className="size-2 rounded-full bg-mint" /> available{ai.model ? ` (model ${ai.model})` : ""}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sun-soft px-2.5 py-0.5 text-warning">
                  <TriangleAlert className="size-3.5" aria-hidden /> not configured on this server (ANTHROPIC_API_KEY is not set)
                </span>
              )}
            </p>
            <p className="text-xs font-semibold text-muted-foreground">
              Your questions and code are sent to the AI service through this site&apos;s server when you use the tutor or “Explain My Error”. Conversations are stored only in this browser.
            </p>
          </Block>
        </Section>

        {/* R */}
        <Section id="r" description="Real R (webR) runs right here in your browser – nothing to install.">
          <Block className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-surface-2/60 px-4 py-3">
              <span aria-hidden className={cn("size-3 shrink-0 rounded-full", rDot)} />
              <p className="min-w-0 flex-1 text-sm font-semibold" role="status">
                <strong className="font-extrabold">{r.message}</strong>
                {r.status !== "idle" && <span className="text-muted-foreground"> · {r.crossOriginIsolated ? "fast mode (can be interrupted)" : "compatibility mode"}</span>}
              </p>
            </div>
            {r.installed.length > 0 && (
              <div>
                <p className="mb-1.5 text-sm font-bold">Packages installed this session</p>
                <ul className="flex flex-wrap gap-1.5">
                  {r.installed.map((pkg) => (
                    <li key={pkg} className={cn("rounded-full bg-[var(--c-soft)] px-2.5 py-0.5 font-mono text-xs font-bold", INK)}>
                      {pkg}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Button variant="success" onClick={() => void rSession.ensure().catch(() => {})} disabled={r.status === "ready" || r.status === "busy" || r.status === "loading"}>
                <Play /> Start R now
              </Button>
              <Button variant="outline" onClick={() => void rSession.restart().then(() => toast("R restarted", { description: "All variables were cleared." }))}>
                <RotateCcw /> Restart R
              </Button>
            </div>
          </Block>
        </Section>

        <AccountSection />

        {/* Data */}
        <Section id="data" description="Progress, notes, bookmarks and saved code are stored in this browser.">
          <Row label="Export progress" hint="Download a backup file (JSON) with your progress and settings.">
            <Button variant="outline" onClick={exportData}>
              <Download /> Export
            </Button>
          </Row>
          <Row label="Import progress" hint="Restore a backup file – for example to move to another device.">
            <Button variant="outline" onClick={() => file.current?.click()}>
              <Upload /> Import
            </Button>
            <input
              ref={file}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              aria-label="Import progress file"
              tabIndex={-1}
              onChange={(e) =>
                void importData(e.target.files?.[0]).finally(() => {
                  if (file.current) file.current.value = "";
                })
              }
            />
          </Row>
          <Row label="Reset settings" hint="Put every setting on this page back to its default. Your progress is kept.">
            <Button
              variant="outline"
              onClick={() => {
                updateSettings(defaultSettings);
                toast("Settings restored to defaults");
              }}
            >
              <SlidersHorizontal /> Reset settings
            </Button>
          </Row>
          <Block>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-coral/40 bg-coral-soft px-4 py-4">
              <div className="min-w-0 flex-1 basis-56">
                <p className="flex items-center gap-2 font-display text-base font-semibold text-danger">
                  <TriangleAlert className="size-5" aria-hidden /> Danger zone
                </p>
                <p className="mt-0.5 text-sm font-semibold text-muted-foreground">Delete all progress, scores, notes, bookmarks and saved code from this browser.</p>
              </div>
              <Button variant="danger" onClick={() => setConfirmReset(true)}>
                <UserRound /> Reset all progress
              </Button>
            </div>
          </Block>
        </Section>
      </div>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent title="Reset all progress?" description="This deletes completed lessons, scores, notes, bookmarks and saved code from this browser. It cannot be undone – export your progress first if you might want it back.">
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                progress.reset();
                setConfirmReset(false);
                toast("Progress reset");
              }}
            >
              Reset everything
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
