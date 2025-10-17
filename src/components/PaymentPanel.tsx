"use client";

import { useState, useEffect } from "react";
import { usePaymentReceiver } from "@/hooks/usePaymentReceiver";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Send, Wallet, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { NETWORK_NAMES } from "@/contracts/paymentReceiver";
import { useChainId } from "wagmi";

export function PaymentPanel() {
  const {
    contractAddress,
    isContractAvailable,
    contractBalance,
    isOwner,
    sendPayment,
    withdraw,
    emergencyWithdraw,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    formatAmount,
    refetchBalance,
  } = usePaymentReceiver();

  const chainId = useChainId();
  const [paymentAmount, setPaymentAmount] = useState("");

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Transaction confirmed!", {
        description: "Your transaction has been successfully processed.",
      });
      setPaymentAmount("");
      refetchBalance();
    }
  }, [isConfirmed, refetchBalance]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      toast.error("Transaction failed", {
        description: error.message || "An error occurred during the transaction.",
      });
    }
  }, [error]);

  const handleSendPayment = () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error("Invalid amount", {
        description: "Please enter a valid payment amount.",
      });
      return;
    }

    try {
      sendPayment(paymentAmount);
      toast.info("Transaction submitted", {
        description: "Please confirm the transaction in your wallet.",
      });
    } catch (err) {
      console.error("Error sending payment:", err);
    }
  };

  const handleWithdraw = () => {
    try {
      withdraw();
      toast.info("Withdrawal submitted", {
        description: "Please confirm the transaction in your wallet.",
      });
    } catch (err) {
      console.error("Error withdrawing:", err);
    }
  };

  const handleEmergencyWithdraw = () => {
    if (window.confirm("Are you sure you want to perform an emergency withdrawal? This will withdraw all funds.")) {
      try {
        emergencyWithdraw();
        toast.info("Emergency withdrawal submitted", {
          description: "Please confirm the transaction in your wallet.",
        });
      } catch (err) {
        console.error("Error with emergency withdrawal:", err);
      }
    }
  };

  if (!isContractAvailable) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Receiver</CardTitle>
          <CardDescription>
            Contract not available on this network
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

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Send Payment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Payment
          </CardTitle>
          <CardDescription>
            Send ETH to the payment receiver contract
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment-amount">Amount (ETH)</Label>
            <Input
              id="payment-amount"
              type="number"
              step="0.001"
              placeholder="0.0"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              disabled={isPending || isConfirming}
            />
          </div>

          <Button
            onClick={handleSendPayment}
            disabled={isPending || isConfirming || !paymentAmount}
            className="w-full"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isPending ? "Confirm in wallet..." : "Processing..."}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Payment
              </>
            )}
          </Button>

          {isConfirmed && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Payment sent successfully!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Contract Balance & Owner Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Contract Balance
          </CardTitle>
          <CardDescription>
            Current balance in the payment receiver
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="text-sm text-gray-600 mb-1">Total Balance</div>
            <div className="text-3xl font-bold text-gray-900">
              {contractBalance ? formatAmount(contractBalance) : "0.0"} ETH
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Contract: {contractAddress?.slice(0, 6)}...{contractAddress?.slice(-4)}
            </div>
          </div>

          {isOwner && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Owner Controls
                </div>

                <Button
                  onClick={handleWithdraw}
                  disabled={isPending || isConfirming || !contractBalance || contractBalance === BigInt(0)}
                  className="w-full"
                  variant="outline"
                >
                  {isPending || isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Withdraw All Funds
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleEmergencyWithdraw}
                  disabled={isPending || isConfirming || !contractBalance || contractBalance === BigInt(0)}
                  className="w-full"
                  variant="destructive"
                >
                  {isPending || isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Emergency Withdraw
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {!isOwner && (
            <Alert>
              <AlertDescription className="text-sm">
                Only the contract owner can withdraw funds.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
