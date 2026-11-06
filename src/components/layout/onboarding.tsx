"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { progress, useProgress, type Profile } from "@/lib/store/progress";
import { updateSettings } from "@/lib/store/settings";
import { cn } from "@/lib/utils";

const PROGRAMMING: { value: NonNullable<Profile["programming"]>; label: string; hint: string }[] = [
  { value: "none", label: "I have never programmed", hint: "Perfect – we start from zero." },
  { value: "some", label: "I have tried a little coding", hint: "Maybe Excel formulas, Python or a tutorial." },
  { value: "experienced", label: "I already program", hint: "All lessons will be unlocked for you." },
];
const STATS: { value: NonNullable<Profile["statistics"]>; label: string }[] = [
  { value: "none", label: "New to statistics" },
  { value: "some", label: "I know the basics (mean, median…)" },
  { value: "confident", label: "Comfortable with statistics" },
];
const GOALS: { value: NonNullable<Profile["goal"]>; label: string }[] = [
  { value: "study", label: "For my studies" },
  { value: "research", label: "For research" },
  { value: "work", label: "For my job" },
  { value: "career", label: "To change careers" },
  { value: "curiosity", label: "Just curious" },
];

function Choice<T extends string>({ value, current, onSelect, label, hint }: { value: T; current?: T; onSelect: (v: T) => void; label: string; hint?: string }) {
  const on = current === value;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={() => onSelect(value)}
      className={cn(
        "w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors cursor-pointer",
        on ? "border-primary bg-primary-soft" : "border-border hover:bg-surface-2",
      )}
    >
      <span className="font-medium">{label}</span>
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </button>
  );
}

export function Onboarding() {
  const state = useProgress();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Partial<Profile>>({});

  useEffect(() => {
    // Ask once, on the first visit, but never interrupt someone who is already coding.
    const quiet = ["/error-checker", "/playground"].some((x) => pathname.startsWith(x));
    if (state.updatedAt === 0 && !state.profile.onboarded && !quiet) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, [state.updatedAt, state.profile.onboarded, pathname]);

  const finish = (go?: string) => {
    progress.setProfile({ ...p, onboarded: true });
    if (p.programming === "experienced") updateSettings({ learningMode: "free" });
    setOpen(false);
    if (go) router.push(go);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? finish() : setOpen(o))}>
      <DialogContent title={step === 0 ? "Welcome to R Academy!" : step === 1 ? "A little about you" : "You're all set"} description={step === 0 ? "Three quick questions help us suggest where to start. You can change your answers later in Settings." : undefined}>
        {step === 0 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ob-name">What should we call you? (optional)</Label>
              <Input id="ob-name" value={p.name ?? ""} onChange={(e) => setP({ ...p, name: e.target.value })} placeholder="Your first name" />
            </div>
            <fieldset className="space-y-2">
              <legend className="mb-1 text-sm font-medium">Have you programmed before?</legend>
              <div role="radiogroup" className="grid gap-2">
                {PROGRAMMING.map((o) => (
                  <Choice key={o.value} value={o.value} current={p.programming} onSelect={(v) => setP({ ...p, programming: v })} label={o.label} hint={o.hint} />
                ))}
              </div>
            </fieldset>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => finish()}>
                Skip for now
              </Button>
              <Button onClick={() => setStep(1)} disabled={!p.programming}>
                Next
              </Button>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <fieldset className="space-y-2">
              <legend className="mb-1 text-sm font-medium">How familiar are you with statistics?</legend>
              <div role="radiogroup" className="grid gap-2">
                {STATS.map((o) => (
                  <Choice key={o.value} value={o.value} current={p.statistics} onSelect={(v) => setP({ ...p, statistics: v })} label={o.label} />
                ))}
              </div>
            </fieldset>
            <fieldset className="space-y-2">
              <legend className="mb-1 text-sm font-medium">Why are you learning R?</legend>
              <div role="radiogroup" className="grid grid-cols-2 gap-2">
                {GOALS.map((o) => (
                  <Choice key={o.value} value={o.value} current={p.goal} onSelect={(v) => setP({ ...p, goal: v })} label={o.label} />
                ))}
              </div>
            </fieldset>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button onClick={() => setStep(2)}>Next</Button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4 text-sm">
            <p>
              {p.programming === "experienced"
                ? "Since you already program, every lesson is unlocked. Skim Stage 1 quickly or jump straight to the topics you need."
                : p.programming === "some"
                  ? "We suggest starting with Module 1 – it moves quickly – then continuing in order. Lessons unlock as you complete them."
                  : "Start with Module 1, Lesson 1. No installation needed: R runs right here in your browser. Lessons unlock as you complete them."}
            </p>
            <p className="text-muted-foreground">
              {p.statistics === "confident"
                ? "You can move quickly through the descriptive statistics module and focus on the R code."
                : "Statistics is explained from scratch in Modules 7 and 9, always with plain-English interpretations."}
            </p>
            <p className="text-muted-foreground">Your progress is saved in this browser. You can create an optional account in Settings to sync it across devices.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => finish("/learn")}>
                See the learning path
              </Button>
              <Button onClick={() => finish("/learn/what-is-programming")}>Start learning</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
