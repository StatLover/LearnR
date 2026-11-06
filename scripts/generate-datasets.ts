/**
 * Generates the sample CSV datasets used throughout R Academy.
 *
 * The data is synthetic (made up) but realistic, and generated from a fixed
 * random seed so it is identical every time. Run with:  npm run datasets
 * Output: public/data/*.csv  (served to the browser and loaded into webR)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "data");
mkdirSync(OUT, { recursive: true });

// ---------- seeded random helpers ----------
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
let rand = mulberry32(2024);
const reseed = (s: number) => (rand = mulberry32(s));
const runif = (a: number, b: number) => a + (b - a) * rand();
const rint = (a: number, b: number) => Math.floor(runif(a, b + 1));
const rnorm = (mean = 0, sd = 1) => {
  const u = Math.max(rand(), 1e-12);
  const v = rand();
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
const pick = <T,>(xs: T[]) => xs[Math.floor(rand() * xs.length)];
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const round = (x: number, d = 0) => {
  const f = 10 ** d;
  return Math.round(x * f) / f;
};
const pad = (n: number, w = 3) => String(n).padStart(w, "0");

function toCsv(header: string[], rows: (string | number | null)[][]) {
  const esc = (v: string | number | null) => {
    if (v === null) return "NA";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [header.join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n") + "\n";
}
function write(name: string, header: string[], rows: (string | number | null)[][]) {
  writeFileSync(join(OUT, name), toCsv(header, rows));
  console.log(`wrote ${name} (${rows.length} rows)`);
}

const FIRST = [
  "Amara", "Ben", "Chloe", "Daniel", "Elena", "Farid", "Grace", "Hugo", "Isla", "Jamal",
  "Keiko", "Liam", "Maya", "Noah", "Olivia", "Pablo", "Quinn", "Rosa", "Samir", "Tara",
  "Umar", "Vera", "Wei", "Ximena", "Yusuf", "Zoe", "Aiden", "Bianca", "Carlos", "Dina",
  "Ethan", "Fatima", "George", "Hana", "Ivan", "Julia", "Kofi", "Lena", "Mateo", "Nadia",
  "Oscar", "Priya", "Ravi", "Sofia", "Tomas", "Uma", "Victor", "Wendy", "Xavier", "Yara",
  "Zane", "Alice", "Bruno", "Clara", "Diego", "Emma", "Felix", "Gina", "Hassan", "Ines",
];

const FEMALE = new Set([
  "Amara", "Chloe", "Elena", "Grace", "Isla", "Keiko", "Maya", "Olivia", "Quinn", "Rosa", "Tara",
  "Vera", "Ximena", "Zoe", "Bianca", "Dina", "Fatima", "Hana", "Julia", "Lena", "Nadia", "Priya",
  "Sofia", "Uma", "Wendy", "Yara", "Alice", "Clara", "Emma", "Gina", "Ines",
]);
const genderOf = (first: string): "Female" | "Male" => (FEMALE.has(first) ? "Female" : "Male");

// ---------- 1. students.csv ----------
reseed(101);
{
  const rows: (string | number | null)[][] = [];
  for (let i = 1; i <= 60; i++) {
    const gender = genderOf(FIRST[i - 1]);
    const age = rint(16, 19);
    const cls = pick(["A", "B", "C"]);
    const study = clamp(Math.round(rnorm(9, 4)), 1, 20);
    const attendance = clamp(Math.round(rnorm(86, 8)), 55, 100);
    const ability = rnorm(0, 7);
    const base = 38 + 1.9 * study + 0.25 * attendance + ability;
    const math = clamp(Math.round(base + rnorm(0, 6)), 20, 100);
    const reading = clamp(Math.round(base + 3 + rnorm(0, 6)), 20, 100);
    let science: number | null = clamp(Math.round(base - 1 + rnorm(0, 7)), 20, 100);
    if ([7, 23, 41].includes(i)) science = null;
    rows.push([`S${pad(i)}`, FIRST[i - 1], gender, age, cls, study, attendance, math, reading, science]);
  }
  write(
    "students.csv",
    ["student_id", "name", "gender", "age", "class", "study_hours", "attendance", "math", "reading", "science"],
    rows,
  );
}

// ---------- 2. survey.csv ----------
reseed(202);
{
  const rows: (string | number | null)[][] = [];
  const ages = ["18-24", "25-34", "35-44", "45-54", "55+"];
  const feats = ["Search", "Recommendations", "Price", "Support"];
  for (let i = 1; i <= 200; i++) {
    const ageGroup = pick(ages);
    const gender = rand() < 0.04 ? "Non-binary" : rand() < 0.5 ? "Female" : "Male";
    const region = pick(["North", "South", "East", "West"]);
    const ageIdx = ages.indexOf(ageGroup);
    let hours: number | null = round(clamp(rnorm(4.2 - 0.45 * ageIdx, 1.4), 0.2, 10), 1);
    const feature = pick(feats);
    const satLatent = 3.3 + (feature === "Support" ? -0.5 : 0) + (feature === "Price" ? 0.3 : 0) + (region === "West" ? 0.3 : 0) + rnorm(0, 1);
    const satisfaction = clamp(Math.round(satLatent), 1, 5);
    const recommend = rand() < 0.15 + 0.17 * satisfaction ? "Yes" : "No";
    if (i % 23 === 0) hours = null;
    rows.push([i, ageGroup, gender, region, satisfaction, recommend, hours, feature]);
  }
  write(
    "survey.csv",
    ["respondent_id", "age_group", "gender", "region", "satisfaction", "recommend", "hours_online", "favorite_feature"],
    rows,
  );
}

// ---------- 3. sales.csv ----------
reseed(303);
{
  const rows: (string | number | null)[][] = [];
  const regions: Record<string, { base: number; growth: number; price: number }> = {
    North: { base: 420, growth: 6, price: 24.5 },
    South: { base: 360, growth: 9, price: 23.0 },
    East: { base: 300, growth: 3, price: 26.0 },
    West: { base: 480, growth: -1.5, price: 22.0 },
  };
  for (let y = 2022; y <= 2024; y++) {
    for (let m = 1; m <= 12; m++) {
      const t = (y - 2022) * 12 + (m - 1);
      const season = 1 + 0.18 * Math.sin(((m - 3) / 12) * 2 * Math.PI) + (m === 11 || m === 12 ? 0.22 : 0);
      for (const [region, p] of Object.entries(regions)) {
        const units = Math.max(50, Math.round((p.base + p.growth * t) * season * (1 + rnorm(0, 0.06))));
        const revenue = round(units * p.price * (1 + rnorm(0, 0.02)), 2);
        rows.push([`${y}-${String(m).padStart(2, "0")}-01`, region, units, revenue]);
      }
    }
  }
  write("sales.csv", ["month", "region", "units", "revenue"], rows);
}

// ---------- 4. patients.csv ----------
reseed(404);
{
  const rows: (string | number | null)[][] = [];
  for (let i = 1; i <= 150; i++) {
    const age = rint(25, 80);
    const sex = rand() < 0.52 ? "Female" : "Male";
    const smoker = rand() < 0.22 ? "Yes" : "No";
    const exercise = clamp(Math.round(rnorm(3, 2)), 0, 7);
    let bmi: number | null = round(clamp(rnorm(27 - 0.4 * exercise + 0.03 * (age - 50), 4), 17, 45), 1);
    const sbp = Math.round(clamp(rnorm(105 + 0.55 * age + (smoker === "Yes" ? 6 : 0) + 0.6 * ((bmi as number) - 27), 11), 90, 190));
    let chol: number | null = Math.round(clamp(rnorm(170 + 0.7 * age + (smoker === "Yes" ? 12 : 0), 28), 120, 320));
    const logit = -7.2 + 0.05 * age + 0.13 * (bmi as number) - 0.15 * exercise;
    const diabetes = rand() < 1 / (1 + Math.exp(-logit)) ? "Yes" : "No";
    if ([12, 37, 64, 98, 131].includes(i)) bmi = null;
    if ([5, 29, 77, 88, 120, 144].includes(i)) chol = null;
    rows.push([`P${pad(i)}`, age, sex, bmi, sbp, chol, smoker, exercise, diabetes]);
  }
  write(
    "patients.csv",
    ["patient_id", "age", "sex", "bmi", "systolic_bp", "cholesterol", "smoker", "exercise_days", "diabetes"],
    rows,
  );
}

// ---------- 5. customers_messy.csv ----------
reseed(505);
{
  const rows: (string | number | null)[][] = [];
  const cities = ["New York", "Chicago", "Houston", "Seattle", "Boston"];
  const messCity = (c: string) => pick([c, c, c.toLowerCase(), c.toUpperCase(), ` ${c} `]);
  const messGender = (g: "F" | "M") =>
    g === "F" ? pick(["Female", "female", "F", "Female", " f"]) : pick(["Male", "male", "M", "Male", "MALE "]);
  for (let i = 1; i <= 56; i++) {
    const first = FIRST[(i * 7) % FIRST.length];
    const last = pick(["Smith", "Garcia", "Chen", "Okafor", "Novak", "Silva", "Khan", "Müller", "Rossi", "Kim"]);
    let name = `${first} ${last}`;
    if (i % 6 === 0) name = `  ${name}`;
    if (i % 9 === 0) name = name.toUpperCase();
    if (i % 11 === 0) name = name.toLowerCase();
    let age: string = String(rint(19, 74));
    if (i === 8) age = "";
    if (i === 15) age = "unknown";
    if (i === 27) age = "-4";
    if (i === 33) age = "230";
    if (i === 46) age = "N/A";
    const gender = messGender(genderOf(first) === "Female" ? "F" : "M");
    const city = messCity(pick(cities));
    const month = rint(1, 12);
    const day = rint(1, 28);
    const year = pick([2022, 2023, 2023, 2024]);
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const us = `${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}/${year}`;
    const signup = i % 4 === 0 ? us : iso;
    const amount = round(Math.exp(rnorm(6, 0.8)), 2);
    let spent: string;
    if (i % 5 === 0) spent = `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    else spent = amount.toFixed(2);
    if (i === 19 || i === 40) spent = "";
    if (i === 52) spent = "N/A";
    rows.push([`C${pad(i)}`, name, age, gender, city, signup, spent]);
  }
  // duplicated rows (exact copies) – a classic data-entry problem
  for (const k of [3, 17, 30, 44]) rows.splice(k + 1, 0, [...rows[k]]);
  write("customers_messy.csv", ["customer_id", "name", "age", "gender", "city", "signup_date", "total_spent"], rows);
}

// ---------- 6. housing.csv ----------
reseed(606);
{
  const rows: (string | number | null)[][] = [];
  const hoods: Record<string, number> = { Downtown: 85000, Riverside: 40000, Hillcrest: 60000, Oakwood: 0 };
  for (let i = 1; i <= 200; i++) {
    const hood = pick(Object.keys(hoods));
    const bedrooms = clamp(Math.round(rnorm(3, 1)), 1, 5);
    const size = Math.round(clamp(rnorm(650 + 420 * bedrooms, 260), 550, 3800) / 10) * 10;
    const bathrooms = clamp(Math.round(bedrooms / 2 + rnorm(0.4, 0.5)) , 1, 4);
    let year: number | null = rint(1950, 2022);
    const garage = rand() < 0.6 ? "Yes" : "No";
    const ageEffect = -650 * (2024 - (year as number)) / 10;
    const price = Math.round((42000 + 128 * size + hoods[hood] + 9000 * bathrooms + (garage === "Yes" ? 14000 : 0) + ageEffect * 10 + rnorm(0, 26000)) / 500) * 500;
    if ([14, 58, 103, 167].includes(i)) year = null;
    rows.push([i, hood, size, bedrooms, bathrooms, year, garage, price]);
  }
  write(
    "housing.csv",
    ["house_id", "neighborhood", "size_sqft", "bedrooms", "bathrooms", "year_built", "garage", "price"],
    rows,
  );
}

// ---------- 7. weather.csv ----------
reseed(707);
{
  const rows: (string | number | null)[][] = [];
  const start = Date.UTC(2023, 0, 1);
  for (let d = 0; d < 365; d++) {
    const date = new Date(start + d * 86400000).toISOString().slice(0, 10);
    const seasonal = 13 + 11 * Math.sin(((d - 105) / 365) * 2 * Math.PI);
    const tmax = round(seasonal + 4.5 + rnorm(0, 3), 1);
    const tmin = round(tmax - clamp(rnorm(8, 2), 2, 14), 1);
    const rain = rand() < 0.32 ? round(Math.exp(rnorm(1.2, 0.9)), 1) : 0;
    rows.push([date, tmax, tmin, rain]);
  }
  write("weather.csv", ["date", "temp_max", "temp_min", "rain_mm"], rows);
}
