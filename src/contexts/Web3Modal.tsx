"use client";

import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  mainnet,
  optimism,
  arbitrum,
  base,
  bsc,
  avalanche,
  moonbeam
} from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import React, { ReactNode } from "react";

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "b0db8a0e9feaf59699896d7c7bfa4c5f";

if (!projectId) {
  throw new Error("NEXT_PUBLIC_PROJECT_ID is not defined");
}

// 2. Create a metadata object - optional
const metadata = {
  name: "Candy Codex Payment Receiver",
  description: "Multichain Payment Solution - Receive ETH payments across 15+ blockchains",
  url: "https://candy-codex-payment-receiver.vercel.app",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// 3. Define custom networks not in @reown/appkit/networks
const zkSync = {
  id: 324,
  name: 'zkSync Era',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://zksync-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'] },
  },
  blockExplorers: {
    default: { name: 'zkSync Explorer', url: 'https://explorer.zksync.io' },
  },
} as const;

const berachain = {
  id: 80094,
  name: 'Berachain',
  nativeCurrency: { name: 'BERA', symbol: 'BERA', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://berachain-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'] },
  },
  blockExplorers: {
    default: { name: 'BeraScan', url: 'https://berascan.com' },
  },
} as const;

const ronin = {
  id: 2020,
  name: 'Ronin',
  nativeCurrency: { name: 'RON', symbol: 'RON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://ronin-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'] },
  },
  blockExplorers: {
    default: { name: 'Ronin Explorer', url: 'https://app.roninchain.com' },
  },
} as const;

const apechain = {
  id: 33139,
  name: 'ApeChain',
  nativeCurrency: { name: 'APE', symbol: 'APE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://apechain-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'] },
  },
  blockExplorers: {
    default: { name: 'ApeScan', url: 'https://apescan.io' },
  },
} as const;

const sei = {
  id: 1329,
  name: 'Sei',
  nativeCurrency: { name: 'SEI', symbol: 'SEI', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sei-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'] },
  },
  blockExplorers: {
    default: { name: 'SeiTrace', url: 'https://seitrace.com' },
  },
} as const;

const abstractChain = {
  id: 2741,
  name: 'Abstract',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://abstract-mainnet.g.alchemy.com/v2/kAmtb3hCAJaBhgQWSJBVs'] },
  },
  blockExplorers: {
    default: { name: 'Abstract Explorer', url: 'https://abscan.org' },
  },
} as const;

const cronos = {
  id: 25,
  name: 'Cronos',
  nativeCurrency: { name: 'CRO', symbol: 'CRO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://cronos-evm-rpc.publicnode.com'] },
  },
  blockExplorers: {
    default: { name: 'Cronos Explorer', url: 'https://explorer.cronos.org' },
  },
} as const;

// 3. Set the networks - ALL 14 chains
const networks = [
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
] as const;

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks: [...networks],
  projectId,
  ssr: true,
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [...networks],
  projectId,
  metadata,
  features: {
    analytics: false, // Optional - defaults to your Cloud configuration,
    socials: false,
    email: false,
  },
});

// 6. Create query client
const queryClient = new QueryClient();

export function Web3ModalProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
