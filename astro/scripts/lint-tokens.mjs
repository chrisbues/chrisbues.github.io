#!/usr/bin/env node
/**
 * Enforces the two house rules that keep AI-generated components
 * theme-able without hand-editing:
 *
 *   1. No raw color values in components — use design tokens.
 *   2. No `dark:` variants — dark mode is a token swap in tokens.css.
 *
 * Comments are stripped before checking, so documenting a hex value
 * (e.g. explaining why status red/green can't carry meaning alone)
 * is allowed; using one is not.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["src/components", "src/layouts", "src/pages"];
const EXTS = new Set([".tsx", ".jsx", ".ts", ".js", ".astro", ".mdx"]);
const RULES = [
  { re: /#[0-9a-fA-F]{3,8}\b/g, msg: "raw hex color" },
  { re: /\brgba?\(/g, msg: "raw rgb()/rgba() color" },
  { re: /\bdark:/g, msg: "`dark:` variant (dark mode is a token swap)" },
];

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const p = join(dir, entry);
    return statSync(p).isDirectory() ? walk(p) : EXTS.has(extname(p)) ? [p] : [];
  });

/** Blank out comments so documentation can mention what code may not use. */
const stripComments = (src) =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length))
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, (m) => m.replace(/[^\n]/g, " "));

let violations = 0;
for (const root of ROOTS) {
  let files;
  try {
    files = walk(root);
  } catch {
    continue;
  }
  for (const file of files) {
    const lines = stripComments(readFileSync(file, "utf8")).split("\n");
    lines.forEach((line, i) => {
      for (const { re, msg } of RULES) {
        re.lastIndex = 0;
        const hit = re.exec(line);
        if (hit) {
          console.error(`${file}:${i + 1}  ${msg} — ${hit[0]}`);
          violations++;
        }
      }
    });
  }
}

if (violations) {
  console.error(
    `\n✗ ${violations} token violation(s). Components must use design tokens from src/styles/tokens.css.`,
  );
  process.exit(1);
}
console.log("✓ tokens ok — no raw colors, no dark: variants in components");
