"use client";

import { WalletConnection } from "./WalletConnection";

export function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div>
              <h1 className="text-2xl tracking-wider sm:text-3xl font-bold font-chewy">
                🍭 Candy Codex Payment Receiver
              </h1>
              <p className="text-sm sm:text-base text-purple-100 font-dynapuff">
                Multichain Payment Solution
              </p>
            </div>
          </div>

          <WalletConnection />
        </div>
      </div>
    </header>
  );
}
