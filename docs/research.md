# Research summary (2026-10-21)

Where this project came from and what was checked before building. Copied from the `/unbox` session so the repo is the source of truth.

| Repo file | Original | What |
|---|---|---|
| `docs/brief.md` | `.gg/unbox/agentic-website.md` | The idea in 3 parts (verbatim) |
| `docs/plan.md` | `.gg/unbox/agentic-website-plan.md` | Day-1 plan + interaction layer (verbatim) |
| `docs/lab/sim.py` | `.gg/unbox/lab/agentic-website/sim.py` | Simulation (verbatim) |
| `docs/lab/results.txt` | `.gg/unbox/lab/agentic-website/results.txt` | Its output (verbatim) |

Paths inside the copied files (e.g. `lab/agentic-website/sim.py`) refer to the original `.gg/unbox` layout; in this repo they live under `docs/lab/`.

## Source

Fathom call "Impromptu Google Meet Meeting", 2026-10-21, 1:28:50–1:50:17. Goal: an AI that watches how visitors use your site, suggests changes, tests them, and keeps the winners; a human approves every change.

## Main problem

Small sites get little traffic (about 50 visitors a day, ~1 sale per 100). A one-day A/B test is mostly luck, and a proper 50/50 test on sales takes months (~40k visitors per arm to see a +20% lift at 1% conversion).

## What was picked

| Part | Origin | Closest prior art and how this differs | Kill-test | Chance | Check by |
|---|---|---|---|---|---|
| Own tracker (scroll, stayed 30s, exits) | owner + Rybbit | Hotjar / Clarity: hosted; this is self-hosted, no personal data | A/A on the real site shows a weekly gap of 20%+ | – | 2026-10-28 |
| Agent writes the change, owner approves on Discord | owner | Fibr AI / Unbounce Smart Traffic auto-apply in hosted builders; this edits your own code behind a click | fewer than 2 shippable suggestions in 2 weeks | 70% | 2026-11-04 |
| Weekly rounds judged on "stayed 30s" | simulation | standard A/B advice judges on sales | A/A weekly fake-win rate over 20% on real traffic | – | 2026-10-28 |
| Agent learns which kind of idea wins | owner + ai | CRO-agent "learnings database"; this shifts future tries toward the winning kind | no kind clearly wins after ~10 tests | 50% | 2026-12-20 |

Dropped: big section swaps (later), day switching, and the slow dial (failed in simulation, below).

## Simulation (`docs/lab/sim.py`, seed 42, 2,000 runs per row)

Re-run on 2026-10-21 with Python 3.13.7: output identical to `docs/lab/results.txt`.

| Visitors/day | Sales, weekly: fake win | Stayed 30s, daily: fake win | Stayed 30s, weekly: fake win | Real +20% picked, weekly |
|---|---|---|---|---|
| 50 | 78% | 59% | 17% | 93% |
| 200 | 72% | 29% | 1% | 100% |
| 500 | 59% | 10% | 0% | 100% |

- Never judge by sales on a small site: a real +20% page is picked only 46–68% of the time even over a week.
- Daily rounds are mostly luck below ~500 visitors a day. The original "daily test" failed its own kill-test (59% fake wins at 50/day).
- Slow dial checked daily: 16–26% wrong promotions. Dropped.
- Result: weekly rounds on a common signal (ADR 0004). Works from ~200/day; at 50/day 17% of wins are luck.

## Patterns kept

- **judge-by-the-common-signal:** when the real goal is rare (sales), decide on a common signal that moves with it (stayed 30s).
- **measure-against-a-reference:** run the same page against itself (A/A) first; any "winner" shows the noise floor.
- **brakes-before-engine:** the agent may only write variant files; nothing goes live without a click.
- **shrink-the-paid-product:** one job (visitor behaviour in, one approved page change out) instead of Hotjar + VWO.

## Grounding: pinned reference code

| Repo | Used for | Permalink |
|---|---|---|
| GrowthBook | FNV-1a v2 sticky assignment hash (ADR 0003) | https://github.com/growthbook/growthbook/blob/58eeb92f6ad6200c8bb952c2fa1bdfd4349fb20f/packages/sdk-js/src/util.ts#L19-L39 |
| GrowthBook | Bandit only reports after ≥100 visitors per version (slow dial reference) | https://github.com/growthbook/growthbook/blob/58eeb92f6ad6200c8bb952c2fa1bdfd4349fb20f/packages/stats-ts/src/banditWeights.ts#L156 |
| Rybbit | Open-source tracker bot blocking | https://github.com/rybbit-io/rybbit/blob/9cee0e9007ecb574533a4a2f28623b78f84b18a1/server/src/services/tracker/botBlocking/enumerationObserver.ts#L5 |
| Microsoft Clarity | Tracker baseline: scroll, pointer, activity time | https://github.com/microsoft/clarity/blob/4e78cb7be1f7e5598d90c497a7c86ad9b549d1cc/packages/clarity-js/src/data/baseline.ts#L60 |
| rrweb | Masking options for recordings | https://github.com/rrweb-io/rrweb/blob/9b9a1ff30dd281d00317b0fbece3dbd90a9e0a80/packages/rrweb-snapshot/src/snapshot.ts#L964 |
| PostHog | Rage-click alerts grouped so they don't spam | https://github.com/PostHog/posthog/blob/c5355d6ca0559c144ea2556b37217b70c2d958b7/frontend/src/scenes/hog-functions/sub-templates/sub-templates.ts#L222 |
| OpenReplay | Dead and rage clicks as "issues" | https://github.com/openreplay/openreplay/blob/e14b4220d605578b6f849af3552db08b4c80b18d/frontend/app/mstore/types/issue.ts#L7 |
| Highlight | Filtering sessions with rage clicks | https://github.com/highlight/highlight/blob/abbc5ccdf69923329635720bfc8d43c6e5c20fdd/backend/clickhouse/querybuilder.go#L143 |
| ruflo | Paired decision log to see which method wins (idea-kind learning) | https://github.com/ruvnet/ruflo/blob/9271be48b0d23a31750a2e2220afa4c57ec3e26b/v3/@claude-flow/cli/src/ruvector/model-router.ts#L758 |
| Firecrawl | Stable rollout percent (considered for slow dial, not kept) | https://github.com/firecrawl/firecrawl/blob/12c69db4faf6fdaa92d91a06ec213abf17ce9e99/apps/api/src/config.ts#L347 |

Other: CRO agent guide with a learnings database, https://www.digitalapplied.com/blog/build-cro-ab-test-agent-landing-pages-2026 (not pinned; web page).

## Unchecked

Far-field sources from a helper that ran no searches: factory small tweaks (Box 1957), farm strip trials, one-patient medical trials, Thompson 1933.
