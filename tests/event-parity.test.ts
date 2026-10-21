import { describe, expect, it } from "vitest";
import type { StoredEvent } from "../packages/server/src/index.ts";
import type { TrackerEvent, TrackerEventKind } from "../packages/tracker/src/index.ts";

// Tracker and server keep hand-copied event shapes (tracker may not import @pms/server,
// see docs/architecture.md rules 1 and 5). These assertions fail `npm run typecheck`
// as soon as the two drift apart.
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

const kinds: Equal<TrackerEventKind, StoredEvent["kind"]> = true;
const depth: Equal<TrackerEvent["depth"], StoredEvent["depth"]> = true;

describe("tracker ↔ server event contract", () => {
  it("keeps event kind and depth types identical", () => {
    expect([kinds, depth]).toEqual([true, true]);
  });
});
