"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wallet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAYMENT_RECEIVER_ADDRESSES, NETWORK_NAMES, PAYMENT_RECEIVER_ABI } from "@/contracts/paymentReceiver";
import { useReadContracts } from "wagmi";
import { formatEther } from "viem";
export function MultiChainBalancePanel() {
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
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  const handleRefresh = () => {
    refetch();
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
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Total Balance Summary */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="text-sm text-gray-600 mb-1">Total Balance (All Chains)</div>
          <div className="text-3xl font-bold text-gray-900">
            {formatEther(totalBalance)} ETH
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Across {chainIds.length} networks
          </div>
        </div>

        {isLoading && !data ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Network</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balanceData.map((chain) => (
                  <TableRow key={chain.chainId}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{chain.name}</span>
                        <code className="text-xs bg-gray-100 px-2 py-0.5 rounded w-fit">
                          {chain.address.slice(0, 6)}...{chain.address.slice(-4)}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {chain.isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                      ) : chain.hasError ? (
                        <span className="text-gray-400 text-sm">Error</span>
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                          <span className={`font-mono font-semibold ${
                            chain.balance > BigInt(0) ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {formatEther(chain.balance)}
                          </span>
                          <span className="text-gray-500 text-xs">ETH</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {chain.isLoading ? (
                        <Badge variant="outline" className="text-xs">
                          Loading...
                        </Badge>
                      ) : chain.hasError ? (
                        <Badge variant="destructive" className="text-xs">
                          Error
                        </Badge>
                      ) : chain.balance > BigInt(0) ? (
                        <Badge variant="default" className="text-xs bg-green-600">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Empty
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
