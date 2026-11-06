import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { LabHero } from "@/components/playground/labs/lab-hero";
import { getLab, labs } from "@/components/playground/labs/lab-list";
import { VizLab } from "@/components/playground/viz-lab";
import { NormalLab } from "@/components/playground/labs/normal-lab";
import { CltLab } from "@/components/playground/labs/clt-lab";
import { CorrelationLab } from "@/components/playground/labs/correlation-lab";
import { RegressionLab } from "@/components/playground/labs/regression-lab";

const LAB_COMPONENTS: Record<string, ComponentType> = {
  "chart-builder": VizLab,
  normal: NormalLab,
  clt: CltLab,
  correlation: CorrelationLab,
  regression: RegressionLab,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return labs.map((l) => ({ lab: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ lab: string }> }): Promise<Metadata> {
  const { lab } = await params;
  const info = getLab(lab);
  return info ? { title: `${info.title} – R Labs`, description: info.description } : {};
}

export default async function LabPage({ params }: { params: Promise<{ lab: string }> }) {
  const { lab } = await params;
  const info = getLab(lab);
  const Lab = LAB_COMPONENTS[lab];
  if (!info || !Lab) notFound();
  return (
    <>
      <LabHero lab={info} />
      <div className="mx-auto max-w-7xl px-5 py-6 sm:py-8">
        <Lab />
      </div>
    </>
  );
}
