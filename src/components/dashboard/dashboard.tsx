"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookmark, BookOpen, CalendarDays, CalendarCheck, CheckCircle2, Code2, Dumbbell, Flame, Flag, FolderKanban, Mountain, NotebookPen, Play, PlayCircle, Search, Star, Bug, Target, Trash2, Trophy, TrendingUp, Award, FolderOpen, RefreshCw } from "lucide-react";

const ACH_ICONS: Record<string, typeof Award> = {
  play: Play, "book-open": BookOpen, flame: Flame, "check-circle": CheckCircle2, dumbbell: Dumbbell, mountain: Mountain, star: Star,
  flag: Flag, bug: Bug, trophy: Trophy, search: Search, calendar: CalendarDays, "calendar-check": CalendarCheck,
};
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StaticCode } from "@/components/code/static-code";
import { openInPlayground } from "@/components/code/code-block";
import {
  achievements,
  allOutlineLessons,
  courseCompletion,
  currentStreak,
  longestStreak,
  moduleCompletion,
  progress,
  suggestedNextLesson,
  useProgress,
  weakConcepts,
  type Outline,
} from "@/lib/store/progress";
import { useSettings } from "@/lib/store/settings";
import { cn, plural, timeAgo, todayKey } from "@/lib/utils";
import { useRouter } from "next/navigation";

function Stat({ icon: Icon, label, value, sub }: { icon: typeof Flame; label: string; value: string | number; sub?: string }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </Card>
  );
}

