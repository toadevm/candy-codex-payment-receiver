import type { Metadata } from "next";
import { Inter, DynaPuff, Chewy } from "next/font/google";
import "./globals.css";
import { Web3ModalProvider } from '@/contexts/Web3Modal'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ["latin"],
});

const chewy = Chewy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-chewy",
});

const dynaPuff = DynaPuff({
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-dynapuff",
});

export const metadata: Metadata = {
  title: "Automated Payroll System - Blockchain Salary Management",
  description: "Manage automated employee payroll on the blockchain with secure, transparent, and timely salary payments using smart contracts.",
  keywords: ["Payroll", "Blockchain", "Ethereum", "Smart Contracts", "Automated Payments", "Salary Management", "Web3"],
  openGraph: {
    title: "Automated Payroll System - Blockchain Salary Management",
    description: "Manage automated employee payroll on the blockchain with secure, transparent, and timely salary payments using smart contracts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${chewy.variable} ${dynaPuff.variable} antialiased`}>
        <Web3ModalProvider>
          {children}
          <Toaster position="top-right" richColors />
        </Web3ModalProvider>
      </body>
    </html>
  );
}
