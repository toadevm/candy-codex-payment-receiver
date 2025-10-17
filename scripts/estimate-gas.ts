import hre from "hardhat";
import { ethers } from "ethers";

async function main() {
  console.log("Estimating Lollypop deployment costs on Ethereum Mainnet...");

  try {
    // Get the contract artifact
    const contractArtifact = await hre.artifacts.readArtifact("contracts/Lollypop.sol:Lollypop");
    
    // Create provider using the network URL
    const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/VmvZCtX4lWs4C7E8_FaPDKgMxiqqzXoN");

    // Get current gas price and fee data from mainnet
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");
    const maxFeePerGas = feeData.maxFeePerGas || gasPrice;
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || ethers.parseUnits("2", "gwei");

    // Calculate bytecode size and estimate gas
    const bytecodeSize = Math.ceil(contractArtifact.bytecode.length / 2);
    
    // Base deployment cost calculation:
    // 21,000 base transaction cost + 32,000 for contract creation + bytecode cost
    const baseGas = BigInt(21000);
    const createGas = BigInt(32000);
    const bytecodeGas = BigInt(bytecodeSize) * BigInt(16); // ~16 gas per byte for non-zero data
    
    // Additional gas for constructor execution (estimated based on contract complexity)
    // The Lollypop contract has a simple constructor, so estimate ~50,000 gas
    const constructorGas = BigInt(50000);
    
    // Total estimated gas
    const estimatedGas = baseGas + createGas + bytecodeGas + constructorGas;
    
    // Add 20% buffer for safety
    const gasWithBuffer = estimatedGas + (estimatedGas * BigInt(20) / BigInt(100));
    
    // Calculate deployment costs (both legacy and EIP-1559)
    const legacyCost = gasPrice * gasWithBuffer;
    const eip1559Cost = maxFeePerGas * gasWithBuffer;
    
    console.log("\n📊 Deployment Cost Estimation (with 20% safety buffer):");
    console.log("========================================================");
    console.log(`Network: Ethereum Mainnet`);
    console.log(`Contract: Lollypop NFT`);
    console.log(`Contract bytecode size: ${bytecodeSize.toLocaleString()} bytes`);
    console.log(`Base gas: ${baseGas.toString()}`);
    console.log(`Contract creation gas: ${createGas.toString()}`);
    console.log(`Bytecode deployment gas: ${bytecodeGas.toString()}`);
    console.log(`Constructor execution gas: ${constructorGas.toString()}`);
    console.log(`Total estimated gas: ${estimatedGas.toString()}`);
    console.log(`Gas with 20% buffer: ${gasWithBuffer.toString()}`);
    console.log("");
    
    console.log("💰 Current Gas Prices (Live from Mainnet):");
    console.log(`Legacy gas price: ${ethers.formatUnits(gasPrice, "gwei")} gwei`);
    console.log(`EIP-1559 max fee: ${ethers.formatUnits(maxFeePerGas, "gwei")} gwei`);
    console.log(`EIP-1559 priority fee: ${ethers.formatUnits(maxPriorityFeePerGas, "gwei")} gwei`);
    console.log("");
    
    console.log("💸 Estimated Deployment Costs:");
    console.log(`Legacy transaction: ${ethers.formatEther(legacyCost)} ETH`);
    console.log(`EIP-1559 transaction: ${ethers.formatEther(eip1559Cost)} ETH`);
    console.log("");
    
    // USD estimations
    const ethPriceUSD = 3500;
    console.log("💵 USD Estimates (ETH ≈ $3,500):");
    console.log(`Legacy transaction: $${(parseFloat(ethers.formatEther(legacyCost)) * ethPriceUSD).toFixed(2)}`);
    console.log(`EIP-1559 transaction: $${(parseFloat(ethers.formatEther(eip1559Cost)) * ethPriceUSD).toFixed(2)}`);
    console.log("");
    
    // Gas price scenarios
    console.log("📊 Cost at Different Gas Prices:");
    const scenarios = [
      { name: "Low (10 gwei)", price: BigInt(10) },
      { name: "Medium (30 gwei)", price: BigInt(30) },
      { name: "High (50 gwei)", price: BigInt(50) },
      { name: "Peak (100 gwei)", price: BigInt(100) }
    ];
    
    scenarios.forEach(scenario => {
      const scenarioPrice = ethers.parseUnits(scenario.price.toString(), "gwei");
      const scenarioCost = scenarioPrice * gasWithBuffer;
      const scenarioUSD = parseFloat(ethers.formatEther(scenarioCost)) * ethPriceUSD;
      console.log(`${scenario.name}: ${ethers.formatEther(scenarioCost)} ETH ($${scenarioUSD.toFixed(2)})`);
    });
    
    console.log("");
    console.log("📝 Important Notes:");
    console.log("• This is a rough estimate based on bytecode analysis");
    console.log("• Actual gas usage may vary depending on network conditions");
    console.log("• The estimate includes a 20% safety buffer");
    console.log("• Deploy during off-peak hours for lower costs");
    console.log("• Consider testing on testnets first");
    console.log("");
    
    console.log("⚠️  Deployment Considerations:");
    console.log("• The contract is quite large due to complex features");
    console.log("• It includes referral system, token blocking, marketplace controls");
    console.log("• Uses OpenZeppelin contracts (ERC721, Ownable, ReentrancyGuard, Pausable)");
    console.log("• Make sure you have sufficient ETH in your deployer account");
    console.log("");
    
    console.log("🔧 To Deploy:");
    console.log("1. Set MAINNET_PRIVATE_KEY environment variable");
    console.log("2. Ensure your account has enough ETH");
    console.log("3. Use the deployment script: scripts/deploy-lollypop.ts");
    console.log("4. Command: npx hardhat run scripts/deploy-lollypop.ts --network mainnet");

  } catch (error) {
    console.error("❌ Error during estimation:", error);
    throw error;
  }
}

main()
  .then(() => {
    console.log("\n✅ Gas estimation completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Estimation failed:", error);
    process.exit(1);
  });