function ActivityCalendar({ days }: { days: string[] }) {
  const set = new Set(days);
  const cells: { key: string; on: boolean }[] = [];
  const d = new Date();
  d.setDate(d.getDate() - 7 * 12 + 1);
  for (let i = 0; i < 7 * 12; i++) {
    const k = todayKey(d);
    cells.push({ key: k, on: set.has(k) });
    d.setDate(d.getDate() + 1);
  }
  return (
    <div>
      <div className="grid grid-flow-col grid-rows-7 gap-1" role="img" aria-label={`Learning activity over the last 12 weeks: active on ${cells.filter((c) => c.on).length} days`}>
        {cells.map((c) => (
          <span key={c.key} title={c.key} className={cn("size-3 rounded-sm", c.on ? "bg-primary" : "bg-surface-2")} />
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Last 12 weeks – each square is a day you learned.</p>
    </div>
  );
}

export function Dashboard({ outline, conceptLessons, lessonTitles }: { outline: Outline; conceptLessons: Record<string, { id: string; title: string }>; lessonTitles: Record<string, string> }) {
  const s = useProgress();
  const settings = useSettings();
  const router = useRouter();
  const [openSnippet, setOpenSnippet] = useState<string | null>(null);
  const completion = courseCompletion(outline, s);
  const next = suggestedNextLesson(outline, s);
  const lessons = allOutlineLessons(outline);
  const currentModule = next ? outline.modules.find((m) => m.number === next.module) : outline.modules[outline.modules.length - 1];
  const exercisesPassed = Object.values(s.exercises).filter((e) => e.passedAt).length;
  const totalExercises = outline.modules.reduce((a, m) => a + m.exercises.length, 0);
  const quizScores = lessons.filter((l) => s.lessons[l.id]?.quizBest !== undefined).map((l) => ({ l, best: s.lessons[l.id]!.quizBest! }));
  const avgQuiz = quizScores.length ? Math.round((quizScores.reduce((a, q) => a + q.best, 0) / quizScores.length) * 100) : null;
  const weak = weakConcepts(s).filter((w) => conceptLessons[w.concept]).slice(0, 4);
  const streak = currentStreak(s.activityDays);
  const earned = achievements.filter((a) => s.achievements[a.id]);
  const notes = Object.entries(s.notes).sort((a, b) => b[1].updatedAt - a[1].updatedAt);
  const greeting = s.profile.name ? `Welcome back, ${s.profile.name}!` : completion.done ? "Welcome back!" : "Welcome to R Academy!";

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center gap-6 p-6">
        <ProgressRing value={completion.pct} size={92} label={`Course ${completion.pct}% complete`} />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold">{greeting}</h2>
          <p className="mt-1 text-muted-foreground">
            {completion.done} of {completion.total} lessons completed.
            {currentModule && next ? (
              <>
                {" "}You are in <strong>Module {currentModule.number}: {currentModule.title}</strong>.
              </>
            ) : null}
          </p>
          {next ? (
            <p className="mt-1 text-sm">
              Suggested next lesson: <Link href={`/learn/${next.id}`} className="font-medium text-accent underline">{next.title}</Link>
            </p>
          ) : (
            <p className="mt-1 text-sm text-success">You have completed every lesson – try the capstone project!</p>
          )}
        </div>
        {next && (
          <Button asChild size="lg">
            <Link href={`/learn/${next.id}`}>
              <PlayCircle /> Continue Learning
            </Link>
          </Button>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={Flame} label="Day learning streak" value={streak} sub={`Longest: ${plural(longestStreak(s.activityDays), "day")}`} />
        <Stat icon={CheckCircle2} label="Lessons completed" value={completion.done} sub={`of ${completion.total}`} />
        <Stat icon={Dumbbell} label="Exercises passed" value={exercisesPassed} sub={`of ${totalExercises}`} />
        <Stat icon={Target} label="Average quiz score" value={avgQuiz === null ? "–" : `${avgQuiz}%`} sub={`${quizScores.length} quizzes taken`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 font-semibold"><TrendingUp className="size-5 text-primary" /> Progress by module</h2>
          <ul className="space-y-3">
            {outline.modules.map((m) => {
              const c = moduleCompletion(m, s);
              const cp = s.checkpoints[String(m.number)];
              return (
                <li key={m.number} className="grid items-center gap-2 sm:grid-cols-[1fr_200px_90px]">
                  <Link href={`/learn/module/${m.id}`} className="truncate text-sm hover:text-primary">
                    <span className="text-muted-foreground">{m.number}.</span> {m.title}
                  </Link>
                  <ProgressBar value={c.pct} label={`Module ${m.number}: ${c.pct}%`} />
                  <span className="text-xs text-muted-foreground">
                    {c.done}/{c.total} {cp?.passedAt ? "· ✓ checkpoint" : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card className="p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold"><CalendarDays className="size-5 text-primary" /> Activity</h2>
          <ActivityCalendar days={s.activityDays} />
          <p className="mt-4 text-sm">
            Daily goal: <strong>{settings.dailyGoalMinutes} minutes</strong>. {streak > 0 ? "Keep your streak going!" : "Study today to start a streak."}
          </p>
        </Card>
      </div>

      {weak.length > 0 && (
        <Card className="border-warning/40 p-5">
          <h2 className="mb-1 flex items-center gap-2 font-semibold"><RefreshCw className="size-5 text-warning" /> Suggested revision</h2>
          <p className="mb-3 text-sm text-muted-foreground">Based on your quiz answers, these topics could use another look. Everyone needs a second pass sometimes!</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {weak.map((w) => (
              <li key={w.concept}>
                <Link href={`/learn/${conceptLessons[w.concept].id}`} className="flex items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm hover:bg-surface">
                  <span>
                    <span className="block font-medium capitalize">{w.concept.replace(/-/g, " ")}</span>
                    <span className="block text-xs text-muted-foreground">Review: {conceptLessons[w.concept].title}</span>
                  </span>
                  <Badge variant="warning">{w.wrong} missed</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-3 flex items-center gap-2 font-semibold"><BookOpen className="size-5 text-primary" /> Recently visited</h2>
          {s.recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing yet – <Link href="/learn" className="text-accent underline">start your first lesson</Link>.</p>
          ) : (
            <ul className="space-y-1">
              {s.recent.slice(0, 8).map((r) => (
                <li key={`${r.kind}-${r.id}`}>
                  <Link href={r.href} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-surface-2">
                    {r.kind === "lesson" ? <BookOpen className="size-4 text-muted-foreground" /> : r.kind === "exercise" ? <Dumbbell className="size-4 text-muted-foreground" /> : <FolderKanban className="size-4 text-muted-foreground" />}
                    <span className="min-w-0 flex-1 truncate">{r.title}</span>
                    <span className="text-xs text-muted-foreground">{timeAgo(r.at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="p-5">
          <h2 className="mb-3 flex items-center gap-2 font-semibold"><Target className="size-5 text-primary" /> Quiz scores</h2>
          {quizScores.length === 0 ? (
            <p className="text-sm text-muted-foreground">Take the quiz at the end of a lesson to see your scores here.</p>
          ) : (
            <ul className="space-y-2">
              {quizScores.slice(-8).map(({ l, best }) => (
                <li key={l.id} className="grid grid-cols-[1fr_120px_40px] items-center gap-2 text-sm">
                  <Link href={`/learn/${l.id}#quiz`} className="truncate hover:text-primary">{l.title}</Link>
                  <ProgressBar value={best * 100} tone={best >= 0.7 ? "primary" : "accent"} label={`${l.title} quiz: ${Math.round(best * 100)}%`} />
                  <span className="text-right text-xs text-muted-foreground">{Math.round(best * 100)}%</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="mb-3 flex items-center gap-2 font-semibold"><Trophy className="size-5 text-primary" /> Achievements <span className="text-sm font-normal text-muted-foreground">({earned.length} of {achievements.length})</span></h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {achievements.map((a) => {
            const on = Boolean(s.achievements[a.id]);
            const Icon = ACH_ICONS[a.icon] ?? Award;
            return (
              <li key={a.id} className={cn("rounded-xl border p-3 text-center", on ? "border-primary/40 bg-primary-soft/50" : "border-border opacity-60")}>
                <Icon className={cn("mx-auto size-6", on ? "text-primary" : "text-muted-foreground")} aria-hidden />
                <p className="mt-1.5 text-sm font-semibold">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.description}</p>
                <p className="mt-1 text-[11px] font-medium">{on ? `Earned ${new Date(s.achievements[a.id]).toLocaleDateString()}` : "Not yet earned"}</p>
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-3 flex items-center gap-2 font-semibold"><Code2 className="size-5 text-primary" /> Saved code examples ({s.snippets.length})</h2>
          {s.snippets.length === 0 ? (
            <p className="text-sm text-muted-foreground">Use the save button (or Ctrl+S) in any code editor to keep code here.</p>
          ) : (
            <ul className="space-y-2">
              {s.snippets.slice(0, 10).map((sn) => (
                <li key={sn.id} className="rounded-lg border border-border">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <button className="min-w-0 flex-1 truncate text-left text-sm font-medium hover:text-primary cursor-pointer" onClick={() => setOpenSnippet(openSnippet === sn.id ? null : sn.id)} aria-expanded={openSnippet === sn.id}>
                      {sn.title}
                    </button>
                    <span className="text-xs text-muted-foreground">{timeAgo(sn.updatedAt)}</span>
                    <Button size="icon-sm" variant="ghost" aria-label={`Open ${sn.title} in the playground`} onClick={() => { openInPlayground(sn.code); router.push("/playground"); }}><FolderOpen /></Button>
                    <Button size="icon-sm" variant="ghost" aria-label={`Delete ${sn.title}`} onClick={() => progress.deleteSnippet(sn.id)}><Trash2 /></Button>
                  </div>
                  {openSnippet === sn.id && <StaticCode code={sn.code} className="border-t border-border" />}
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="p-5">
          <h2 className="mb-3 flex items-center gap-2 font-semibold"><Bookmark className="size-5 text-primary" /> Bookmarks ({s.bookmarks.length})</h2>
          {s.bookmarks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Bookmark lessons, examples, projects and functions to find them here.</p>
          ) : (
            <ul className="space-y-1">
              {s.bookmarks.map((b) => (
                <li key={b.id} className="flex items-center gap-2">
                  <Link href={b.href} className="min-w-0 flex-1 truncate rounded-md px-2 py-1.5 text-sm hover:bg-surface-2">{b.title}</Link>
                  <Badge variant="outline">{b.kind}</Badge>
                  <Button size="icon-sm" variant="ghost" aria-label={`Remove bookmark ${b.title}`} onClick={() => progress.toggleBookmark(b)}><Trash2 /></Button>
                </li>
              ))}
            </ul>
          )}
          {notes.length > 0 && (
            <>
              <h3 className="mb-2 mt-5 flex items-center gap-2 text-sm font-semibold"><NotebookPen className="size-4 text-primary" /> My lesson notes</h3>
              <ul className="space-y-1">
                {notes.map(([id, n]) => (
                  <li key={id}>
                    <Link href={`/learn/${id}`} className="block rounded-md px-2 py-1.5 text-sm hover:bg-surface-2">
                      <span className="font-medium">{lessonTitles[id] ?? id}</span>
                      <span className="block truncate text-xs text-muted-foreground">{n.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
