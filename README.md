# 🍭 Lollypop NFT DApp

A modern, responsive NFT minting application built with Next.js, wagmi, and Reown (WalletConnect) for the Lollypop NFT collection.

## ✨ Features

- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **Wallet Integration**: Seamless wallet connection with Reown AppKit
- **Real-time Updates**: Live contract data and transaction status
- **Mobile Friendly**: Fully responsive design for all devices
- **Type Safe**: Built with TypeScript for better development experience
- **Optimized**: Fast performance with Next.js App Router

## 🚀 Getting Started

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
   
   Update `.env.local` with your values:
   ```env
   NEXT_PUBLIC_PROJECT_ID=your_reown_project_id
   NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
   NEXT_PUBLIC_CHAIN_ID=1
   ```

3. **Get a Reown Project ID**
   - Go to [Reown Cloud](https://cloud.reown.com)
   - Create a new project
   - Copy your Project ID to `NEXT_PUBLIC_PROJECT_ID`

4. **Deploy your contract**
   - Deploy the Lollypop contract to Ethereum
   - Update `NEXT_PUBLIC_CONTRACT_ADDRESS` with your deployed contract address

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
├── components/           # Reusable UI components
│   ├── Header.tsx       # Site header with wallet connection
│   ├── Hero.tsx         # Landing page hero section
│   ├── MintSection.tsx  # Main minting interface
│   ├── WalletConnection.tsx # Wallet connection component
│   └── Footer.tsx       # Site footer
├── contexts/            # React contexts
│   └── Web3Modal.tsx    # Web3Modal provider setup
├── contracts/           # Contract ABIs and configurations
│   └── lollypop.ts      # Contract ABI and constants
├── hooks/               # Custom React hooks
│   └── useLollypopContract.ts # Contract interaction hook
└── config/              # Configuration files
    └── wagmi.ts         # Wagmi configuration
```

## 🔧 Contract Integration

The app integrates with the Lollypop NFT contract which includes:

- **Mint Function**: Public minting with ETH payment
- **Supply Tracking**: Real-time total supply and remaining NFTs
- **Price Information**: Current mint price and transaction fees
- **Admin Functions**: Owner-only functions for contract management

### Contract Constants

- **Max Supply**: 550 NFTs
- **Mint Price**: 1.015 ETH
- **Transaction Fee**: 0.0014 ETH
- **Max per TX**: 1 NFT

## 🎨 Customization

### Styling
- The app uses Tailwind CSS for styling
- Modify colors and components in the component files
- Update the color scheme in `tailwind.config.js`

### Contract Configuration
- Update contract address in `.env.local`
- Modify contract ABI in `src/contracts/lollypop.ts`
- Adjust contract constants as needed

### Wallet Configuration
- Add/remove supported networks in `src/contexts/Web3Modal.tsx`
- Configure wallet options in the same file

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Digital Ocean App Platform
- AWS Amplify

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📱 Mobile Support

The app is fully responsive and supports:
- iOS Safari
- Chrome Mobile
- Mobile wallet apps (MetaMask, Rainbow, etc.)

## 🔒 Security Considerations

- All sensitive data is kept in environment variables
- Contract interactions are validated client-side
- Users approve all transactions through their wallet
- No private keys are stored or transmitted

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ for the NFT community
