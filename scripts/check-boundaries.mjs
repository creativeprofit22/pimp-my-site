// Enforces the boundary rules from docs/architecture.md by scanning import specifiers.
// Run: node scripts/check-boundaries.mjs   (part of `npm run lint`)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { builtinModules } from "node:module";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SOURCE_EXT = /\.(?:[cm]?js|[cm]?ts)$/;
const BUILTINS = new Set(builtinModules.map((m) => m.replace(/^node:/, "")));
const IO_BUILTINS = new Set([
  "fs",
  "fs/promises",
  "http",
  "https",
  "http2",
  "net",
  "tls",
  "dgram",
  "dns",
  "sqlite",
  "child_process",
  "worker_threads",
  "cluster",
  "readline",
]);

/** Workspace packages each package may import (by package name). */
const ALLOWED_WORKSPACE = {
  tracker: [],
  recorder: [],
  stats: [],
  notify: [],
  agent: ["stats"],
  server: ["stats", "notify"],
};
const BROWSER = new Set(["tracker", "recorder"]);

/** Returns every module specifier imported or required by the source text. */
export function findSpecifiers(source) {
  const out = [];
  const patterns = [
    /\b(?:import|export)\s[^'"`;]*?\sfrom\s*['"]([^'"]+)['"]/g,
    /\bimport\s*['"]([^'"]+)['"]/g,
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const re of patterns) {
    for (const m of source.matchAll(re)) out.push(m[1]);
  }
  return out;
}

function builtinName(spec) {
  const bare = spec.replace(/^node:/, "");
  if (spec.startsWith("node:") || BUILTINS.has(bare) || BUILTINS.has(bare.split("/")[0])) {
    return bare;
  }
  return null;
}

/** Which area a repo-relative path (forward slashes) belongs to, or null if unchecked. */
export function areaOf(relPath) {
  if (relPath.startsWith("site/")) return { kind: "site" };
  const m = /^packages\/([^/]+)\/src\//.exec(relPath);
  if (m) return { kind: "package", name: m[1] };
  return null;
}

/**
 * Checks one file's source against the rules for its area.
 * @param {string} relPath repo-relative path with forward slashes
 * @param {string} source file contents
 * @returns {string[]} human-readable violations (empty when clean)
 */
export function checkSource(relPath, source) {
  const area = areaOf(relPath);
  if (!area) return [];
  const problems = [];
  const fail = (msg) => problems.push(`${relPath}: ${msg}`);
  const isBrowser = area.kind === "site" || BROWSER.has(area.name);

  for (const spec of findSpecifiers(source)) {
    const builtin = builtinName(spec);
    const pms = /^@pms\/([^/]+)(\/.*)?$/.exec(spec);

    if (isBrowser && builtin !== null) fail(`browser code must not import "${spec}"`);
    if (isBrowser && (pms?.[1] === "server" || /packages\/server/.test(spec))) {
      fail(`browser code must not import server code ("${spec}")`);
    }

    if (area.kind === "package") {
      if (area.name === "stats" && builtin !== null && IO_BUILTINS.has(builtin)) {
        fail(`stats must stay pure; "${spec}" does I/O`);
      }
      if (pms) {
        if (pms[2]) fail(`import "@pms/${pms[1]}" only through its public index, not "${spec}"`);
        const allowed = ALLOWED_WORKSPACE[area.name] ?? [];
        if (pms[1] !== area.name && !allowed.includes(pms[1])) {
          fail(`${area.name} may not depend on @pms/${pms[1]}`);
        }
      }
      if (spec.startsWith(".") && /(?:^|\/)\.\.\/\.\.\//.test(spec)) {
        fail(`relative import "${spec}" leaves the package; use the @pms/* name`);
      }
    }
  }

  if (
    area.kind === "package" &&
    area.name === "stats" &&
    /\b(?:fetch|XMLHttpRequest)\s*\(/.test(source)
  ) {
    fail("stats must stay pure; network calls are not allowed");
  }
  return problems;
}

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (SOURCE_EXT.test(name)) files.push(full);
  }
  return files;
}

export function checkRepo(root) {
  const problems = [];
  const dirs = ["site", "packages"].map((d) => join(root, d));
  for (const dir of dirs) {
    let files = [];
    try {
      files = walk(dir);
    } catch {
      continue;
    }
    for (const file of files) {
      const rel = relative(root, file).split(sep).join("/");
      problems.push(...checkSource(rel, readFileSync(file, "utf8")));
    }
  }
  return problems;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
  const problems = checkRepo(root);
  if (problems.length > 0) {
    console.error(`Boundary check failed (${problems.length}):`);
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }
  console.log("Boundary check passed.");
}
