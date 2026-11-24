[![token-radar-01](https://make.fun/badge/token-radar-01.svg)](https://make.fun/bounty/token-radar-01)
[![rank](https://make.fun/badge/token-radar-01/linlscl/token-launch-radar/rank.svg)](https://make.fun/bounty/token-radar-01)
[![reward](https://make.fun/badge/token-radar-01/linlscl/token-launch-radar/reward.svg)](https://make.fun/bounty/token-radar-01)

# Token Launch Radar

A static dashboard that ranks protocols that have not launched a token yet, and attaches a step-by-step airdrop farming guide (action, cost, time) where we could verify the program. Built for the make.fun bounty `token-radar-01`: "Build the best token launch radar".

## What it does

- Takes a DefiLlama snapshot and keeps protocols without a token.
- Estimates an implied token value for each one with the radar-3 model.
- Ranks them by implied value and renders a static page.
- Shows a farming guide only for protocols where the program is known. For the rest it falls back to a generic template instead of guessing.

This board is not a largest-TVL ranking. It looks for the next batch of DeFi infrastructure that has already accumulated real capital, can keep operating, and has a basis for potential token value, among the protocols that record no token yet. Risk management vaults, capital allocators and real-world-asset infrastructure hold most of the implied value here: the plumbing that already holds capital. A high TVL alone does not mean a high future token value.

## The radar-3 model

```
implied = round(tvl_usd x 0.08 x (1 + clamp(change_7d, -40, 60) / 100 x 0.20) x (0.85 + min(age_days, 730) / 730 x 0.15))
```

- The base multiple **0.08** is the median market-cap-to-TVL ratio of the 47 protocols in this snapshot that already trade and hold at least $50M of TVL (median 0.082, rounded to 0.08). A token is worth what the market already pays for one.
- Seven-day growth is dampened: one week of TVL swing moves a valuation by at most 12%, so momentum matters without overwhelming size, and a short-term inflow is not mistaken for lasting value.
- Age is a maturity factor from 0.85 to 1.00 over two years: a protocol that has run two years with no token has proven it can hold users without one.
- Category is used for relative ranking, display and peer comparison, never as a subjective multiplier on one sector.

Implied value is a proxy model built from a historical sample. It is not a prediction of a token's actual fully diluted value, and it does not predict whether or when a protocol issues a token. Limitations: the ratio is a median, so individual launches can land far above or below it, and TVL can move quickly between snapshot and launch.

## Run locally

```bash
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts --input input/snapshot.json
```

The static site is written to `out/`.

## Data source

DefiLlama, fetched on 2026-11-14. All figures in the dashboard come from that snapshot or from the model above.

Optional: earn referral rewards, a second way to make money — https://make.fun/r/n4xb3a4f
