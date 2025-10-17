"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { PAYROLL_CONTRACT_ADDRESS, PAYROLL_ABI, ZERO_ADDRESS } from '@/contracts/payroll';
import { formatEther, parseEther } from 'viem';

export { ZERO_ADDRESS };

export interface Employee {
  employeeAddress: string;
  paymentAmount: bigint;
  tokenAddress: string;
  paymentIntervalDays: number;
  lastPaymentTimestamp: number;
  isActive: boolean;
  exists: boolean;
}

export function usePayrollContract() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  // Transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // ============ READ FUNCTIONS ============

  // Contract Owner
  const { data: contractOwner } = useReadContract({
    address: PAYROLL_CONTRACT_ADDRESS,
    abi: PAYROLL_ABI,
    functionName: 'owner',
  });

  // Paused state
  const { data: paused } = useReadContract({
    address: PAYROLL_CONTRACT_ADDRESS,
    abi: PAYROLL_ABI,
    functionName: 'paused',
  });

  // Get all employees
  const { data: allEmployees, refetch: refetchEmployees } = useReadContract({
    address: PAYROLL_CONTRACT_ADDRESS,
    abi: PAYROLL_ABI,
    functionName: 'getAllEmployees',
  });

  // Get employee count
  const { data: employeeCount } = useReadContract({
    address: PAYROLL_CONTRACT_ADDRESS,
    abi: PAYROLL_ABI,
    functionName: 'getEmployeeCount',
  });

  // Get eligible employees (those due for payment)
  const { data: eligibleEmployees } = useReadContract({
    address: PAYROLL_CONTRACT_ADDRESS,
    abi: PAYROLL_ABI,
    functionName: 'getEligibleEmployees',
  });

  // Get contract ETH balance
  const { data: contractETHBalance } = useReadContract({
    address: PAYROLL_CONTRACT_ADDRESS,
    abi: PAYROLL_ABI,
    functionName: 'getContractETHBalance',
  });

  // Get employee details - now returns a hook instead of calling hook inside function
  const useEmployee = (employeeAddress?: string) => {
    return useReadContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'getEmployee',
      args: employeeAddress ? [employeeAddress as `0x${string}`] : undefined,
      query: {
        enabled: !!employeeAddress,
      },
    });
  };

  // Check if payment is due for an employee
  const useIsPaymentDue = (employeeAddress?: string) => {
    return useReadContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'isPaymentDue',
      args: employeeAddress ? [employeeAddress as `0x${string}`] : undefined,
      query: {
        enabled: !!employeeAddress,
      },
    });
  };

  // Get next payment date for an employee
  const useNextPaymentDate = (employeeAddress?: string) => {
    return useReadContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'getNextPaymentDate',
      args: employeeAddress ? [employeeAddress as `0x${string}`] : undefined,
      query: {
        enabled: !!employeeAddress,
      },
    });
  };

  // Get token balance of contract
  const useContractTokenBalance = (tokenAddress?: string) => {
    return useReadContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'getContractTokenBalance',
      args: tokenAddress ? [tokenAddress as `0x${string}`] : undefined,
      query: {
        enabled: !!tokenAddress && tokenAddress !== ZERO_ADDRESS,
      },
    });
  };

  // ============ WRITE FUNCTIONS ============

  // Add employee
  const addEmployee = (
    employeeAddress: string,
    paymentAmount: string,
    tokenAddress: string,
    intervalDays: number
  ) => {
    writeContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'addEmployee',
      args: [
        employeeAddress as `0x${string}`,
        parseEther(paymentAmount),
        (tokenAddress || ZERO_ADDRESS) as `0x${string}`,
        BigInt(intervalDays),
      ],
    });
  };

  // Remove employee
  const removeEmployee = (employeeAddress: string) => {
    writeContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'removeEmployee',
      args: [employeeAddress as `0x${string}`],
    });
  };

  // Update employee
  const updateEmployee = (
    employeeAddress: string,
    paymentAmount: string,
    intervalDays: number
  ) => {
    writeContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'updateEmployee',
      args: [
        employeeAddress as `0x${string}`,
        parseEther(paymentAmount),
        BigInt(intervalDays),
      ],
    });
  };

  // Execute payment for single employee
  const executePayment = (employeeAddress: string) => {
    writeContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'executePayment',
      args: [employeeAddress as `0x${string}`],
    });
  };

  // Execute all payments
  const executeAllPayments = () => {
    writeContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'executeAllPayments',
    });
  };

  // Execute batch payments
  const executeBatchPayments = (employeeAddresses: string[]) => {
    writeContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'executeBatchPayments',
      args: [employeeAddresses as `0x${string}`[]],
    });
  };

  // Pause employee
  const pauseEmployee = (employeeAddress: string) => {
    writeContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'pauseEmployee',
      args: [employeeAddress as `0x${string}`],
    });
  };

  // Resume employee
  const resumeEmployee = (employeeAddress: string) => {
    writeContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'resumeEmployee',
      args: [employeeAddress as `0x${string}`],
    });
  };

  // Pause all payments
  const pauseAllPayments = () => {
    writeContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'pauseAllPayments',
    });
  };

  // Resume all payments
  const resumeAllPayments = () => {
    writeContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'resumeAllPayments',
    });
  };

  // Deposit ETH
  const depositETH = (amount: string) => {
    writeContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'depositETH',
      value: parseEther(amount),
    });
  };

  // Deposit tokens
  const depositTokens = (tokenAddress: string, amount: string) => {
    writeContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'depositTokens',
      args: [tokenAddress as `0x${string}`, parseEther(amount)],
    });
  };

  // Withdraw ETH
  const withdrawETH = (amount: string) => {
    writeContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'withdrawETH',
      args: [parseEther(amount)],
    });
  };

  // Withdraw tokens
  const withdrawTokens = (tokenAddress: string, amount: string) => {
    writeContract({
      address: PAYROLL_CONTRACT_ADDRESS,
      abi: PAYROLL_ABI,
      functionName: 'withdrawTokens',
      args: [tokenAddress as `0x${string}`, parseEther(amount)],
    });
  };

  // ============ HELPER FUNCTIONS ============

  const isOwner = contractOwner?.toLowerCase() === address?.toLowerCase();

  const formatPaymentAmount = (amount: bigint) => {
    return formatEther(amount);
  };

  const getPaymentStatus = (employee: Employee | undefined) => {
    if (!employee) return 'N/A';
    if (!employee.exists) return 'Not Found';
    if (!employee.isActive) return 'Paused';
    return 'Active';
  };

  const calculateNextPayment = (employee: Employee | undefined) => {
    if (!employee || !employee.exists) return null;
    const nextPaymentTimestamp = employee.lastPaymentTimestamp + (employee.paymentIntervalDays * 86400);
    return new Date(nextPaymentTimestamp * 1000);
  };

  const getDaysUntilNextPayment = (employee: Employee | undefined) => {
    const nextPayment = calculateNextPayment(employee);
    if (!nextPayment) return null;

    const now = new Date();
    const diffTime = nextPayment.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return {
    // Read data
    contractOwner,
    paused,
    allEmployees,
    employeeCount,
    eligibleEmployees,
    contractETHBalance,

    // Read hooks
    useEmployee,
    useIsPaymentDue,
    useNextPaymentDate,
    useContractTokenBalance,

    // Write functions (Owner only)
    addEmployee,
    removeEmployee,
    updateEmployee,
    pauseEmployee,
    resumeEmployee,
    pauseAllPayments,
    resumeAllPayments,
    depositETH,
    depositTokens,
    withdrawETH,
    withdrawTokens,

    // Payment execution (Anyone can trigger)
    executePayment,
    executeAllPayments,
    executeBatchPayments,

    // Refetch functions
    refetchEmployees,

    // Transaction state
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,

    // Helpers
    isOwner,
    formatPaymentAmount,
    getPaymentStatus,
    calculateNextPayment,
    getDaysUntilNextPayment,
  };
}
