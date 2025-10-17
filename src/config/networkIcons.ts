// Network icon mappings for supported chains
// Icons are served from the public folder
export const NETWORK_ICONS: Record<number, string> = {
  1: "/icons/eth.png",        // Ethereum
  324: "/icons/zks.png",      // zkSync Era
  10: "/icons/op.png",        // Optimism
  42161: "/icons/arb.png",    // Arbitrum One
  80094: "/icons/bera.png",   // Berachain
  2020: "/icons/ron.png",     // Ronin
  43114: "/icons/avax.png",   // Avalanche
  8453: "/icons/base.png",    // Base
  33139: "/icons/ape.png",    // ApeChain
  1329: "/icons/sei.png",     // Sei
  2741: "/icons/eth.png",     // Abstract (using ETH as placeholder - logo not found)
  56: "/icons/bnb.png",       // BNB Chain
  1284: "/icons/moons.png",   // Moonbeam
} as const;
