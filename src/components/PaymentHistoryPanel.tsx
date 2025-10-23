"use client";

import { usePaymentReceiver } from "@/hooks/usePaymentReceiver";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="shadow-md hover:shadow-lg transition-shadow"
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
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Payer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">
                      #{payment.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {payment.payer.slice(0, 6)}...{payment.payer.slice(-4)}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-semibold text-green-600">
                          {formatAmount(payment.amount)}
                        </span>
                        <span className="text-gray-500 text-xs">ETH</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatTimestamp(payment.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
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
                          // Link to contract events page
                          window.open(`${explorerUrl}/address/${contractAddress}#events`, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
