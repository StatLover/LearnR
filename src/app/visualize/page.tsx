import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { VizLab } from "@/components/playground/viz-lab";

export const metadata: Metadata = { title: "Visualization Lab", description: "Pick a dataset and a chart type, get real R plotting code (base R or ggplot2), run it, modify it and export the plot." };

export default function VisualizePage() {
  return (
    <>
      <PageHeader
        icon={<BarChart3 />}
        title="Data Visualization Lab"
        description="Pick a sample dataset and a chart type. R Academy writes the R code for you – in base R or ggplot2 – and runs it. Then change the code to customise the chart, and export the plot as a PNG."
      />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <VizLab />
      </div>
    </>
  );
}
