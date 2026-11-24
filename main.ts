import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "All of our servers are down, including the ones that would tell me why. I cannot check the cause yet, and I will not guess.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

if (LINE.length < 1 || LINE.length > 160) {
  console.error(`line is ${LINE.length} characters, must be 1-160`);
  process.exit(1);
}
if (LINE.trim().length === 0 || LINE.includes("\n")) {
  console.error("line must be non-whitespace and a single line");
  process.exit(1);
}
// Ties break on bytes: the line is pure ASCII, so bytes must equal chars.
const byteLength = Buffer.byteLength(LINE, "utf8");
if (byteLength !== LINE.length) {
  console.error(`byte length ${byteLength} != char length ${LINE.length}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");
const readBack = readFileSync(outPath, "utf8");
if (readBack !== LINE) {
  console.error("read-back differs from the line");
  process.exit(1);
}
