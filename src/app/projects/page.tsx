import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";
import { projects } from "@/content/projects";
import { PageHeader } from "@/components/layout/page-header";
import { Hexy } from "@/components/brand/mascot";
import { HexBadge } from "@/components/game/hex-badge";
import { BossProjectCard, ProjectCard } from "@/components/projects/project-card";
import { LEVELS } from "@/components/projects/project-meta";
import { ProjectsOverview } from "@/components/projects/project-progress";
import { XP } from "@/lib/game/xp";

export const metadata: Metadata = {
  title: "Projects",
  description: "Guided real-world R data projects with sample datasets, automatic checkpoints and solutions – finishing with a capstone exploratory data analysis.",
};

const HOW = [
  { n: 1, title: "Read the brief", text: "Meet the dataset and the question you will answer.", color: "var(--sky)" },
  { n: 2, title: "Solve each step", text: `Write R code – it is checked automatically. +${XP.projectStep} XP per step.`, color: "var(--grape)" },
  { n: 3, title: "Finish the quest", text: `Pass every step for a +${XP.projectComplete} XP completion bonus.`, color: "var(--mint)" },
];

const LEVEL_ICON = { beginner: "play", intermediate: "mountain", capstone: "crown" } as const;

export default function ProjectsPage() {
  const levels = (["beginner", "intermediate", "capstone"] as const).map((level) => ({ level, list: projects.filter((p) => p.level === level) })).filter((g) => g.list.length);
  return (
    <>
      <PageHeader
        icon={<FolderKanban />}
        color="tangerine"
        eyebrow="Data quests"
        title="Real-world data projects"
        description="Put your skills together on realistic datasets. Each project is a quest of small steps with clear instructions, hints, automatic checkpoints and an explained solution – ending with the capstone: a complete exploratory data analysis."
        art={<Hexy mood="point" size={124} animate />}
      />
      <div className="mx-auto max-w-7xl space-y-10 px-5 py-8">
        <div className="space-y-4">
          <ProjectsOverview projects={projects.map((p) => ({ id: p.id, stepIds: p.steps.map((s) => s.id) }))} />
          <ol className="grid gap-3 sm:grid-cols-3" aria-label="How a project works">
            {HOW.map((h) => (
              <li key={h.n} className="flex gap-3 rounded-2xl border-2 border-dashed border-border bg-card/60 px-4 py-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full font-display text-sm font-bold text-white" style={{ background: h.color }} aria-hidden>
                  {h.n}
                </span>
                <span>
                  <span className="block font-display font-semibold leading-tight">{h.title}</span>
                  <span className="block text-xs font-semibold text-muted-foreground">{h.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {projects.length === 0 && <p className="text-muted-foreground">Projects are being prepared.</p>}

        {levels.map(({ level, list }) => (
          <section key={level} aria-labelledby={`level-${level}`}>
            <div className="mb-4 flex items-center gap-3">
              <HexBadge icon={LEVEL_ICON[level]} color={LEVELS[level].color} size={44} />
              <div>
                <h2 id={`level-${level}`} className="font-display text-2xl font-bold tracking-tight">
                  {LEVELS[level].title}
                </h2>
                <p className="text-sm font-semibold text-muted-foreground">{LEVELS[level].blurb}</p>
              </div>
            </div>
            {level === "capstone" ? (
              <ul className="grid gap-5">
                {list.map((p) => (
                  <li key={p.id}>
                    <BossProjectCard p={p} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((p) => (
                  <li key={p.id}>
                    <ProjectCard p={p} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
