import type { Metadata } from "next";
import { Map as MapIcon } from "lucide-react";
import { modules } from "@/content/curriculum";
import { projects } from "@/content/projects";
import { PageHeader } from "@/components/layout/page-header";
import { FloatingHexes } from "@/components/brand/decor";
import { MapSummary, WorldChips, WorldMap } from "@/components/path/world-map";
import { worlds } from "@/lib/game/worlds";

export const metadata: Metadata = {
  title: "Learning Map",
  description: "Seven worlds take you from your very first line of R to statistics, data projects and intermediate R.",
};

export default function LearnPage() {
  const lessons = modules.reduce((a, m) => a + m.lessons.length, 0);
  const exercises = modules.reduce((a, m) => a + m.exercises.length, 0);
  return (
    <>
      <PageHeader
        icon={<MapIcon />}
        color="mint"
        eyebrow={`${worlds.length} worlds · ${lessons} lessons · ${exercises} challenges · ${projects.length} projects`}
        title="Your learning map"
        description="Travel from your very first line of R to statistics and real data projects. Each node is a short, hands-on lesson – finish one to light up the path to the next. Completed lessons stay open, so you can revisit them anytime."
      >
        <MapSummary />
      </PageHeader>
      <div className="relative">
        <FloatingHexes className="opacity-50" count={9} />
        <div className="relative mx-auto max-w-7xl px-5 py-8">
          <h2 className="sr-only">Worlds</h2>
          <WorldChips />
          <div className="mt-10">
            <WorldMap />
          </div>
        </div>
      </div>
    </>
  );
}
