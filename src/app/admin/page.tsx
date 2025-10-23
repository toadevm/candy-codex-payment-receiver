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
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  <strong>Development Mode:</strong> Admin access is currently open. To restrict access,
                  configure ADMIN_ADDRESSES in /src/app/admin/page.tsx with authorized wallet addresses.
                </AlertDescription>
              </Alert>

              <NetworkManager />

              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700">
                  <strong>Post-Addition Steps:</strong>
                  <ol className="list-decimal ml-5 mt-2 space-y-1">
                    <li>Upload the network icon to <code className="bg-yellow-100 px-1 rounded">public/icons/</code></li>
                    <li>Review the updated configuration files</li>
                    <li>Commit changes to your repository</li>
                    <li>Run <code className="bg-yellow-100 px-1 rounded">npm run build</code></li>
                    <li>Deploy the updated application</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
