# Benchmarks (/bench)

`/bench` compares 2 or more candidates with a frozen, repeatable study and writes a plain-language verdict. Set up on 2026-10-21 with `/setup-bench`.

- Kit: `bench/kit/` (version 1.0.0, vendored; do not edit or reformat, files are hash-checked)
- Config: `.gg/bench.config.json` (study kinds: code, library, agent; existing tool: vitest)
- Command: `.gg/commands/bench.md`
- Studies: `bench/studies/<id>/` (raw `runs/` are git-ignored; study, protocol, report and verdict are tracked)
- Health check: `node bench/kit/cli.mjs selftest` must pass all checks

The Foundation phase runs no study.

## When later phases must run /bench

A phase that hits one of these decisions runs the study **before** picking, and links the verdict in its ADR or README.

| Phase | Kind | Question | Measure |
|---|---|---|---|
| Tracker | code | Which payload shape keeps each `sendBeacon` batch smallest without losing events (JSON vs compact arrays)? | bytes per batch, events dropped |
| Tracker | library | Does `isbot` filtering cost too much bundle size versus a small hand-written user-agent list? | gzip bytes, bots caught on a fixed UA list |
| Recorder | library | `rrweb` vs `@rrweb/record` for recording only | gzip bundle size, main-thread CPU per minute on the demo page |
| Server | code | `node:sqlite` vs daily JSON-lines for ingest and weekly counts (ADR 0002 fallback) | inserts/second, weekly-count query time at 1 year of data |
| Stats | code | Does the implemented weekly rule match the simulation (`docs/lab/sim.py`) on fake-win and real-win rates? | A/A fake-win rate, A/B pick rate at 50/200/500 visitors a day |
| Agent | agent | Which prompt variant gives more shippable hero proposals from the same weekly report? | share of proposals the owner would ship, schema-valid rate, cost per run |
| Agent (MCP) | agent | Does exposing the report as MCP tools beat a plain CLI report for proposal quality? | same as above |

Notify (Discord) has no performance decision and needs no study.

## How to start one

```text
/bench new which recorder package adds less weight to the page: rrweb or @rrweb/record?
```
