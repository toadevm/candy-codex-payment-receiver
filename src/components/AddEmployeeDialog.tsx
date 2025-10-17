"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePayrollContract, ZERO_ADDRESS } from "@/hooks/usePayrollContract";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AddEmployeeDialog() {
  const [open, setOpen] = useState(false);
  const [employeeAddress, setEmployeeAddress] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [intervalDays, setIntervalDays] = useState("30");
  const [tokenAddress, setTokenAddress] = useState(ZERO_ADDRESS);

  const { addEmployee, isPending, isConfirmed } = usePayrollContract();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeAddress || !paymentAmount || !intervalDays) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      addEmployee(employeeAddress, paymentAmount, tokenAddress, parseInt(intervalDays));
      toast.success("Adding employee...");
    } catch (error) {
      toast.error("Failed to add employee");
      console.error(error);
    }
  };

  if (isConfirmed) {
    setOpen(false);
    setEmployeeAddress("");
    setPaymentAmount("");
    setIntervalDays("30");
    setTokenAddress(ZERO_ADDRESS);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Add a new employee to the automated payroll system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="address">Employee Wallet Address *</Label>
              <Input
                id="address"
                placeholder="0x..."
                value={employeeAddress}
                onChange={(e) => setEmployeeAddress(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Payment Amount (ETH) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.001"
                placeholder="0.5"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="interval">Payment Interval (Days) *</Label>
              <Input
                id="interval"
                type="number"
                min="1"
                max="365"
                placeholder="30"
                value={intervalDays}
                onChange={(e) => setIntervalDays(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Between 1 and 365 days</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="token">Token Address (Optional)</Label>
              <Input
                id="token"
                placeholder="0x... (leave default for ETH)"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value || ZERO_ADDRESS)}
              />
              <p className="text-xs text-muted-foreground">
                Use 0x0000... for ETH or enter ERC20 token address
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
