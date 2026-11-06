// Copies the webR runtime (R compiled to WebAssembly) from node_modules into
// public/webr so the app can serve R itself instead of depending on a CDN.
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules", "webr", "dist");
const dest = join(root, "public", "webr");

if (!existsSync(src)) {
  console.warn("[copy-webr] node_modules/webr/dist not found – skipping.");
  process.exit(0);
}

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

const files = ["R.js", "R.wasm", "libRblas.so", "libRlapack.so", "webr-worker.js"];
for (const f of files) cpSync(join(src, f), join(dest, f));
cpSync(join(src, "vfs"), join(dest, "vfs"), { recursive: true });
console.log("[copy-webr] webR runtime copied to public/webr");
