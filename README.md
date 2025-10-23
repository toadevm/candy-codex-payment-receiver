# Multi-Chain Payment Receiver DApp

A modern, multi-chain payment receiver application built with Next.js, wagmi, and Reown (WalletConnect). Monitor and manage payments across 14+ blockchain networks from a single interface.

## Features

- **Multi-Chain Support**: Monitor balances across 14+ networks simultaneously
- **Real-time Updates**: Live balance tracking and payment history
- **Network Management**: Add new blockchain networks through an admin interface
- **Wallet Integration**: Seamless wallet connection with Reown AppKit
- **Modern UI/UX**: Beautiful, responsive design with purple/pink gradient theme
- **Type Safe**: Built with TypeScript for better development experience
- **Mobile Friendly**: Fully responsive design for all devices

## Supported Networks

- Ethereum
- zkSync Era
- Optimism
- Arbitrum One
- Base
- BNB Chain
- Cronos
- Abstract
- Moonbeam
- Sei
- ApeChain
- Ronin
- Bera Chain
- And more...

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- A Reown Project ID (get one at [Reown Cloud](https://cloud.reown.com))

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**

   Create `.env.local` with your Reown Project ID:
   ```env
   NEXT_PUBLIC_PROJECT_ID=your_reown_project_id
   ```

3. **Get a Reown Project ID**
   - Go to [Reown Cloud](https://cloud.reown.com)
   - Create a new project
   - Copy your Project ID to `.env.local`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx         # Home page with balance panel
│   ├── admin/           # Admin panel for network management
│   └── api/             # API routes for network configuration
├── components/           # Reusable UI components
│   ├── Header.tsx       # Site header with wallet connection
│   ├── TabNavigation.tsx # Tab navigation between pages
│   ├── MultiChainBalancePanel.tsx # Multi-chain balance display
│   ├── PaymentHistoryPanel.tsx # Payment transaction history
│   ├── PaymentPanel.tsx # Payment withdrawal controls
│   └── NetworkManager.tsx # Admin interface for adding networks
├── contexts/            # React contexts
│   └── Web3Modal.tsx    # Web3Modal provider setup
├── contracts/           # Contract ABIs and configurations
│   └── paymentReceiver.ts # Contract ABI and addresses
├── hooks/               # Custom React hooks
│   └── usePaymentReceiver.ts # Contract interaction hook
└── config/              # Configuration files
    ├── wagmi.ts         # Wagmi configuration
    ├── networkIcons.ts  # Network icon mappings
    └── nativeTokens.ts  # Native token symbols
```

## Contract Integration

The app integrates with the Payment Receiver contract deployed across multiple chains:

- **Receive Payments**: Accept native token payments on any supported network
- **Balance Tracking**: Real-time balance monitoring across all chains
- **Payment History**: View recent payment transactions
- **Withdraw Funds**: Owner-only function to withdraw collected payments

## Admin Panel

Access the admin panel at `/admin` to add new blockchain networks:

1. Enter chain ID and network details
2. Upload network icon (PNG, JPG, SVG, or WebP)
3. Provide contract address and RPC URL
4. Submit to update configuration files
5. Rebuild and redeploy the app

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set `NEXT_PUBLIC_PROJECT_ID` environment variable
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Digital Ocean App Platform
- AWS Amplify

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Customization

### Adding New Networks
Use the admin panel at `/admin` or manually update:
- `src/contracts/paymentReceiver.ts` - Contract addresses
- `src/config/nativeTokens.ts` - Native token symbols
- `src/config/networkIcons.ts` - Network icon paths
- `src/config/wagmi.ts` - Wagmi chain configurations
- `src/contexts/Web3Modal.tsx` - Reown modal networks

### Styling
- The app uses Tailwind CSS with a purple/pink gradient theme
- Modify component styles in individual component files
- Update global styles in `src/app/globals.css`

## Mobile Support

The app is fully responsive and supports:
- iOS Safari
- Chrome Mobile
- Mobile wallet apps (MetaMask, Rainbow, Coinbase Wallet, etc.)

## Security Considerations

- All sensitive data is kept in environment variables
- Contract interactions are validated client-side
- Users approve all transactions through their wallet
- No private keys are stored or transmitted
- Admin functions are restricted to contract owner

## License

This project is open source and available under the MIT License.

---

Built with by Candy Codex
