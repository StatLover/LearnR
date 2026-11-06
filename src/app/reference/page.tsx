import type { Metadata } from "next";
import { Library } from "lucide-react";
import { rFunctions } from "@/content/functions";
import { PageHeader } from "@/components/layout/page-header";
import { FunctionSearch } from "@/components/reference/function-search";

export const metadata: Metadata = { title: "R Function Reference", description: "A searchable, beginner-friendly reference of commonly used R functions with syntax, arguments, examples, output and common mistakes." };

export default function ReferencePage() {
  const categories = [...new Set(rFunctions.map((f) => f.category))];
  return (
    <>
      <PageHeader icon={<Library />} title="R Function Reference" description="Beginner-friendly documentation for the R functions you will use most. Every entry explains the purpose, syntax and arguments, and has a runnable example with its real output, common mistakes and related functions." />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <FunctionSearch functions={rFunctions.map(({ name, package: pkg, category, purpose, syntax }) => ({ name, package: pkg, category, purpose, syntax }))} categories={categories} />
      </div>
    </>
  );
}
