import { http } from 'wagmi'
import {
  mainnet,
  zkSync,
  optimism,
  arbitrum,
  base,
  bsc,
  avalanche,
  moonbeam
} from 'wagmi/chains'
import { createConfig } from 'wagmi'
import { defineChain } from 'viem'

// Custom chain definitions for chains not in wagmi/chains
const berachain = defineChain({
  id: 80094,
  name: 'Berachain',
  nativeCurrency: { name: 'BERA', symbol: 'BERA', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://berachain-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'] },
  },
  blockExplorers: {
    default: { name: 'BeraScan', url: 'https://berascan.com' },
  },
})

const ronin = defineChain({
  id: 2020,
  name: 'Ronin',
  nativeCurrency: { name: 'RON', symbol: 'RON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://ronin-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'] },
  },
  blockExplorers: {
    default: { name: 'Ronin Explorer', url: 'https://app.roninchain.com' },
  },
})

const apechain = defineChain({
  id: 33139,
  name: 'ApeChain',
  nativeCurrency: { name: 'APE', symbol: 'APE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://apechain-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'] },
  },
  blockExplorers: {
    default: { name: 'ApeScan', url: 'https://apescan.io' },
  },
})

const sei = defineChain({
  id: 1329,
  name: 'Sei',
  nativeCurrency: { name: 'SEI', symbol: 'SEI', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sei-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'] },
  },
  blockExplorers: {
    default: { name: 'SeiTrace', url: 'https://seitrace.com' },
  },
})

const abstractChain = defineChain({
  id: 2741,
  name: 'Abstract',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://abstract-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'] },
  },
  blockExplorers: {
    default: { name: 'Abstract Explorer', url: 'https://abscan.org' },
  },
})

const cronos = defineChain({
  id: 25,
  name: 'Cronos',
  nativeCurrency: { name: 'CRO', symbol: 'CRO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://cronos-evm-rpc.publicnode.com'] },
  },
  blockExplorers: {
    default: { name: 'Cronos Explorer', url: 'https://explorer.cronos.org' },
  },
})

export const config = createConfig({
  chains: [
    mainnet,
    zkSync,
    optimism,
    arbitrum,
    berachain,
    ronin,
    avalanche,
    base,
    apechain,
    sei,
    abstractChain,
    bsc,
    moonbeam,
    cronos,
  ],
  transports: {
    [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'),
    [zkSync.id]: http('https://zksync-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'),
    [optimism.id]: http('https://opt-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'),
    [arbitrum.id]: http('https://arb-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'),
    [berachain.id]: http('https://berachain-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'),
    [ronin.id]: http('https://ronin-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'),
    [avalanche.id]: http('https://avax-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'),
    [base.id]: http('https://base-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'),
    [apechain.id]: http('https://apechain-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'),
    [sei.id]: http('https://sei-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'),
    [abstractChain.id]: http('https://abstract-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'),
    [bsc.id]: http(),
    [moonbeam.id]: http(),
    [cronos.id]: http(),
  },
})

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!

if (!projectId) {
  throw new Error('Project ID is not defined')
}