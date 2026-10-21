# AGENTS.md

npm workspace (Node >=22.13, TypeScript, ESM): `packages/*`, static `site/`, agent-writable `variants/`.
Read `docs/architecture.md` (boundary rules) and `docs/adr/` before changing structure.

- Install: `npm ci`
- Build: none (`site/` is served as-is; packages are typechecked, not compiled)
- Typecheck: `npm run typecheck`
- Lint: `npm run lint` (Biome + `scripts/check-boundaries.mjs`); auto-fix format with `npm run format`
- Test: `npm test`
- Dev server: `npm run serve` (or `node scripts/serve.mjs`), then open `/site/`
- Bench kit health: `node bench/kit/cli.mjs selftest` (never edit or reformat `bench/kit/`)

CI lives in `.github/workflows/ci.yml` and must stay green.

Never commit with `--no-verify`.
