import type { Metadata } from "next";
import { BookA } from "lucide-react";
import { glossary } from "@/content/glossary";
import { PageHeader } from "@/components/layout/page-header";
import { GlossaryList } from "@/components/reference/glossary-list";

export const metadata: Metadata = { title: "Glossary", description: "A beginner-friendly dictionary of programming, R, data and statistics terms – in plain English with short R examples." };

export default function GlossaryPage() {
  return (
    <>
      <PageHeader icon={<BookA />} title="Glossary" description={`${glossary.length} programming, R, data and statistics terms explained in plain English, most with a short R example.`} />
      <div className="mx-auto max-w-6xl px-4 py-8"><GlossaryList terms={glossary} /></div>
    </>
  );
}
