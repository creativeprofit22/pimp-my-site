# @pms/notify

Sends messages to the owner (Discord webhook now) and carries approve/reject links back to the server.

Runs in: Node 22+.

## Public API

Exported from `src/index.ts`. Other packages use only these named types.

- `Notifier` – `send(message)` interface; Discord is one implementation
- `NotifyMessage` – title, body and optional approval links

## Allowed dependencies

- Runtime: Node built-ins only (global `fetch`)
- Workspace: none
- Forbidden: reading or writing storage directly

See `docs/architecture.md` for the boundary rules (checked by `npm run lint`).
