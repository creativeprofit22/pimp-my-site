# @pms/server

Small Node HTTP server: ingests tracker events, stores them (SQLite via `node:sqlite`, see ADR 0002), serves variant assignment and the approval endpoints called from Discord.

Runs in: Node 22+.

## Public API

Exported from `src/index.ts`. Other packages use only these named types.

- `StoredEvent` – an event as kept on disk (no IP, daily visitor hash only)
- `EventStore` – the storage interface (`append`, `countsFor`)
- `ApprovalRequest` – one pending change waiting for a human

## Allowed dependencies

- Runtime: Node built-ins only (`node:http`, `node:sqlite`, `node:crypto`)
- Workspace: `@pms/stats` (pure functions), `@pms/notify` (via its `Notifier` interface)
- Forbidden: browser packages importing this package

See `docs/architecture.md` for the boundary rules (checked by `npm run lint`).
