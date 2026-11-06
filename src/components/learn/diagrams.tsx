/* Theme-aware SVG illustrations used in lessons. Colours come from CSS variables. */
import type { DiagramName } from "@/content/types";
import type { ReactNode } from "react";

const C = {
  fg: "var(--foreground)",
  muted: "var(--muted-foreground)",
  border: "var(--border)",
  card: "var(--card)",
  green: "var(--primary)",
  greenSoft: "var(--primary-soft)",
  blue: "var(--accent)",
  blueSoft: "var(--accent-soft)",
  warn: "var(--warning)",
  warnSoft: "var(--warning-soft)",
  danger: "var(--danger)",
  dangerSoft: "var(--danger-soft)",
  surface: "var(--surface-2)",
};
const MONO = "var(--font-mono)";

function Svg({ w, h, title, children }: { w: number; h: number; title: string; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={title} className="h-auto w-full" style={{ fontFamily: "var(--font-sans)" }}>
      <title>{title}</title>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill={C.muted} />
        </marker>
      </defs>
      {children}
    </svg>
  );
}
function Box({ x, y, w, h, fill = C.card, stroke = C.border, r = 10, children }: { x: number; y: number; w: number; h: number; fill?: string; stroke?: string; r?: number; children?: ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {children}
    </g>
  );
}
function T({ x, y, children, size = 14, mono, weight, fill = C.fg, anchor = "middle" }: { x: number; y: number; children: ReactNode; size?: number; mono?: boolean; weight?: number; fill?: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} fontSize={size} textAnchor={anchor} dominantBaseline="middle" fill={fill} fontWeight={weight} style={mono ? { fontFamily: MONO } : undefined}>
      {children}
    </text>
  );
}
function Arrow({ x1, y1, x2, y2, dashed }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.muted} strokeWidth={1.8} markerEnd="url(#arr)" strokeDasharray={dashed ? "5 4" : undefined} />;
}
function Cells({ x, y, values, w = 56, h = 40, fill = C.greenSoft, index = true, highlight = [] as number[] }: { x: number; y: number; values: string[]; w?: number; h?: number; fill?: string; index?: boolean; highlight?: number[] }) {
  return (
    <g>
      {values.map((v, i) => (
        <g key={i}>
          <rect x={x + i * w} y={y} width={w} height={h} fill={highlight.includes(i + 1) ? C.blueSoft : fill} stroke={highlight.includes(i + 1) ? C.blue : C.border} strokeWidth={1.5} />
          <T x={x + i * w + w / 2} y={y + h / 2} mono>
            {v}
          </T>
          {index && (
            <T x={x + i * w + w / 2} y={y + h + 14} size={12} mono fill={C.muted}>
              [{i + 1}]
            </T>
          )}
        </g>
      ))}
    </g>
  );
}

