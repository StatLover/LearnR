import { CodeRunner } from "@/components/code/code-runner";
export default function P() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <CodeRunner workspace="playground" initialCode={'x <- c(10, 20, 30)\nmean(x)\nhist(rnorm(100))\nhead(read.csv("data/students.csv"))'} />
    </div>
  );
}
