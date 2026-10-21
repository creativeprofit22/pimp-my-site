// Loads hero text from variants/hero.json. No tracking here.
// The markup already contains fallback text, so a failed fetch leaves the page usable.

const HERO_URL = "../variants/hero.json";

/**
 * Applies hero data to the document. Uses textContent only, never innerHTML.
 * @param {{ getElementById(id: string): { textContent: string | null } | null, querySelector(sel: string): { setAttribute(name: string, value: string): void } | null }} doc
 * @param {unknown} data
 * @returns {boolean} true when the data was valid and applied
 */
export function applyHero(doc, data) {
  if (typeof data !== "object" || data === null) return false;
  const { id, headline, subhead } = /** @type {Record<string, unknown>} */ (data);
  if (typeof id !== "string" || typeof headline !== "string" || typeof subhead !== "string") {
    return false;
  }
  if (headline.trim() === "" || subhead.trim() === "") return false;

  const h = doc.getElementById("hero-headline");
  const p = doc.getElementById("hero-subhead");
  if (!h || !p) return false;
  h.textContent = headline;
  p.textContent = subhead;
  doc.querySelector(".hero")?.setAttribute("data-variant", id);
  return true;
}

async function loadHero() {
  try {
    const res = await fetch(HERO_URL, { cache: "no-store" });
    if (!res.ok) return;
    applyHero(document, await res.json());
  } catch {
    // Keep the fallback text from the markup.
  }
}

if (typeof document !== "undefined") {
  loadHero();
}
