# Agentic website: a site that improves itself (brief, 2026-10-21)

Source: Fathom call "Impromptu Google Meet Meeting", 1:28:50–1:50:17 (Ken, Isaac, Mario, Aris).

## The goal in one line
An AI that watches how visitors use your site, suggests changes, tests them, and keeps the winners. You approve every change.

## The main problem to solve
Small sites don't get much traffic, so a one-day A vs B test is mostly luck. At about 50 visitors a day and roughly 1 sale per 100 visitors, a proper 50/50 test can take months.

## Fixed rules (from you)
- You approve every change before it goes live
- Your own tracking, no Hotjar or PostHog. Mention it in the privacy policy
- It runs on a schedule (for example 10am and 6pm), not nonstop
- It edits the real site code and content
- It must work on low-traffic sites
- It starts on your own sites, not client sites
- Design work goes through your private uimaxxxing toolchain (kept out of this brief)

Note: the "classic 50/50 split" rule clashes with low traffic. Part 2's first test decides whether it can stay.

## The 3 parts
### Part 1: Watcher (your chance it works: 70%)
- **What:** a small tracker records scroll depth, time on page, where visitors leave and page speed. Twice a day the AI reads it and writes code fixes for you to approve.
- **Closest existing thing:** Hotjar and Microsoft Clarity. They show the data, but you do the thinking. Yours writes the change.
- **Reuse:** Rybbit (open-source tracker, includes bot filtering): https://github.com/rybbit-io/rybbit/blob/9cee0e9007ecb574533a4a2f28623b78f84b18a1/server/src/services/tracker/botBlocking/enumerationObserver.ts#L5
- **Effort:** about 1 week.
- **Biggest risk:** on a small site there may not be enough data for anything beyond obvious advice.
- **Kill test:** after 2 weeks, fewer than 2 suggestions you'd actually ship. Check by 2026-11-20.

### Part 2: Daily test with a morning Discord message (your chance it works: 70%)
- **What:** each day the AI writes a new headline or hero version. Visitors are split between the old and new versions. Each morning Discord reports the result, and you tap to keep the winner.
- **Closest existing things:** Fibr AI and Unbounce Smart Traffic, which are hosted page builders. Yours edits your own code and needs your approval.
- **Effort:** needs a small split script, because this repo is plain static files.
- **Biggest risk:** too little traffic to tell a real winner from luck.
- **Kill test (do this FIRST):** show the identical page as both A and B for 7 days. If the report claims a winner by more than 20%, daily results are noise. Then switch to a "slow dial" (the new version starts at 10% of visitors and grows only while it's winning) or to weekly rounds. Check by 2026-11-20.
- **Reference for the slow dial:** GrowthBook only reports a "probability this is best" after 100 or more visitors per version: https://github.com/growthbook/growthbook/blob/58eeb92f6ad6200c8bb952c2fa1bdfd4349fb20f/packages/stats-ts/src/banditWeights.ts#L156

### Part 3: AI learns which ideas work (your chance it works: 50%)
- **What:** each idea is tagged by where it came from (known-good copy styles, visitor behaviour, speed fixes). The AI keeps score of which type wins and tries more of that type.
- **Closest existing thing:** a published CRO agent guide that keeps a "learnings database": https://www.digitalapplied.com/blog/build-cro-ab-test-agent-landing-pages-2026. Yours also shifts future tries toward the type that wins.
- **Reference:** ruflo keeps a side-by-side log of two decision methods to see which wins: https://github.com/ruvnet/ruflo/blob/9271be48b0d23a31750a2e2220afa4c57ec3e26b/v3/@claude-flow/cli/src/ruvector/model-router.ts#L758
- **Kill test:** after about 10 tests, no idea type clearly wins. Check by 2026-12-20.

## Build order
Part 1, then Part 2 (starting with the same-page test), then Part 3.

## Not explored yet
A one-tap "was this clear?" button for visitors. It gives far more feedback per visitor than waiting for sales.

## Unchecked
These far-field sources came from a helper that ran no searches: factory small-tweaks (Box 1957), farm strip trials, one-patient medical trials, Thompson 1933.
