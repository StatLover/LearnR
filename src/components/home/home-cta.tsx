"use client";
import Link from "next/link";
import { PlayCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { courseCompletion, suggestedNextLesson, useProgress, type Outline } from "@/lib/store/progress";

export function HomeCta({ outline }: { outline: Outline }) {
  const s = useProgress();
  const next = suggestedNextLesson(outline, s);
  const c = courseCompletion(outline, s);
  const first = outline.modules[0]?.lessons[0];
  const target = c.done > 0 && next ? next : first;
  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild size="lg">
        <Link href={target ? `/learn/${target.id}` : "/learn"}>
          <PlayCircle /> {c.done > 0 ? "Continue learning" : "Start learning – it's free"}
        </Link>
      </Button>
      <Button asChild size="lg" variant="outline">
        <Link href="/learn">
          See the learning path <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}
