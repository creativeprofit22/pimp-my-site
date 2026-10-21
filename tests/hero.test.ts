import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { applyHero } from "../site/hero.js";

function fakeDoc() {
  const nodes: Record<string, { textContent: string | null }> = {
    "hero-headline": { textContent: "fallback headline" },
    "hero-subhead": { textContent: "fallback subhead" },
  };
  const attrs: Record<string, string> = {};
  return {
    nodes,
    attrs,
    getElementById: (id: string) => nodes[id] ?? null,
    querySelector: (sel: string) =>
      sel === ".hero"
        ? {
            setAttribute: (name: string, value: string) => {
              attrs[name] = value;
            },
          }
        : null,
  };
}

describe("applyHero", () => {
  it("sets hero text and variant id from variants/hero.json", () => {
    const data = JSON.parse(
      readFileSync(new URL("../variants/hero.json", import.meta.url), "utf8"),
    );
    const doc = fakeDoc();
    expect(applyHero(doc, data)).toBe(true);
    expect(doc.nodes["hero-headline"]?.textContent).toBe(data.headline);
    expect(doc.nodes["hero-subhead"]?.textContent).toBe(data.subhead);
    expect(doc.attrs["data-variant"]).toBe(data.id);
  });

  it("keeps fallback text for invalid data", () => {
    for (const bad of [
      null,
      "x",
      {},
      { id: "a", headline: 1, subhead: "s" },
      { id: "a", headline: " ", subhead: "s" },
    ]) {
      const doc = fakeDoc();
      expect(applyHero(doc, bad)).toBe(false);
      expect(doc.nodes["hero-headline"]?.textContent).toBe("fallback headline");
    }
  });

  it("treats markup as plain text", () => {
    const doc = fakeDoc();
    applyHero(doc, { id: "a", headline: "<img src=x onerror=alert(1)>", subhead: "s" });
    expect(doc.nodes["hero-headline"]?.textContent).toBe("<img src=x onerror=alert(1)>");
  });
});

describe("site/index.html", () => {
  it("has fallback hero text and loads hero.js, with no tracking script", () => {
    const html = readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
    expect(html).toMatch(/id="hero-headline">[^<]+</);
    expect(html).toMatch(/id="hero-subhead">[^<]+</);
    expect(html).toContain('src="./hero.js"');
    expect(html).not.toMatch(/tracker|analytics|gtag|sendBeacon/i);
  });
});
