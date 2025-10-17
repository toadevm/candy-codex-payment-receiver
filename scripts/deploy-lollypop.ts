import hre from "hardhat";
import { ethers } from "ethers";

async function main() {
  console.log("Estimating Lollypop deployment costs on Ethereum Mainnet...");

  try {
    // Get the contract artifact
    const contractArtifact = await hre.artifacts.readArtifact("contracts/Lollypop.sol:Lollypop");
    
    // Create provider using the network URL
    const networkConfig = hre.config.networks.mainnet;
    if (networkConfig.type !== "http") {
      throw new Error("Mainnet network is not configured as HTTP");
    }
    
    const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/VmvZCtX4lWs4C7E8_FaPDKgMxiqqzXoN");
    
    // Create a dummy wallet for estimation (this won't be used for actual deployment)
    const dummyPrivateKey = "0x0000000000000000000000000000000000000000000000000000000000000001";
    const wallet = new ethers.Wallet(dummyPrivateKey, provider);
    
    console.log(`Estimating for address: ${wallet.address}`);

    // Create ContractFactory
    const contractFactory = new ethers.ContractFactory(
      contractArtifact.abi,
      contractArtifact.bytecode,
      wallet
    );

    // Get current gas price and fee data from mainnet
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");
    const maxFeePerGas = feeData.maxFeePerGas || gasPrice;
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || ethers.parseUnits("2", "gwei");

    // Create deployment transaction
    const deployTx = await contractFactory.getDeployTransaction();
    
    // Estimate gas for deployment
    const estimatedGas = await provider.estimateGas(deployTx);
    
    // Calculate deployment costs (both legacy and EIP-1559)
    const legacyCost = gasPrice * estimatedGas;
    const eip1559Cost = maxFeePerGas * estimatedGas;
    
    console.log("\n📊 Deployment Cost Estimation:");
    console.log("================================");
    console.log(`Network: Ethereum Mainnet`);
    console.log(`Contract: Lollypop NFT`);
    console.log(`Contract size: ${Math.ceil(contractArtifact.bytecode.length / 2)} bytes`);
    console.log(`Estimated gas: ${estimatedGas.toString()} gas units`);
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
    
    // USD estimations (using approximate ETH price)
    const ethPriceUSD = 3500; // Approximate ETH price
    console.log("💵 USD Estimates (ETH ≈ $3,500):");
    console.log(`Legacy transaction: $${(parseFloat(ethers.formatEther(legacyCost)) * ethPriceUSD).toFixed(2)}`);
    console.log(`EIP-1559 transaction: $${(parseFloat(ethers.formatEther(eip1559Cost)) * ethPriceUSD).toFixed(2)}`);
    console.log("");
    
    // Show current ETH price in other common amounts for reference
    console.log("📈 Cost in other amounts:");
    console.log(`0.1 ETH = $${(0.1 * ethPriceUSD).toFixed(2)}`);
    console.log(`0.05 ETH = $${(0.05 * ethPriceUSD).toFixed(2)}`);
    console.log(`0.01 ETH = $${(0.01 * ethPriceUSD).toFixed(2)}`);
    console.log("");
    
    console.log("📝 Important Notes:");
    console.log("• This estimate uses LIVE mainnet gas prices");
    console.log("• Actual costs may vary based on network congestion");
    console.log("• Consider deploying during off-peak hours (UTC late night/early morning)");
    console.log("• The Lollypop contract includes complex features (referrals, blocking, etc.)");
    console.log("• Gas prices can fluctuate significantly throughout the day");
    console.log("");
    
    console.log("🔧 To Deploy:");
    console.log("1. Set MAINNET_PRIVATE_KEY in your environment with your actual private key");
    console.log("2. Ensure your account has sufficient ETH for deployment");
    console.log("3. Uncomment the deployment code below in the script");
    console.log("4. Run: npx hardhat run scripts/deploy-lollypop.ts --network mainnet");
    console.log("");
    
    console.log("⚠️  SECURITY WARNINGS:");
    console.log("• Never share your private key");
    console.log("• Use environment variables for private keys");
    console.log("• Double-check the contract before deployment");
    console.log("• Consider deploying to testnet first");
    
    // Uncomment the following lines to actually deploy
    /*
    console.log("\n🚀 Proceeding with actual deployment...");
    
    // Use the real private key from environment
    const realPrivateKey = process.env.MAINNET_PRIVATE_KEY;
    if (!realPrivateKey) {
      throw new Error("MAINNET_PRIVATE_KEY environment variable not set");
    }
    
    const realWallet = new ethers.Wallet(realPrivateKey, provider);
    const realFactory = new ethers.ContractFactory(
      contractArtifact.abi,
      contractArtifact.bytecode,
      realWallet
    );
    
    const lollypop = await realFactory.deploy({
      gasLimit: estimatedGas,
      maxFeePerGas: maxFeePerGas,
      maxPriorityFeePerGas: maxPriorityFeePerGas
    });
    
    console.log("📡 Deployment transaction sent. Waiting for confirmation...");
    const receipt = await lollypop.deploymentTransaction()?.wait();
    const address = await lollypop.getAddress();
    console.log(`✅ Lollypop deployed to: ${address}`);
    console.log(`🔗 Etherscan: https://etherscan.io/address/${address}`);
    console.log(`📝 Transaction hash: ${receipt?.hash}`);
    console.log(`⛽ Gas used: ${receipt?.gasUsed.toString()}`);
    console.log(`💰 Actual cost: ${ethers.formatEther(receipt?.gasUsed * receipt?.gasPrice)} ETH`);
    */

  } catch (error) {
    console.error("❌ Error during deployment estimation:", error);
    throw error;
  }
}

main()
  .then(() => {
    console.log("\n✅ Fee estimation completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment estimation failed:", error);
    process.exit(1);
  });