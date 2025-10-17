import { http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { createConfig } from 'wagmi'

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!

if (!projectId) {
  throw new Error('Project ID is not defined')
}