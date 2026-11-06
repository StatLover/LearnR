import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Hexy } from "@/components/brand/mascot";
import { LabHub } from "@/components/playground/labs/lab-hub";
import { LabArt } from "@/components/playground/labs/lab-art";
import { labs } from "@/components/playground/labs/lab-list";

export const metadata: Metadata = {
  title: "R Labs",
  description: "Interactive simulations powered by real R: build charts, explore the normal distribution, the Central Limit Theorem, correlation and regression with sliders – and see the R code behind every result.",
};

export default function VisualizePage() {
  return (
    <>
      <PageHeader
        icon={<FlaskConical />}
        color="mint"
        eyebrow="Interactive simulations"
        title="R Labs"
        description="Play with sliders, switches and datasets and watch statistics come alive. Every plot and every number is computed by real R in your browser – and every lab shows you the code, so you can take it to the playground."
        art={<Hexy mood="cool" size={130} animate />}
      />
      <div className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
        <LabHub arts={Object.fromEntries(labs.map((l) => [l.id, <LabArt key={l.id} lab={l} className="block" />]))} />
      </div>
    </>
  );
}
