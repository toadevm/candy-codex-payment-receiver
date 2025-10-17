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
  title: "Candy Codex Payment Receiver - Multichain Payment Solution",
  description: "Send and receive ETH payments across multiple blockchains with our secure, transparent payment receiver smart contract. Supporting 15+ chains including Ethereum, zkSync, Optimism, Arbitrum, and more.",
  keywords: ["Payment Receiver", "Multichain", "Blockchain", "Ethereum", "Smart Contracts", "Crypto Payments", "Web3", "DeFi", "zkSync", "Optimism", "Arbitrum"],
  openGraph: {
    title: "Candy Codex Payment Receiver - Multichain Payment Solution",
    description: "Send and receive ETH payments across multiple blockchains with our secure, transparent payment receiver smart contract.",
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
