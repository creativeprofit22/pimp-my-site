# @pms/agent

Weekly report CLI (later an MCP server): reads counts, writes the report, and proposes new variants. It may only write `variants/*.json`; every change waits for human approval.

Runs in: Node 22+.

## Public API

Exported from `src/index.ts`. Other packages use only these named types.

- `WeeklyReport` – the report the agent produces
- `VariantProposal` – one proposed change to a file in `variants/`

## Allowed dependencies

- Runtime: `@modelcontextprotocol/sdk` (planned, MCP phase)
- Workspace: `@pms/stats`
- Forbidden: writing any path outside `variants/*.json` (enforced in the agent phase)

See `docs/architecture.md` for the boundary rules (checked by `npm run lint`).
