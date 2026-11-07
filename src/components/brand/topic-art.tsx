/**
 * Colourful topic illustrations used as thumbnails on lesson, exercise and
 * project cards (inspired by the illustrated simulation cards of PhET).
 * Every scene is a small hand-made SVG drawn in a 160 × 100 box.
 */
import type { ReactNode } from "react";
import type { TopicKind } from "@/lib/game/worlds";
import { cn } from "@/lib/utils";

/** Lines drawn straight on the background (axes, arrows) adapt to the theme; ink on white panels stays dark. */
const LINE = { stroke: "var(--art-line)" } as const;
const P = { ink: "#1b1e3d", w: "#ffffff", indigo: "#5b5bf6", mint: "#18b874", sun: "#ffbd14", coral: "#ff5a5f", sky: "#1e9bf0", grape: "#9a5cf0", tang: "#ff8433", pink: "#f2559d", teal: "#10b3b0", soft: "#eef0fd" };
const MONO = "var(--font-mono)";

function Win({ children, x = 22, y = 16, w = 116, h = 68, bar = P.indigo }: { children?: ReactNode; x?: number; y?: number; w?: number; h?: number; bar?: string }) {
  return (
    <g>
      <rect x={x} y={y + 3} width={w} height={h} rx="9" fill={P.ink} opacity="0.12" />
      <rect x={x} y={y} width={w} height={h} rx="9" fill={P.w} />
      <path d={`M${x} ${y + 9} a9 9 0 0 1 9 -9 h${w - 18} a9 9 0 0 1 9 9 v5 h-${w} z`} fill={bar} />
      <circle cx={x + 8} cy={y + 7} r="2" fill={P.w} opacity="0.8" />
      <circle cx={x + 15} cy={y + 7} r="2" fill={P.w} opacity="0.6" />
      {children}
    </g>
  );
}

function Bars({ x, y, heights, colors, w = 12, gap = 5 }: { x: number; y: number; heights: number[]; colors: string[]; w?: number; gap?: number }) {
  return (
    <g>
      {heights.map((h, i) => (
        <rect key={i} x={x + i * (w + gap)} y={y - h} width={w} height={h} rx="3" fill={colors[i % colors.length]} />
      ))}
    </g>
  );
}

