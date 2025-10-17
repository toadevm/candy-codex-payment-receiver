"use client";

import { useAccount } from "wagmi";
import { usePayrollContract, ZERO_ADDRESS } from "@/hooks/usePayrollContract";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatEther } from "viem";
import { DollarSign, Calendar, Clock, AlertCircle, CheckCircle2, Coins } from "lucide-react";
import { toast } from "sonner";

export function EmployeePanel() {
  const { address } = useAccount();
  const {
    useEmployee,
    useIsPaymentDue,
    useNextPaymentDate,
    contractETHBalance,
    useContractTokenBalance,
    executePayment,
    isPending,
  } = usePayrollContract();

  const { data: employee } = useEmployee(address);
  const { data: isPaymentDue } = useIsPaymentDue(address);
  const { data: nextPaymentTimestamp } = useNextPaymentDate(address);

  const isEthPayment = employee?.tokenAddress === ZERO_ADDRESS;
  const { data: tokenBalance } = useContractTokenBalance(
    employee?.tokenAddress && !isEthPayment ? employee.tokenAddress : undefined
  );

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Employee Dashboard</CardTitle>
          <CardDescription>Connect your wallet to view your employee information</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!employee || !employee.exists) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Employee Dashboard</CardTitle>
          <CardDescription>You are not registered as an employee</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Contact your employer to be added to the payroll system.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleClaimPayment = () => {
    if (!address) return;
    executePayment(address);
    toast.success("Claiming payment...");
  };

  const nextPaymentDate = nextPaymentTimestamp
    ? new Date(Number(nextPaymentTimestamp) * 1000).toLocaleDateString()
    : "N/A";

  return (
    <div className="space-y-6">
      {/* Status Alert */}
      {isPaymentDue && employee.isActive && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <p className="font-medium text-green-900 dark:text-green-100">
                  Your payment is ready! Click the button to claim your salary.
                </p>
              </div>
              <Button onClick={handleClaimPayment} disabled={isPending}>
                {isPending ? "Processing..." : "Claim Payment"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!employee.isActive && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="font-medium text-yellow-900 dark:text-yellow-100">
                Your account is paused. Contact your employer for more information.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employee Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salary Amount</CardTitle>
            {isEthPayment ? (
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Coins className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatEther(employee.paymentAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isEthPayment ? "ETH per period" : "Tokens per period"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Interval</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(employee.paymentIntervalDays)}</div>
            <p className="text-xs text-muted-foreground">Days between payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{nextPaymentDate}</div>
            <p className="text-xs text-muted-foreground">Scheduled date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {employee.isActive ? (
                <Badge variant="default">Active</Badge>
              ) : (
                <Badge variant="secondary">Paused</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isPaymentDue ? "Payment due now" : "Payment scheduled"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contract Balances */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Funding Status</CardTitle>
          <CardDescription>Available funds in payroll contract</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ETH Balance</p>
                  <p className="text-2xl font-bold">
                    {contractETHBalance ? formatEther(contractETHBalance) : "0"}
                  </p>
                </div>
              </div>
              {isEthPayment && (
                <Badge variant={contractETHBalance && contractETHBalance >= employee.paymentAmount ? "default" : "destructive"}>
                  {contractETHBalance && contractETHBalance >= employee.paymentAmount ? "Funded" : "Low"}
                </Badge>
              )}
            </div>

            {!isEthPayment && (
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Coins className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Token Balance</p>
                    <p className="text-2xl font-bold">
                      {tokenBalance !== undefined ? formatEther(tokenBalance) : "0"}
                    </p>
                  </div>
                </div>
                <Badge variant={tokenBalance && tokenBalance >= employee.paymentAmount ? "default" : "destructive"}>
                  {tokenBalance && tokenBalance >= employee.paymentAmount ? "Funded" : "Low"}
                </Badge>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {isEthPayment
              ? "Your salary will be paid in ETH from the contract balance shown above."
              : "Your salary will be paid in ERC20 tokens from the contract token balance shown above."}
          </p>
        </CardContent>
      </Card>

      {/* Employment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Employment Details</CardTitle>
          <CardDescription>Your payroll information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Wallet Address</p>
              <p className="text-sm font-mono mt-1">{address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Currency</p>
              <p className="text-sm mt-1">
                {isEthPayment
                  ? "ETH (Native)"
                  : `ERC20 Token: ${employee.tokenAddress.slice(0, 6)}...${employee.tokenAddress.slice(-4)}`}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Payment</p>
              <p className="text-sm mt-1">
                {employee.lastPaymentTimestamp
                  ? new Date(Number(employee.lastPaymentTimestamp) * 1000).toLocaleString()
                  : "Not paid yet"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
              <div className="mt-1">
                {isPaymentDue ? (
                  <Badge variant="destructive">Due Now</Badge>
                ) : (
                  <Badge variant="outline">Scheduled</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong>Automated Payments:</strong> Your salary is paid automatically every{" "}
            {Number(employee.paymentIntervalDays)} days directly to your connected wallet.
          </p>
          <p>
            <strong>Payment Claiming:</strong> When your payment is due, you can claim it by clicking
            the &ldquo;Claim Payment&rdquo; button. Anyone can trigger the payment execution.
          </p>
          <p>
            <strong>Payment Currency:</strong> Payments are made in{" "}
            {isEthPayment ? "ETH" : "ERC20 tokens"}.
          </p>
          <p>
            <strong>Contract Balance:</strong> The contract funding status section shows if there are enough funds available for your next payment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
