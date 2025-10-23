"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, CheckCircle2, AlertCircle, Network } from "lucide-react";
import { toast } from "sonner";

interface NetworkFormData {
  chainId: string;
  name: string;
  nativeTokenSymbol: string;
  contractAddress: string;
  rpcUrl: string;
  explorerUrl: string;
  iconUrl: string;
}

export function NetworkManager() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<NetworkFormData>({
    chainId: "",
    name: "",
    nativeTokenSymbol: "",
    contractAddress: "",
    rpcUrl: "",
    explorerUrl: "",
    iconUrl: "",
  });

  const handleInputChange = (field: keyof NetworkFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  };

  const validateForm = (): boolean => {
    if (!formData.chainId || isNaN(Number(formData.chainId))) {
      toast.error("Invalid Chain ID", {
        description: "Chain ID must be a valid number.",
      });
      return false;
    }

    if (!formData.name.trim()) {
      toast.error("Network Name Required", {
        description: "Please enter a network name.",
      });
      return false;
    }

    if (!formData.nativeTokenSymbol.trim()) {
      toast.error("Token Symbol Required", {
        description: "Please enter the native token symbol (e.g., ETH, CRO).",
      });
      return false;
    }

    if (!formData.contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error("Invalid Contract Address", {
        description: "Contract address must be a valid Ethereum address.",
      });
      return false;
    }

    if (!formData.rpcUrl.match(/^https?:\/\/.+/)) {
      toast.error("Invalid RPC URL", {
        description: "RPC URL must be a valid HTTP/HTTPS URL.",
      });
      return false;
    }

    if (!formData.explorerUrl.match(/^https?:\/\/.+/)) {
      toast.error("Invalid Explorer URL", {
        description: "Explorer URL must be a valid HTTP/HTTPS URL.",
      });
      return false;
    }

    if (!formData.iconUrl.match(/^\/icons\/.+\.(png|jpg|jpeg|svg|webp)$/)) {
      toast.error("Invalid Icon Path", {
        description: "Icon URL must be in format: /icons/filename.png",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/add-network", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chainId: Number(formData.chainId),
          name: formData.name.trim(),
          nativeTokenSymbol: formData.nativeTokenSymbol.trim().toUpperCase(),
          contractAddress: formData.contractAddress.toLowerCase(),
          rpcUrl: formData.rpcUrl.trim(),
          explorerUrl: formData.explorerUrl.trim(),
          iconUrl: formData.iconUrl.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add network");
      }

      toast.success("Network Added Successfully!", {
        description: `${formData.name} has been added. Please rebuild and redeploy the app to see changes.`,
      });

      setSuccess(true);

      // Reset form
      setFormData({
        chainId: "",
        name: "",
        nativeTokenSymbol: "",
        contractAddress: "",
        rpcUrl: "",
        explorerUrl: "",
        iconUrl: "",
      });
    } catch (error) {
      console.error("Error adding network:", error);
      toast.error("Failed to Add Network", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Add New Network
        </CardTitle>
        <CardDescription>
          Add support for a new blockchain network to the payment receiver
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chainId">Chain ID *</Label>
              <Input
                id="chainId"
                type="number"
                placeholder="25"
                value={formData.chainId}
                onChange={(e) => handleInputChange("chainId", e.target.value)}
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-gray-500">Numeric chain identifier</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Network Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Cronos"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-gray-500">Display name for the network</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nativeTokenSymbol">Native Token Symbol *</Label>
              <Input
                id="nativeTokenSymbol"
                type="text"
                placeholder="CRO"
                value={formData.nativeTokenSymbol}
                onChange={(e) => handleInputChange("nativeTokenSymbol", e.target.value)}
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-gray-500">e.g., ETH, CRO, BNB</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractAddress">Contract Address *</Label>
              <Input
                id="contractAddress"
                type="text"
                placeholder="0x405792CbED87Fbb34afA505F768C8eDF8f9504E9"
                value={formData.contractAddress}
                onChange={(e) => handleInputChange("contractAddress", e.target.value)}
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-gray-500">Payment receiver contract address</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rpcUrl">RPC URL *</Label>
              <Input
                id="rpcUrl"
                type="url"
                placeholder="https://cronos-evm-rpc.publicnode.com"
                value={formData.rpcUrl}
                onChange={(e) => handleInputChange("rpcUrl", e.target.value)}
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-gray-500">Network RPC endpoint</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="explorerUrl">Block Explorer URL *</Label>
              <Input
                id="explorerUrl"
                type="url"
                placeholder="https://explorer.cronos.org"
                value={formData.explorerUrl}
                onChange={(e) => handleInputChange("explorerUrl", e.target.value)}
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-gray-500">Block explorer base URL</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="iconUrl">Icon Path *</Label>
              <Input
                id="iconUrl"
                type="text"
                placeholder="/icons/cro.png"
                value={formData.iconUrl}
                onChange={(e) => handleInputChange("iconUrl", e.target.value)}
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-gray-500">
                Path to icon in public folder (e.g., /icons/network.png)
              </p>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Important:</strong> After adding a network, you must rebuild and redeploy the application
              for changes to take effect. Make sure the icon file exists in the public/icons directory.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Network...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Network
                </>
              )}
            </Button>
          </div>

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Network configuration files have been updated successfully! Remember to commit, build, and deploy.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
