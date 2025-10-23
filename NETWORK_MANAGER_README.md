# Network Manager

The Network Manager is an admin interface that allows you to add new blockchain networks to the payment receiver dApp through a user-friendly web interface.

## Features

- Add new networks without manually editing code files
- Automatically updates all necessary configuration files:
  - Contract addresses (`src/contracts/paymentReceiver.ts`)
  - Native token symbols (`src/config/nativeTokens.ts`)
  - Network icons (`src/config/networkIcons.ts`)
  - Wagmi configuration (`src/config/wagmi.ts`)
  - Web3Modal/Reown configuration (`src/contexts/Web3Modal.tsx`)

## Access

Navigate to `/admin` route in your deployed application.

### Security

By default, the admin page is open during development. To restrict access:

1. Open `src/app/admin/page.tsx`
2. Add admin wallet addresses to the `ADMIN_ADDRESSES` array:
   ```typescript
   const ADMIN_ADDRESSES = [
     "0x1234567890123456789012345678901234567890",
     "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
   ];
   ```
3. Update the `isAdmin` check to use the array:
   ```typescript
   const isAdmin = isConnected && address && ADMIN_ADDRESSES.includes(address.toLowerCase());
   ```

## How to Add a Network

1. Navigate to `/admin`
2. Connect your wallet (must be an admin address if configured)
3. Fill out the form with network details:
   - **Chain ID**: Numeric identifier (e.g., 25 for Cronos)
   - **Network Name**: Display name (e.g., "Cronos")
   - **Native Token Symbol**: Token symbol (e.g., "CRO")
   - **Contract Address**: Payment receiver contract address
   - **RPC URL**: Network RPC endpoint
   - **Block Explorer URL**: Block explorer base URL
   - **Icon Path**: Path to icon in public folder (e.g., `/icons/cro.png`)

4. Click "Add Network"

## Post-Addition Steps

After successfully adding a network, you must:

1. **Upload the network icon** to `public/icons/` directory
2. **Review the changes** in the updated configuration files
3. **Commit the changes** to your git repository
4. **Rebuild the application**: `npm run build`
5. **Deploy** the updated application

The configuration changes are written to the filesystem and require a rebuild to take effect.

## Example: Adding Cronos

```
Chain ID: 25
Network Name: Cronos
Native Token Symbol: CRO
Contract Address: 0x405792CbED87Fbb34afA505F768C8eDF8f9504E9
RPC URL: https://cronos-evm-rpc.publicnode.com
Block Explorer URL: https://explorer.cronos.org
Icon Path: /icons/cro.png
```

## Technical Details

The Network Manager works by:

1. Accepting network configuration through a web form
2. Validating all inputs (chain ID, addresses, URLs, etc.)
3. Calling the `/api/add-network` API endpoint
4. The API updates all configuration files using Node.js filesystem operations
5. Configuration changes persist to the source code files

## Files Modified

When you add a network, these files are automatically updated:

- `src/contracts/paymentReceiver.ts` - Contract addresses and network names
- `src/config/nativeTokens.ts` - Native token symbols
- `src/config/networkIcons.ts` - Network icon mappings
- `src/config/wagmi.ts` - Wagmi chain configurations
- `src/contexts/Web3Modal.tsx` - Reown/WalletConnect modal networks

## Troubleshooting

**Issue**: Network doesn't appear after adding
- **Solution**: Make sure you've rebuilt and redeployed the application

**Issue**: Icon doesn't display
- **Solution**: Verify the icon file exists at the specified path in `public/icons/`

**Issue**: Cannot access admin page
- **Solution**: Check that your wallet is connected and listed in ADMIN_ADDRESSES

**Issue**: API error when adding network
- **Solution**: Check the browser console and server logs for detailed error messages

## Development

The Network Manager consists of:

- **Component**: `src/components/NetworkManager.tsx` - The form interface
- **API Route**: `src/app/api/add-network/route.ts` - Backend logic
- **Admin Page**: `src/app/admin/page.tsx` - Admin dashboard

To modify validation rules or add new fields, edit the respective files.
