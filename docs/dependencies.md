# Dependencies

Checked with `npm view <pkg> version` on **2026-10-21** (Node v22.20.0, npm 10.9.3). All installs use exact versions (`--save-exact`). Add a planned package only in its phase, re-check the version then, and update this table.

## Pinned now (root `devDependencies`)

| Package | Pinned | Latest on 2026-10-21 | Why |
|---|---|---|---|
| typescript | 7.0.2 | 7.0.2 | Typecheck (`tsc --noEmit` per package) |
| vitest | 5.0.5 | 5.0.5 | Tests |
| @biomejs/biome | 2.5.15 | 2.6.2 | Lint + format |
| @types/node | 22.20.5 | 26.6.5 | Node types |

Notes:

- **@biomejs/biome:** 2.6.2 was published 9 hours before the check and was blocked by the install tool's 2-day release-age cooldown. 2.5.15 is the newest release older than 2 days. Dependabot will propose 2.6.x later.
- **@types/node:** pinned to the 22.x line (latest 22.20.5) so types match the lowest supported runtime (`engines: node >=22.13`). The latest 26.6.5 would allow APIs missing on Node 22.

## Planned (not installed yet)

| Package | Latest on 2026-10-21 | Phase | Use |
|---|---|---|---|
| isbot | 5.2.2 | tracker / server ingest | Bot filtering |
| web-vitals | 6.2.3 | tracker | Page speed signals |
| rrweb | 2.1.7 | recorder | Session recording (full package) |
| @rrweb/record | 2.1.7 | recorder | Recorder-only package; choose one of the two via /bench |
| esbuild | 0.28.2 | tracker / recorder | Bundle browser packages |
| @modelcontextprotocol/sdk | 1.32.1 | agent (MCP) | Expose the report and proposals as MCP tools |

All 2026-10-21 values matched the list given in the phase brief.

## Runtime built-ins (no install)

- `node:sqlite` – storage (ADR 0002); loads unflagged on Node 22.20.0 with an `ExperimentalWarning`.
- `node:http`, `node:crypto` – server and hashing.
- Global `fetch` – Discord webhook in `@pms/notify`.
