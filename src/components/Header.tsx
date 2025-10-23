"use client";

import { WalletConnection } from "./WalletConnection";
import Link from "next/link";
import { Shield } from "lucide-react";

export function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/">
              <h1 className="text-2xl tracking-wider sm:text-3xl font-bold font-chewy cursor-pointer hover:opacity-90 transition-opacity">
                🍭 Candy Codex Payment Receiver
              </h1>
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-semibold"
              title="Network Administration"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>

          <WalletConnection />
        </div>
      </div>
    </header>
  );
}
