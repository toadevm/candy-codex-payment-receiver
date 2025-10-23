"use client";

import { WalletConnection } from "./WalletConnection";
import Link from "next/link";

export function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link href="/">
            <h1 className="text-2xl tracking-wider sm:text-3xl font-bold font-chewy cursor-pointer hover:opacity-90 transition-opacity">
              🍭 Candy Codex Payment Receiver
            </h1>
          </Link>

          <WalletConnection />
        </div>
      </div>
    </header>
  );
}
