"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wallet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAYMENT_RECEIVER_ADDRESSES, NETWORK_NAMES, PAYMENT_RECEIVER_ABI } from "@/contracts/paymentReceiver";
import { NETWORK_ICONS } from "@/config/networkIcons";
import { NATIVE_TOKENS } from "@/config/nativeTokens";
import { useReadContracts } from "wagmi";
import { formatEther } from "viem";
import { useState } from "react";
import Image from "next/image";

export function MultiChainBalancePanel() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get all chain IDs
  const chainIds = Object.keys(PAYMENT_RECEIVER_ADDRESSES).map(Number);

  // Create contract calls for all chains
  const contracts = chainIds.map((chainId) => ({
    address: PAYMENT_RECEIVER_ADDRESSES[chainId as keyof typeof PAYMENT_RECEIVER_ADDRESSES],
    abi: PAYMENT_RECEIVER_ABI,
    functionName: 'getBalance' as const,
    chainId,
  }));

  const { data, isLoading, refetch } = useReadContracts({
    contracts,
    query: {
      refetchInterval: false, // Disable auto-refetch - only refresh when user clicks button
    },
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    // Keep the spinning animation visible for at least 500ms for better UX
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Calculate total balance across all chains
  const totalBalance = data?.reduce((acc, result) => {
    if (result.status === 'success' && result.result) {
      return acc + result.result;
    }
    return acc;
  }, BigInt(0)) || BigInt(0);

  // Prepare balance data with chain info
  const balanceData = chainIds.map((chainId, index) => {
    const result = data?.[index];
    const balance = result?.status === 'success' ? result.result : BigInt(0);

    return {
      chainId,
      name: NETWORK_NAMES[chainId as keyof typeof NETWORK_NAMES],
      balance,
      address: PAYMENT_RECEIVER_ADDRESSES[chainId as keyof typeof PAYMENT_RECEIVER_ADDRESSES],
      isLoading: !data && isLoading,
      hasError: result?.status === 'failure',
    };
  }).sort((a, b) => {
    // Sort by balance (highest first)
    if (b.balance > a.balance) return 1;
    if (b.balance < a.balance) return -1;
    return 0;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Multi-Chain Balances
            </CardTitle>
            <CardDescription>
              Contract balances across all supported networks
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="shadow-md hover:shadow-lg transition-shadow"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Total Balance Summary */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Value (All Chains)</div>
              <div className="text-3xl font-bold text-gray-900">
                {formatEther(totalBalance)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Combined native tokens
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">
                Across {chainIds.length} networks
              </div>
            </div>
          </div>
        </div>

        {isLoading && !data ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {balanceData.map((chain) => (
              <div
                key={chain.chainId}
                className="border rounded-lg p-3 hover:border-purple-300 transition-colors"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {NETWORK_ICONS[chain.chainId] && (
                        <Image
                          src={NETWORK_ICONS[chain.chainId]}
                          alt={chain.name}
                          width={20}
                          height={20}
                          className="rounded-full flex-shrink-0"
                        />
                      )}
                      <span className="font-medium text-sm truncate">{chain.name}</span>
                    </div>
                    {chain.isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin text-gray-400 flex-shrink-0" />
                    ) : chain.hasError ? (
                      <Badge variant="destructive" className="text-xs h-5">
                        Error
                      </Badge>
                    ) : chain.balance > BigInt(0) ? (
                      <Badge variant="default" className="text-xs h-5 bg-green-600">
                        <div className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                          <span>Active</span>
                        </div>
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs h-5">
                        <div className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                          <span>Active</span>
                        </div>
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    {chain.isLoading ? (
                      <div className="h-6 bg-gray-100 rounded animate-pulse"></div>
                    ) : chain.hasError ? (
                      <span className="text-gray-400 text-xs">Failed to load</span>
                    ) : (
                      <>
                        <div className={`font-mono font-semibold text-lg ${
                          chain.balance > BigInt(0) ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {formatEther(chain.balance)}
                        </div>
                        <span className="text-gray-500 text-xs">
                          {NATIVE_TOKENS[chain.chainId] || "ETH"}
                        </span>
                      </>
                    )}
                  </div>

                  <code className="text-xs bg-gray-100 px-2 py-1 rounded truncate">
                    {chain.address.slice(0, 6)}...{chain.address.slice(-4)}
                  </code>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
