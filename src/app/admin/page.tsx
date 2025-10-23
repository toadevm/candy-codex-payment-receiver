"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NetworkManager } from "@/components/NetworkManager";
import { useAccount } from "wagmi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Shield } from "lucide-react";

export default function AdminPage() {
  const { isConnected, address } = useAccount();

  // Add your admin addresses here
  const ADMIN_ADDRESSES = [
    // Add admin wallet addresses that should have access
    // Example: "0x1234567890123456789012345678901234567890"
  ];

  const isAdmin = isConnected && address && ADMIN_ADDRESSES.length === 0; // Allow all when no admins configured
  // Change above line to: const isAdmin = isConnected && address && ADMIN_ADDRESSES.includes(address.toLowerCase());
  // After adding admin addresses

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 font-chewy flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Network Administration
            </h1>
            <p className="text-gray-600 font-dynapuff">
              Manage blockchain networks and configurations
            </p>
          </div>

          {!isConnected ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please connect your wallet to access the network administration panel.
              </AlertDescription>
            </Alert>
          ) : !isAdmin ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Access Denied:</strong> Your wallet address is not authorized to access this page.
                Only designated admin addresses can manage network configurations.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              <NetworkManager />

              
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
