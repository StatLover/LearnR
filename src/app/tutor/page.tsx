import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { TutorPage } from "@/components/tutor/tutor-page";

export const metadata: Metadata = {
  title: "AI Tutor",
  description: "A personal AI tutor for R: explanations in simple English, line-by-line walkthroughs, debugging help, practice exercises, quizzes and statistics.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        icon={<Sparkles />}
        title="AI R Tutor"
        description="Ask anything about R, your code, or statistics. Pick a mode to change how the tutor helps you. When the tutor shows what code does, it runs that code in your browser first – so you see real output, not guesses."
      />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <TutorPage />
      </div>
    </>
  );
}
