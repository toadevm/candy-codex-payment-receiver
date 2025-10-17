"use client";

import { useState } from "react";
import { usePayrollContract } from "@/hooks/usePayrollContract";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AddEmployeeDialog } from "./AddEmployeeDialog";
import { EmployeeList } from "./EmployeeList";
import { formatEther } from "viem";
import {
  Pause,
  Play,
  DollarSign,
  Upload,
  Download,
  Loader2,
  AlertCircle,
  Coins
} from "lucide-react";
import { toast } from "sonner";

export function OwnerPanel() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [isTokenMode, setIsTokenMode] = useState(false);

  const {
    contractETHBalance,
    paused,
    employeeCount,
    eligibleEmployees,
    pauseAllPayments,
    resumeAllPayments,
    depositETH,
    withdrawETH,
    depositTokens,
    withdrawTokens,
    useContractTokenBalance,
    executeAllPayments,
    executePayment,
    removeEmployee,
    pauseEmployee,
    resumeEmployee,
    isPending,
  } = usePayrollContract();

  const { data: tokenBalance } = useContractTokenBalance(tokenAddress);

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid deposit amount");
      return;
    }

    if (isTokenMode) {
      if (!tokenAddress || tokenAddress.length !== 42) {
        toast.error("Please enter a valid token contract address");
        return;
      }
      depositTokens(tokenAddress, depositAmount);
      toast.success("Depositing tokens... (Approve transaction first if needed)");
    } else {
      depositETH(depositAmount);
      toast.success("Depositing ETH...");
    }
    setDepositAmount("");
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid withdrawal amount");
      return;
    }

    if (isTokenMode) {
      if (!tokenAddress || tokenAddress.length !== 42) {
        toast.error("Please enter a valid token contract address");
        return;
      }
      withdrawTokens(tokenAddress, withdrawAmount);
      toast.success("Withdrawing tokens...");
    } else {
      withdrawETH(withdrawAmount);
      toast.success("Withdrawing ETH...");
    }
    setWithdrawAmount("");
  };

  const handleExecuteAll = () => {
    if (!eligibleEmployees || eligibleEmployees.length === 0) {
      toast.error("No employees are due for payment");
      return;
    }
    executeAllPayments();
    toast.success("Executing all payments...");
  };

  const handlePauseAll = () => {
    pauseAllPayments();
    toast.success("Pausing all payments...");
  };

  const handleResumeAll = () => {
    resumeAllPayments();
    toast.success("Resuming all payments...");
  };

  const handleExecutePayment = (address: string) => {
    executePayment(address);
    toast.success("Executing payment...");
  };

  const handlePauseEmployee = (address: string) => {
    pauseEmployee(address);
    toast.success("Pausing employee...");
  };

  const handleResumeEmployee = (address: string) => {
    resumeEmployee(address);
    toast.success("Resuming employee...");
  };

  const handleRemoveEmployee = (address: string) => {
    if (confirm(`Are you sure you want to remove employee ${address}?`)) {
      removeEmployee(address);
      toast.success("Removing employee...");
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ETH Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contractETHBalance ? formatEther(contractETHBalance) : "0"}
            </div>
            <p className="text-xs text-muted-foreground">ETH available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Token Balance</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {tokenBalance !== undefined && tokenAddress ? formatEther(tokenBalance) : "---"}
            </div>
            <p className="text-xs text-muted-foreground">
              {tokenAddress ? `${tokenAddress.slice(0, 6)}...${tokenAddress.slice(-4)}` : "Enter token address"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeCount ? employeeCount.toString() : "0"}</div>
            <p className="text-xs text-muted-foreground">Registered in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments Due</CardTitle>
            {paused && <Badge variant="destructive">Paused</Badge>}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {eligibleEmployees ? eligibleEmployees.length : "0"}
            </div>
            <p className="text-xs text-muted-foreground">Employees awaiting payment</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage payroll system operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <AddEmployeeDialog />

            <Button
              variant="default"
              onClick={handleExecuteAll}
              disabled={isPending || !eligibleEmployees || eligibleEmployees.length === 0}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <DollarSign className="mr-2 h-4 w-4" />
              )}
              Pay All Due Employees
            </Button>

            {paused ? (
              <Button variant="outline" onClick={handleResumeAll} disabled={isPending}>
                <Play className="mr-2 h-4 w-4" />
                Resume All Payments
              </Button>
            ) : (
              <Button variant="outline" onClick={handlePauseAll} disabled={isPending}>
                <Pause className="mr-2 h-4 w-4" />
                Pause All Payments
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fund Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fund Management</CardTitle>
              <CardDescription>Deposit and withdraw funds for employee payments</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="token-mode" className="text-sm font-medium">
                {isTokenMode ? "ERC20 Token" : "ETH"}
              </Label>
              <Switch
                id="token-mode"
                checked={isTokenMode}
                onCheckedChange={setIsTokenMode}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Token Address Input (only for ERC20 mode) */}
          {isTokenMode && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <Label htmlFor="tokenAddress">Token Contract Address</Label>
              <Input
                id="tokenAddress"
                placeholder="0x..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
              />
              {tokenBalance !== undefined && tokenAddress && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">
                    Contract Balance: {formatEther(tokenBalance)}
                  </Badge>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Enter the ERC20 token contract address. You&apos;ll need to approve token spending before deposit.
              </p>
            </div>
          )}

          {/* Deposit and Withdraw */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit">Deposit Amount</Label>
                <Input
                  id="deposit"
                  type="number"
                  step="0.000001"
                  placeholder={isTokenMode ? "100" : "0.5"}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleDeposit} disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Deposit {isTokenMode ? "Tokens" : "ETH"}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw">Withdraw Amount</Label>
                <Input
                  id="withdraw"
                  type="number"
                  step="0.000001"
                  placeholder={isTokenMode ? "100" : "0.5"}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleWithdraw}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Withdraw {isTokenMode ? "Tokens" : "ETH"}
              </Button>
            </div>
          </div>

          {/* Current Balance Display */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Contract Balance:</span>
              <Badge variant="default" className="text-base">
                {isTokenMode
                  ? tokenBalance !== undefined && tokenAddress
                    ? `${formatEther(tokenBalance)} Tokens`
                    : "Enter token address"
                  : `${contractETHBalance ? formatEther(contractETHBalance) : "0"} ETH`}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <EmployeeList
        onExecutePayment={handleExecutePayment}
        onPause={handlePauseEmployee}
        onResume={handleResumeEmployee}
        onRemove={handleRemoveEmployee}
      />
    </div>
  );
}
