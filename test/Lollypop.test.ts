import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Lollypop NFT Contract", function () {
  let lollypop: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let feeReceiver: any;
  let extraFeeReceiver: any;

  const MINT_PRICE = ethers.parseEther("1.015");
  const TX_FEE = ethers.parseEther("0.0014");
  const EXTRA_FEE_PERCENTAGE = 100n; // 1%
  const REFERRAL_FEE_PERCENTAGE = 11n; // 0.11%
  const MAX_SUPPLY = 550n;

  beforeEach(async function () {
    [owner, addr1, addr2, feeReceiver, extraFeeReceiver] = await ethers.getSigners();
    
    lollypop = await ethers.deployContract("contracts/Lollypop.sol:Lollypop");
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await lollypop.owner()).to.equal(owner.address);
    });

    it("Should have correct initial values", async function () {
      expect(await lollypop.name()).to.equal("lollypop");
      expect(await lollypop.symbol()).to.equal("lolly");
      expect(await lollypop.totalSupply()).to.equal(0);
      expect(await lollypop.maxSupply()).to.equal(MAX_SUPPLY);
      expect(await lollypop.maxMintAmountPerTx()).to.equal(1);
    });

    it("Should have correct constants", async function () {
      expect(await lollypop.INITIAL_MAX_SUPPLY()).to.equal(MAX_SUPPLY);
      expect(await lollypop.MINT_PRICE()).to.equal(MINT_PRICE);
      expect(await lollypop.TX_FEE()).to.equal(TX_FEE);
      expect(await lollypop.EXTRA_FEE_PERCENTAGE()).to.equal(EXTRA_FEE_PERCENTAGE);
      expect(await lollypop.REFERRAL_FEE_PERCENTAGE()).to.equal(REFERRAL_FEE_PERCENTAGE);
      expect(await lollypop.MAX_MINT_PER_TX()).to.equal(10);
    });
  });

  describe("Basic Minting", function () {
    it("Should mint NFT with correct payment", async function () {
      const extraFee = (MINT_PRICE * EXTRA_FEE_PERCENTAGE) / 10000n;
      const totalCost = MINT_PRICE + TX_FEE + extraFee;

      await expect(lollypop.connect(addr1).mint(1, { value: totalCost }))
        .to.emit(lollypop, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, 0);

      expect(await lollypop.totalSupply()).to.equal(1);
      expect(await lollypop.ownerOf(0)).to.equal(addr1.address);
      expect(await lollypop.balanceOf(addr1.address)).to.equal(1);
    });

    it("Should fail minting with insufficient payment", async function () {
      const insufficientPayment = MINT_PRICE; // Missing TX_FEE and extra fee

      await expect(
        lollypop.connect(addr1).mint(1, { value: insufficientPayment })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should fail minting with excessive payment", async function () {
      const extraFee = (MINT_PRICE * EXTRA_FEE_PERCENTAGE) / 10000n;
      const totalCost = MINT_PRICE + TX_FEE + extraFee;
      const excessivePayment = totalCost * 3n; // More than 2x allowed

      await expect(
        lollypop.connect(addr1).mint(1, { value: excessivePayment })
      ).to.be.revertedWith("Excessive payment");
    });

    it("Should fail minting zero amount", async function () {
      const extraFee = (MINT_PRICE * EXTRA_FEE_PERCENTAGE) / 10000n;
      const totalCost = MINT_PRICE + TX_FEE + extraFee;

      await expect(
        lollypop.connect(addr1).mint(0, { value: totalCost })
      ).to.be.revertedWith("Invalid mint amount");
    });

    it("Should fail setting maxMintAmountPerTx above MAX_MINT_PER_TX", async function () {
      // Should fail when trying to set maxMintAmountPerTx above MAX_MINT_PER_TX (10)
      await expect(
        lollypop.connect(owner).setMaxMintAmountPerTx(11)
      ).to.be.revertedWith("Invalid amount");
    });

    it("Should fail minting more than maxMintAmountPerTx", async function () {
      // Default maxMintAmountPerTx is 1
      const extraFee = (MINT_PRICE * EXTRA_FEE_PERCENTAGE) / 10000n;
      const totalCost = (MINT_PRICE + TX_FEE + extraFee) * 2n;

      await expect(
        lollypop.connect(addr1).mint(2, { value: totalCost })
      ).to.be.revertedWith("Invalid mint amount");
    });
  });

  describe("Referral System", function () {
    it("Should mint with referral and track earnings", async function () {
      const extraFee = (MINT_PRICE * EXTRA_FEE_PERCENTAGE) / 10000n;
      const totalCost = MINT_PRICE + TX_FEE + extraFee;
      const referralFee = (MINT_PRICE * REFERRAL_FEE_PERCENTAGE) / 10000n;

      await expect(
        lollypop.connect(addr1).mintWithReferral(1, addr2.address, { value: totalCost })
      )
        .to.emit(lollypop, "ReferralEarned")
        .withArgs(addr2.address, addr1.address, referralFee);

      const stats = await lollypop.getReferralStats(addr2.address);
      expect(stats.earnings).to.equal(referralFee);
      expect(stats.totalReferred).to.equal(1);
    });

    it("Should fail self-referral", async function () {
      const extraFee = (MINT_PRICE * EXTRA_FEE_PERCENTAGE) / 10000n;
      const totalCost = MINT_PRICE + TX_FEE + extraFee;

      await expect(
        lollypop.connect(addr1).mintWithReferral(1, addr1.address, { value: totalCost })
      ).to.be.revertedWith("Cannot refer yourself");
    });

    it("Should fail referral with zero address", async function () {
      const extraFee = (MINT_PRICE * EXTRA_FEE_PERCENTAGE) / 10000n;
      const totalCost = MINT_PRICE + TX_FEE + extraFee;

      await expect(
        lollypop.connect(addr1).mintWithReferral(1, ethers.ZeroAddress, { value: totalCost })
      ).to.be.revertedWith("Invalid referrer address");
    });

    it("Should allow withdrawal of referral earnings", async function () {
      const extraFee = (MINT_PRICE * EXTRA_FEE_PERCENTAGE) / 10000n;
      const totalCost = MINT_PRICE + TX_FEE + extraFee;
      const referralFee = (MINT_PRICE * REFERRAL_FEE_PERCENTAGE) / 10000n;

      // Mint with referral
      await lollypop.connect(addr1).mintWithReferral(1, addr2.address, { value: totalCost });

      const initialBalance = await ethers.provider.getBalance(addr2.address);
      
      await expect(lollypop.connect(addr2).withdrawReferralEarnings())
        .to.emit(lollypop, "ReferralWithdrawn")
        .withArgs(addr2.address, referralFee);

      const finalBalance = await ethers.provider.getBalance(addr2.address);
      expect(finalBalance).to.be.gt(initialBalance);
      
      // Earnings should be reset
      const stats = await lollypop.getReferralStats(addr2.address);
      expect(stats.earnings).to.equal(0);
    });
  });

  describe("Security Features", function () {
    it("Should enforce mint cooldown", async function () {
      const extraFee = (MINT_PRICE * EXTRA_FEE_PERCENTAGE) / 10000n;
      const totalCost = MINT_PRICE + TX_FEE + extraFee;

      // First mint should succeed
      await lollypop.connect(addr1).mint(1, { value: totalCost });

      // Second mint immediately should fail
      await expect(
        lollypop.connect(addr1).mint(1, { value: totalCost })
      ).to.be.revertedWith("Mint cooldown not met");
    });

    it("Should allow emergency stop", async function () {
      await lollypop.connect(owner).toggleEmergencyStop();
      
      const extraFee = (MINT_PRICE * EXTRA_FEE_PERCENTAGE) / 10000n;
      const totalCost = MINT_PRICE + TX_FEE + extraFee;

      await expect(
        lollypop.connect(addr1).mint(1, { value: totalCost })
      ).to.be.revertedWith("Emergency stop activated");
    });

    it("Should pause and unpause contract", async function () {
      await lollypop.connect(owner).pause();
      
      const extraFee = (MINT_PRICE * EXTRA_FEE_PERCENTAGE) / 10000n;
      const totalCost = MINT_PRICE + TX_FEE + extraFee;

      await expect(
        lollypop.connect(addr1).mint(1, { value: totalCost })
      ).to.be.revertedWithCustomError(lollypop, "EnforcedPause");

      await lollypop.connect(owner).unpause();
      
      // Should work after unpause
      await expect(lollypop.connect(addr1).mint(1, { value: totalCost }))
        .to.emit(lollypop, "Transfer");
    });
  });

  describe("Token Blocking", function () {
    beforeEach(async function () {
      // Mint a token first
      const extraFee = (MINT_PRICE * EXTRA_FEE_PERCENTAGE) / 10000n;
      const totalCost = MINT_PRICE + TX_FEE + extraFee;
      await lollypop.connect(addr1).mint(1, { value: totalCost });
    });

    it("Should block and unblock tokens", async function () {
      // Block token
      await expect(lollypop.connect(owner).blockToken(0))
        .to.emit(lollypop, "TokenBlocked")
        .withArgs(0);

      expect(await lollypop.isTokenBlocked(0)).to.equal(true);

      // Should prevent transfer of blocked token
      await expect(
        lollypop.connect(addr1).transferFrom(addr1.address, addr2.address, 0)
      ).to.be.revertedWith("Token transfer is blocked");

      // Unblock token
      await expect(lollypop.connect(owner).unblockToken(0))
        .to.emit(lollypop, "TokenUnblocked")
        .withArgs(0);

      expect(await lollypop.isTokenBlocked(0)).to.equal(false);
    });

    it("Should prevent non-owner from blocking tokens", async function () {
      await expect(
        lollypop.connect(addr1).blockToken(0)
      ).to.be.revertedWithCustomError(lollypop, "OwnableUnauthorizedAccount");
    });
  });

  describe("Marketplace Control", function () {
    it("Should approve and revoke marketplaces", async function () {
      await expect(lollypop.connect(owner).approveMarketplace(addr1.address))
        .to.emit(lollypop, "MarketplaceApproved")
        .withArgs(addr1.address);

      expect(await lollypop.isMarketplaceApproved(addr1.address)).to.equal(true);

      await expect(lollypop.connect(owner).revokeMarketplace(addr1.address))
        .to.emit(lollypop, "MarketplaceRevoked")
        .withArgs(addr1.address);

      expect(await lollypop.isMarketplaceApproved(addr1.address)).to.equal(false);
    });

    it("Should toggle marketplace restriction", async function () {
      await expect(lollypop.connect(owner).toggleMarketplaceRestriction())
        .to.emit(lollypop, "MarketplaceRestrictionToggled")
        .withArgs(true);

      expect(await lollypop.marketplaceRestrictionEnabled()).to.equal(true);
    });
  });

  describe("Admin Functions", function () {
    it("Should set max supply within limits", async function () {
      await lollypop.connect(owner).setMaxSupply(600);
      expect(await lollypop.maxSupply()).to.equal(600);

      // Should not exceed 2x initial supply
      await expect(
        lollypop.connect(owner).setMaxSupply(1200)
      ).to.be.revertedWith("Cannot exceed 2x initial supply");
    });

    it("Should set max mint amount per tx", async function () {
      await lollypop.connect(owner).setMaxMintAmountPerTx(5);
      expect(await lollypop.maxMintAmountPerTx()).to.equal(5);
    });

    it("Should mint for address (owner only)", async function () {
      await expect(lollypop.connect(owner).mintForAddress(addr1.address, 3))
        .to.emit(lollypop, "Transfer");

      expect(await lollypop.balanceOf(addr1.address)).to.equal(3);
      expect(await lollypop.totalSupply()).to.equal(3);
    });

    it("Should prevent non-owner from admin functions", async function () {
      await expect(
        lollypop.connect(addr1).setMaxSupply(600)
      ).to.be.revertedWithCustomError(lollypop, "OwnableUnauthorizedAccount");

      await expect(
        lollypop.connect(addr1).mintForAddress(addr2.address, 1)
      ).to.be.revertedWithCustomError(lollypop, "OwnableUnauthorizedAccount");
    });
  });

  describe("Supply Limits", function () {
    it("Should enforce max supply", async function () {
      // Set max supply to a small number for testing
      await lollypop.connect(owner).setMaxSupply(2);

      const extraFee = (MINT_PRICE * EXTRA_FEE_PERCENTAGE) / 10000n;
      const totalCost = MINT_PRICE + TX_FEE + extraFee;

      // Mint 2 tokens
      await lollypop.connect(addr1).mint(1, { value: totalCost });
      await lollypop.connect(addr2).mint(1, { value: totalCost });

      // Third mint should fail
      await expect(
        lollypop.connect(addr1).mint(1, { value: totalCost })
      ).to.be.revertedWith("Exceeds max supply");
    });
  });

  describe("Payment Distribution", function () {
    it("Should distribute payments correctly", async function () {
      const extraFee = (MINT_PRICE * EXTRA_FEE_PERCENTAGE) / 10000n;
      const totalCost = MINT_PRICE + TX_FEE + extraFee;

      const contractBalanceBefore = await ethers.provider.getBalance(await lollypop.getAddress());

      await lollypop.connect(addr1).mint(1, { value: totalCost });

      // Contract should not hold any funds after mint (all distributed)
      const contractBalanceAfter = await ethers.provider.getBalance(await lollypop.getAddress());
      expect(contractBalanceAfter).to.equal(0);
    });

    it("Should handle change correctly", async function () {
      const extraFee = (MINT_PRICE * EXTRA_FEE_PERCENTAGE) / 10000n;
      const totalCost = MINT_PRICE + TX_FEE + extraFee;
      const overpayment = totalCost + ethers.parseEther("0.001");

      const balanceBefore = await ethers.provider.getBalance(addr1.address);
      
      const tx = await lollypop.connect(addr1).mint(1, { value: overpayment });
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const balanceAfter = await ethers.provider.getBalance(addr1.address);
      const actualCost = balanceBefore - balanceAfter;

      // Should only cost totalCost + gas, change should be returned
      expect(actualCost).to.equal(totalCost + gasUsed);
    });
  });

  describe("Batch Operations", function () {
    it("Should approve multiple marketplaces", async function () {
      const marketplaces = [addr1.address, addr2.address];
      
      await expect(lollypop.connect(owner).approveMultipleMarketplaces(marketplaces))
        .to.emit(lollypop, "MarketplaceApproved");

      expect(await lollypop.isMarketplaceApproved(addr1.address)).to.equal(true);
      expect(await lollypop.isMarketplaceApproved(addr2.address)).to.equal(true);
    });

    it("Should block multiple tokens", async function () {
      // First mint some tokens
      await lollypop.connect(owner).mintForAddress(addr1.address, 3);
      
      const tokenIds = [0, 1, 2];
      await expect(lollypop.connect(owner).blockMultipleTokens(tokenIds))
        .to.emit(lollypop, "MultipleTokensBlocked");

      expect(await lollypop.isTokenBlocked(0)).to.equal(true);
      expect(await lollypop.isTokenBlocked(1)).to.equal(true);
      expect(await lollypop.isTokenBlocked(2)).to.equal(true);
    });
  });
});