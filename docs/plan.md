# Agentic website: day-1 plan (2026-10-21)

Goes with `agentic-website.md` (the ideas). This file is the "how to start" part from /unbox2.

## What it replaces, shrunk down
- **Replaces:** Hotjar or Clarity (watching visitors) plus VWO, Optimizely or Fibr AI (testing versions). These are hosted, paid per seat or per visitor, do far more than needed, and a human drives them.
- **Shrunk version:** runs on your own server, no subscription, does ONE job, and your AI agent drives it from the command line.
- **Scope line:** "Visitor behaviour in, one approved page change out. On purpose."

## Simulation result (ran today, `lab/agentic-website/sim.py`, seed 42, 2,000 runs per row)
We tested the same page against itself (any "winner" is luck), then a version that's truly 20% better.

| Visitors/day | Judge by **sales** (1%): luck "wins" by 20%+ (weekly) | Judge by **"stayed 30s+"** (40%): luck wins, daily | Same, weekly | Real 20% better version picked, weekly |
|---|---|---|---|---|
| 50 | 78% | 59% | 17% | 93% |
| 200 | 72% | 29% | 1% | 100% |
| 500 | 59% | 10% | 0% | 100% |

**What it means**
- **Never judge by sales on a small site.** Even a full week of sales data is mostly luck: a real 20% better page gets picked only 46–68% of the time.
- **Daily rounds are mostly luck below roughly 500 visitors a day.** Part 2's daily test failed its own check in the simulation.
- **Fix:** judge by something common, like "stayed 30 seconds" or "scrolled past the hero", and run **weekly** rounds under 500 visitors a day. Daily rounds are only OK above that.
- **The "slow dial" wasn't safe either:** checking it every day promoted a fake winner 16–26% of the time. Drop it, or only check it weekly.

## Interaction layer (Clarity-style), added 2026-10-21
What the tracker records, so the agent can see WHY people leave, not just that they left:

| Signal | What it is | Used for |
|---|---|---|
| Clicks | what people click, by section | which buttons and links work |
| Rage clicks | 3+ fast clicks on one spot | something looks clickable but isn't, or is broken |
| Dead clicks | a click that changes nothing | same, a quieter version |
| Scroll by section | the last section each visitor reached | where people give up |
| Session recordings | a replay of the visit (page changes, mouse and scroll), not a video | you watch a few when the numbers look odd; the agent reads the summaries |

**How it's built:** record with rrweb (open-source, the same idea Clarity and PostHog use). Clicks and scroll go through the same small tracker as before.

**Privacy rules (non-negotiable):**
- mask every text input and form field (rrweb `maskAllInputs`); never record passwords, emails or payment fields;
- record only a sample of visits (e.g. 20%), and delete recordings after 30 days;
- the privacy policy says plainly that visits may be recorded.

**For the agent:** it reads per-section numbers plus rage and dead-click counts, never raw recordings. Discord alerts are grouped: at most one message per problem per day (PostHog does this for rage clicks, so a broken button doesn't spam you).

**Reference code (indexed under tag `pimp-my-site`):**
- PostHog: rage-click alerts grouped so they don't spam. https://github.com/PostHog/posthog/blob/c5355d6ca0559c144ea2556b37217b70c2d958b7/frontend/src/scenes/hog-functions/sub-templates/sub-templates.ts#L222
- OpenReplay: dead and rage clicks as "issues". https://github.com/openreplay/openreplay/blob/e14b4220d605578b6f849af3552db08b4c80b18d/frontend/app/mstore/types/issue.ts#L7
- Highlight: filtering sessions that had rage clicks. https://github.com/highlight/highlight/blob/abbc5ccdf69923329635720bfc8d43c6e5c20fdd/backend/clickhouse/querybuilder.go#L143
- rrweb masking options: https://github.com/rrweb-io/rrweb/blob/9b9a1ff30dd281d00317b0fbece3dbd90a9e0a80/packages/rrweb-snapshot/src/snapshot.ts#L964
- Microsoft Clarity's tracker (scroll, pointer, activity time): https://github.com/microsoft/clarity/blob/4e78cb7be1f7e5598d90c497a7c86ad9b549d1cc/packages/clarity-js/src/data/baseline.ts#L60

## Day-1 plan
1. **Close the most dangerous gap first (first hour).** The worst mistake would be the agent changing your live site by itself. Guard: the agent may only write version files (e.g. `variants/hero.json`). The site reads those files, and nothing goes live without your click. The tracker stores no IP addresses or personal data, and the privacy policy gets one line about it.
2. **Instrument:** the simulation above sets the rules (common signal, weekly rounds). Week 1 on the real site: show the same hero as both A and B, and confirm the gap stays under 20%.
3. **Smallest working version (command line first, because the agent drives it):**
   - a page whose hero text comes from `variants/hero.json`;
   - a tiny tracker script that sends version, "stayed 30s", scroll depth by section, clicks and rage/dead clicks to your own endpoint (`navigator.sendBeacon`);
   - rrweb recording on a 20% sample with all inputs masked (can come in week 2);
   - a `report` command that prints counts per version;
   - an agent prompt: read the report, propose the next hero text as a file change, and post it to Discord for approval.
4. **Close each risk as it opens:**
   - tracker endpoint: rate limit and filter bots (on small sites bots can be most of the "visitors");
   - the Discord webhook URL lives in an env var, never in the repo;
   - the approve link needs a secret so strangers can't approve changes;
   - recordings: inputs masked, stored on your server only, deleted after 30 days, and the replay page is behind a login.
5. **Small checked steps:** one change per commit, each one checked.
6. **Tests that would prove it wrong:**
   - A/A on the real site shows a weekly gap of 20% or more → stop and fix tracking. Check by 2026-10-28.
   - Watcher gives fewer than 2 changes you'd ship in 2 weeks → rethink Part 1. Check by 2026-11-04.
7. **Follow-up:** run `/unbox2 evolve` after the first surprise, or by 2026-10-24.
8. **Comparison table (all `claimed` until measured):**

| | Hotjar + VWO | Yours |
|---|---|---|
| Cost | monthly subscription | your hosting only (claimed) |
| Where the data lives | their servers | your server (claimed) |
| Who drives it | you, clicking | your agent; you approve (claimed) |
| Setup | script tags + dashboards | one script + one prompt (claimed) |
| Scope | everything | hero changes, judged weekly (on purpose) |

Note: this repo (`pimp-my-site`) has no site files yet, so the skeleton starts from zero.
