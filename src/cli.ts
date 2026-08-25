import { readFileSync } from "node:fs";
import { evaluate, type PlatformSpec } from "./gate.ts";

const file = process.argv[2];
if (!file) {
  console.error("usage: node --experimental-strip-types src/cli.ts <spec.json>");
  process.exit(2);
}

const spec = JSON.parse(readFileSync(file, "utf8")) as PlatformSpec;
const result = evaluate(spec);
if (result.allowed) {
  console.log("READY");
  process.exit(0);
}
console.log("BLOCKED");
for (const finding of result.findings) console.log(`- ${finding}`);
process.exit(1);
