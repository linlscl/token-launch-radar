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
// The six entries after them are also bespoke, written from the same official sources: the
// six top-10 protocols with no own points program (steakhouse-financial, gauntlet,
// nonce-capital, usdd, bittensor-dtao, rockawayx). Each says plainly what the participation
// really is (vault yield, savings yield, staking emissions) and never presents itself as a
// points guide, because there is no points program to farm on those six.
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
  'steakhouse-financial': [
    'Open the Morpho app and find the Steakhouse vaults: Steakhouse Prime USDC, High Yield USDC, and USDG. Confirm the vault names on app.morpho.org before depositing. Cost: $0. Time: 10 minutes.',
    'Read each vault details (asset, strategy, current yield) on Morpho and pick one that matches your asset. Steakhouse manages the vaults; you deposit into them to earn yield, not points. Cost: $0. Time: 10 minutes.',
    'Get the vault asset (for example USDC) in your wallet. Start with a test size such as $100 equivalent. Cost: your principal plus a network fee (check live gas, budget a few dollars). Time: 10 minutes.',
    'Approve the vault contract to spend your asset, then deposit it into the chosen Steakhouse vault. Cost: principal plus gas for the approval and the deposit (a few dollars, check live gas). Time: 5 to 10 minutes.',
    'Confirm you received the vault receipt token in your wallet and that your deposit shows on Morpho. Cost: $0. Time: 5 minutes.',
    'Understand what you earn: the vault yield from lending, paid in the asset. Steakhouse has no points program of its own, so there are no Steakhouse points to farm. Cost: $0. Time: 5 minutes.',
    'Optionally look at the Zama Steakhouse Confidential Prime USDC vault, which ran a 12-week yield boost in three declining phases from 2026-06-24. That is a yield boost, not points, and it may have ended; check the Zama blog before depositing. Cost: $0 to check, plus principal and gas if you proceed. Time: 10 minutes.',
    'Monitor your position weekly on Morpho: check the vault yield, your share balance, and any change in the vault terms. Cost: $0. Time: 5 minutes per week.',
    'Know the risks: vault yield varies, the underlying lending can lose value, and a vault strategy can change. Only deposit money you can leave in the vault. Cost: $0. Time: 5 minutes.',
    'To exit, withdraw from the vault on Morpho back to your wallet. Check for any withdrawal delay or fee on the vault page first. Cost: a withdrawal transaction, a few dollars of gas (check live). Time: 5 to 10 minutes.',
    'Hold and recheck weekly. There is no Steakhouse points program and no airdrop announced, so treat this as a yield position, not a points farm. Cost: opportunity cost of the locked principal. Time: 5 minutes per week.',
  ],
  'gauntlet': [
    'Open the Morpho app and find the Gauntlet vaults: Gauntlet USDG Premium V2 and Gauntlet USDC Prime Vault. Confirm the vault names on app.morpho.org before depositing. Cost: $0. Time: 10 minutes.',
    'Read each vault details (asset, strategy, current yield) on Morpho and pick one that matches your asset. Gauntlet manages the vaults; you deposit into them to earn yield, not points. Cost: $0. Time: 10 minutes.',
    'Get the vault asset (for example USDC or USDG) in your wallet. Start with a test size such as $100 equivalent. Cost: your principal plus a network fee (check live gas, budget a few dollars). Time: 10 minutes.',
    'Approve the vault contract to spend your asset, then deposit it into the chosen Gauntlet vault. Cost: principal plus gas for the approval and the deposit (a few dollars, check live gas). Time: 5 to 10 minutes.',
    'Confirm you received the vault receipt token in your wallet and that your deposit shows on Morpho. Cost: $0. Time: 5 minutes.',
    'Understand what you earn: the vault yield from lending, paid in the asset. Gauntlet has no points program of its own, so there are no Gauntlet points to farm. Cost: $0. Time: 5 minutes.',
    'Optionally check the Arbitrum DRIP Season 2 rewards for Gauntlet USDG Premium V2 deposits, paid in ARB and claimed through Merkl. That is an Arbitrum DAO incentive, not Gauntlet points, and it may have ended; verify it is live before relying on it. Cost: $0 to check. Time: 10 minutes.',
    'Note the Arc Earn Vault is managed by Gauntlet, but Circle has said it does not promise rewards and there is no ARC token. Do not deposit there expecting points or a token. Cost: $0. Time: 5 minutes.',
    'Monitor your position weekly on Morpho: check the vault yield, your share balance, and any change in the vault terms. Cost: $0. Time: 5 minutes per week.',
    'Know the risks: vault yield varies, the underlying lending can lose value, and a vault strategy can change. Only deposit money you can leave in the vault. Cost: $0. Time: 5 minutes.',
    'To exit, withdraw from the vault on Morpho back to your wallet, and claim any ARB rewards through Merkl if the DRIP incentive is live. Check for any withdrawal delay or fee first. Cost: a withdrawal transaction, a few dollars of gas (check live). Time: 5 to 10 minutes.',
  ],
  'nonce-capital': [
    'Understand what Nonce Capital is: a vault manager that curates strategies on Veda infrastructure for ether.fi Liquid. Nonce has no points program of its own. Cost: $0. Time: 10 minutes.',
    'Open the ether.fi app and find the Liquid vault, which Nonce manages on Veda infrastructure. Confirm it on the Veda ecosystem page (veda.tech/ecosystem/nonce-capital) before depositing. Cost: $0. Time: 10 minutes.',
    'Get the vault asset in your wallet. Start with a test size such as $100 equivalent. Cost: your principal plus a network fee (check live gas, budget a few dollars). Time: 10 minutes.',
    'Approve the vault contract to spend your asset, then deposit it into the ether.fi Liquid vault. Cost: principal plus gas for the approval and the deposit (a few dollars, check live gas). Time: 5 to 10 minutes.',
    'Confirm you received the vault receipt token in your wallet and that your deposit shows in the ether.fi app. Cost: $0. Time: 5 minutes.',
    'Understand what you earn: the deposit earns Veda Points and ether.fi points, because the vault runs on Veda infrastructure. Those are Veda and ether.fi points, not Nonce points. Cost: $0. Time: 5 minutes.',
    'Check the Veda Points dashboard to confirm the Liquid vault is listed as an eligible activity. Only eligible activities earn Veda Points, and the season status can change. Cost: $0. Time: 10 minutes.',
    'Monitor your position weekly: check the vault yield, your share balance, and your points on the Veda dashboard and the ether.fi app. Cost: $0. Time: 5 minutes per week.',
    'Know the risks: vault yield varies, the underlying strategies can lose value, and points programs can change or end. Only deposit money you can leave in the vault. Cost: $0. Time: 5 minutes.',
    'To exit, withdraw from the ether.fi Liquid vault back to your wallet. Check for any withdrawal delay or fee on the vault page first. Cost: a withdrawal transaction, a few dollars of gas (check live). Time: 5 to 10 minutes.',
    'Hold and recheck weekly. There is no Nonce points program, so do not expect Nonce points; any points you earn are Veda or ether.fi points, and neither has announced a token for them. Cost: opportunity cost of the locked principal. Time: 5 minutes per week.',
  ],
  'usdd': [
    'Understand what USDD is: a circulating stablecoin, not a pre-token protocol. There is no points program and no new token to farm. Cost: $0. Time: 10 minutes.',
    'The closest official mechanism is sUSDD, the yield-bearing token of USDD Savings. Open the USDD app at app.usdd.io and find the PSM and Savings pages. Cost: $0. Time: 10 minutes.',
    'Get USDT or USDC in your wallet. Start with a test size such as $100 equivalent. Cost: your principal plus a network fee (check live gas, budget a few dollars). Time: 10 minutes.',
    'Use the PSM (Peg Stability Module) in the USDD app to swap your USDT or USDC for USDD. Check the PSM rate before swapping. Cost: your principal plus a small swap fee (check live). Time: 5 to 10 minutes.',
    'Deposit the USDD into USDD Savings to mint sUSDD and hold it. The official mechanism pays up to 12% annual yield on sUSDD. Cost: one deposit transaction, a few dollars of gas (check live). Time: 5 minutes.',
    'Confirm the sUSDD balance shows in your wallet and that the Savings page shows your position. Cost: $0. Time: 5 minutes.',
    'Understand what you earn: yield on sUSDD, not points. There is no USDD points program, so there are no points to farm. Cost: $0. Time: 5 minutes.',
    'Note the occasional Merkl airdrop campaigns (for example 5000 USDD on BNB Chain in October 2025) have ended. Do not expect a live airdrop; verify any new campaign on the official channels before participating. Cost: $0. Time: 10 minutes.',
    'Monitor your sUSDD position weekly: check the yield rate, your balance, and any change in the Savings terms. Cost: $0. Time: 5 minutes per week.',
    'Know the risks: the yield rate can change, USDD peg can move, and the Savings terms can change. Only deposit money you can leave in Savings. Cost: $0. Time: 5 minutes.',
    'To exit, redeem sUSDD back to USDD in the Savings page, then swap USDD back to USDT or USDC through the PSM if you want out. Check for any fee or delay first. Cost: a redemption transaction, a few dollars of gas (check live). Time: 5 to 10 minutes.',
  ],
  'bittensor-dtao': [
    'Understand what Bittensor is: TAO is already a circulating native token, and dTAO is a subnet token mechanism, not a points program. There are no points to farm. Cost: $0. Time: 10 minutes.',
    'Read the official Bittensor docs at bittensor.ai/learn/tao-and-dtao to understand TAO, dTAO, and subnets before staking. Cost: $0. Time: 10 minutes.',
    'Get TAO in your wallet. Start with a test size such as a small amount of TAO you can leave staked. Cost: your principal plus a network fee (check live). Time: 10 minutes.',
    'Choose a subnet to stake to. Each subnet has its own alpha token, paired with TAO in an AMM pool. Research the subnet purpose and activity on the official explorer before choosing. Cost: $0. Time: 15 minutes.',
    'Stake your TAO to the chosen subnet, which buys that subnet alpha token. Alternatively, stake to the root network. Cost: your principal plus a staking transaction fee (check live). Time: 5 to 10 minutes.',
    'Understand what you earn: TAO and alpha emissions, distributed about every 360 blocks (roughly 72 minutes), in proportion to your stake and the subnet alpha price. This is staking emissions, not points. Cost: $0. Time: 5 minutes.',
    'Confirm your stake shows in the Bittensor wallet or explorer and that emissions are accruing. Cost: $0. Time: 5 minutes.',
    'Monitor your position weekly: check the subnet alpha price, your emissions, and whether the subnet is still active. Alpha prices move, so your emissions share changes with them. Cost: $0. Time: 5 minutes per week.',
    'Know the risks: alpha token prices are volatile, a subnet can lose activity, and staked TAO is locked while staked. Only stake money you can leave locked. Cost: $0. Time: 5 minutes.',
    'To exit, unstake from the subnet (selling alpha back to TAO) or unstake from root. Check for any unstaking delay on the network first. Cost: an unstaking transaction fee (check live). Time: 5 to 10 minutes.',
    'Hold and recheck weekly. There is no points program and no new token to farm; TAO is already issued, so this is a staking position, not an airdrop farm. Cost: opportunity cost of the locked TAO. Time: 5 minutes per week.',
  ],
  'rockawayx': [
    'Understand what RockawayX is: a vault manager, not a points program. RockawayX has no points program of its own, so there are no RockawayX points to farm. Cost: $0. Time: 10 minutes.',
    'Choose which RockawayX-managed route fits you: the RockawayX Tori Ecosystem Vault on Upshift (earns Tori Cores), the onycSOL vault on Exponent (earns OnRe Points), or the Marinade USDC Earn Vault on Kamino (yield only, no points). Cost: $0. Time: 10 minutes.',
    'For the Tori route, open Upshift and find the RockawayX Tori Ecosystem Vault (an ERC-4626 vault). Deposit trUSD, USDC, or USDT and receive the etrUSD LP token. Start with a test size such as $100 equivalent. Cost: your principal plus gas (check live). Time: 10 to 20 minutes.',
    'Understand the Tori route reward: the vault earns Tori Cores points (Tori program, 30 Cores per dollar per day during pre-deposit), not RockawayX points. Confirm the Cores rate on Tori official channels before depositing. Cost: $0. Time: 10 minutes.',
    'For the onycSOL route, open Exponent and find onycSOL, managed by RockawayX. Deposit to earn 4x OnRe Points (OnRe program, not RockawayX). Confirm the multiplier on OnRe official channels before depositing. Cost: $0 to check, plus principal and gas if you proceed. Time: 10 minutes.',
    'For the Marinade route, open Kamino and find the Marinade USDC Earn Vault managed by RockawayX. Deposit USDC to earn yield only; there are no points on this route. Cost: $0 to check, plus principal and gas if you proceed. Time: 10 minutes.',
    'Confirm your deposit shows in the relevant app (Upshift for Tori, Exponent for onycSOL, Kamino for Marinade) and that you received the expected receipt token. Cost: $0. Time: 5 minutes.',
    'Monitor your position weekly: check the vault yield, your receipt token balance, and your Cores or OnRe Points on the relevant program page. Cost: $0. Time: 5 minutes per week.',
    'Know the risks: vault yield varies, the underlying strategies can lose value, and points programs (Tori Cores, OnRe Points) can change or end. Only deposit money you can leave in the vault. Cost: $0. Time: 5 minutes.',
    'To exit, withdraw from the chosen vault back to your wallet. Check for any withdrawal delay or fee on the vault page first. Cost: a withdrawal transaction, a few dollars of gas (check live). Time: 5 to 10 minutes.',
    'Hold and recheck weekly. There is no RockawayX points program; any points you earn belong to Tori or OnRe, and neither has confirmed a token for them. Cost: opportunity cost of the locked principal. Time: 5 minutes per week.',
  ],
};
