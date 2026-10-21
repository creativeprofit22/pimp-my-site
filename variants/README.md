# variants/

Page content that can change between versions. This is the **only folder the agent may write**, and only `*.json` files in it (see `docs/architecture.md`).

Every change still waits for a human to approve it on Discord before it goes live.

## Files

- `hero.json` – the hero section: `{ "id": string, "headline": string, "subhead": string }`. One variant for now (`"a"`).

Shape is checked by `tests/variants.test.ts`.
