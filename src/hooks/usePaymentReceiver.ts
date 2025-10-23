"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId, useSendTransaction } from 'wagmi';
import { PAYMENT_RECEIVER_ABI, PAYMENT_RECEIVER_ADDRESSES, SupportedChainId } from '@/contracts/paymentReceiver';
import { formatEther, parseEther } from 'viem';

export interface Payment {
  payer: string;
  amount: bigint;
  timestamp: number;
}

export function usePaymentReceiver() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeContract, data: writeHash, isPending: isWritePending, error: writeError } = useWriteContract();
  const { sendTransaction, data: sendHash, isPending: isSendPending, error: sendError } = useSendTransaction();

  // Get contract address for current chain
  const contractAddress = PAYMENT_RECEIVER_ADDRESSES[chainId as SupportedChainId];

  // Combine hashes and states
  const hash = writeHash || sendHash;
  const isPending = isWritePending || isSendPending;
  const error = writeError || sendError;

  // Transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // ============ READ FUNCTIONS ============

  // Contract Owner
  const { data: contractOwner } = useReadContract({
    address: contractAddress,
    abi: PAYMENT_RECEIVER_ABI,
    functionName: 'owner',
    query: {
      enabled: !!contractAddress,
    },
  });

  // Get contract balance
  const { data: contractBalance, refetch: refetchBalance } = useReadContract({
    address: contractAddress,
    abi: PAYMENT_RECEIVER_ABI,
    functionName: 'getBalance',
    query: {
      enabled: !!contractAddress,
      refetchInterval: false, // Disable auto-refetch
    },
  });

  // Get total payments count
  const { data: totalPayments, refetch: refetchTotalPayments } = useReadContract({
    address: contractAddress,
    abi: PAYMENT_RECEIVER_ABI,
    functionName: 'totalPayments',
    query: {
      enabled: !!contractAddress,
      refetchInterval: false, // Disable auto-refetch
    },
  });

  // Get specific payment by ID
  const usePayment = (paymentId?: number) => {
    return useReadContract({
      address: contractAddress,
      abi: PAYMENT_RECEIVER_ABI,
      functionName: 'getPayment',
      args: paymentId !== undefined ? [BigInt(paymentId)] : undefined,
      query: {
        enabled: !!contractAddress && paymentId !== undefined,
      },
    });
  };

  // Get recent payments
  const useRecentPayments = (count: number = 10) => {
    return useReadContract({
      address: contractAddress,
      abi: PAYMENT_RECEIVER_ABI,
      functionName: 'getRecentPayments',
      args: [BigInt(count)],
      query: {
        enabled: !!contractAddress && count > 0,
        refetchInterval: false, // Disable auto-refetch - only refresh when user clicks button
      },
    });
  };

  // ============ WRITE FUNCTIONS ============

  // Send payment (anyone can send)
  // Note: We send ETH directly to the contract which triggers the receive() function
  const sendPayment = (amount: string) => {
    if (!contractAddress) {
      throw new Error('Contract not deployed on this network');
    }
    // Send a simple ETH transfer to trigger the receive() function
    sendTransaction({
      to: contractAddress,
      value: parseEther(amount),
    });
  };

  // Withdraw funds (owner only)
  const withdraw = () => {
    if (!contractAddress) {
      throw new Error('Contract not deployed on this network');
    }
    writeContract({
      address: contractAddress,
      abi: PAYMENT_RECEIVER_ABI,
      functionName: 'withdraw',
    });
  };

  // Emergency withdraw (owner only)
  const emergencyWithdraw = () => {
    if (!contractAddress) {
      throw new Error('Contract not deployed on this network');
    }
    writeContract({
      address: contractAddress,
      abi: PAYMENT_RECEIVER_ABI,
      functionName: 'emergencyWithdraw',
    });
  };

  // Transfer ownership (owner only)
  const transferOwnership = (newOwner: string) => {
    if (!contractAddress) {
      throw new Error('Contract not deployed on this network');
    }
    writeContract({
      address: contractAddress,
      abi: PAYMENT_RECEIVER_ABI,
      functionName: 'transferOwnership',
      args: [newOwner as `0x${string}`],
    });
  };

  // ============ HELPER FUNCTIONS ============

  const isOwner = contractOwner?.toLowerCase() === address?.toLowerCase();

  const formatAmount = (amount: bigint) => {
    return formatEther(amount);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const isContractAvailable = !!contractAddress;

  return {
    // Contract info
    contractAddress,
    isContractAvailable,

    // Read data
    contractOwner,
    contractBalance,
    totalPayments,

    // Read hooks
    usePayment,
    useRecentPayments,

    // Write functions
    sendPayment,
    withdraw,
    emergencyWithdraw,
    transferOwnership,

    // Refetch functions
    refetchBalance,
    refetchTotalPayments,

    // Transaction state
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,

    // Helpers
    isOwner,
    formatAmount,
    formatTimestamp,
  };
}
