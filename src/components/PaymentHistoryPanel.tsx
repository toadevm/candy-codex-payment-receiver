"use client";

import { usePaymentReceiver } from "@/hooks/usePaymentReceiver";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, History, RefreshCw, AlertCircle, ExternalLink } from "lucide-react";
import { NETWORK_NAMES } from "@/contracts/paymentReceiver";
import { useChainId } from "wagmi";

export function PaymentHistoryPanel() {
  const {
    isContractAvailable,
    totalPayments,
    formatAmount,
    formatTimestamp,
    refetchTotalPayments,
    contractAddress,
  } = usePaymentReceiver();

  const chainId = useChainId();
  const { data: recentPaymentsData, isLoading, refetch } = usePaymentReceiver().useRecentPayments(20);

  if (!isContractAvailable) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            View recent payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              The Payment Receiver contract is not deployed on{" "}
              {NETWORK_NAMES[chainId as keyof typeof NETWORK_NAMES] || "this network"}.
              Please switch to a supported network.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const handleRefresh = () => {
    refetch();
    refetchTotalPayments();
  };

  // Extract payment data
  const payments: Array<{
    id: number;
    payer: string;
    amount: bigint;
    timestamp: number;
  }> = [];

  if (recentPaymentsData) {
    const [paymentIds, payers, amounts, timestamps] = recentPaymentsData;

    for (let i = 0; i < paymentIds.length; i++) {
      payments.push({
        id: Number(paymentIds[i]),
        payer: payers[i],
        amount: amounts[i],
        timestamp: Number(timestamps[i]),
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Payment History
            </CardTitle>
            <CardDescription>
              Recent transactions on the payment receiver
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Total Payments:</span>
            <Badge variant="secondary" className="font-mono">
              {totalPayments?.toString() || "0"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Network:</span>
            <Badge variant="outline" className="font-mono">
              {NETWORK_NAMES[chainId as keyof typeof NETWORK_NAMES] || `Chain ${chainId}`}
            </Badge>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No payments recorded yet</p>
            <p className="text-gray-400 text-xs mt-2">
              Send your first payment to see it appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => {
              // Get the correct block explorer URL based on chainId
              const explorerUrls: Record<number, string> = {
                1: 'https://etherscan.io',
                324: 'https://explorer.zksync.io',
                10: 'https://optimistic.etherscan.io',
                42161: 'https://arbiscan.io',
                80094: 'https://berascan.com',
                2020: 'https://app.roninchain.com',
                43114: 'https://snowtrace.io',
                8453: 'https://basescan.org',
                33139: 'https://apescan.io',
                1329: 'https://seitrace.com',
                2741: 'https://abscan.org',
                56: 'https://bscscan.com',
                1284: 'https://moonscan.io',
              };
              const explorerUrl = explorerUrls[chainId] || 'https://etherscan.io';

              return (
                <div
                  key={payment.id}
                  className="border-2 border-dashed !border-purple-600 hover:!border-purple-500 rounded-lg p-4 hover:shadow-lg transition-all duration-300 bg-white"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="font-mono text-sm font-semibold text-purple-700">
                        #{payment.id}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Payer:</span>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {payment.payer.slice(0, 6)}...{payment.payer.slice(-4)}
                        </code>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-green-600 text-lg">
                          {formatAmount(payment.amount)}
                        </span>
                        <span className="text-gray-500 text-xs">ETH</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatTimestamp(payment.timestamp)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          window.open(`${explorerUrl}/address/${contractAddress}#events`, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {payments.length > 0 && (
          <div className="mt-4 text-center text-xs text-gray-500">
            Showing most recent {payments.length} payment{payments.length !== 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
