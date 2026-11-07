import type { Metadata } from "next";
import { BookA } from "lucide-react";
import { glossary } from "@/content/glossary";
import { PageHeader } from "@/components/layout/page-header";
import { Hexy } from "@/components/brand/mascot";
import { GlossaryList } from "@/components/reference/glossary-list";

export const metadata: Metadata = { title: "Glossary", description: "A beginner-friendly dictionary of programming, R, data and statistics terms – in plain English with short R examples." };

export default function GlossaryPage() {
  return (
    <>
      <PageHeader
        icon={<BookA />}
        color="pink"
        eyebrow={`Dictionary · ${glossary.length} terms`}
        title="Glossary"
        description="Programming, R, data and statistics words explained in plain English – most with a tiny R example you can copy. Stuck on a word in a lesson? It's in here."
        art={<Hexy mood="think" size={120} />}
      />
      <div className="mx-auto max-w-6xl px-5 py-8 sm:py-10">
        <GlossaryList terms={glossary} />
      </div>
    </>
  );
}
