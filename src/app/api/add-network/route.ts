import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface NetworkConfig {
  chainId: number;
  name: string;
  nativeTokenSymbol: string;
  contractAddress: string;
  rpcUrl: string;
  explorerUrl: string;
  iconUrl: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: NetworkConfig = await request.json();

    // Validate required fields
    const { chainId, name, nativeTokenSymbol, contractAddress, rpcUrl, explorerUrl, iconUrl } = body;

    if (!chainId || !name || !nativeTokenSymbol || !contractAddress || !rpcUrl || !explorerUrl || !iconUrl) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate chain ID is a number
    if (typeof chainId !== "number" || chainId <= 0) {
      return NextResponse.json(
        { error: "Chain ID must be a positive number" },
        { status: 400 }
      );
    }

    // Validate contract address format
    if (!contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: "Invalid contract address format" },
        { status: 400 }
      );
    }

    const projectRoot = process.cwd();

    // Update paymentReceiver.ts
    await updatePaymentReceiverConfig(projectRoot, body);

    // Update nativeTokens.ts
    await updateNativeTokensConfig(projectRoot, body);

    // Update networkIcons.ts
    await updateNetworkIconsConfig(projectRoot, body);

    // Update wagmi.ts
    await updateWagmiConfig(projectRoot, body);

    // Update Web3Modal.tsx
    await updateWeb3ModalConfig(projectRoot, body);

    return NextResponse.json({
      success: true,
      message: `Network ${name} (Chain ID: ${chainId}) added successfully`,
    });
  } catch (error) {
    console.error("Error adding network:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add network" },
      { status: 500 }
    );
  }
}

async function updatePaymentReceiverConfig(projectRoot: string, config: NetworkConfig) {
  const filePath = path.join(projectRoot, "src/contracts/paymentReceiver.ts");
  let content = await fs.readFile(filePath, "utf-8");

  // Add to PAYMENT_RECEIVER_ADDRESSES
  const addressesRegex = /(export const PAYMENT_RECEIVER_ADDRESSES = \{[^}]+)/;
  const addressMatch = content.match(addressesRegex);
  if (addressMatch) {
    const newAddress = `  ${config.chainId}: "${config.contractAddress}" as \`0x\${string}\`, // ${config.name}\n`;
    content = content.replace(
      /(\} as const;\s*\/\/ Network names mapping)/,
      `${newAddress}} as const;\n\n// Network names mapping`
    );
  }

  // Add to NETWORK_NAMES
  const namesRegex = /(export const NETWORK_NAMES = \{[^}]+)/;
  const nameMatch = content.match(namesRegex);
  if (nameMatch) {
    const newName = `  ${config.chainId}: "${config.name}",\n`;
    content = content.replace(
      /(\} as const;\s*export type SupportedChainId)/,
      `${newName}} as const;\n\nexport type SupportedChainId`
    );
  }

  await fs.writeFile(filePath, content, "utf-8");
}

async function updateNativeTokensConfig(projectRoot: string, config: NetworkConfig) {
  const filePath = path.join(projectRoot, "src/config/nativeTokens.ts");
  let content = await fs.readFile(filePath, "utf-8");

  const newToken = `  ${config.chainId}: "${config.nativeTokenSymbol}",       // ${config.name}\n`;
  content = content.replace(
    /(\} as const;)/,
    `${newToken}} as const;`
  );

  await fs.writeFile(filePath, content, "utf-8");
}

async function updateNetworkIconsConfig(projectRoot: string, config: NetworkConfig) {
  const filePath = path.join(projectRoot, "src/config/networkIcons.ts");
  let content = await fs.readFile(filePath, "utf-8");

  const newIcon = `  ${config.chainId}: "${config.iconUrl}",    // ${config.name}\n`;
  content = content.replace(
    /(\} as const;)/,
    `${newIcon}} as const;`
  );

  await fs.writeFile(filePath, content, "utf-8");
}

async function updateWagmiConfig(projectRoot: string, config: NetworkConfig) {
  const filePath = path.join(projectRoot, "src/config/wagmi.ts");
  let content = await fs.readFile(filePath, "utf-8");

  // Generate safe variable name (remove spaces, special chars)
  const varName = config.name.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Add chain definition
  const chainDef = `
const ${varName} = defineChain({
  id: ${config.chainId},
  name: '${config.name}',
  nativeCurrency: { name: '${config.nativeTokenSymbol}', symbol: '${config.nativeTokenSymbol}', decimals: 18 },
  rpcUrls: {
    default: { http: ['${config.rpcUrl}'] },
  },
  blockExplorers: {
    default: { name: '${config.name} Explorer', url: '${config.explorerUrl}' },
  },
})
`;

  // Insert before export const config
  content = content.replace(
    /(export const config = createConfig)/,
    `${chainDef}\n$1`
  );

  // Add to chains array
  content = content.replace(
    /(chains: \[[^\]]+)/,
    `$1,\n    ${varName}`
  );

  // Add to transports
  content = content.replace(
    /(transports: \{[^}]+)\s*\}/,
    `$1    [${varName}.id]: http(),\n  }`
  );

  await fs.writeFile(filePath, content, "utf-8");
}

async function updateWeb3ModalConfig(projectRoot: string, config: NetworkConfig) {
  const filePath = path.join(projectRoot, "src/contexts/Web3Modal.tsx");
  let content = await fs.readFile(filePath, "utf-8");

  // Generate safe variable name
  const varName = config.name.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Add chain definition
  const chainDef = `
const ${varName} = {
  id: ${config.chainId},
  name: '${config.name}',
  nativeCurrency: { name: '${config.nativeTokenSymbol}', symbol: '${config.nativeTokenSymbol}', decimals: 18 },
  rpcUrls: {
    default: { http: ['${config.rpcUrl}'] },
  },
  blockExplorers: {
    default: { name: '${config.name} Explorer', url: '${config.explorerUrl}' },
  },
} as const;
`;

  // Insert before the networks array comment
  content = content.replace(
    /(\/\/ 3\. Set the networks)/,
    `${chainDef}\n$1`
  );

  // Add to networks array
  content = content.replace(
    /(const networks = \[[^\]]+)/,
    `$1,\n  ${varName}`
  );

  // Update chain count in comment
  const currentCount = (content.match(/ALL (\d+) chains/)?.[1] || "0");
  const newCount = parseInt(currentCount) + 1;
  content = content.replace(
    /ALL \d+ chains/,
    `ALL ${newCount} chains`
  );

  await fs.writeFile(filePath, content, "utf-8");
}
