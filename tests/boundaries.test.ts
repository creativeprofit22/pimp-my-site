import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { checkRepo, checkSource, findSpecifiers } from "../scripts/check-boundaries.mjs";

describe("findSpecifiers", () => {
  it("finds static, side-effect, dynamic and require imports", () => {
    const src = `
      import { a,
        b } from "./x.js";
      import "./side.js";
      export * from "./re.js";
      const m = await import("./dyn.js");
      const r = require("./req.cjs");
    `;
    expect(findSpecifiers(src).sort()).toEqual(
      ["./dyn.js", "./re.js", "./req.cjs", "./side.js", "./x.js"].sort(),
    );
  });
});

describe("checkSource", () => {
  it("rejects server and node imports from browser code", () => {
    const bad = `import { EventStore } from "@pms/server";\nimport fs from "node:fs";`;
    expect(checkSource("site/hero.js", bad)).toHaveLength(2);
    expect(checkSource("packages/tracker/src/index.ts", bad).length).toBeGreaterThanOrEqual(2);
    expect(checkSource("packages/recorder/src/x.ts", `import "fs";`)).toHaveLength(1);
  });

  it("keeps stats pure", () => {
    expect(
      checkSource("packages/stats/src/index.ts", `import { readFile } from "node:fs/promises";`),
    ).not.toHaveLength(0);
    expect(
      checkSource("packages/stats/src/index.ts", `const r = await fetch("https://x");`),
    ).not.toHaveLength(0);
    expect(
      checkSource("packages/stats/src/index.ts", `import type { Notifier } from "@pms/notify";`),
    ).not.toHaveLength(0);
  });

  it("only allows listed workspace deps through the public index", () => {
    expect(
      checkSource("packages/server/src/a.ts", `import type { VisitCounts } from "@pms/stats";`),
    ).toEqual([]);
    expect(
      checkSource("packages/server/src/a.ts", `import { x } from "@pms/stats/src/inner.ts";`),
    ).not.toHaveLength(0);
    expect(
      checkSource("packages/notify/src/a.ts", `import type { EventStore } from "@pms/server";`),
    ).not.toHaveLength(0);
    expect(
      checkSource("packages/agent/src/a.ts", `import { y } from "../../server/src/index.ts";`),
    ).not.toHaveLength(0);
  });

  it("allows server to use node built-ins", () => {
    expect(
      checkSource("packages/server/src/a.ts", `import { DatabaseSync } from "node:sqlite";`),
    ).toEqual([]);
  });
});

describe("repo", () => {
  it("currently has no boundary violations", () => {
    const root = fileURLToPath(new URL("..", import.meta.url));
    expect(checkRepo(root)).toEqual([]);
  });
});
