// Native token symbols for each supported chain
export const NATIVE_TOKENS: Record<number, string> = {
  1: "ETH",        // Ethereum
  324: "ETH",      // zkSync Era
  10: "ETH",       // Optimism
  42161: "ETH",    // Arbitrum One
  80094: "BERA",   // Berachain
  2020: "RON",     // Ronin
  43114: "AVAX",   // Avalanche
  8453: "ETH",     // Base
  33139: "APE",    // ApeChain
  1329: "SEI",     // Sei
  2741: "ETH",     // Abstract
  56: "BNB",       // BNB Chain
  1284: "GLMR",    // Moonbeam
  25: "CRO",       // Cronos
} as const;
