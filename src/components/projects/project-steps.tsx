"use client";

import { CheckCircle2, Circle, Trophy } from "lucide-react";
import type { Project } from "@/content/types";
import { ExerciseCard } from "@/components/learn/exercise-card";
import { ProgressBar } from "@/components/ui/progress";
import { Markdown } from "@/components/content/markdown";
import { progress, useProgress } from "@/lib/store/progress";
import { tutor } from "@/lib/ai/tutor-store";
import { useRouter } from "next/navigation";

export function ProjectProgress({ project }: { project: Project }) {
  const s = useProgress();
  const done = project.steps.filter((st) => s.projects[project.id]?.steps[st.id]?.passedAt).length;
  return (
    <div>
      <p className="text-sm font-medium">{done} of {project.steps.length} checkpoints passed</p>
      <ProgressBar value={(done / project.steps.length) * 100} className="mt-1.5" label="Project progress" />
      <ol className="mt-3 space-y-1.5 text-sm">
        {project.steps.map((st, i) => (
          <li key={st.id}>
            <a href={`#step-${st.id}`} className="flex items-start gap-2 hover:text-primary">
              {s.projects[project.id]?.steps[st.id]?.passedAt ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> : <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />}
              {i + 1}. {st.title}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ProjectSteps({ project }: { project: Project }) {
  const s = useProgress();
  const router = useRouter();
  const allDone = project.steps.every((st) => s.projects[project.id]?.steps[st.id]?.passedAt);
  return (
    <div className="space-y-8">
      {project.steps.map((st, i) => {
        const setup = project.steps.slice(0, i).map((p) => p.solution).join("\n\n");
        return (
          <section key={st.id} id={`step-${st.id}`} className="scroll-mt-24" aria-labelledby={`step-title-${st.id}`}>
            <h2 id={`step-title-${st.id}`} className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
              Step {i + 1} of {project.steps.length}
            </h2>
            <ExerciseCard
              kind="project-step"
              task={{ id: `${project.id}:${st.id}`, title: st.title, prompt: st.instructions, starterCode: st.starterCode, hints: st.hints, solution: st.solution, explanation: st.explanation, tests: st.tests }}
              setupCode={setup}
              workspace={`project:${project.id}`}
              savedCode={s.projects[project.id]?.steps[st.id]?.code}
              passed={Boolean(s.projects[project.id]?.steps[st.id]?.passedAt)}
              onCodeChange={(c) => progress.saveProjectCode(project.id, st.id, c)}
              onResult={(ok, code) => progress.recordProjectStep(project.id, project.title, st.id, ok, code)}
              onAskTutor={(code) => {
                tutor.queue(`I'm doing step ${i + 1} ("${st.title}") of the project "${project.title}". Instructions: ${st.instructions}\n\nMy code:\n\`\`\`r\n${code}\n\`\`\`\nPlease give me a hint, not the full solution.`);
                router.push("/tutor");
              }}
              headerExtra={i > 0 ? <span className="text-xs text-muted-foreground">Earlier steps&apos; solutions run first automatically</span> : null}
            />
          </section>
        );
      })}
      <section aria-labelledby="wrap-up" className="rounded-xl border border-border bg-card p-5">
        <h2 id="wrap-up" className="flex items-center gap-2 text-xl font-bold">
          <Trophy className="size-5 text-primary" /> {allDone ? "Project complete – congratulations!" : "Wrapping up"}
        </h2>
        <div className="mt-2">
          <Markdown>{project.wrapUp}</Markdown>
        </div>
      </section>
    </div>
  );
}
