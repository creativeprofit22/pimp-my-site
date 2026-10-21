# @pms/recorder

Optional session recording: a thin wrapper around rrweb's recorder with privacy defaults (mask all inputs and text) and sampling.

Runs in: the browser.

## Public API

Exported from `src/index.ts`. Other packages use only these named types.

- `RecorderConfig` – endpoint, sample rate, masking options
- `RecordingChunk` – one batch of rrweb events sent to the server
- (later phase) `startRecorder(config)`

## Allowed dependencies

- Runtime: `@rrweb/record` or `rrweb` (planned; the choice is a /bench question)
- Workspace: none
- Forbidden: `@pms/server`, any `node:*` module

See `docs/architecture.md` for the boundary rules (checked by `npm run lint`).
