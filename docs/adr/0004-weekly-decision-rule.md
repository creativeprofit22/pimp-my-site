# ADR 0004: Weekly decisions judged on "stayed 30s"

- Status: Accepted
- Date: 2026-10-21

## Context

Small sites get 50–500 visitors a day and about 1 sale per 100 visitors. The original idea was a daily A/B round judged on sales. We simulated it before building: `docs/lab/sim.py` (seed 42, 2,000 runs per row; output in `docs/lab/results.txt`).

A/A means both versions are the same page, so any "win" over 20% is luck.

| Visitors/day | Sales, weekly: fake win | "Stayed 30s", daily: fake win | "Stayed 30s", weekly: fake win | Real +20% picked, weekly |
|---|---|---|---|---|
| 50 | 78% | 59% | 17% | 93% |
| 200 | 72% | 29% | 1% | 100% |
| 500 | 59% | 10% | 0% | 100% |

Also measured: a "slow dial" (new version starts at 10% and grows while winning, checked daily) promoted a fake winner 16–26% of the time.

## Decision

- **Signal:** "stayed 30s" (a visitor is still on the page 30 seconds after load). Sales are not used to decide; even a full week of sales picks a real +20% page only 46–68% of the time.
- **Round length:** one decision per 7 days, 50/50 split, sticky assignment (ADR 0003).
- **Rule (implemented in `@pms/stats` as a `DecisionRule`):** promote the challenger only when its weekly stayed-30s rate beats control by the agreed margin and the sample-ratio check passes; otherwise keep control or report `no-call`. The exact threshold is set and tested against the simulation in the stats phase.
- **Daily rounds:** not used below ~500 visitors a day.
- **Slow dial:** dropped.
- **Kill-test:** run A/A on the real site for one week. A weekly gap of 20% or more means tracking is broken; stop and fix it before any real test (check by 2026-10-28).

## Consequences

- Works from about 200 visitors a day (1% fake wins). At 50 a day, 17% of "wins" are luck; the report must say so.
- Slower feedback (one decision a week) in exchange for decisions that mean something.
- "Stayed 30s" is a proxy, not revenue; the agent is told this when proposing changes.
