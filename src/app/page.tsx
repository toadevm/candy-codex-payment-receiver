"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OwnerPanel } from "@/components/OwnerPanel";
import { EmployeePanel } from "@/components/EmployeePanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePayrollContract } from "@/hooks/usePayrollContract";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccount } from "wagmi";

export default function Home() {
  const { isOwner } = usePayrollContract();
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        {!isConnected ? (
          <Card className="max-w-2xl mx-auto mt-12">
            <CardHeader>
              <CardTitle>Welcome to Automated Payroll System</CardTitle>
              <CardDescription>
                Connect your wallet to access your payroll dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This decentralized application allows employers to manage automated
                salary payments for their employees using blockchain technology.
                Employees can view their payment schedules and claim their salaries
                when due.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue={isOwner ? "owner" : "employee"} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="owner">Owner Dashboard</TabsTrigger>
              <TabsTrigger value="employee">Employee Dashboard</TabsTrigger>
            </TabsList>

            <TabsContent value="owner" className="space-y-4">
              {isOwner ? (
                <OwnerPanel />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Owner Access Required</CardTitle>
                    <CardDescription>
                      You must be the contract owner to access this panel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Only the contract owner can manage employees and payroll settings.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="employee" className="space-y-4">
              <EmployeePanel />
            </TabsContent>
          </Tabs>
        )}
      </main>

      <Footer />
    </div>
  );
}
