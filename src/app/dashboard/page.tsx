import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/dashboard";
import { allLessons } from "@/content/curriculum";

export const metadata: Metadata = {
  title: "My Adventure",
  description: "Your R Academy dashboard: XP, level, streak, daily goal, world progress, badges, quiz scores, saved code and bookmarks.",
};

export default function DashboardPage() {
  const conceptLessons: Record<string, { id: string; title: string }> = {};
  for (const l of allLessons) for (const c of l.concepts ?? []) if (!conceptLessons[c]) conceptLessons[c] = { id: l.id, title: l.title };
  const lessonTitles = Object.fromEntries(allLessons.map((l) => [l.id, l.title]));
  return <Dashboard conceptLessons={conceptLessons} lessonTitles={lessonTitles} />;
}
