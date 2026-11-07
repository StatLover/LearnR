"use client";
import Link from "next/link";
import { Map as MapIcon, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOutline } from "@/components/game/outline-context";
import { allOutlineLessons, courseCompletion, suggestedNextLesson, useProgress } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

/** "Start learning" (or "Continue") plus a link to the learning map. */
export function HomeCta({ className, center }: { className?: string; center?: boolean }) {
  const outline = useOutline();
  const s = useProgress();
  const next = suggestedNextLesson(outline, s);
  const c = courseCompletion(outline, s);
  const first = allOutlineLessons(outline)[0];
  const started = c.done > 0 && next;
  const target = started ? next : first;
  return (
    <div className={cn("flex flex-col gap-3", center && "items-center", className)}>
      <div className={cn("flex flex-wrap gap-3", center && "justify-center")}>
        <Button asChild size="xl" variant="success">
          <Link href={target ? `/learn/${target.id}` : "/learn"}>
            <Play className="fill-current" /> {started ? "Continue learning" : "Start Learning"}
          </Link>
        </Button>
        <Button asChild size="xl" variant="outline">
          <Link href="/learn">
            <MapIcon /> Explore the map
          </Link>
        </Button>
      </div>
      <p className="text-sm font-semibold text-muted-foreground">
        {started ? (
          <>
            Up next: <strong className="text-foreground">{next.title}</strong> · {c.done}/{c.total} lessons done
          </>
        ) : (
          "Free · no installation · your first line of R in under a minute"
        )}
      </p>
    </div>
  );
}