const scenes: Record<TopicKind, () => ReactNode> = {
  hello: () => (
    <g>
      <Win bar={P.mint}>
        <text x="32" y="46" fontFamily={MONO} fontSize="11" fill={P.ink}>&gt; print(</text>
        <text x="32" y="62" fontFamily={MONO} fontSize="11" fill={P.mint} fontWeight="700">&quot;Hello!&quot;)</text>
      </Win>
      <path d="M112 28 h34 a6 6 0 0 1 6 6 v14 a6 6 0 0 1 -6 6 h-20 l-8 7 v-7 h-6 a6 6 0 0 1 -6 -6 v-14 a6 6 0 0 1 6 -6z" fill={P.sun} />
      <text x="129" y="45" fontSize="11" textAnchor="middle" fontWeight="800" fill={P.ink}>Hi!</text>
    </g>
  ),
  console: () => (
    <g>
      <Win bar={P.ink}>
        <text x="30" y="44" fontFamily={MONO} fontSize="10" fill={P.mint}>&gt; 2 + 3</text>
        <text x="30" y="58" fontFamily={MONO} fontSize="10" fill={P.ink}>[1] 5</text>
        <rect x="30" y="66" width="7" height="10" fill={P.indigo} />
      </Win>
      <rect x="100" y="54" width="44" height="34" rx="6" fill={P.sky} />
      <rect x="106" y="62" width="30" height="3" rx="1.5" fill={P.w} />
      <rect x="106" y="70" width="22" height="3" rx="1.5" fill={P.w} opacity="0.8" />
      <rect x="106" y="78" width="26" height="3" rx="1.5" fill={P.w} opacity="0.6" />
    </g>
  ),
  code: () => (
    <g>
      <Win bar={P.grape}>
        <rect x="30" y="38" width="10" height="4" rx="2" fill={P.grape} />
        <rect x="44" y="38" width="40" height="4" rx="2" fill={P.sky} />
        <rect x="30" y="50" width="60" height="4" rx="2" fill={P.mint} />
        <rect x="30" y="62" width="28" height="4" rx="2" fill={P.tang} />
        <rect x="62" y="62" width="34" height="4" rx="2" fill={P.pink} />
        <rect x="30" y="74" width="46" height="4" rx="2" fill="#a0a6c8" />
      </Win>
      <circle cx="132" cy="70" r="16" fill={P.sun} />
      <path d="M126 70 l5 5 9 -10" stroke={P.ink} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  variable: () => (
    <g>
      {[["x", "5", P.mint, 22], ["name", '"Ana"', P.sky, 64], ["ok", "TRUE", P.grape, 106]].map(([l, v, col, x]) => (
        <g key={String(l)}>
          <rect x={Number(x)} y="36" width="36" height="40" rx="8" fill={String(col)} />
          <rect x={Number(x) + 4} y="40" width="28" height="26" rx="5" fill={P.w} opacity="0.95" />
          <text x={Number(x) + 18} y="57" textAnchor="middle" fontFamily={MONO} fontSize="9" fontWeight="700" fill={P.ink}>{String(v)}</text>
          <rect x={Number(x) + 4} y="22" width="28" height="12" rx="4" fill={P.ink} />
          <text x={Number(x) + 18} y="31" textAnchor="middle" fontFamily={MONO} fontSize="8" fill={P.w}>{String(l)}</text>
        </g>
      ))}
    </g>
  ),
  calc: () => (
    <g>
      <rect x="44" y="12" width="72" height="80" rx="12" fill={P.indigo} />
      <rect x="52" y="20" width="56" height="20" rx="5" fill={P.w} />
      <text x="102" y="35" textAnchor="end" fontFamily={MONO} fontSize="12" fontWeight="700" fill={P.ink}>42</text>
      {["+", "−", "×", "÷", "^", "%"].map((o, i) => (
        <g key={o}>
          <rect x={52 + (i % 3) * 20} y={46 + Math.floor(i / 3) * 21} width="16" height="16" rx="4" fill={[P.sun, P.mint, P.coral, P.sky, P.pink, P.tang][i]} />
          <text x={60 + (i % 3) * 20} y={58 + Math.floor(i / 3) * 21} textAnchor="middle" fontSize="11" fontWeight="800" fill={P.ink}>{o}</text>
        </g>
      ))}
    </g>
  ),
  types: () => (
    <g>
      <circle cx="44" cy="52" r="20" fill={P.mint} />
      <text x="44" y="57" textAnchor="middle" fontSize="14" fontWeight="800" fill={P.w}>3.14</text>
      <rect x="66" y="32" width="40" height="40" rx="8" fill={P.sun} />
      <text x="86" y="57" textAnchor="middle" fontSize="13" fontWeight="800" fill={P.ink}>&quot;a&quot;</text>
      <path d="M128 30 l20 36 h-40z" fill={P.grape} />
      <text x="128" y="60" textAnchor="middle" fontSize="9" fontWeight="800" fill={P.w}>TRUE</text>
    </g>
  ),
  error: () => (
    <g>
      <Win bar={P.coral}>
        <text x="30" y="46" fontFamily={MONO} fontSize="9" fill={P.coral} fontWeight="700">Error: object</text>
        <text x="30" y="58" fontFamily={MONO} fontSize="9" fill={P.coral} fontWeight="700">&apos;x&apos; not found</text>
        <path d="M30 70 q5 -5 10 0 t10 0 t10 0" stroke={P.coral} strokeWidth="2" fill="none" />
      </Win>
      <circle cx="128" cy="68" r="14" fill={P.w} stroke={P.ink} strokeWidth="3" />
      <line x1="138" y1="78" x2="148" y2="88" style={LINE} strokeWidth="5" strokeLinecap="round" />
    </g>
  ),
  vector: () => (
    <g>
      {[P.mint, P.sky, P.grape, P.pink, P.tang].map((col, i) => (
        <g key={i}>
          <rect x={18 + i * 26} y="34" width="24" height="28" rx="5" fill={col} />
          <text x={30 + i * 26} y="53" textAnchor="middle" fontSize="11" fontWeight="800" fill={P.w}>{[80, 90, 100, 75, 60][i]}</text>
          <text x={30 + i * 26} y="76" textAnchor="middle" fontFamily={MONO} fontSize="8" fill="#5c6189">[{i + 1}]</text>
        </g>
      ))}
      <text x="80" y="24" textAnchor="middle" fontFamily={MONO} fontSize="10" fontWeight="700" fill={P.ink}>c( … )</text>
    </g>
  ),
  list: () => (
    <g>
      <path d="M40 34 q40 -26 80 0 v44 a10 10 0 0 1 -10 10 h-60 a10 10 0 0 1 -10 -10z" fill={P.sky} />
      <rect x="48" y="44" width="22" height="22" rx="5" fill={P.sun} />
      <circle cx="88" cy="56" r="11" fill={P.pink} />
      <path d="M104 66 l9 -18 9 18z" fill={P.mint} />
      <rect x="56" y="70" width="48" height="8" rx="4" fill={P.w} opacity="0.85" />
    </g>
  ),
  table: () => (
    <g>
      <rect x="24" y="18" width="112" height="70" rx="9" fill={P.w} />
      <rect x="24" y="18" width="112" height="16" rx="9" fill={P.sky} />
      <rect x="24" y="28" width="112" height="6" fill={P.sky} />
      {[0, 1, 2].map((r) => [0, 1, 2].map((cc) => <rect key={`${r}${cc}`} x={30 + cc * 36} y={40 + r * 15} width="30" height="9" rx="3" fill={[P.soft, "#dff3ff", "#e9e1ff"][cc]} />))}
      {[0, 1, 2].map((cc) => <rect key={cc} x={34 + cc * 36} y="23" width="22" height="5" rx="2.5" fill={P.w} />)}
    </g>
  ),
  missing: () => (
    <g>
      <rect x="24" y="18" width="112" height="70" rx="9" fill={P.w} />
      {[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((cc) => {
        const na = (r + cc) % 3 === 1 && r !== 0;
        return <rect key={`${r}${cc}`} x={30 + cc * 26} y={24 + r * 15} width="22" height="11" rx="3" fill={na ? P.coral : r === 0 ? P.sky : P.soft} opacity={na ? 0.9 : 1} />;
      }))}
      <text x="120" y="88" fontSize="18" fontWeight="900" fill={P.coral}>?</text>
    </g>
  ),
  logic: () => (
    <g>
      <path d="M80 14 L104 38 L80 62 L56 38 Z" fill={P.grape} />
      <text x="80" y="42" textAnchor="middle" fontSize="11" fontWeight="800" fill={P.w}>if</text>
      <path d="M60 50 L36 72" stroke={P.mint} strokeWidth="5" strokeLinecap="round" />
      <path d="M100 50 L124 72" stroke={P.coral} strokeWidth="5" strokeLinecap="round" />
      <rect x="16" y="72" width="40" height="18" rx="9" fill={P.mint} />
      <text x="36" y="84" textAnchor="middle" fontSize="9" fontWeight="800" fill={P.w}>TRUE</text>
      <rect x="104" y="72" width="40" height="18" rx="9" fill={P.coral} />
      <text x="124" y="84" textAnchor="middle" fontSize="9" fontWeight="800" fill={P.w}>FALSE</text>
    </g>
  ),
  loop: () => (
    <g>
      <circle cx="80" cy="52" r="30" fill="none" stroke={P.grape} strokeWidth="8" strokeDasharray="150 40" strokeLinecap="round" />
      <path d="M104 26 l8 14 -16 0z" fill={P.grape} transform="rotate(20 104 33)" />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={Math.round(80 + 30 * Math.cos((i * Math.PI) / 2))} cy={Math.round(52 + 30 * Math.sin((i * Math.PI) / 2))} r="7" fill={[P.sun, P.mint, P.sky, P.pink][i]} />)}
      <text x="80" y="57" textAnchor="middle" fontFamily={MONO} fontSize="12" fontWeight="800" fill={P.ink}>i</text>
    </g>
  ),
  function: () => (
    <g>
      <rect x="54" y="28" width="52" height="46" rx="10" fill={P.grape} />
      <text x="80" y="57" textAnchor="middle" fontFamily={MONO} fontSize="13" fontWeight="800" fill={P.w}>f(x)</text>
      <circle cx="68" cy="24" r="6" fill={P.sun} />
      <circle cx="92" cy="24" r="6" fill={P.mint} />
      <path d="M18 51 h30" stroke={P.sky} strokeWidth="5" strokeLinecap="round" />
      <path d="M40 43 l9 8 -9 8" stroke={P.sky} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M112 51 h30" stroke={P.pink} strokeWidth="5" strokeLinecap="round" />
      <path d="M134 43 l9 8 -9 8" stroke={P.pink} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  import: () => (
    <g>
      <path d="M24 22 h26 l10 10 v48 a5 5 0 0 1 -5 5 h-31 a5 5 0 0 1 -5 -5 v-53 a5 5 0 0 1 5 -5z" fill={P.w} />
      <path d="M50 22 v10 h10" fill={P.tang} />
      <text x="40" y="62" textAnchor="middle" fontSize="10" fontWeight="900" fill={P.tang}>CSV</text>
      <path d="M68 52 h22" style={LINE} strokeWidth="5" strokeLinecap="round" />
      <path d="M84 44 l9 8 -9 8" style={LINE} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="100" y="28" width="44" height="50" rx="7" fill={P.w} />
      <rect x="100" y="28" width="44" height="11" rx="7" fill={P.tang} />
      {[0, 1, 2].map((r) => <rect key={r} x="106" y={46 + r * 10} width="32" height="5" rx="2.5" fill={P.soft} />)}
    </g>
  ),
  filter: () => (
    <g>
      {[P.sky, P.coral, P.mint, P.sun, P.grape, P.mint].map((col, i) => <circle key={i} cx={46 + (i % 3) * 34} cy={20 + Math.floor(i / 3) * 12} r="5" fill={col} />)}
      <path d="M36 38 h88 l-32 28 v18 l-24 -8 v-10z" fill={P.tang} />
      <circle cx="80" cy="92" r="5" fill={P.mint} />
    </g>
  ),
  clean: () => (
    <g>
      <rect x="24" y="30" width="58" height="50" rx="8" fill={P.w} />
      {[0, 1, 2, 3].map((r) => <rect key={r} x="30" y={37 + r * 10} width={[40, 28, 44, 20][r]} height="5" rx="2.5" fill={r % 2 ? P.coral : "#a0a6c8"} transform={`rotate(${[4, -6, 3, -4][r]} 50 50)`} />)}
      <path d="M90 55 h14" style={LINE} strokeWidth="4" strokeLinecap="round" />
      <rect x="110" y="30" width="34" height="50" rx="8" fill={P.w} />
      {[0, 1, 2, 3].map((r) => <rect key={r} x="115" y={37 + r * 10} width="24" height="5" rx="2.5" fill={P.mint} />)}
      <path d="M136 20 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill={P.sun} />
    </g>
  ),
  pipe: () => (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={14 + i * 50} y="38" width="34" height="28" rx="7" fill={[P.tang, P.sky, P.mint][i]} />
          <rect x={20 + i * 50} y="46" width="22" height="4" rx="2" fill={P.w} />
          <rect x={20 + i * 50} y="54" width="14" height="4" rx="2" fill={P.w} opacity="0.7" />
          {i < 2 && <text x={56 + i * 50} y="57" textAnchor="middle" fontFamily={MONO} fontSize="11" fontWeight="800" fill={P.ink}>|&gt;</text>}
        </g>
      ))}
    </g>
  ),
  bar: () => (
    <g>
      <line x1="26" y1="84" x2="138" y2="84" style={LINE} strokeWidth="3" strokeLinecap="round" />
      <Bars x={34} y={82} heights={[30, 52, 40, 64, 46]} colors={[P.pink, P.sky, P.sun, P.mint, P.grape]} w={16} gap={6} />
    </g>
  ),
  scatter: () => (
    <g>
      <line x1="26" y1="84" x2="138" y2="84" style={LINE} strokeWidth="3" strokeLinecap="round" />
      <line x1="26" y1="84" x2="26" y2="16" style={LINE} strokeWidth="3" strokeLinecap="round" />
      {[[40, 72], [52, 66], [60, 70], [70, 56], [82, 52], [90, 46], [100, 40], [112, 34], [122, 26], [76, 62], [106, 44]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={[P.pink, P.sky, P.grape][i % 3]} opacity="0.9" />
      ))}
    </g>
  ),
  palette: () => (
    <g>
      <path d="M80 18 c34 0 54 20 50 40 c-3 14 -20 10 -26 18 c-6 10 6 18 -10 20 c-40 4 -64 -18 -64 -40 c0 -22 18 -38 50 -38z" fill={P.w} />
      {[[60, 38, P.coral], [82, 32, P.sun], [104, 42, P.mint], [56, 62, P.sky], [80, 74, P.grape]].map(([x, y, col], i) => <circle key={i} cx={Number(x)} cy={Number(y)} r="8" fill={String(col)} />)}
    </g>
  ),
  center: () => (
    <g>
      <line x1="20" y1="70" x2="140" y2="70" style={LINE} strokeWidth="3" strokeLinecap="round" />
      {[38, 52, 64, 74, 84, 96, 112].map((x, i) => <circle key={i} cx={x} cy="58" r="7" fill={[P.sky, P.mint, P.grape, P.pink, P.sun, P.tang, P.sky][i]} />)}
      <path d="M78 26 v60" stroke={P.teal} strokeWidth="4" strokeDasharray="6 4" />
      <path d="M68 18 h20 l-10 12z" fill={P.teal} />
    </g>
  ),
  spread: () => (
    <g>
      <line x1="20" y1="64" x2="140" y2="64" style={LINE} strokeWidth="3" strokeLinecap="round" />
      {[30, 50, 70, 80, 90, 110, 130].map((x, i) => <circle key={i} cx={x} cy="52" r="6" fill={P.teal} opacity={0.5 + (i % 3) * 0.2} />)}
      <path d="M30 80 h100" stroke={P.tang} strokeWidth="4" strokeLinecap="round" />
      <path d="M36 74 l-8 6 8 6 M124 74 l8 6 -8 6" stroke={P.tang} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  correlation: () => (
    <g>
      <rect x="22" y="16" width="116" height="74" rx="9" fill={P.w} />
      {[[36, 76], [48, 70], [58, 66], [68, 58], [80, 52], [92, 46], [104, 38], [116, 32], [126, 26]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.5" fill={P.teal} />)}
      <line x1="30" y1="80" x2="132" y2="22" stroke={P.coral} strokeWidth="3" strokeLinecap="round" />
      <text x="40" y="32" fontFamily={MONO} fontSize="10" fontWeight="800" fill={P.ink}>r = 0.9</text>
    </g>
  ),
  bell: () => {
    const pts = Array.from({ length: 41 }, (_, i) => {
      const z = -3 + (6 * i) / 40;
      return `${80 + z * 20},${(84 - 60 * Math.exp(-(z * z) / 2)).toFixed(2)}`;
    }).join(" ");
    return (
      <g>
        <polygon points={`20,84 ${pts} 140,84`} fill={P.teal} opacity="0.25" />
        <polyline points={pts} fill="none" stroke={P.teal} strokeWidth="4" strokeLinejoin="round" />
        <line x1="16" y1="84" x2="144" y2="84" style={LINE} strokeWidth="3" strokeLinecap="round" />
        <line x1="80" y1="24" x2="80" y2="84" stroke={P.indigo} strokeWidth="2.5" strokeDasharray="4 3" />
      </g>
    );
  },
  test: () => (
    <g>
      <rect x="22" y="22" width="56" height="62" rx="9" fill={P.w} />
      <text x="50" y="44" textAnchor="middle" fontFamily={MONO} fontSize="10" fontWeight="800" fill={P.ink}>p &lt; 0.05</text>
      <rect x="30" y="54" width="40" height="5" rx="2.5" fill={P.teal} />
      <rect x="30" y="64" width="30" height="5" rx="2.5" fill="#a0a6c8" />
      <circle cx="108" cy="50" r="22" fill={P.w} stroke={P.ink} strokeWidth="4" />
      <line x1="124" y1="66" x2="140" y2="82" style={LINE} strokeWidth="7" strokeLinecap="round" />
      <path d="M98 50 l7 7 12 -14" stroke={P.mint} strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  regression: () => (
    <g>
      <line x1="26" y1="84" x2="138" y2="84" style={LINE} strokeWidth="3" strokeLinecap="round" />
      <line x1="26" y1="84" x2="26" y2="16" style={LINE} strokeWidth="3" strokeLinecap="round" />
      {[[40, 70], [54, 72], [62, 58], [76, 60], [88, 46], [98, 50], [112, 34], [124, 36]].map(([x, y], i) => {
        const ly = 78 - (Number(x) - 30) * 0.42;
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x} y2={ly} stroke={P.tang} strokeWidth="2" strokeDasharray="3 2" />
            <circle cx={x} cy={y} r="4.5" fill={P.sky} />
          </g>
        );
      })}
      <line x1="30" y1="78" x2="136" y2="33.5" stroke={P.coral} strokeWidth="4" strokeLinecap="round" />
    </g>
  ),
  apply: () => (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={22 + i * 30} y="24" width="22" height="18" rx="5" fill={P.sky} />
          <path d={`M${33 + i * 30} 44 v10`} style={LINE} strokeWidth="2.5" />
          <rect x={22 + i * 30} y="56" width="22" height="18" rx="5" fill={P.mint} />
        </g>
      ))}
      <rect x="18" y="45" width="122" height="10" rx="5" fill={P.sun} />
      <text x="79" y="53" textAnchor="middle" fontFamily={MONO} fontSize="7.5" fontWeight="800" fill={P.ink}>sapply(x, f)</text>
    </g>
  ),
  calendar: () => (
    <g>
      <rect x="30" y="22" width="66" height="62" rx="9" fill={P.w} />
      <rect x="30" y="22" width="66" height="16" rx="9" fill={P.sun} />
      <rect x="30" y="32" width="66" height="6" fill={P.sun} />
      {[0, 1, 2].map((r) => [0, 1, 2, 3].map((cc) => <rect key={`${r}${cc}`} x={36 + cc * 14} y={44 + r * 12} width="10" height="8" rx="2" fill={r === 1 && cc === 2 ? P.coral : P.soft} />))}
      <rect x="104" y="40" width="42" height="26" rx="7" fill={P.grape} />
      <text x="125" y="57" textAnchor="middle" fontSize="11" fontWeight="800" fill={P.w}>Aa</text>
      <text x="125" y="80" textAnchor="middle" fontFamily={MONO} fontSize="9" fontWeight="800" fill={P.ink}>{"^\\d+$"}</text>
    </g>
  ),
  package: () => (
    <g>
      <path d="M80 16 l40 18 v40 l-40 18 -40 -18 v-40z" fill={P.tang} />
      <path d="M40 34 l40 18 40 -18" stroke={P.w} strokeWidth="3" fill="none" opacity="0.7" />
      <path d="M80 52 v40" stroke={P.w} strokeWidth="3" opacity="0.7" />
      <path d="M60 25 l40 18" stroke={P.sun} strokeWidth="6" />
      <circle cx="132" cy="76" r="12" fill={P.coral} />
      <path d="M126 74 h12 M132 68 v12" stroke={P.w} strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  map: () => (
    <g>
      <path d="M22 26 l36 -10 44 10 36 -10 v64 l-36 10 -44 -10 -36 10z" fill={P.w} />
      <path d="M58 16 v64 M102 26 v64" stroke="#dde1f4" strokeWidth="2" />
      <path d="M36 70 q20 -30 40 -12 t42 -24" stroke={P.indigo} strokeWidth="3" strokeDasharray="5 4" fill="none" />
      <circle cx="36" cy="70" r="5" fill={P.mint} />
      <path d="M118 22 c-7 0 -11 5 -11 10 c0 8 11 17 11 17 s11 -9 11 -17 c0 -5 -4 -10 -11 -10z" fill={P.coral} />
      <circle cx="118" cy="32" r="4" fill={P.w} />
    </g>
  ),
  report: () => (
    <g>
      <rect x="38" y="12" width="70" height="82" rx="8" fill={P.w} />
      <rect x="46" y="22" width="40" height="6" rx="3" fill={P.ink} />
      <Bars x={48} y={62} heights={[14, 24, 18, 30]} colors={[P.sky, P.mint, P.sun, P.pink]} w={9} gap={4} />
      <rect x="46" y="70" width="52" height="4" rx="2" fill="#a0a6c8" />
      <rect x="46" y="78" width="40" height="4" rx="2" fill="#a0a6c8" />
      <circle cx="122" cy="64" r="16" fill={P.sun} />
      <path d="M115 64 l5 5 9 -10" stroke={P.ink} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  trophy: () => (
    <g>
      <path d="M58 18 h44 v22 a22 22 0 0 1 -44 0z" fill={P.sun} />
      <path d="M58 24 h-12 a10 10 0 0 0 12 18 M102 24 h12 a10 10 0 0 1 -12 18" stroke={P.sun} strokeWidth="5" fill="none" />
      <rect x="74" y="60" width="12" height="14" fill={P.sun} />
      <rect x="62" y="74" width="36" height="12" rx="4" fill={P.tang} />
      <path d="M80 26 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill={P.w} />
    </g>
  ),
};

export function TopicArt({ kind, className, bg, label }: { kind: TopicKind; className?: string; bg?: string; label?: string }) {
  const S = scenes[kind] ?? scenes.code;
  return (
    <svg viewBox="0 0 160 100" className={cn("h-auto w-full", className)} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <rect width="160" height="100" fill={bg ?? "var(--surface-2)"} />
      <circle cx="146" cy="8" r="26" fill="#ffffff" opacity="0.18" />
      <circle cx="10" cy="96" r="20" fill="#ffffff" opacity="0.14" />
      {S()}
    </svg>
  );
}
