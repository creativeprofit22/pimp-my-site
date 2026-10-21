# ADR 0002: Store events in SQLite via built-in `node:sqlite`

- Status: Accepted
- Date: 2026-10-21

## Context

Events are small rows (variant, kind, path, time, daily visitor hash). Volume is a few thousand rows a day. The weekly report needs counts per variant per window. ADR 0001 puts everything on one VPS, so a local file database fits. We want no native npm dependency.

Options:

1. **SQLite via Node's built-in `node:sqlite`** (`DatabaseSync`), one file.
2. **Daily JSON-lines files** (`events-YYYY-MM-DD.jsonl`), counted by streaming.
3. A server database (Postgres): more to run, not needed at this size.

## Verification (2026-10-21)

On the dev machine, Node v22.20.0:

```
node -e "require('node:sqlite')"   # loads without a flag
```

It loads unflagged but prints an `ExperimentalWarning` (the module is still marked experimental on Node 22). CI runs Node 22.x and 24.x.

## Decision

Use `node:sqlite` behind the `EventStore` interface in `@pms/server`. Nothing outside the server touches the database.

Fallback: if `node:sqlite` breaks or changes on a Node upgrade, implement `EventStore` with daily JSON-lines files. Callers do not change, because they only see `EventStore`.

## Consequences

- No extra dependency; one file to back up.
- Requires Node ≥ 22.13 (`engines` in `package.json`).
- The experimental warning shows in logs on Node 22; acceptable, can be silenced with `--disable-warning=ExperimentalWarning`.
- The API may still change; the `EventStore` interface keeps the blast radius to one file.
