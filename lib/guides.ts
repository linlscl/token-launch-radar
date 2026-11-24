// Bespoke farm guides: one entry per protocol slug, written by hand for the protocols a reader
// actually opens. Each entry is an array of 3 to 12 strings; every string is one farm step, 20 to
// 600 characters, and already carries its cost and time in the form
//   "<action>. Cost: <cost>. Time: <time>."
// A slug with no entry here falls back to the template in lib/model.ts, so this file may stay empty
// and the board still builds. Add a guide only when you know the protocol's real mechanics: which
// pool or vault, what the points program is called, what counts as a qualifying action. Never invent
// a points program, a pool name or a reward: if you do not know it, leave the slug out and the
// template covers it.
//
// Four entries below are bespoke (Claude wrote veda/upshift/onre 1-4 verbatim; onre 5-7 and
// symbiotic were completed from the official sources in prompts-clean/claude-sources-top10.md).
// The other six top-10 protocols (steakhouse-financial, gauntlet, nonce-capital, usdd,
// bittensor-dtao, rockawayx) have no own points program, so they stay on the template and are
// never presented as points guides.
export const GUIDES: Record<string, string[]> = {
  'veda': [
    'Open the Veda Points dashboard from veda.tech and check which activities are currently listed as eligible. The official launch post says points accrue only during eligible activities listed there, and one check found no season running, so confirm before depositing. Cost: $0. Time: 10 minutes.',
    'In the Lombard WebApp, stake BTC to mint LBTC, the route described in the Veda launch post (veda.tech/blog/lombard-launch). Start with a test size such as $100 equivalent. Cost: your principal plus a network fee (check live gas, budget a few dollars). Time: 10 to 20 minutes.',
    'Deposit the LBTC into the Lombard DeFi Vault and hold the LBTCv token you receive. The official post describes this vault as earning 3x Veda Points and 4x Lombard Lux. Cost: one deposit transaction, a few dollars of gas (check live). Time: 5 minutes.',
    'Confirm the LBTCv balance shows in your wallet and that your address appears on the Veda Points dashboard. If points show nothing, that vault is probably not in an eligible activity right now. Cost: $0. Time: 5 minutes.',
    'Optionally look at ether.fi Liquid, another Veda-powered vault named in the source material. Only deposit if the dashboard lists it as eligible; do not assume. Cost: $0 to check, plus principal and gas if you proceed. Time: 10 minutes.',
    'Hold and recheck the dashboard weekly. Veda has never said what points convert to, and no VEDA token or airdrop is announced, so treat the money as a yield position, not a guaranteed airdrop bet. Cost: opportunity cost of the locked principal. Time: 5 minutes per week.',
  ],
  'upshift': [
    'Open app.upshift.finance/points and read the Season 2 rules: 1x for depositing in any vault, a 5x bonus for depositing before total Upshift TVL reaches $750M, and distribution decays over time so early deposits earn more. Cost: $0. Time: 10 minutes.',
    'Check live Upshift TVL against the $750M threshold. The snapshot shows $499M, which was below it at capture, but verify the current figure before relying on the bonus. Cost: $0. Time: 5 minutes.',
    'Deposit USDC into the Upshift Core USDC vault, listed at 12x points. Use an amount you can leave locked, for example a $100 test first. Cost: principal plus gas for the approval and the deposit (a few dollars, check live gas). Time: 5 to 10 minutes.',
    'Optionally put a second slice into the Upshift Gamma USDC Vault, listed at 10x. Most other vaults are around 5x, so compare multipliers on the points page before choosing. Cost: principal plus another round of gas. Time: 10 minutes.',
    'Check that your address shows Season 2 points on the points page after the deposit. Points decay over time, so a late deposit earns less than an early one of the same size. Cost: $0. Time: 5 minutes.',
    'Hold and recheck weekly. Upshift describes points only as a reward for liquidity providers and active participants and has announced no token and no points-to-token conversion. Cost: opportunity cost of the principal. Time: 5 minutes per week.',
  ],
  'onre': [
    'Read the OnRe points terms first: the official docs say points have no monetary value, are not transferable, and carry no entitlement to tokens or rewards. A future ONRE token has been mentioned but is not confirmed. Cost: $0. Time: 10 minutes.',
    'Fund the new wallet with USDC and a little SOL for fees, then swap USDC for ONyc in OnRe Open Access at app.onre.finance. Start with about $100. Cost: your principal plus a few cents of SOL in fees. Time: 10 minutes.',
    'Hold ONyc for the base rate: the launch announcement gives 1x, which is 1 point per ONyc per day. This is the no-extra-risk baseline. Cost: $0 beyond the swap. Time: 2 minutes to check your points.',
    'For 2x, provide liquidity with ONyc on Kamino, Orca, or Raydium, the venues named in the launch announcement. Pick an ONyc pool listed there and check pool terms yourself. Cost: principal plus pool fees and impermanent-loss risk. Time: 15 minutes.',
    'For 3x, use ONyc as collateral on Kamino or Loopscale, the lending venues named in the launch announcement. Deposit it as collateral without borrowing against it, to avoid liquidation risk. Cost: principal plus a few cents of SOL in fees. Time: 15 minutes.',
    'For 4x, hold YT-ONyc on Exponent, the yield-token route named in the launch announcement. Check the YT terms and expiry yourself before buying, since yield tokens expire. Cost: principal plus pool fees. Time: 15 minutes.',
    'Hold and recheck the points page weekly. The official docs say points have no monetary value, are not transferable, and carry no entitlement to tokens or rewards, and no ONRE token is confirmed. Cost: $0 to check. Time: 5 minutes per week.',
  ],
  'symbiotic': [
    'Open the Symbiotic points program docs at docs.symbiotic.fi and read how points work. Symbiotic Points have run since June 2024 with no end date, and V2 points accrue per hour as Vault TVL allocated to adapters times 0.001. Cost: $0. Time: 10 minutes.',
    'Deposit collateral into a Symbiotic vault, for example wstETH into a wstETH vault. Start with a test size such as $100 equivalent. Cost: your principal plus a network fee (check live gas, budget a few dollars). Time: 10 to 20 minutes.',
    'Delegate the deposited collateral to a network or operator through the Symbiotic app. Active delegation earns about twice the points of a pre-deposit, according to the official docs, so do not leave it undelegated. Cost: one delegation transaction, a few dollars of gas (check live). Time: 5 minutes.',
    'Understand which vault you are in: Core V2 vaults earn points per hour from TVL allocated to adapters, while V1 vaults only count collateral delegated to networks. Check the vault version on the points page before depositing. Cost: $0. Time: 5 minutes.',
    'Confirm your points are accruing on the Symbiotic points page. V2 points accrue hourly in proportion to the vault TVL allocated to adapters, so a larger allocation earns more per hour. Cost: $0. Time: 5 minutes.',
    'Hold and recheck weekly. Symbiotic has announced no token, and its terms say points have no cash or monetary value, with no supply, allocation, or conversion mechanism published since June 2024, so treat this as a participation record, not a guaranteed airdrop. Cost: opportunity cost of the locked collateral. Time: 5 minutes per week.',
  ],
};
