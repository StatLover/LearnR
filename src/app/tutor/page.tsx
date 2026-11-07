import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { TutorHeroArt, TutorPage, TutorStatusChip } from "@/components/tutor/tutor-page";

export const metadata: Metadata = {
  title: "AI Tutor",
  description: "Meet Hexy, your personal AI tutor for R: explanations in simple English, line-by-line walkthroughs, debugging help, practice exercises, quizzes and statistics – with code output that really comes from R.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        icon={<Sparkles />}
        eyebrow="Your AI learning buddy"
        title="Meet Hexy, your R tutor"
        description={
          <>
            <p>Ask anything about R, your code or statistics – in your own words. Hexy explains things simply, gives hints instead of spoilers, and runs code in your browser before showing what it prints, so you see real output, not guesses.</p>
            <TutorStatusChip className="mt-3" />
          </>
        }
        art={<TutorHeroArt />}
      />
      <div className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
        <TutorPage />
      </div>
    </>
  );
}
