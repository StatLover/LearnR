import type { Metadata } from "next";
import { Bug } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorChecker } from "@/components/error-checker/error-checker";

export const metadata: Metadata = {
  title: "R Code Error Checker",
  description: "Paste R code, run it in real R, and get a plain-English explanation of the error, where it is and how to fix it – with corrected code that has been run.",
};

export default function ErrorCheckerPage() {
  return (
    <>
      <PageHeader
        icon={<Bug />}
        title="R Code Error Checker"
        description="Paste your R code (or write it here). R Academy runs it in real R inside your browser, finds the line that failed, explains the error in plain English and suggests corrected code – which is only shown as working after R has actually run it."
      />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <ErrorChecker />
      </div>
    </>
  );
}
