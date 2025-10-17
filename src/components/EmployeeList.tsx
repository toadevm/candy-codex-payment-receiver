"use client";

import { usePayrollContract } from "@/hooks/usePayrollContract";
import { formatEther } from "viem";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pause, Play, Edit, Trash2, DollarSign } from "lucide-react";

interface EmployeeListProps {
  onEdit?: (address: string) => void;
  onRemove?: (address: string) => void;
  onPause?: (address: string) => void;
  onResume?: (address: string) => void;
  onExecutePayment?: (address: string) => void;
  showActions?: boolean;
}

interface EmployeeRowProps {
  employeeAddr: string;
  onEdit?: (address: string) => void;
  onRemove?: (address: string) => void;
  onPause?: (address: string) => void;
  onResume?: (address: string) => void;
  onExecutePayment?: (address: string) => void;
  showActions: boolean;
  isOwner: boolean;
}

function EmployeeRow({
  employeeAddr,
  onEdit,
  onRemove,
  onPause,
  onResume,
  onExecutePayment,
  showActions,
  isOwner,
}: EmployeeRowProps) {
  const { useEmployee, useIsPaymentDue } = usePayrollContract();
  const { data: employee } = useEmployee(employeeAddr);
  const { data: isPaymentDue } = useIsPaymentDue(employeeAddr);

  if (!employee || !employee.exists) return null;

  return (
    <TableRow>
      <TableCell className="font-mono text-sm">
        {employeeAddr.slice(0, 6)}...{employeeAddr.slice(-4)}
      </TableCell>
      <TableCell>
        {formatEther(employee.paymentAmount)} ETH
      </TableCell>
      <TableCell>{Number(employee.paymentIntervalDays)} days</TableCell>
      <TableCell>
        {employee.isActive ? (
          <Badge variant="default">Active</Badge>
        ) : (
          <Badge variant="secondary">Paused</Badge>
        )}
      </TableCell>
      <TableCell>
        {isPaymentDue ? (
          <Badge variant="destructive">Due Now</Badge>
        ) : (
          <Badge variant="outline">Scheduled</Badge>
        )}
      </TableCell>
      {showActions && (
        <TableCell className="text-right">
          <div className="flex gap-1 justify-end">
            {isPaymentDue && employee.isActive && onExecutePayment && (
              <Button
                size="sm"
                variant="default"
                onClick={() => onExecutePayment(employeeAddr)}
              >
                <DollarSign className="h-4 w-4 mr-1" />
                Pay
              </Button>
            )}
            {isOwner && (
              <>
                {employee.isActive && onPause ? (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onPause(employeeAddr)}
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                ) : onResume ? (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onResume(employeeAddr)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                ) : null}
                {onEdit && (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onEdit(employeeAddr)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {onRemove && (
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => onRemove(employeeAddr)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

export function EmployeeList({
  onEdit,
  onRemove,
  onPause,
  onResume,
  onExecutePayment,
  showActions = true,
}: EmployeeListProps) {
  const { allEmployees, isOwner } = usePayrollContract();

  if (!allEmployees || allEmployees.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>No employees found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Add your first employee to get started with automated payroll
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employees</CardTitle>
        <CardDescription>
          {allEmployees.length} employee{allEmployees.length !== 1 ? "s" : ""} registered
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Payment Amount</TableHead>
                <TableHead>Interval (Days)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Due</TableHead>
                {showActions && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {allEmployees.map((employeeAddr: string) => (
                <EmployeeRow
                  key={employeeAddr}
                  employeeAddr={employeeAddr}
                  onEdit={onEdit}
                  onRemove={onRemove}
                  onPause={onPause}
                  onResume={onResume}
                  onExecutePayment={onExecutePayment}
                  showActions={showActions}
                  isOwner={isOwner}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
