"use client";

import { Check, PartyPopper, Trophy, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Project } from "@/content/types";
import { ExerciseCard } from "@/components/learn/exercise-card";
import { Markdown } from "@/components/content/markdown";
import { Hexy } from "@/components/brand/mascot";
import { FloatingHexes } from "@/components/brand/decor";
import { progress, useProgress } from "@/lib/store/progress";
import { tutor } from "@/lib/ai/tutor-store";
import { XP } from "@/lib/game/xp";
import { cn } from "@/lib/utils";
import { projectStatus } from "./project-progress";
import { projectXp } from "./project-meta";

/** A numbered node on the quest path. */
function StepNode({ n, state, small }: { n: number; state: "done" | "current" | "todo"; small?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative z-10 grid shrink-0 place-items-center rounded-full font-display font-bold",
        small ? "size-8 text-base" : "size-12 text-xl",
        state === "done" && "bg-mint text-white shadow-[0_4px_0_var(--mint-shadow)]",
        state === "current" && "animate-pulse-ring border-[3px] border-primary bg-card text-primary [--node-color:var(--primary)]",
        state === "todo" && "border-[3px] border-border-strong bg-surface-2 text-muted-foreground",
      )}
    >
      {state === "done" ? <Check className={small ? "size-4" : "size-6"} strokeWidth={3.5} /> : n}
    </span>
  );
}

/**
 * The project's steps as a vertical "quest path": numbered nodes joined by a
 * line (filled in as steps are passed), each with its exercise card, ending
 * in the wrap-up.
 */
export function ProjectSteps({ project }: { project: Project }) {
  const s = useProgress();
  const router = useRouter();
  const st = projectStatus(
    s,
    project.id,
    project.steps.map((x) => x.id),
  );
  const allDone = st.complete;
  return (
    <ol className="relative" aria-label="Project steps">
      {project.steps.map((step, i) => {
        const setup = project.steps
          .slice(0, i)
          .map((p) => p.solution)
          .join("\n\n");
        const passed = Boolean(s.projects[project.id]?.steps[step.id]?.passedAt);
        const state = passed ? "done" : step.id === st.next ? "current" : "todo";
        return (
          <li key={step.id} id={`step-${step.id}`} className="relative grid scroll-mt-24 grid-cols-1 gap-5 pb-10 sm:grid-cols-[3rem_minmax(0,1fr)]">
            {/* connector to the next node (on phones the cards use the full width instead) */}
            <span aria-hidden className="absolute left-6 top-14 bottom-0 hidden w-1.5 -translate-x-1/2 rounded-full sm:block" style={{ background: passed ? "var(--mint)" : "var(--surface-3)" }} />
            <div className="hidden justify-center sm:flex">
              <StepNode n={i + 1} state={state} />
            </div>
            <section aria-labelledby={`step-title-${step.id}`} className="min-w-0">
              <h2 id={`step-title-${step.id}`} className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-sm font-semibold uppercase tracking-wider sm:min-h-12">
                <span className="sm:hidden">
                  <StepNode n={i + 1} state={state} small />
                </span>
                <span className={state === "todo" ? "text-muted-foreground" : passed ? "text-success" : "text-primary"}>
                  Step {i + 1} of {project.steps.length}
                </span>
                {passed && <span className="rounded-full bg-mint-soft px-2 py-0.5 text-[11px] text-success">Passed</span>}
                {state === "current" && <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] text-primary">You are here</span>}
              </h2>
              <ExerciseCard
                kind="project-step"
                task={{ id: `${project.id}:${step.id}`, title: step.title, prompt: step.instructions, starterCode: step.starterCode, hints: step.hints, solution: step.solution, explanation: step.explanation, tests: step.tests }}
                setupCode={setup}
                workspace={`project:${project.id}`}
                savedCode={s.projects[project.id]?.steps[step.id]?.code}
                passed={passed}
                onCodeChange={(c) => progress.saveProjectCode(project.id, step.id, c)}
                onResult={(ok, code) => progress.recordProjectStep(project.id, project.title, step.id, ok, code)}
                onAskTutor={(code) => {
                  tutor.queue(`I'm doing step ${i + 1} ("${step.title}") of the project "${project.title}". Instructions: ${step.instructions}\n\nMy code:\n\`\`\`r\n${code}\n\`\`\`\nPlease give me a hint, not the full solution.`);
                  router.push("/tutor");
                }}
                headerExtra={i > 0 ? <span className="text-xs font-semibold text-muted-foreground">Earlier steps&apos; solutions run first automatically</span> : null}
              />
            </section>
          </li>
        );
      })}

      {/* the finish: wrap-up */}
      <li id="wrap-up" className="relative grid scroll-mt-24 grid-cols-1 gap-5 sm:grid-cols-[3rem_minmax(0,1fr)]">
        <div className="hidden justify-center sm:flex">
          <span
            aria-hidden
            className={cn(
              "relative z-10 grid size-12 place-items-center rounded-full",
              allDone ? "bg-sun text-[#3b2600] shadow-[0_4px_0_var(--sun-shadow)]" : "border-[3px] border-dashed border-border-strong bg-surface-2 text-muted-foreground",
            )}
          >
            <Trophy className="size-6" />
          </span>
        </div>
        <section
          aria-labelledby="wrap-up-title"
          className={cn("relative overflow-hidden rounded-3xl border-2 p-5 shadow-[var(--shadow-card)] sm:p-6", allDone ? "border-sun" : "border-border bg-card")}
          style={allDone ? { background: "linear-gradient(135deg, var(--sun-soft) 0%, var(--mint-soft) 60%, var(--card) 100%)" } : undefined}
        >
          {allDone && <FloatingHexes count={7} className="opacity-70" />}
          <div className="relative">
            <div role="status" className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Hexy mood={allDone ? "celebrate" : "think"} size={allDone ? 104 : 80} className="shrink-0" animate={allDone} />
              <div className="min-w-0">
                {allDone && (
                  <p className="flex items-center gap-1.5 font-display text-sm font-semibold uppercase tracking-wider text-success">
                    <PartyPopper className="size-4" aria-hidden /> Quest complete
                  </p>
                )}
                <h2 id="wrap-up-title" className="font-display text-2xl font-bold">
                  {allDone ? "Project complete – congratulations!" : "Wrapping up"}
                </h2>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  {allDone ? (
                    <>
                      You passed all {project.steps.length} steps and earned{" "}
                      <span className="inline-flex items-center gap-0.5 font-bold text-warning">
                        <Zap className="size-3.5 fill-current" aria-hidden />
                        {projectXp(project.steps.length)} XP
                      </span>{" "}
                      including the +{XP.projectComplete} XP completion bonus. That is real data analysis – well done!
                    </>
                  ) : (
                    `Pass all ${project.steps.length} steps to finish the quest and unlock the +${XP.projectComplete} XP completion bonus. ${st.done} down, ${project.steps.length - st.done} to go!`
                  )}
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border-2 border-border bg-card/80 p-4">
              <Markdown>{project.wrapUp}</Markdown>
            </div>
          </div>
        </section>
      </li>
    </ol>
  );
}
