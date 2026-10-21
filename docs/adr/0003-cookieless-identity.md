# ADR 0003: Cookieless visitor identity with a daily salted hash

- Status: Accepted
- Date: 2026-10-21

## Context

We need to count unique visitors per variant and keep each visitor on the same variant, without cookies, without storing IP addresses or personal data, and without a consent banner.

## Decision

1. **Visitor id = salted, daily-rotating hash.** The server computes `sha256(dailySalt + site + ip + userAgent)` in memory when an event arrives and stores only the hash. The IP is never written anywhere.
   - `dailySalt` is random, kept in memory (or an env var on restart), and replaced every day; old salts are discarded. After the rotation, yesterday's hashes can't be linked to today's or reversed.
2. **Sticky assignment = FNV-1a hash bucket**, computed in `@pms/stats` (pure): `bucket = fnv1a32(seed + visitorId) / 2^32`, then the bucket picks the variant. Same visitor, same day, same variant. Based on GrowthBook's v2 hash (MIT):
   https://github.com/growthbook/growthbook/blob/58eeb92f6ad6200c8bb952c2fa1bdfd4349fb20f/packages/sdk-js/src/util.ts#L19-L39
3. Bots are filtered before hashing (user-agent check, `isbot` planned) and the ingest endpoint is rate-limited.

## Consequences

- No cookie or local storage, no personal data at rest.
- A visitor coming back on another day may see a different variant. The weekly rule (ADR 0004) counts day-visitors, so this adds noise but no bias; the sample-ratio check in `stats` catches broken splits.
- Visitors behind one shared IP with the same browser count as one; acceptable at this scale.
- The privacy policy states that visits are measured without cookies or stored IPs.
