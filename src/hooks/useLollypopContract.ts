'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { LOLLYPOP_ABI, LOLLYPOP_CONTRACT_ADDRESS, MINT_PRICE, TX_FEE, EXTRA_FEE_PERCENTAGE } from '@/contracts/lollypop'
import { useAccount } from 'wagmi'

export function useLollypopContract() {
  const { address } = useAccount()

  // Basic contract info
  const {
    data: totalSupply,
    isLoading: totalSupplyLoading,
    refetch: refetchTotalSupply,
  } = useReadContract({
    address: LOLLYPOP_CONTRACT_ADDRESS,
    abi: LOLLYPOP_ABI,
    functionName: 'totalSupply',
  })

  const {
    data: maxSupply,
    isLoading: maxSupplyLoading,
  } = useReadContract({
    address: LOLLYPOP_CONTRACT_ADDRESS,
    abi: LOLLYPOP_ABI,
    functionName: 'maxSupply',
  })

  const {
    data: maxMintAmountPerTx,
    isLoading: maxMintAmountPerTxLoading,
  } = useReadContract({
    address: LOLLYPOP_CONTRACT_ADDRESS,
    abi: LOLLYPOP_ABI,
    functionName: 'maxMintAmountPerTx',
  })

  // Contract constants
  const { data: mintPrice } = useReadContract({
    address: LOLLYPOP_CONTRACT_ADDRESS,
    abi: LOLLYPOP_ABI,
    functionName: 'MINT_PRICE',
  })

  const { data: txFee } = useReadContract({
    address: LOLLYPOP_CONTRACT_ADDRESS,
    abi: LOLLYPOP_ABI,
    functionName: 'TX_FEE',
  })

  const { data: extraFeePercentage } = useReadContract({
    address: LOLLYPOP_CONTRACT_ADDRESS,
    abi: LOLLYPOP_ABI,
    functionName: 'EXTRA_FEE_PERCENTAGE',
  })

  const { data: referralFeePercentage } = useReadContract({
    address: LOLLYPOP_CONTRACT_ADDRESS,
    abi: LOLLYPOP_ABI,
    functionName: 'REFERRAL_FEE_PERCENTAGE',
  })

  // Security features
  const { data: emergencyStop } = useReadContract({
    address: LOLLYPOP_CONTRACT_ADDRESS,
    abi: LOLLYPOP_ABI,
    functionName: 'emergencyStop',
  })

  const { data: paused } = useReadContract({
    address: LOLLYPOP_CONTRACT_ADDRESS,
    abi: LOLLYPOP_ABI,
    functionName: 'paused',
  })

  const { data: mintCooldown } = useReadContract({
    address: LOLLYPOP_CONTRACT_ADDRESS,
    abi: LOLLYPOP_ABI,
    functionName: 'mintCooldown',
  })

  // User-specific data
  const { data: userBalance } = useReadContract({
    address: LOLLYPOP_CONTRACT_ADDRESS,
    abi: LOLLYPOP_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  })

  const { data: lastMintTime } = useReadContract({
    address: LOLLYPOP_CONTRACT_ADDRESS,
    abi: LOLLYPOP_ABI,
    functionName: 'lastMintTime',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  })

  const { data: mintCount } = useReadContract({
    address: LOLLYPOP_CONTRACT_ADDRESS,
    abi: LOLLYPOP_ABI,
    functionName: 'mintCount',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  })

  // Referral system
  const { data: referralStats, refetch: refetchReferralStats } = useReadContract({
    address: LOLLYPOP_CONTRACT_ADDRESS,
    abi: LOLLYPOP_ABI,
    functionName: 'getReferralStats',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  })

  const { data: referralEarnings } = useReadContract({
    address: LOLLYPOP_CONTRACT_ADDRESS,
    abi: LOLLYPOP_ABI,
    functionName: 'referralEarnings',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  })

  // Marketplace features
  const { data: marketplaceRestrictionEnabled } = useReadContract({
    address: LOLLYPOP_CONTRACT_ADDRESS,
    abi: LOLLYPOP_ABI,
    functionName: 'marketplaceRestrictionEnabled',
  })

  // Contract owner
  const { data: contractOwner } = useReadContract({
    address: LOLLYPOP_CONTRACT_ADDRESS,
    abi: LOLLYPOP_ABI,
    functionName: 'owner',
  })

  const { writeContract, data: hash, error, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Calculate total cost including extra fee
  const calculateTotalCost = (mintAmount: number) => {
    const baseCost = MINT_PRICE * BigInt(mintAmount)
    const txFeeCost = TX_FEE * BigInt(mintAmount)
    const extraFee = (baseCost * EXTRA_FEE_PERCENTAGE) / BigInt(10000)
    return baseCost + txFeeCost + extraFee
  }

  // Minting functions
  const mint = (mintAmount: number) => {
    const totalCost = calculateTotalCost(mintAmount)
    
    writeContract({
      address: LOLLYPOP_CONTRACT_ADDRESS,
      abi: LOLLYPOP_ABI,
      functionName: 'mint',
      args: [BigInt(mintAmount)],
      value: totalCost,
    })
  }

  const mintWithReferral = (mintAmount: number, referrerAddress: `0x${string}`) => {
    const totalCost = calculateTotalCost(mintAmount)
    
    writeContract({
      address: LOLLYPOP_CONTRACT_ADDRESS,
      abi: LOLLYPOP_ABI,
      functionName: 'mintWithReferral',
      args: [BigInt(mintAmount), referrerAddress],
      value: totalCost,
    })
  }

  // Referral functions
  const withdrawReferralEarnings = () => {
    writeContract({
      address: LOLLYPOP_CONTRACT_ADDRESS,
      abi: LOLLYPOP_ABI,
      functionName: 'withdrawReferralEarnings',
    })
  }

  // Token blocking functions (for owners)
  const blockToken = (tokenId: number) => {
    writeContract({
      address: LOLLYPOP_CONTRACT_ADDRESS,
      abi: LOLLYPOP_ABI,
      functionName: 'blockToken',
      args: [BigInt(tokenId)],
    })
  }

  const unblockToken = (tokenId: number) => {
    writeContract({
      address: LOLLYPOP_CONTRACT_ADDRESS,
      abi: LOLLYPOP_ABI,
      functionName: 'unblockToken',
      args: [BigInt(tokenId)],
    })
  }

  const blockMultipleTokens = (tokenIds: number[]) => {
    writeContract({
      address: LOLLYPOP_CONTRACT_ADDRESS,
      abi: LOLLYPOP_ABI,
      functionName: 'blockMultipleTokens',
      args: [tokenIds.map(id => BigInt(id))],
    })
  }

  // Admin functions (owner only)
  const pause = () => {
    writeContract({
      address: LOLLYPOP_CONTRACT_ADDRESS,
      abi: LOLLYPOP_ABI,
      functionName: 'pause',
    })
  }

  const unpause = () => {
    writeContract({
      address: LOLLYPOP_CONTRACT_ADDRESS,
      abi: LOLLYPOP_ABI,
      functionName: 'unpause',
    })
  }

  const toggleEmergencyStop = () => {
    writeContract({
      address: LOLLYPOP_CONTRACT_ADDRESS,
      abi: LOLLYPOP_ABI,
      functionName: 'toggleEmergencyStop',
    })
  }

  const setMaxMintAmountPerTx = (amount: number) => {
    writeContract({
      address: LOLLYPOP_CONTRACT_ADDRESS,
      abi: LOLLYPOP_ABI,
      functionName: 'setMaxMintAmountPerTx',
      args: [BigInt(amount)],
    })
  }

  const setMaxSupply = (supply: number) => {
    writeContract({
      address: LOLLYPOP_CONTRACT_ADDRESS,
      abi: LOLLYPOP_ABI,
      functionName: 'setMaxSupply',
      args: [BigInt(supply)],
    })
  }

  const mintForAddress = (to: `0x${string}`, amount: number) => {
    writeContract({
      address: LOLLYPOP_CONTRACT_ADDRESS,
      abi: LOLLYPOP_ABI,
      functionName: 'mintForAddress',
      args: [to, BigInt(amount)],
    })
  }

  const withdraw = () => {
    writeContract({
      address: LOLLYPOP_CONTRACT_ADDRESS,
      abi: LOLLYPOP_ABI,
      functionName: 'withdraw',
    })
  }

  // Marketplace functions
  const approveMarketplace = (marketplace: `0x${string}`) => {
    writeContract({
      address: LOLLYPOP_CONTRACT_ADDRESS,
      abi: LOLLYPOP_ABI,
      functionName: 'approveMarketplace',
      args: [marketplace],
    })
  }

  const revokeMarketplace = (marketplace: `0x${string}`) => {
    writeContract({
      address: LOLLYPOP_CONTRACT_ADDRESS,
      abi: LOLLYPOP_ABI,
      functionName: 'revokeMarketplace',
      args: [marketplace],
    })
  }

  // Check functions - these need to be used as separate hooks
  const useIsTokenBlocked = (tokenId: number | null) => {
    return useReadContract({
      address: LOLLYPOP_CONTRACT_ADDRESS,
      abi: LOLLYPOP_ABI,
      functionName: 'isTokenBlocked',
      args: tokenId !== null ? [BigInt(tokenId)] : undefined,
      query: { enabled: tokenId !== null }
    })
  }

  const useIsMarketplaceApproved = (marketplace: `0x${string}` | null) => {
    return useReadContract({
      address: LOLLYPOP_CONTRACT_ADDRESS,
      abi: LOLLYPOP_ABI,
      functionName: 'isMarketplaceApproved',
      args: marketplace ? [marketplace] : undefined,
      query: { enabled: !!marketplace }
    })
  }

  // Helper function to check if user can mint
  const canMint = () => {
    if (!address || !lastMintTime || !mintCooldown) return true
    const now = Math.floor(Date.now() / 1000)
    return now >= Number(lastMintTime) + Number(mintCooldown)
  }

  // Helper function to get remaining cooldown
  const getRemainingCooldown = () => {
    if (!lastMintTime || !mintCooldown) return 0
    const now = Math.floor(Date.now() / 1000)
    const nextMintTime = Number(lastMintTime) + Number(mintCooldown)
    return Math.max(0, nextMintTime - now)
  }

  return {
    // Basic contract info
    totalSupply: totalSupply as bigint | undefined,
    maxSupply: maxSupply as bigint | undefined,
    maxMintAmountPerTx: maxMintAmountPerTx as bigint | undefined,
    
    // Contract constants
    mintPrice: mintPrice as bigint | undefined,
    txFee: txFee as bigint | undefined,
    extraFeePercentage: extraFeePercentage as bigint | undefined,
    referralFeePercentage: referralFeePercentage as bigint | undefined,
    
    // Security features
    emergencyStop: emergencyStop as boolean | undefined,
    paused: paused as boolean | undefined,
    mintCooldown: mintCooldown as bigint | undefined,
    
    // User data
    userBalance: userBalance as bigint | undefined,
    lastMintTime: lastMintTime as bigint | undefined,
    mintCount: mintCount as bigint | undefined,
    
    // Referral data
    referralStats: referralStats as [bigint, bigint] | undefined, // [earnings, totalReferred]
    referralEarnings: referralEarnings as bigint | undefined,
    
    // Contract settings
    marketplaceRestrictionEnabled: marketplaceRestrictionEnabled as boolean | undefined,
    contractOwner: contractOwner as `0x${string}` | undefined,
    
    // Loading states
    totalSupplyLoading,
    maxSupplyLoading,
    maxMintAmountPerTxLoading,
    
    // Write functions
    mint,
    mintWithReferral,
    withdrawReferralEarnings,
    blockToken,
    unblockToken,
    blockMultipleTokens,
    pause,
    unpause,
    toggleEmergencyStop,
    setMaxMintAmountPerTx,
    setMaxSupply,
    mintForAddress,
    withdraw,
    approveMarketplace,
    revokeMarketplace,
    
    // Check functions (these should be used as separate hooks)
    useIsTokenBlocked,
    useIsMarketplaceApproved,
    
    // Helper functions
    calculateTotalCost,
    canMint,
    getRemainingCooldown,
    
    // Transaction states
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
    
    // Utilities
    refetchTotalSupply,
    refetchReferralStats,
  }
}