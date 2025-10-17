"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { formatEther, isAddress } from "viem";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  Loader2,
  CheckCircle,
  ExternalLink,
  Share2,
  Wallet,
  Trophy,
  Users,
} from "lucide-react";
import { useLollypopContract } from "@/hooks/useLollypopContract";
import { MINT_PRICE, TX_FEE, EXTRA_FEE_PERCENTAGE } from "@/contracts/lollypop";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function MintSection() {
  const { address, isConnected } = useAccount();
  const [mintAmount, setMintAmount] = useState(1);
  const [referrerAddress, setReferrerAddress] = useState("");
  const [showReferralMint, setShowReferralMint] = useState(false);
  const [activeTab, setActiveTab] = useState<"mint" | "referral">("mint");

  const {
    totalSupply,
    maxSupply,
    maxMintAmountPerTx,
    paused,
    emergencyStop,
    canMint,
    getRemainingCooldown,
    calculateTotalCost,
    mint,
    mintWithReferral,
    withdrawReferralEarnings,
    referralStats,
    referralEarnings,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
    refetchTotalSupply,
    refetchReferralStats,
    totalSupplyLoading,
    maxSupplyLoading,
    maxMintAmountPerTxLoading,
  } = useLollypopContract();

  // Refetch total supply when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      refetchTotalSupply();
      refetchReferralStats();
    }
  }, [isConfirmed, refetchTotalSupply, refetchReferralStats]);

  const totalCost = calculateTotalCost(mintAmount);
  const mintPriceInEth = formatEther(MINT_PRICE);
  const txFeeInEth = formatEther(TX_FEE);
  const extraFee =
    (MINT_PRICE * BigInt(mintAmount) * EXTRA_FEE_PERCENTAGE) / BigInt(10000);
  const extraFeeInEth = formatEther(extraFee);
  const totalCostInEth = formatEther(totalCost);

  const [cooldownTime, setCooldownTime] = useState(0);

  // Update cooldown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldownTime(getRemainingCooldown());
    }, 1000);

    return () => clearInterval(interval);
  }, [getRemainingCooldown]);

  // Check for referral parameter in URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const refParam = urlParams.get("ref");

      if (refParam && isAddress(refParam)) {
        setReferrerAddress(refParam);
        setShowReferralMint(true);

        // Clean up URL without page refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, []);

  const handleMintAmountChange = (amount: number) => {
    const max = maxMintAmountPerTx ? Number(maxMintAmountPerTx) : 1;
    setMintAmount(Math.max(1, Math.min(amount, max)));
  };

  const handleMint = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (showReferralMint && referrerAddress) {
      handleMintWithReferral();
    } else {
      mint(mintAmount);
    }
  };

  const handleMintWithReferral = () => {
    if (!isAddress(referrerAddress)) {
      toast.error("Please enter a valid referrer address");
      return;
    }

    if (referrerAddress.toLowerCase() === address?.toLowerCase()) {
      toast.error("You cannot refer yourself");
      return;
    }

    mintWithReferral(mintAmount, referrerAddress as `0x${string}`);
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

  const remaining =
    maxSupply && totalSupply !== undefined
      ? Number(maxSupply - totalSupply)
      : null;
  const progress =
    maxSupply && totalSupply !== undefined
      ? (Number(totalSupply) / Number(maxSupply)) * 100
      : 0;
  const hasEarnings = referralEarnings && referralEarnings > BigInt(0);

  return (
    <section className="py-4 bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-sm w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("mint")}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-all font-dynapuff ${
                activeTab === "mint"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Mint NFT
            </button>
            <button
              onClick={() => setActiveTab("referral")}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-all font-dynapuff ${
                activeTab === "referral"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Referral Program
            </button>
          </div>
        </div>

        {activeTab === "mint" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto px-4 sm:px-0"
          >
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl h-full">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CardTitle className="text-xl tracking-wider sm:text-2xl font-bold mb-2 font-chewy">
                    🍭 Mint Genesis Collection
                  </CardTitle>
                </motion.div>
                <CardDescription className="font-dynapuff sm:text-xl">
                  Mint your Lollypop from the Genesis Collection!
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Referral Toggle */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-700 font-dynapuff tracking-wide">
                    Have a referral code?
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReferralMint(!showReferralMint)}
                    className="bg-white hover:bg-gray-50 font-dynapuff tracking-wide"
                  >
                    {showReferralMint ? "Hide" : "Use"} Referral
                  </Button>
                </motion.div>

                {/* Referral Input */}
                {showReferralMint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border"
                  >
                    <Label
                      htmlFor="referrer"
                      className="text-sm font-medium font-dynapuff tracking-wide"
                    >
                      Referrer Address
                    </Label>
                    <Input
                      id="referrer"
                      placeholder="0x..."
                      value={referrerAddress}
                      onChange={(e) => setReferrerAddress(e.target.value)}
                      className="bg-white"
                    />
                    <p className="text-xs text-gray-600 font-dynapuff tracking-wide">
                      💡 Earn rewards for your referrer with each mint!
                    </p>
                  </motion.div>
                )}

                {/* Supply Progress */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between text-sm text-muted-foreground font-dynapuff tracking-wide">
                    <span>Minted</span>
                    <span>
                      {totalSupplyLoading || maxSupplyLoading ? (
                        <span className="flex items-center gap-2 font-dynapuff tracking-wide">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Loading...
                        </span>
                      ) : (
                        `${totalSupply?.toString() || 0} / ${
                          maxSupply?.toString() || 0
                        }`
                      )}
                    </span>
                  </div>

                  <Progress value={progress} className="h-3" />

                  <motion.p
                    key={remaining}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-center text-sm text-muted-foreground font-dynapuff tracking-wide"
                  >
                    {remaining !== null
                      ? `${remaining} remaining`
                      : "Loading..."}
                  </motion.p>
                </motion.div>

                {/* Mint Amount Selector */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <label className="block text-sm font-medium font-dynapuff tracking-wide">
                    Quantity
                  </label>
                  <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMintAmountChange(mintAmount - 1)}
                      disabled={mintAmount <= 1}
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <motion.div
                      key={mintAmount}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="flex items-center"
                    >
                      <input
                        type="number"
                        min="1"
                        max={
                          maxMintAmountPerTxLoading
                            ? 1
                            : Number(maxMintAmountPerTx) || 1
                        }
                        value={mintAmount}
                        onChange={(e) =>
                          handleMintAmountChange(parseInt(e.target.value) || 1)
                        }
                        className="w-14 sm:w-16 text-center text-lg sm:text-xl font-bold border-2 border-input rounded-lg py-1 sm:py-2 focus:border-primary focus:outline-none bg-background"
                      />
                    </motion.div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMintAmountChange(mintAmount + 1)}
                      disabled={
                        maxMintAmountPerTxLoading ||
                        mintAmount >= Number(maxMintAmountPerTx || 1) ||
                        (remaining !== null && mintAmount >= remaining)
                      }
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>

                {/* Price Breakdown */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
                >
                  <div className="space-y-2 text-sm">
                    <motion.div
                      className="flex justify-between"
                      whileHover={{ x: 2 }}
                    >
                      <span className="text-gray-600 font-dynapuff tracking-wide">
                        Price per NFT:
                      </span>
                      <span className="font-medium text-gray-900 font-dynapuff tracking-wide">
                        {mintPriceInEth} ETH
                      </span>
                    </motion.div>
                    <motion.div
                      className="flex justify-between"
                      whileHover={{ x: 2 }}
                    >
                      <span className="text-gray-600 font-dynapuff tracking-wide">
                        Transaction fee:
                      </span>
                      <span className="font-medium text-gray-900 font-dynapuff tracking-wide">
                        {txFeeInEth} ETH
                      </span>
                    </motion.div>
                    <motion.div
                      className="flex justify-between"
                      whileHover={{ x: 2 }}
                    >
                      <span className="text-gray-600 font-dynapuff tracking-wide">
                        Development Fee (1%):
                      </span>
                      <span className="font-medium text-gray-900 font-dynapuff tracking-wide">
                        {extraFeeInEth} ETH
                      </span>
                    </motion.div>
                    <motion.div
                      className="flex justify-between"
                      whileHover={{ x: 2 }}
                    >
                      <span className="text-gray-600 font-dynapuff tracking-wide">
                        Quantity:
                      </span>
                      <span className="font-medium text-gray-900 font-dynapuff tracking-wide">
                        {mintAmount}
                      </span>
                    </motion.div>
                    <hr className="my-2 border-border" />
                    <motion.div
                      className="flex justify-between font-bold text-lg"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="text-gray-900 font-chewy tracking-wide">
                        Total:
                      </span>
                      <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-chewy tracking-wide">
                        {totalCostInEth} ETH
                      </span>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Mint Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleMint}
                    disabled={
                      !isConnected ||
                      isPending ||
                      isConfirming ||
                      remaining === 0 ||
                      totalSupplyLoading ||
                      maxSupplyLoading ||
                      paused ||
                      emergencyStop ||
                      !canMint() ||
                      (showReferralMint &&
                        (!referrerAddress || !isAddress(referrerAddress)))
                    }
                    className="w-full bg-gradient-to-r tracking-widest from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 sm:py-6 text-base sm:text-lg disabled:opacity-50 shadow-lg font-chewy "
                    size="lg"
                  >
                    {!isConnected ? (
                      "Connect Wallet to Mint"
                    ) : paused ? (
                      "⏸️ Contract Paused"
                    ) : emergencyStop ? (
                      "🚨 Emergency Stop Active"
                    ) : !canMint() && cooldownTime > 0 ? (
                      `⏰ Cooldown: ${Math.floor(cooldownTime / 60)}:${(
                        cooldownTime % 60
                      )
                        .toString()
                        .padStart(2, "0")}`
                    ) : totalSupplyLoading || maxSupplyLoading ? (
                      <span className="flex items-center gap-2 font-dynapuff tracking-wide">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading Contract Data...
                      </span>
                    ) : isPending ? (
                      <span className="flex items-center gap-2 font-dynapuff tracking-wide">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Confirming Transaction...
                      </span>
                    ) : isConfirming ? (
                      <span className="flex items-center gap-2 font-dynapuff tracking-wide">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Minting...
                      </span>
                    ) : remaining === 0 ? (
                      "Sold Out"
                    ) : showReferralMint ? (
                      `Mint ${mintAmount} with Referral`
                    ) : (
                      `Mint ${mintAmount} Genesis Lollypop${mintAmount > 1 ? "s" : ""}`
                    )}
                  </Button>
                </motion.div>

                {/* Transaction Status */}
                {hash && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <p className="text-sm text-blue-800 flex items-center gap-2 font-dynapuff tracking-wide">
                      <ExternalLink className="h-4 w-4" />
                      Transaction submitted:{" "}
                      <a
                        href={`https://etherscan.io/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-900 font-medium font-dynapuff tracking-wide"
                      >
                        View on Etherscan
                      </a>
                    </p>
                  </motion.div>
                )}

                {isConfirmed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <p className="text-sm text-green-800 font-medium flex items-center gap-2 font-dynapuff tracking-wide">
                      <CheckCircle className="h-4 w-4" />
                      🎉 Successfully minted {mintAmount} Genesis Lollypop NFT
                      {mintAmount > 1 ? "s" : ""}!
                    </p>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-sm text-red-800 font-dynapuff tracking-wide">
                      Error: {error.message}
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Referral Tab */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto px-4 sm:px-0"
          >
            <div className="grid md:grid-cols-2 gap-4 sm:gap-8 items-stretch">
              {/* Referral Stats Card */}
              <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl h-full">
                <CardHeader>
                  <CardTitle className="flex tracking-wider items-center gap-2 font-chewy">
                    {/* <Trophy className="h-5 w-5 tracking-widest text-yellow-500" /> */}
                    Your Referral Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {address ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg">
                          <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {referralStats ? referralStats[1].toString() : "0"}
                          </div>
                          <div className="text-sm text-gray-600 font-dynapuff tracking-wide">
                            Total Referrals
                          </div>
                        </div>

                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-lg">
                          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {referralEarnings
                              ? formatEther(referralEarnings)
                              : "0"}{" "}
                            ETH
                          </div>
                          <div className="text-sm text-gray-600 font-dynapuff tracking-wide">
                            Total Earnings
                          </div>
                        </div>
                      </div>

                      {/* {hasEarnings && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
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
                      )} */}

                      <Button
                        onClick={copyReferralLink}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-chewy tracking-wider"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Copy Referral Link
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-dynapuff tracking-wide">
                        Connect your wallet to view referral stats
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* How it Works Card */}
              <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl h-full">
                <CardHeader>
                  <CardTitle className="flex tracking-wider items-center gap-2 font-chewy">
                    {/* <Share2 className="h-5 w-5 tracking-widest text-purple-500" /> */}
                    How Referrals Work
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 font-dynapuff">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 font-dynapuff">
                      Earn 0.11% on every referral!
                    </h4>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-start gap-3">
                        <Badge
                          variant="secondary"
                          className="mt-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                        >
                          1
                        </Badge>
                        <span>Share your referral link with friends</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge
                          variant="secondary"
                          className="mt-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                        >
                          2
                        </Badge>
                        <span>They mint using your referral link</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge
                          variant="secondary"
                          className="mt-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                        >
                          3
                        </Badge>
                        <span>Earn 0.11% of their mint cost as reward</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge
                          variant="secondary"
                          className="mt-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                        >
                          4
                        </Badge>
                        <span>Withdraw your earnings anytime</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2 font-dynapuff">
                      💡 Pro Tips:
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Share on social media for maximum reach</li>
                      <li>• Each successful mint earns you rewards</li>
                      <li>• No limits on how much you can earn</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
