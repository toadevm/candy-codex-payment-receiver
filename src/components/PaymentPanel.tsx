"use client";

import { useEffect } from "react";
import { usePaymentReceiver } from "@/hooks/usePaymentReceiver";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Wallet, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PAYMENT_RECEIVER_ADDRESSES, NETWORK_NAMES } from "@/contracts/paymentReceiver";
import { NETWORK_ICONS } from "@/config/networkIcons";
import { useChainId, useSwitchChain } from "wagmi";
import Image from "next/image";

export function PaymentPanel() {
  const {
    contractAddress,
    isContractAvailable,
    contractBalance,
    isOwner,
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
  const { switchChain } = useSwitchChain();

  // Get all available chain IDs
  const availableChains = Object.keys(PAYMENT_RECEIVER_ADDRESSES).map(Number);

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Transaction confirmed!", {
        description: "Your transaction has been successfully processed.",
      });
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

                <div className="space-y-2">
                  <Label htmlFor="withdraw-chain-select">Withdraw Network</Label>
                  <Select
                    value={chainId.toString()}
                    onValueChange={(value) => {
                      const selectedChainId = parseInt(value);
                      if (switchChain && selectedChainId !== chainId) {
                        switchChain({ chainId: selectedChainId });
                      }
                    }}
                  >
                    <SelectTrigger id="withdraw-chain-select">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          {NETWORK_ICONS[chainId] && (
                            <Image
                              src={NETWORK_ICONS[chainId]}
                              alt={NETWORK_NAMES[chainId as keyof typeof NETWORK_NAMES] || "Network"}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                          )}
                          <span>{NETWORK_NAMES[chainId as keyof typeof NETWORK_NAMES] || "Select Network"}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {availableChains.map((chain) => (
                        <SelectItem key={chain} value={chain.toString()}>
                          <div className="flex items-center gap-2">
                            {NETWORK_ICONS[chain] && (
                              <Image
                                src={NETWORK_ICONS[chain]}
                                alt={NETWORK_NAMES[chain as keyof typeof NETWORK_NAMES]}
                                width={20}
                                height={20}
                                className="rounded-full"
                              />
                            )}
                            <span>{NETWORK_NAMES[chain as keyof typeof NETWORK_NAMES]}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleWithdraw}
                  disabled={isPending || isConfirming || !contractBalance || contractBalance === BigInt(0)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0"
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
                  className="w-full shadow-lg hover:shadow-xl transition-all duration-300"
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
  );
}
