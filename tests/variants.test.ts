import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const hero = JSON.parse(readFileSync(new URL("../variants/hero.json", import.meta.url), "utf8"));

describe("variants/hero.json", () => {
  it("has exactly id, headline and subhead as non-empty strings", () => {
    expect(Object.keys(hero).sort()).toEqual(["headline", "id", "subhead"]);
    for (const key of ["id", "headline", "subhead"]) {
      expect(typeof hero[key]).toBe("string");
      expect(hero[key].trim()).not.toBe("");
    }
  });

  it("contains no markup", () => {
    expect(hero.headline).not.toMatch(/[<>]/);
    expect(hero.subhead).not.toMatch(/[<>]/);
  });
});
