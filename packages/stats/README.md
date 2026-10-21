# @pms/stats

Pure functions only: sticky variant assignment (FNV-1a), sample-ratio-mismatch check, and the weekly decision rule on "stayed 30s" (ADR 0004). No I/O of any kind.

Runs in: Node 22+.

## Public API

Exported from `src/index.ts`. Other packages use only these named types.

- `VisitCounts` – visitors and stayed-30s per variant
- `WeeklyDecision` – result of the weekly rule (`keep`, `promote`, `no-call`)
- `DecisionRule` – function type `(control, challenger) => WeeklyDecision`

## Allowed dependencies

- Runtime: none
- Workspace: none
- Forbidden: `node:fs`, `node:http`, `node:sqlite`, `node:net`, `fetch`, any other `@pms/*` package

See `docs/architecture.md` for the boundary rules (checked by `npm run lint`).
