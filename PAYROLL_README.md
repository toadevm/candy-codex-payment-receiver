# Automated Payroll System

A decentralized payroll management system built on Ethereum using smart contracts. This application allows employers to manage automated salary payments for their employees with blockchain transparency and security.

## Features

### Owner Dashboard
- **Employee Management**: Add, remove, update, pause, and resume employees
- **Payment Execution**: Execute individual or batch payments for due employees
- **Fund Management**: Deposit and withdraw ETH from the payroll contract
- **System Controls**: Pause/resume all payments globally
- **Real-time Stats**: View contract balance, employee count, and pending payments

### Employee Dashboard
- **Salary Information**: View payment amount, interval, and schedule
- **Payment Status**: Check if payment is due and when the next payment is scheduled
- **Claim Payments**: Execute your own payment when due
- **Employment Details**: View all employment information including token type and payment history

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Web3**: Wagmi 2.x, Viem 2.x, Reown AppKit (WalletConnect)
- **Smart Contracts**: Solidity 0.8.20, Hardhat, OpenZeppelin
- **State Management**: React Query (TanStack Query)
- **Notifications**: Sonner

## Smart Contract

The `AutomatedPayroll.sol` contract includes:

- **Employee Management**: Add/remove/update employees with customizable payment schedules
- **Payment Execution**: Automated payment distribution to employees
- **Multi-token Support**: Pay in ETH or any ERC20 token
- **Security Features**: Reentrancy guard, pausable, ownership controls
- **Flexible Intervals**: Set payment intervals from 1 to 365 days

### Key Functions

**Owner Functions:**
- `addEmployee(address, amount, token, intervalDays)` - Register a new employee
- `removeEmployee(address)` - Remove an employee
- `updateEmployee(address, amount, intervalDays)` - Update employee details
- `pauseEmployee(address)` / `resumeEmployee(address)` - Pause/resume individual employee
- `pauseAllPayments()` / `resumeAllPayments()` - Global pause control
- `depositETH()` / `withdrawETH(amount)` - Manage contract funds

**Payment Execution (Anyone can call):**
- `executePayment(address)` - Execute payment for a single employee
- `executeAllPayments()` - Execute all due payments
- `executeBatchPayments(addresses[])` - Execute payments for specific employees

**View Functions:**
- `getEmployee(address)` - Get employee details
- `getAllEmployees()` - Get all registered employees
- `getEligibleEmployees()` - Get employees due for payment
- `isPaymentDue(address)` - Check if payment is due
- `getNextPaymentDate(address)` - Get next payment timestamp

## Setup Instructions

### 1. Clone and Install

\`\`\`bash
cd lollypop-nft-dapp-master
npm install
\`\`\`

### 2. Environment Configuration

Create a `.env.local` file:

\`\`\`bash
# Reown (WalletConnect) Project ID
# Get your project ID at https://cloud.reown.com/
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id

# Automated Payroll Contract Address
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
\`\`\`

### 3. Deploy Smart Contract

\`\`\`bash
# Compile contracts
npx hardhat compile

# Deploy to local network (for testing)
npx hardhat node
npx hardhat run scripts/deploy-payroll.ts --network localhost

# Deploy to testnet (Sepolia)
npx hardhat run scripts/deploy-payroll.ts --network sepolia

# Deploy to mainnet
npx hardhat run scripts/deploy-payroll.ts --network mainnet
\`\`\`

Update `.env.local` with the deployed contract address.

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

### 5. Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Usage Guide

### For Employers (Contract Owners)

1. **Connect Wallet**: Connect with the wallet that deployed the contract
2. **Fund Contract**: Deposit ETH to cover employee salaries
3. **Add Employees**:
   - Click "Add Employee"
   - Enter employee wallet address
   - Set payment amount (in ETH)
   - Set payment interval (days)
   - Optionally specify ERC20 token address
4. **Manage Payments**:
   - View employees due for payment
   - Execute individual or batch payments
   - Pause/resume employees as needed

### For Employees

1. **Connect Wallet**: Connect with your registered employee wallet
2. **View Dashboard**: Check salary amount, interval, and next payment date
3. **Claim Payment**: When payment is due, click "Claim Payment"

## Project Structure

\`\`\`
├── contracts/
│   └── AutomatedPayroll.sol          # Main payroll contract
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Main page with tabs
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── OwnerPanel.tsx            # Owner dashboard
│   │   ├── EmployeePanel.tsx         # Employee dashboard
│   │   ├── EmployeeList.tsx          # Employee table
│   │   ├── AddEmployeeDialog.tsx     # Add employee form
│   │   ├── Header.tsx                # App header
│   │   ├── Footer.tsx                # App footer
│   │   └── ui/                       # shadcn/ui components
│   ├── hooks/
│   │   └── usePayrollContract.ts     # Contract interaction hook
│   ├── contracts/
│   │   └── payroll.ts                # Contract ABI and config
│   └── contexts/
│       └── Web3Modal.tsx             # Web3 provider setup
├── .env.example                      # Environment template
└── hardhat.config.ts                 # Hardhat configuration
\`\`\`

## Security Considerations

- **Owner Control**: Only the contract owner can add/remove employees
- **Payment Execution**: Anyone can trigger payments (permissionless execution)
- **Reentrancy Protection**: Built-in reentrancy guards
- **Pausable**: Emergency pause functionality
- **Interval Limits**: Payment intervals restricted to 1-365 days

## Development

### Running Tests

\`\`\`bash
npx hardhat test
\`\`\`

### Linting

\`\`\`bash
npm run lint
\`\`\`

### Type Checking

\`\`\`bash
npx tsc --noEmit
\`\`\`

## Deployment Checklist

- [ ] Deploy AutomatedPayroll.sol contract
- [ ] Update NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local
- [ ] Set up Reown project and update NEXT_PUBLIC_PROJECT_ID
- [ ] Test all functionality on testnet
- [ ] Deposit initial funds into contract
- [ ] Add test employees
- [ ] Verify contract on Etherscan
- [ ] Deploy frontend to production

## Support

For issues or questions, please open an issue in the GitHub repository.

## License

MIT License - See LICENSE file for details
