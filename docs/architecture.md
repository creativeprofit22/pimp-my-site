# Architecture

A small self-hosted loop: watch visitors, let an agent propose one page change, show it to half the visitors, judge it weekly on "stayed 30s", and ship only what a human approves.

Background: `docs/brief.md` (the idea), `docs/plan.md` (day-1 plan), `docs/research.md` (findings and simulation), ADRs in `docs/adr/`.

## Parts

| Folder | Runs in | Job |
|---|---|---|
| `site/` | browser | The static page. Reads `variants/*.json` over HTTP; fallback text lives in the markup. |
| `variants/` | data | Content that can differ between versions (`hero.json`). The only place the agent writes. |
| `packages/tracker` | browser | Cookieless events: view, scroll depth, stayed 30s, exit. Sends with `sendBeacon`. |
| `packages/recorder` | browser | Optional rrweb recording, 20% sample, all inputs masked. |
| `packages/server` | Node | Ingest endpoint, bot filter, rate limit, storage, variant assignment, approve/reject links. |
| `packages/stats` | anywhere | Pure functions: sticky assignment hash, sample-ratio check, weekly decision rule. |
| `packages/agent` | Node | Weekly report CLI (later MCP). Reads counts, proposes a new `variants/*.json`. |
| `packages/notify` | Node | Sends the report and approval links to Discord. |

## Data flow

```
 visitor browser                                  your VPS (ADR 0001)
 ┌──────────────────────────────┐                ┌──────────────────────────────────────┐
 │ site/index.html + hero.js    │◀── GET ────────│ static files: site/, variants/*.json │
 │   reads variants/hero.json   │                │                                      │
 │ @pms/tracker  ──events──────────sendBeacon──▶│ @pms/server  ingest                  │
 │ @pms/recorder ──chunks──────────POST────────▶│   bot filter, rate limit, no IP kept │
 └──────────────────────────────┘                │   visitor = daily salted hash (0003) │
                                                 │        │                             │
                                                 │        ▼                             │
                                                 │   EventStore: SQLite (0002)          │
                                                 │        │ VariantCounts per week      │
                                                 │        ▼                             │
                                                 │ @pms/stats  weekly rule (0004)       │
                                                 │        │ WeeklyDecision              │
                                                 │        ▼                             │
                                                 │ @pms/agent  report + VariantProposal │
                                                 │        │                             │
                                                 │        ▼                             │
                                                 │ @pms/notify ──▶ Discord ──▶ owner    │
                                                 └────────▲─────────────────────┬───────┘
                                                          │ approve link        │
                                                          │ (secret, server)    │
                                                          └─────────────────────┘
                                   on approval: the proposal is written to variants/*.json
```

Cron on the VPS runs the weekly report (ADR 0004). Nothing goes live without the owner's click.

## Boundary rules

1. **Browser code never imports server code.** `site/`, `packages/tracker` and `packages/recorder` must not import `@pms/server`, any path into `packages/server`, or any Node built-in (`node:*`, `fs`, …).
2. **The agent may only write `variants/*.json`.** No other file in the repo or on the server is writable by the agent. Every write is a proposal until a human approves it. (Enforced in code in the agent phase; documented here now.)
3. **`stats` stays pure.** No I/O: no `node:fs`, `node:http`, `node:sqlite`, `node:net`, no `fetch`, no other `@pms/*` package. Same input, same output.
4. **Reusable packages take domain input only through named interfaces.** Each package exports its types from `src/index.ts` (e.g. `EventStore`, `VisitCounts`, `WeeklyDecision`, `Notifier`). Other packages import `@pms/<name>` only, never a deep path or a relative `../../` path into another package.
5. **Allowed workspace dependencies:**

   | Package | May import |
   |---|---|
   | tracker, recorder, stats, notify | no other `@pms/*` |
   | agent | `@pms/stats` |
   | server | `@pms/stats`, `@pms/notify` |

Rules 1, 3, 4 and 5 are checked by `scripts/check-boundaries.mjs`, which runs in `npm run lint` and CI. `tests/boundaries.test.ts` proves the checker rejects bad imports.

## Privacy baseline

No cookies, no IP stored, no personal data. Recordings mask all inputs, are sampled, stay on the VPS and are deleted after 30 days. The privacy policy says the site measures visits and may record some of them.
