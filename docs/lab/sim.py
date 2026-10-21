"""Can a small site tell a real winner from luck?

Simulates a site where visitors are split between version A and version B.
Two signals per visitor:
  - sale    (rare,   base 1%)
  - stayed  (common, base 40%, e.g. "stayed 30+ seconds")

Scenarios
  A/A : both versions identical -> any "winner" is pure luck
  A/B : B is truly 20% better (relative)

Decision rules compared
  daily   : each day, the higher one "wins"; report fake wins over +20%
  weekly  : same, but one decision per 7 days of data
  dial    : Thompson-style slow dial; promote B only when P(B better) >= 95%
            (needs >= 100 visitors per version, like GrowthBook), max 28 days
Seeded, pure standard library.
"""
import random

SEED = 42
TRIALS = 2000
BASE = {"sale": 0.01, "stayed": 0.40}
LIFT = 0.20


def visitors(rng, n, p):
    return sum(1 for _ in range(n) if rng.random() < p)


def p_b_better(rng, a_hits, a_n, b_hits, b_n, draws=400):
    wins = 0
    for _ in range(draws):
        a = rng.betavariate(1 + a_hits, 1 + a_n - a_hits)
        b = rng.betavariate(1 + b_hits, 1 + b_n - b_hits)
        wins += b > a
    return wins / draws


def fixed_window(rng, per_day, days, pa, pb):
    """50/50 split over `days`; returns (b_won, reported_lift_over_20pct)."""
    n = per_day * days // 2
    a, b = visitors(rng, n, pa), visitors(rng, n, pb)
    if a == 0 and b == 0:
        return False, False
    hi, lo = max(a, b), min(a, b)
    big = lo == 0 or (hi - lo) / lo > 0.20
    return b > a, big


def dial(rng, per_day, pa, pb, max_days=28):
    """Slow dial: B starts at 10%; weight follows P(B better). Returns (promoted, day)."""
    w = 0.10
    an = ah = bn = bh = 0
    for day in range(1, max_days + 1):
        for _ in range(per_day):
            if rng.random() < w:
                bn += 1
                bh += rng.random() < pb
            else:
                an += 1
                ah += rng.random() < pa
        if an >= 100 and bn >= 100:
            p = p_b_better(rng, ah, an, bh, bn)
            if p >= 0.95:
                return True, day
            w = min(0.5, max(0.05, p))
    return False, None


def run():
    rng = random.Random(SEED)
    print(f"seed={SEED} trials={TRIALS} lift(real)={LIFT:.0%}\n")
    for signal, base in BASE.items():
        print(f"=== signal: {signal} (base {base:.0%}) ===")
        print(f"{'visitors/day':>12} | {'A/A daily: fake >20% win':>24} | {'A/A weekly fake':>15} | "
              f"{'A/B daily picks B':>17} | {'A/B weekly picks B':>18} | {'dial A/A wrong promote':>22} | {'dial A/B promotes B (median day)':>32}")
        for per_day in (50, 200, 500):
            aa_daily = sum(fixed_window(rng, per_day, 1, base, base)[1] for _ in range(TRIALS)) / TRIALS
            aa_week = sum(fixed_window(rng, per_day, 7, base, base)[1] for _ in range(TRIALS)) / TRIALS
            ab_daily = sum(fixed_window(rng, per_day, 1, base, base * (1 + LIFT))[0] for _ in range(TRIALS)) / TRIALS
            ab_week = sum(fixed_window(rng, per_day, 7, base, base * (1 + LIFT))[0] for _ in range(TRIALS)) / TRIALS
            dial_trials = TRIALS // 10
            aa_dial = sum(dial(rng, per_day, base, base)[0] for _ in range(dial_trials)) / dial_trials
            res = [dial(rng, per_day, base, base * (1 + LIFT)) for _ in range(dial_trials)]
            days = sorted(d for ok, d in res if ok and d is not None)
            ab_dial = len(days) / dial_trials
            med = days[len(days) // 2] if days else "-"
            print(f"{per_day:>12} | {aa_daily:>24.0%} | {aa_week:>15.0%} | {ab_daily:>17.0%} | {ab_week:>18.0%} | "
                  f"{aa_dial:>22.0%} | {ab_dial:>20.0%} (day {med})")
        print()


if __name__ == "__main__":
    run()