function Flow({ title, steps }: { title: string; steps: { label: string; kind?: "start" | "decision" | "action" | "end" }[] }) {
  // vertical-ish horizontal flow for small screens
  const w = 640;
  const bw = 130;
  const gap = (w - steps.length * bw) / (steps.length + 1);
  return (
    <Svg w={w} h={140} title={title}>
      {steps.map((s, i) => {
        const x = gap + i * (bw + gap);
        const fill = s.kind === "decision" ? C.warnSoft : s.kind === "start" || s.kind === "end" ? C.greenSoft : C.blueSoft;
        return (
          <g key={i}>
            {s.kind === "decision" ? (
              <polygon points={`${x + bw / 2},30 ${x + bw},70 ${x + bw / 2},110 ${x},70`} fill={fill} stroke={C.border} strokeWidth={1.5} />
            ) : (
              <Box x={x} y={45} w={bw} h={50} fill={fill} r={s.kind === "action" ? 8 : 25} />
            )}
            {s.label.split("\n").map((ln, k, arr) => (
              <T key={k} x={x + bw / 2} y={70 + (k - (arr.length - 1) / 2) * 15} size={12.5} mono={/[(<]/.test(ln)}>
                {ln}
              </T>
            ))}
            {i < steps.length - 1 && <Arrow x1={x + bw + 2} y1={70} x2={x + bw + gap - 4} y2={70} />}
          </g>
        );
      })}
    </Svg>
  );
}

const diagrams: Record<DiagramName, () => ReactNode> = {
  "console-vs-script": () => (
    <Svg w={640} h={220} title="The console runs one command now; a script is a saved file of commands">
      <Box x={20} y={20} w={280} h={180} fill={C.surface}>
        <T x={160} y={42} weight={650}>Console</T>
        <T x={40} y={80} mono anchor="start" fill={C.green}>{"> 2 + 3"}</T>
        <T x={40} y={104} mono anchor="start">[1] 5</T>
        <T x={40} y={128} mono anchor="start" fill={C.green}>{"> _"}</T>
        <T x={160} y={175} size={12} fill={C.muted}>Type a command, run it now. Not saved.</T>
      </Box>
      <Box x={340} y={20} w={280} h={180} fill={C.surface}>
        <T x={480} y={42} weight={650}>Script (analysis.R)</T>
        {["# Load and summarise", "scores <- c(80, 90, 100)", "mean(scores)"].map((l, i) => (
          <T key={i} x={360} y={80 + i * 24} mono anchor="start" size={13} fill={i === 0 ? C.muted : C.fg}>{l}</T>
        ))}
        <T x={480} y={175} size={12} fill={C.muted}>A saved file. Run it again any time.</T>
      </Box>
      <Arrow x1={302} y1={110} x2={338} y2={110} />
    </Svg>
  ),
  "r-vs-rstudio": () => (
    <Svg w={640} h={210} title="R is the engine that runs code; RStudio is the dashboard around it">
      <Box x={20} y={30} w={220} h={150} fill={C.greenSoft}>
        <T x={130} y={70} weight={700} size={20}>R</T>
        <T x={130} y={105} size={13}>the engine</T>
        <T x={130} y={130} size={12} fill={C.muted}>understands and runs code</T>
      </Box>
      <Box x={280} y={20} w={340} h={170} fill={C.surface}>
        <T x={450} y={40} weight={650}>RStudio – the dashboard</T>
        <Box x={295} y={55} w={150} h={55} fill={C.card}><T x={370} y={82} size={12}>Script editor</T></Box>
        <Box x={455} y={55} w={150} h={55} fill={C.card}><T x={530} y={82} size={12}>Environment</T></Box>
        <Box x={295} y={118} w={150} h={55} fill={C.card}><T x={370} y={145} size={12}>Console</T></Box>
        <Box x={455} y={118} w={150} h={55} fill={C.card}><T x={530} y={145} size={12}>Plots &amp; files</T></Box>
      </Box>
      <Arrow x1={278} y1={105} x2={244} y2={105} />
      <T x={130} y={200} size={11.5} fill={C.muted}>On R Academy, R runs in your browser (webR)</T>
    </Svg>
  ),
  assignment: () => (
    <Svg w={640} h={170} title="x <- 5 stores the value 5 in a box labelled x">
      <T x={110} y={85} mono size={26} weight={600}>x &lt;- 5</T>
      <Arrow x1={200} y1={85} x2={300} y2={85} />
      <Box x={320} y={40} w={120} h={90} fill={C.greenSoft}>
        <T x={380} y={88} mono size={30} weight={650}>5</T>
      </Box>
      <rect x={340} y={22} width={80} height={26} rx={6} fill={C.blue} />
      <T x={380} y={35} mono fill="#fff" weight={650}>x</T>
      <T x={530} y={70} size={13} anchor="middle">the name (label)</T>
      <T x={530} y={95} size={13} anchor="middle" fill={C.muted}>points to the value</T>
      <T x={110} y={130} size={12} fill={C.muted}>&lt;- means “gets”: x gets 5</T>
    </Svg>
  ),
  "data-types": () => (
    <Svg w={640} h={170} title="The basic data types: numeric, integer, character and logical">
      {[
        { t: "numeric", e: "3.14   42", d: "numbers (with decimals)", f: C.greenSoft },
        { t: "integer", e: "5L   100L", d: "whole numbers", f: C.blueSoft },
        { t: "character", e: '"hello"', d: "text, in quotes", f: C.warnSoft },
        { t: "logical", e: "TRUE  FALSE", d: "yes / no values", f: C.dangerSoft },
      ].map((b, i) => (
        <Box key={b.t} x={16 + i * 156} y={25} w={144} h={120} fill={b.f}>
          <T x={88 + i * 156} y={52} weight={650}>{b.t}</T>
          <T x={88 + i * 156} y={86} mono size={14}>{b.e}</T>
          <T x={88 + i * 156} y={120} size={11.5} fill={C.muted}>{b.d}</T>
        </Box>
      ))}
    </Svg>
  ),
  vector: () => (
    <Svg w={640} h={150} title="A vector is a row of values of the same type, each with a position">
      <T x={100} y={50} mono size={15}>scores</T>
      <Arrow x1={140} y1={50} x2={180} y2={50} />
      <Cells x={190} y={30} values={["80", "90", "100", "75"]} w={70} />
      <T x={330} y={120} size={12.5} fill={C.muted}>Positions start at 1. All values have the same type (here: numeric).</T>
    </Svg>
  ),
  indexing: () => (
    <Svg w={640} h={250} title="Selecting elements of a vector with square brackets">
      {[
        { code: "x[2]", hl: [2] },
        { code: "x[c(1, 3)]", hl: [1, 3] },
        { code: "x[-1]", hl: [2, 3, 4] },
        { code: "x[x > 15]", hl: [3, 4] },
      ].map((r, i) => (
        <g key={r.code}>
          <T x={95} y={38 + i * 55} mono anchor="middle">{r.code}</T>
          <Cells x={190} y={20 + i * 55} values={["5", "12", "20", "33"]} w={56} h={36} fill={C.card} index={false} highlight={r.hl} />
          <T x={440} y={38 + i * 55} anchor="start" size={12.5} fill={C.muted}>
            {["the 2nd element", "elements 1 and 3", "everything except the 1st", "elements where the condition is TRUE"][i]}
          </T>
        </g>
      ))}
    </Svg>
  ),
  list: () => (
    <Svg w={640} h={190} title="A list is one container that can hold different kinds of things">
      <Box x={20} y={20} w={600} h={150} fill={C.surface}>
        <T x={60} y={42} mono anchor="start" weight={650}>person &lt;- list(...)</T>
        {[
          { n: "$name", v: '"Ana"', f: C.warnSoft },
          { n: "$age", v: "29", f: C.greenSoft },
          { n: "$scores", v: "c(88, 92, 79)", f: C.blueSoft },
          { n: "$student", v: "TRUE", f: C.dangerSoft },
        ].map((p, i) => (
          <Box key={p.n} x={40 + i * 145} y={65} w={130} h={85} fill={p.f}>
            <T x={105 + i * 145} y={90} mono size={13} weight={650}>{p.n}</T>
            <T x={105 + i * 145} y={122} mono size={12.5}>{p.v}</T>
          </Box>
        ))}
      </Box>
    </Svg>
  ),
  matrix: () => (
    <Svg w={640} h={200} title="A matrix is a grid of values; m[row, column] picks one">
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <g key={`${r}${c}`}>
            <rect x={160 + c * 60} y={40 + r * 42} width={60} height={42} fill={r === 1 && c === 2 ? C.blueSoft : C.greenSoft} stroke={r === 1 && c === 2 ? C.blue : C.border} strokeWidth={1.5} />
            <T x={190 + c * 60} y={61 + r * 42} mono>{r + 1 + c * 3}</T>
          </g>
        )),
      )}
      {[0, 1, 2].map((r) => <T key={r} x={135} y={61 + r * 42} mono size={12} fill={C.muted}>[{r + 1},]</T>)}
      {[0, 1, 2, 3].map((c) => <T key={c} x={190 + c * 60} y={25} mono size={12} fill={C.muted}>[,{c + 1}]</T>)}
      <T x={520} y={90} mono>m[2, 3]</T>
      <T x={520} y={115} size={12} fill={C.muted}>row 2, column 3 → 8</T>
    </Svg>
  ),
  factor: () => (
    <Svg w={640} h={190} title="A factor stores categories; each value belongs to one of a fixed set of levels">
      <Cells x={30} y={40} values={["low", "high", "medium", "low", "high"]} w={64} index={false} fill={C.card} />
      <Arrow x1={355} y1={60} x2={410} y2={60} />
      <Box x={420} y={20} w={200} h={140} fill={C.warnSoft}>
        <T x={520} y={42} weight={650}>levels</T>
        {["low", "medium", "high"].map((l, i) => <T key={l} x={520} y={75 + i * 26} mono>{`${i + 1}  ${l}`}</T>)}
      </Box>
      <T x={190} y={120} size={12.5} fill={C.muted}>Each value is one of the levels.</T>
      <T x={190} y={142} size={12.5} fill={C.muted}>R stores the categories and their order.</T>
    </Svg>
  ),
  "data-frame": () => (
    <Svg w={640} h={220} title="A data frame is a table: each column is a vector, each row is one observation">
      {["name", "age", "score"].map((h, c) => (
        <g key={h}>
          <rect x={120 + c * 130} y={30} width={130} height={36} fill={C.blueSoft} stroke={C.border} strokeWidth={1.5} />
          <T x={185 + c * 130} y={48} mono weight={650}>{h}</T>
        </g>
      ))}
      {[
        ['"Ana"', "29", "88"],
        ['"Ben"', "35", "92"],
        ['"Chloe"', "41", "79"],
      ].map((row, r) =>
        row.map((v, c) => (
          <g key={`${r}${c}`}>
            <rect x={120 + c * 130} y={66 + r * 36} width={130} height={36} fill={r === 1 ? C.greenSoft : C.card} stroke={C.border} strokeWidth={1.5} />
            <T x={185 + c * 130} y={84 + r * 36} mono>{v}</T>
          </g>
        )),
      )}
      <T x={60} y={120} size={12} fill={C.muted}>row =</T>
      <T x={60} y={136} size={12} fill={C.muted}>observation</T>
      <T x={315} y={195} size={12.5} fill={C.muted}>Each column is a vector (one type per column). df$age gives the age column.</T>
    </Svg>
  ),
  "if-else-flow": () => <Flow title="An if/else statement: check a condition, then run one of two blocks" steps={[{ label: "start", kind: "start" }, { label: "condition\nTRUE?", kind: "decision" }, { label: "TRUE: run\nif { } block", kind: "action" }, { label: "FALSE: run\nelse { } block", kind: "action" }]} />,
  "for-loop-flow": () => <Flow title="A for loop repeats its body once for each element" steps={[{ label: "for (i in x)", kind: "start" }, { label: "next element\nleft?", kind: "decision" }, { label: "run the body\nwith i", kind: "action" }, { label: "no more:\ncontinue after", kind: "end" }]} />,
  "while-loop-flow": () => <Flow title="A while loop repeats while its condition is TRUE" steps={[{ label: "while (cond)", kind: "start" }, { label: "condition\nTRUE?", kind: "decision" }, { label: "run body,\nupdate values", kind: "action" }, { label: "FALSE:\nstop looping", kind: "end" }]} />,
  "function-anatomy": () => (
    <Svg w={640} h={210} title="The parts of a function: name, arguments, body and return value">
      <T x={30} y={50} mono anchor="start" size={17}>
        <tspan fill={C.blue} fontWeight={650}>add_tax</tspan> &lt;- function(<tspan fill={C.green} fontWeight={650}>price, rate = 0.2</tspan>) {"{"}
      </T>
      <T x={60} y={90} mono anchor="start" size={16} fill={C.warn}>total &lt;- price * (1 + rate)</T>
      <T x={60} y={125} mono anchor="start" size={16} fill={C.danger}>return(total)</T>
      <T x={30} y={160} mono anchor="start" size={17}>{"}"}</T>
      <T x={520} y={50} size={12.5} fill={C.blue}>name</T>
      <T x={520} y={70} size={12.5} fill={C.green}>arguments (inputs, with a default)</T>
      <T x={520} y={95} size={12.5} fill={C.warn}>body: the work</T>
      <T x={520} y={125} size={12.5} fill={C.danger}>return value (output)</T>
      <T x={320} y={195} mono size={13} fill={C.muted}>add_tax(100)  →  [1] 120</T>
    </Svg>
  ),
  pipe: () => (
    <Svg w={640} h={150} title="The pipe passes the result of one step into the next">
      {["students", "filter(math > 80)", "select(name, math)", "result"].map((s, i) => (
        <g key={s}>
          <Box x={10 + i * 158} y={45} w={140} h={50} fill={i === 0 || i === 3 ? C.greenSoft : C.blueSoft}>
            <T x={80 + i * 158} y={70} mono size={12.5}>{s}</T>
          </Box>
          {i < 3 && (
            <>
              <Arrow x1={152 + i * 158} y1={70} x2={166 + i * 158} y2={70} />
              <T x={159 + i * 158} y={30} mono size={13} fill={C.muted}>|&gt;</T>
            </>
          )}
        </g>
      ))}
      <T x={320} y={125} size={12.5} fill={C.muted}>Read |&gt; as “and then”. The left side becomes the first argument of the next function.</T>
    </Svg>
  ),
  "tidy-data": () => (
    <Svg w={640} h={200} title="Tidy data: each variable is a column, each observation a row, each value a cell">
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={40 + c * 80} y={30 + r * 36} width={80} height={36} fill={r === 0 ? C.blueSoft : C.card} stroke={C.border} strokeWidth={1.5} />),
      )}
      <rect x={120} y={30} width={80} height={144} fill="none" stroke={C.green} strokeWidth={3} rx={4} />
      <rect x={40} y={102} width={240} height={36} fill="none" stroke={C.warn} strokeWidth={3} rx={4} />
      <T x={430} y={60} size={13} fill={C.green}>■ each variable is a column</T>
      <T x={430} y={95} size={13} fill={C.warn}>■ each observation is a row</T>
      <T x={430} y={130} size={13}>■ each value has its own cell</T>
    </Svg>
  ),
  pivot: () => (
    <Svg w={640} h={210} title="pivot_longer turns wide data into long data; pivot_wider does the reverse">
      <T x={130} y={20} weight={650}>wide</T>
      {[["name", "2023", "2024"], ["Ana", "5", "7"], ["Ben", "3", "4"]].map((row, r) =>
        row.map((v, c) => (
          <g key={`w${r}${c}`}>
            <rect x={40 + c * 60} y={35 + r * 32} width={60} height={32} fill={r === 0 ? C.blueSoft : C.card} stroke={C.border} />
            <T x={70 + c * 60} y={51 + r * 32} mono size={12}>{v}</T>
          </g>
        )),
      )}
      <Arrow x1={240} y1={70} x2={350} y2={70} />
      <T x={295} y={55} mono size={11.5}>pivot_longer()</T>
      <Arrow x1={350} y1={130} x2={240} y2={130} />
      <T x={295} y={148} mono size={11.5}>pivot_wider()</T>
      <T x={480} y={20} weight={650}>long</T>
      {[["name", "year", "n"], ["Ana", "2023", "5"], ["Ana", "2024", "7"], ["Ben", "2023", "3"], ["Ben", "2024", "4"]].map((row, r) =>
        row.map((v, c) => (
          <g key={`l${r}${c}`}>
            <rect x={380 + c * 70} y={35 + r * 32} width={70} height={32} fill={r === 0 ? C.greenSoft : C.card} stroke={C.border} />
            <T x={415 + c * 70} y={51 + r * 32} mono size={12}>{v}</T>
          </g>
        )),
      )}
    </Svg>
  ),
  "ggplot-layers": () => (
    <Svg w={640} h={230} title="A ggplot is built in layers: data, aesthetics, geoms, labels and theme">
      {[
        { t: "data", c: "ggplot(students, …)", f: C.greenSoft },
        { t: "aesthetics", c: "aes(x = study_hours, y = math)", f: C.blueSoft },
        { t: "geom", c: "+ geom_point()", f: C.warnSoft },
        { t: "labels", c: '+ labs(title = "…")', f: C.dangerSoft },
        { t: "theme", c: "+ theme_minimal()", f: C.surface },
      ].map((l, i) => (
        <g key={l.t}>
          <Box x={30 + i * 18} y={20 + i * 38} w={420} h={34} fill={l.f} r={8}>
            <T x={45 + i * 18} y={37 + i * 38} anchor="start" weight={650} size={13}>{l.t}</T>
            <T x={150 + i * 18} y={37 + i * 38} anchor="start" mono size={12}>{l.c}</T>
          </Box>
        </g>
      ))}
      <T x={560} y={90} size={12.5} fill={C.muted}>Each + adds</T>
      <T x={560} y={110} size={12.5} fill={C.muted}>one layer</T>
    </Svg>
  ),
  "boxplot-anatomy": () => (
    <Svg w={640} h={200} title="Box plot: the box shows the middle 50%, the line is the median, whiskers and outliers">
      <line x1={80} y1={100} x2={160} y2={100} stroke={C.fg} strokeWidth={2} />
      <line x1={80} y1={85} x2={80} y2={115} stroke={C.fg} strokeWidth={2} />
      <rect x={160} y={70} width={200} height={60} fill={C.blueSoft} stroke={C.blue} strokeWidth={2} />
      <line x1={240} y1={70} x2={240} y2={130} stroke={C.fg} strokeWidth={3} />
      <line x1={360} y1={100} x2={450} y2={100} stroke={C.fg} strokeWidth={2} />
      <line x1={450} y1={85} x2={450} y2={115} stroke={C.fg} strokeWidth={2} />
      <circle cx={540} cy={100} r={6} fill={C.danger} />
      <T x={80} y={150} size={12}>minimum*</T>
      <T x={160} y={55} size={12}>Q1 (25%)</T>
      <T x={240} y={150} size={12} weight={650}>median</T>
      <T x={360} y={55} size={12}>Q3 (75%)</T>
      <T x={450} y={150} size={12}>maximum*</T>
      <T x={540} y={130} size={12} fill={C.danger}>outlier</T>
      <T x={260} y={185} size={11.5} fill={C.muted}>The box holds the middle 50% of the data (the IQR). *whiskers reach at most 1.5 × IQR.</T>
    </Svg>
  ),
  "histogram-vs-bar": () => (
    <Svg w={640} h={210} title="Histograms show numeric values grouped into bins; bar charts show counts of categories">
      <T x={160} y={20} weight={650}>Histogram – numbers</T>
      {[20, 45, 80, 110, 70, 35, 15].map((h, i) => <rect key={i} x={40 + i * 34} y={160 - h} width={34} height={h} fill={C.greenSoft} stroke={C.green} />)}
      <T x={160} y={180} size={11.5} fill={C.muted}>bars touch: the x-axis is a number line</T>
      <T x={480} y={20} weight={650}>Bar chart – categories</T>
      {[["A", 90], ["B", 120], ["C", 60]].map(([l, h], i) => (
        <g key={String(l)}>
          <rect x={380 + i * 70} y={160 - Number(h)} width={46} height={Number(h)} fill={C.blueSoft} stroke={C.blue} />
          <T x={403 + i * 70} y={172} size={12}>{l}</T>
        </g>
      ))}
      <T x={480} y={195} size={11.5} fill={C.muted}>gaps between bars: separate groups</T>
    </Svg>
  ),
  "center-spread": () => (
    <Svg w={640} h={200} title="Center tells you the typical value; spread tells you how far values are from it">
      <line x1={40} y1={90} x2={600} y2={90} stroke={C.border} strokeWidth={2} />
      {[150, 190, 230, 260, 300, 320, 350, 400, 470].map((x, i) => <circle key={i} cx={x} cy={90} r={8} fill={C.blueSoft} stroke={C.blue} />)}
      <line x1={302} y1={50} x2={302} y2={130} stroke={C.green} strokeWidth={3} />
      <T x={302} y={38} size={12.5} fill={C.green} weight={650}>center (mean / median)</T>
      <line x1={150} y1={150} x2={470} y2={150} stroke={C.warn} strokeWidth={2} markerEnd="url(#arr)" markerStart="url(#arr)" />
      <T x={310} y={170} size={12.5} fill={C.warn}>spread (range, IQR, standard deviation)</T>
    </Svg>
  ),
  "normal-curve": () => {
    const pts = Array.from({ length: 121 }, (_, i) => {
      const z = -3.5 + (7 * i) / 120;
      return `${320 + z * 80},${170 - 140 * Math.exp(-(z * z) / 2)}`;
    }).join(" ");
    return (
      <Svg w={640} h={220} title="The normal distribution: about 68% of values within 1 SD, 95% within 2 SD, 99.7% within 3 SD">
        <rect x={80} y={20} width={480} height={150} fill={C.surface} />
        <rect x={160} y={20} width={320} height={150} fill={C.blueSoft} />
        <rect x={240} y={20} width={160} height={150} fill={C.greenSoft} />
        <polyline points={pts} fill="none" stroke={C.fg} strokeWidth={2.5} />
        <line x1={40} y1={170} x2={600} y2={170} stroke={C.muted} />
        {[-3, -2, -1, 0, 1, 2, 3].map((z) => <T key={z} x={320 + z * 80} y={185} size={11.5} fill={C.muted}>{z === 0 ? "mean" : `${z > 0 ? "+" : ""}${z} SD`}</T>)}
        <T x={320} y={120} size={13} weight={650}>68%</T>
        <T x={200} y={150} size={12}>95%</T>
        <T x={110} y={160} size={11}>99.7%</T>
      </Svg>
    );
  },
  "hypothesis-test": () => <Flow title="Hypothesis test: state H0, compute a test statistic, get a p-value, decide" steps={[{ label: "H0: no effect\nH1: an effect", kind: "start" }, { label: "collect data,\ntest statistic", kind: "action" }, { label: "p-value\n< 0.05?", kind: "decision" }, { label: "yes: reject H0\nno: fail to reject", kind: "end" }]} />,
  "regression-line": () => {
    const pts = [[80, 150], [120, 140], [160, 128], [200, 120], [240, 100], [280, 106], [320, 82], [360, 76], [400, 70], [440, 50], [480, 54]];
    const line = (x: number) => 162 - 0.25 * (x - 60);
    return (
      <Svg w={640} h={210} title="Linear regression fits a straight line; residuals are vertical distances from the points to the line">
        <line x1={60} y1={180} x2={520} y2={180} stroke={C.muted} />
        <line x1={60} y1={20} x2={60} y2={180} stroke={C.muted} />
        <line x1={60} y1={line(60)} x2={520} y2={line(520)} stroke={C.green} strokeWidth={3} />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <line x1={x} y1={y} x2={x} y2={line(x)} stroke={C.warn} strokeDasharray="3 3" />
            <circle cx={x} cy={y} r={5} fill={C.blue} />
          </g>
        ))}
        <T x={580} y={60} size={12.5} fill={C.green}>fitted line</T>
        <T x={580} y={80} size={12.5} fill={C.warn}>residuals</T>
        <T x={290} y={198} size={12} fill={C.muted}>y = intercept + slope × x</T>
      </Svg>
    );
  },
  scope: () => (
    <Svg w={640} h={210} title="Inside a function R looks for a name in the function's environment first, then in the global environment">
      <Box x={20} y={20} w={600} h={170} fill={C.surface}>
        <T x={40} y={40} anchor="start" weight={650}>Global environment</T>
        <T x={40} y={68} anchor="start" mono size={13}>x &lt;- 10</T>
        <Box x={260} y={50} w={340} h={120} fill={C.greenSoft}>
          <T x={280} y={70} anchor="start" weight={650} size={13}>f()&apos;s own environment</T>
          <T x={280} y={100} anchor="start" mono size={13}>y &lt;- 2   # local</T>
          <T x={280} y={128} anchor="start" mono size={13}>x * y   # x? look outside</T>
        </Box>
        <Arrow x1={258} y1={128} x2={140} y2={75} dashed />
        <T x={130} y={150} size={12} fill={C.muted}>1. look inside the function</T>
        <T x={130} y={168} size={12} fill={C.muted}>2. then the global environment</T>
      </Box>
    </Svg>
  ),
  "apply-family": () => (
    <Svg w={640} h={180} title="sapply applies a function to each element and collects the results">
      <Cells x={30} y={40} values={["1", "2", "3", "4"]} w={50} index={false} fill={C.card} />
      <Box x={270} y={35} w={110} h={50} fill={C.warnSoft}><T x={325} y={60} mono size={13}>f(x)</T></Box>
      <Arrow x1={232} y1={60} x2={266} y2={60} />
      <Arrow x1={382} y1={60} x2={416} y2={60} />
      <Cells x={420} y={40} values={["1", "4", "9", "16"]} w={50} index={false} />
      <T x={320} y={130} mono size={13}>sapply(1:4, function(x) x^2)</T>
      <T x={320} y={155} size={12} fill={C.muted}>the same function is applied to every element</T>
    </Svg>
  ),
  "data-pipeline": () => <Flow title="A data analysis: import, clean, explore, model, communicate" steps={[{ label: "import", kind: "start" }, { label: "clean", kind: "action" }, { label: "explore &\nvisualise", kind: "action" }, { label: "communicate", kind: "end" }]} />,
  "error-anatomy": () => (
    <Svg w={640} h={170} title="The parts of an R error message">
      <T x={320} y={60} mono size={16}>
        <tspan fill={C.danger} fontWeight={700}>Error in </tspan>
        <tspan fill={C.blue} fontWeight={650}>mean(scor)</tspan>
        <tspan fill={C.danger}> : </tspan>
        <tspan fill={C.warn} fontWeight={650}>object &apos;scor&apos; not found</tspan>
      </T>
      <T x={115} y={105} size={12.5} fill={C.danger}>“something went wrong”</T>
      <T x={300} y={105} size={12.5} fill={C.blue}>where: the call that failed</T>
      <T x={505} y={105} size={12.5} fill={C.warn}>what: the problem</T>
      <T x={320} y={145} size={12} fill={C.muted}>Read the end first: it tells you what is wrong. The call tells you where to look.</T>
    </Svg>
  ),
};

export function Diagram({ name, caption }: { name: DiagramName; caption?: string }) {
  const D = diagrams[name];
  if (!D) return null;
  return (
    <figure className="not-prose my-5 rounded-xl border border-border bg-card p-4">
      <div className="mx-auto max-w-2xl">{D()}</div>
      {caption && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
