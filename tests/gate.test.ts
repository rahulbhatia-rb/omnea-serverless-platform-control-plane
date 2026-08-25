import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { evaluate, type PlatformSpec } from "../src/gate.ts";

function load(path: string): PlatformSpec {
  return JSON.parse(readFileSync(path, "utf8")) as PlatformSpec;
}

test("production contract passes", () => {
  const result = evaluate(load("examples/production-platform.json"));
  assert.equal(result.allowed, true);
  assert.deepEqual(result.findings, []);
});

test("unsafe contract is blocked with broad coverage", () => {
  const result = evaluate(load("examples/unsafe-platform.json"));
  assert.equal(result.allowed, false);
  assert.ok(result.findings.length >= 40);
});
