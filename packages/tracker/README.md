# @pms/tracker

Cookieless browser tracker: page views, scroll depth, "stayed 30s", exits. Sends small batches with `navigator.sendBeacon`.

Runs in: the browser.

## Public API

Exported from `src/index.ts`. Other packages use only these named types.

- `TrackerConfig` – endpoint URL and variant id
- `TrackerEvent` – one event as sent to the server (`view`, `scroll`, `stayed30`, `exit`)
- (later phase) `startTracker(config)`

## Allowed dependencies

- Runtime: none planned beyond `isbot` (planned, see `docs/dependencies.md`)
- Workspace: none
- Forbidden: `@pms/server`, any `node:*` module

See `docs/architecture.md` for the boundary rules (checked by `npm run lint`).
