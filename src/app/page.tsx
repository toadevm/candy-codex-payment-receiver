"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PaymentPanel } from "@/components/PaymentPanel";
import { PaymentHistoryPanel } from "@/components/PaymentHistoryPanel";
import { MultiChainBalancePanel } from "@/components/MultiChainBalancePanel";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        {!isConnected ? (
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-chewy">
              Welcome to Payment Receiver
            </h1>
            <p className="text-lg text-gray-600 mb-6 font-dynapuff">
              Connect your wallet to send and receive payments across multiple chains
            </p>
            <p className="text-base text-gray-500 font-dynapuff">
              This decentralized application allows anyone to send ETH payments to
              our multichain payment receiver contract. The contract owner can
              withdraw collected funds at any time. All transactions are transparent
              and recorded on the blockchain.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <MultiChainBalancePanel />
            <PaymentPanel />
            <PaymentHistoryPanel />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
