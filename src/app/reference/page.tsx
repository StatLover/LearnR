import type { Metadata } from "next";
import { Library } from "lucide-react";
import { rFunctions } from "@/content/functions";
import { PageHeader } from "@/components/layout/page-header";
import { FunctionSearch } from "@/components/reference/function-search";
import { CardFan } from "@/components/reference/card-fan";

export const metadata: Metadata = { title: "R Function Reference", description: "A searchable, beginner-friendly reference of commonly used R functions with syntax, arguments, examples, output and common mistakes." };

export default function ReferencePage() {
  const categories = [...new Set(rFunctions.map((f) => f.category))];
  return (
    <>
      <PageHeader
        icon={<Library />}
        color="grape"
        eyebrow={`Function library · ${rFunctions.length} cards`}
        title="R Function Reference"
        description="Flip through the R functions you will use most. Every card explains what the function does, how to call it and its arguments – with a runnable example, the real output, common mistakes and related functions."
        art={<CardFan />}
      />
      <div className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
        <FunctionSearch
          functions={rFunctions.map(({ name, package: pkg, category, purpose, syntax }, i) => ({ name, package: pkg, category, purpose, syntax, no: i + 1 }))}
          categories={categories}
        />
      </div>
    </>
  );
}
