/** URL-safe slug for a function name: "%in%" -> "in-operator", "mean" -> "mean". */
export function fnSlug(name: string): string {
  const op = /^%(.+)%$/.exec(name);
  if (op) return `${op[1]}-operator`;
  return name.replace(/[^A-Za-z0-9._-]/g, "-");
}
