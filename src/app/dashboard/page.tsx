import type { Metadata } from "next";
import { LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Dashboard } from "@/components/dashboard/dashboard";
import { getOutline } from "@/content/outline";
import { allLessons } from "@/content/curriculum";

export const metadata: Metadata = { title: "Dashboard", description: "Your R Academy progress: completion, quiz scores, exercises, streaks, achievements, saved code and bookmarks." };

export default function DashboardPage() {
  const conceptLessons: Record<string, { id: string; title: string }> = {};
  for (const l of allLessons) for (const c of l.concepts ?? []) if (!conceptLessons[c]) conceptLessons[c] = { id: l.id, title: l.title };
  const lessonTitles = Object.fromEntries(allLessons.map((l) => [l.id, l.title]));
  return (
    <>
      <PageHeader icon={<LayoutDashboard />} title="Your Dashboard" description="Your learning progress at a glance. Progress is saved in this browser; create an optional account in Settings to sync it across devices." />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Dashboard outline={getOutline()} conceptLessons={conceptLessons} lessonTitles={lessonTitles} />
      </div>
    </>
  );
}
