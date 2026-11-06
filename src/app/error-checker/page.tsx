import type { Metadata } from "next";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorChecker } from "@/components/error-checker/error-checker";
import { DetectiveHexy } from "@/components/error-checker/detective-hexy";

export const metadata: Metadata = {
  title: "R Error Detective",
  description: "Paste R code, run it in real R, and crack the case: the error type, R's exact message, the line where it happened, why, and corrected code that has really been run.",
};

export default function ErrorCheckerPage() {
  return (
    <>
      <PageHeader
        icon={<Search />}
        color="coral"
        eyebrow="Debugging · solve the case"
        title="R Error Detective"
        description="Every bug leaves clues. Paste your R code and Hexy runs it in real R inside your browser, finds the exact line, explains the error in plain English and suggests corrected code – shown as working only after R has actually run it."
        art={<DetectiveHexy mood="point" size={130} animate className="mr-6" />}
      />
      <div className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
        <ErrorChecker />
      </div>
    </>
  );
}
