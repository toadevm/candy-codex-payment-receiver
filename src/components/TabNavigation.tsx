"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shield } from "lucide-react";

export function TabNavigation() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isAdmin = pathname === "/admin";

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex gap-4 py-4">
          <Link
            href="/"
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300
              ${
                isHome
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
              }
            `}
          >
            <Home className="h-5 w-5" />
            Home
          </Link>

          <Link
            href="/admin"
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300
              ${
                isAdmin
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
              }
            `}
          >
            <Shield className="h-5 w-5" />
            Network Manager
          </Link>
        </div>
      </div>
    </div>
  );
}
