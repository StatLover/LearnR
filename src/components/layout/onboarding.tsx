"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Hexy } from "@/components/brand/mascot";
import { progress, useProgress, type Profile } from "@/lib/store/progress";
import { updateSettings } from "@/lib/store/settings";
import { useOutline } from "@/components/game/outline-context";
import { cn } from "@/lib/utils";

const PROGRAMMING: { value: NonNullable<Profile["programming"]>; label: string; hint: string; emoji: string }[] = [
  { value: "none", label: "Brand new to coding", hint: "Perfect – we start from zero.", emoji: "🌱" },
  { value: "some", label: "I've tried a little", hint: "Spreadsheet formulas, a tutorial…", emoji: "🌿" },
  { value: "experienced", label: "I already program", hint: "Every lesson will be unlocked.", emoji: "🌳" },
];
const STATS: { value: NonNullable<Profile["statistics"]>; label: string }[] = [
  { value: "none", label: "New to statistics" },
  { value: "some", label: "I know the basics" },
  { value: "confident", label: "Comfortable with stats" },
];
const GOALS = [
  { xp: 20, label: "Casual", hint: "≈ 5 min a day" },
  { xp: 50, label: "Regular", hint: "≈ 15 min a day" },
  { xp: 100, label: "Serious", hint: "≈ 30 min a day" },
  { xp: 150, label: "Intense", hint: "≈ 45 min a day" },
];

function Choice({ on, onClick, children, className }: { on: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        "press w-full rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold cursor-pointer",
        on ? "border-primary bg-primary-soft [--press-shadow:var(--primary)]" : "border-border bg-surface [--press-shadow:var(--border)] hover:bg-surface-2",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Onboarding() {
  const state = useProgress();
  const pathname = usePathname();
  const router = useRouter();
  const outline = useOutline();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Partial<Profile>>({});
  const [goal, setGoal] = useState(50);
  const first = outline.modules[0]?.lessons[0];

  useEffect(() => {
    // Ask once, on the first visit – but never interrupt someone who is already coding.
    const quiet = ["/error-checker", "/playground", "/learn/"].some((x) => pathname.startsWith(x));
    if (state.updatedAt === 0 && !state.profile.onboarded && !quiet) {
      const t = setTimeout(() => setOpen(true), 700);
      return () => clearTimeout(t);
    }
  }, [state.updatedAt, state.profile.onboarded, pathname]);

  const finish = (go?: string) => {
    progress.setProfile({ ...p, onboarded: true });
    updateSettings({ dailyGoalXp: goal, ...(p.programming === "experienced" ? { learningMode: "free" as const } : {}) });
    setOpen(false);
    if (go) router.push(go);
  };

  const moods = ["wave", "think", "point", "celebrate"] as const;

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? finish() : setOpen(o))}>
      <DialogContent title="Welcome to R Academy" hideTitle className="max-w-md">
        <div className="flex flex-col items-center text-center">
          <Hexy mood={moods[step]} size={92} animate />
          <div className="mt-2 flex gap-1.5" aria-hidden>
            {[0, 1, 2, 3].map((i) => <span key={i} className={cn("h-2 rounded-full transition-all", i === step ? "w-6 bg-primary" : "w-2 bg-surface-3")} />)}
          </div>
        </div>
        {step === 0 && (
          <div className="mt-4 space-y-4">
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold">Hi, I&apos;m Hexy! 👋</h2>
              <p className="mt-1 text-sm text-muted-foreground">I&apos;ll guide you through your R adventure. First – what should I call you?</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ob-name">Your name (optional)</Label>
              <Input id="ob-name" value={p.name ?? ""} onChange={(e) => setP({ ...p, name: e.target.value })} placeholder="e.g. Sam" autoFocus />
            </div>
            <div className="flex justify-between gap-2">
              <Button variant="ghost" onClick={() => finish()}>Skip</Button>
              <Button onClick={() => setStep(1)}>Continue</Button>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="mt-4 space-y-4">
            <h2 className="text-center font-display text-xl font-bold">Have you written code before?</h2>
            <div role="radiogroup" aria-label="Programming experience" className="grid gap-2">
              {PROGRAMMING.map((o) => (
                <Choice key={o.value} on={p.programming === o.value} onClick={() => setP({ ...p, programming: o.value })}>
                  <span className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden>{o.emoji}</span>
                    <span>
                      <span className="block font-display text-base">{o.label}</span>
                      <span className="block text-xs text-muted-foreground">{o.hint}</span>
                    </span>
                  </span>
                </Choice>
              ))}
            </div>
            <fieldset>
              <legend className="mb-2 text-sm font-bold">And statistics?</legend>
              <div role="radiogroup" aria-label="Statistics experience" className="grid grid-cols-3 gap-2">
                {STATS.map((o) => (
                  <Choice key={o.value} on={p.statistics === o.value} onClick={() => setP({ ...p, statistics: o.value })} className="px-2 text-center text-xs">
                    {o.label}
                  </Choice>
                ))}
              </div>
            </fieldset>
            <div className="flex justify-between gap-2">
              <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)} disabled={!p.programming}>Continue</Button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="mt-4 space-y-4">
            <div className="text-center">
              <h2 className="font-display text-xl font-bold">Pick a daily goal</h2>
              <p className="mt-1 text-sm text-muted-foreground">Small daily practice beats long weekend sessions. You can change it anytime.</p>
            </div>
            <div role="radiogroup" aria-label="Daily XP goal" className="grid grid-cols-2 gap-2">
              {GOALS.map((g) => (
                <Choice key={g.xp} on={goal === g.xp} onClick={() => setGoal(g.xp)}>
                  <span className="block font-display text-base">{g.label}</span>
                  <span className="block text-xs text-muted-foreground">{g.xp} XP · {g.hint}</span>
                </Choice>
              ))}
            </div>
            <div className="flex justify-between gap-2">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Continue</Button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="mt-4 space-y-4 text-center">
            <h2 className="font-display text-2xl font-bold">You&apos;re all set{p.name ? `, ${p.name}` : ""}! 🎉</h2>
            <p className="text-sm text-muted-foreground">
              {p.programming === "experienced"
                ? "Every world is unlocked – jump to whatever you need."
                : "Start in World 1: R Explorer. Each lesson is a short adventure: learn, watch the code work, try it, solve a challenge and earn XP."}
            </p>
            <p className="text-xs text-muted-foreground">Your progress is saved in this browser. You can sync it with an optional account in Settings.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button variant="outline" onClick={() => finish("/learn")}>See the map</Button>
              <Button variant="success" onClick={() => finish(first ? `/learn/${first.id}` : "/learn")}>Start lesson 1</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
