"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLollypopContract } from "@/hooks/useLollypopContract";
import { formatEther, isAddress } from "viem";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { Share2, Wallet, Trophy, Users } from "lucide-react";

export default function ReferralSection() {
  const { address } = useAccount();
  const {
    referralStats,
    referralEarnings,
    mintWithReferral,
    withdrawReferralEarnings,
    calculateTotalCost,
    isPending,
    isConfirmed,
    refetchReferralStats,
  } = useLollypopContract();

  const [mintQuantity, setMintQuantity] = useState(1);
  const [referrerAddress, setReferrerAddress] = useState("");
  const [showReferralMint, setShowReferralMint] = useState(false);

  const handleMintWithReferral = () => {
    if (!isAddress(referrerAddress)) {
      toast.error("Please enter a valid referrer address");
      return;
    }

    if (referrerAddress.toLowerCase() === address?.toLowerCase()) {
      toast.error("You cannot refer yourself");
      return;
    }

    mintWithReferral(mintQuantity, referrerAddress as `0x${string}`);
  };

  const handleWithdrawEarnings = () => {
    withdrawReferralEarnings();
  };

  const copyReferralLink = () => {
    if (!address) return;
    const referralLink = `${window.location.origin}?ref=${address}`;
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  const totalCost = calculateTotalCost(mintQuantity);
  const hasEarnings = referralEarnings && referralEarnings > BigInt(0);

  if (isConfirmed) {
    refetchReferralStats();
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12 px-4"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Referral Program
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Earn rewards by referring friends to mint Genesis Lollypop NFTs. Share your
            referral link and earn 0.11% of each successful mint!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto px-4 sm:px-0">
          {/* Referral Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 tracking-widest text-yellow-500" />
                  Your Referral Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {address ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold text-green-600">
                          {referralStats ? referralStats[1].toString() : "0"}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total Referrals
                        </div>
                      </div>

                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">
                          {referralEarnings
                            ? formatEther(referralEarnings)
                            : "0"}{" "}
                          ETH
                        </div>
                        <div className="text-sm text-gray-600">
                          Total Earnings
                        </div>
                      </div>
                    </div>

                    {hasEarnings && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-yellow-800">
                              Earnings Available
                            </div>
                            <div className="text-sm text-yellow-600">
                              {formatEther(referralEarnings!)} ETH ready to
                              withdraw
                            </div>
                          </div>
                          <Button
                            onClick={handleWithdrawEarnings}
                            disabled={isPending}
                            variant="outline"
                            className="border-yellow-300 hover:bg-yellow-100"
                          >
                            <Wallet className="h-4 w-4 mr-2" />
                            Withdraw
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    <Button
                      onClick={copyReferralLink}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Copy Referral Link
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Connect your wallet to view referral stats
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Mint with Referral Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-purple-500" />
                  Mint with Referral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Use a referral link?
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReferralMint(!showReferralMint)}
                      className="font-dynapuff tracking-wide"
                    >
                      {showReferralMint ? "Hide" : "Show"} Referral Mint
                    </Button>
                  </div>

                  {showReferralMint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <Label
                          htmlFor="referrer"
                          className="font-dynapuff tracking-wide"
                        >
                          Referrer Address
                        </Label>
                        <Input
                          id="referrer"
                          placeholder="0x..."
                          value={referrerAddress}
                          onChange={(e) => setReferrerAddress(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="quantity"
                          className="font-dynapuff tracking-wide"
                        >
                          Quantity
                        </Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          max="10"
                          value={mintQuantity}
                          onChange={(e) =>
                            setMintQuantity(Number(e.target.value))
                          }
                          className="mt-1"
                        />
                      </div>

                      <div className="p-3 bg-white rounded-lg border">
                        <div className="flex justify-between text-sm">
                          <span className="font-dynapuff tracking-wide">
                            Total Cost:
                          </span>
                          <span className="font-semibold font-dynapuff tracking-wide">
                            {formatEther(totalCost)} ETH
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={handleMintWithReferral}
                        disabled={
                          isPending ||
                          !referrerAddress ||
                          !isAddress(referrerAddress)
                        }
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 font-chewy tracking-wider"
                      >
                        {isPending
                          ? "Minting..."
                          : `Mint ${mintQuantity} with Referral`}
                      </Button>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">How it works:</h4>
                  <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">
                        1
                      </Badge>
                      <span>Share your referral link with friends</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">
                        2
                      </Badge>
                      <span>They mint using your referral link</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">
                        3
                      </Badge>
                      <span>Earn 0.11% of their mint cost as reward</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">
                        4
                      </Badge>
                      <span>Withdraw your earnings anytime</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
