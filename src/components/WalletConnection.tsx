"use client";

import { useAccount, useBalance, useDisconnect } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { formatEther } from "viem";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";

export function WalletConnection() {
  const { address, isConnected, connector } = useAccount();
  const { data: balance } = useBalance({
    address,
  });
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();

  if (!isConnected) {
    return (
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="h-12 sm:h-14 px-2 sm:px-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100 min-w-[150px] sm:min-w-[280px]"
          onClick={() => open()}
        >
          <div className="flex items-center justify-center w-full space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <span className="font-medium text-gray-900 text-sm sm:text-base font-dynapuff">
              Connect Wallet
            </span>
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Button
        variant="outline"
        className="h-12 sm:h-14 px-3 sm:px-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100 min-w-[200px] sm:min-w-[280px]"
        onClick={() => disconnect()}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 text-xs sm:text-sm">
                {address?.slice(0, 4)}...{address?.slice(-3)}
              </p>
              {balance && (
                <p className="text-xs text-gray-600 hidden sm:block">
                  {parseFloat(formatEther(balance.value)).toFixed(4)} ETH
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-xs text-gray-500 bg-white px-1 sm:px-2 py-1 rounded-full border hidden sm:block">
              {connector?.name}
            </span>
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
          </div>
        </div>
      </Button>
    </div>
  );
}
