// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract Lollypop is ERC721, Ownable, ReentrancyGuard, Pausable {
    uint256 private _tokenIdCounter;

    // Constants
    uint256 public constant INITIAL_MAX_SUPPLY = 550;
    uint256 public constant MINT_PRICE = 1.015 ether;
    address public constant FEE_RECEIVER = 0xD47d58Ba5f1b35F87a84CCcA3Aab183ABeF55372;
    uint256 public constant TX_FEE = 0.0014 ether;
    address public constant EXTRA_FEE_RECEIVER = 0x72917B3A78B909562644b23ef3F540c4A81Ed3E9;
    uint256 public constant EXTRA_FEE_PERCENTAGE = 100; // 1% = 100 basis points
    uint256 public constant REFERRAL_FEE_PERCENTAGE = 11; // 0.11% = 11 basis points
    uint256 public constant MAX_MINT_PER_TX = 10; // Maximum allowed mint per transaction
    uint256 public constant MAX_TOKENS_PER_BATCH = 50; // Maximum tokens in batch operations

    // Configurable parameters
    string private _baseTokenURI;
    string private _hiddenMetadataUri;
    uint256 public maxSupply = INITIAL_MAX_SUPPLY;
    uint256 public maxMintAmountPerTx = 1;

    // Marketplace control variables
    mapping(address => bool) public approvedMarketplaces;
    bool public marketplaceRestrictionEnabled = false;
    
    // Token transfer blocking variables
    mapping(uint256 => bool) public blockedTokens;
    
    // Referral system variables
    mapping(address => uint256) public referralEarnings;
    mapping(address => uint256) public totalReferrals;
    
    // Security variables
    mapping(address => uint256) public lastMintTime;
    mapping(address => uint256) public mintCount;
    uint256 public mintCooldown = 60; // 1 minute cooldown between mints
    bool public emergencyStop = false;
    
    // Events for marketplace control
    event MarketplaceApproved(address indexed marketplace);
    event MarketplaceRevoked(address indexed marketplace);
    event MarketplaceRestrictionToggled(bool enabled);
    
    // Events for token blocking
    event TokenBlocked(uint256 indexed tokenId);
    event TokenUnblocked(uint256 indexed tokenId);
    event MultipleTokensBlocked(uint256[] tokenIds);
    event MultipleTokensUnblocked(uint256[] tokenIds);
    
    // Events for referral system
    event ReferralEarned(address indexed referrer, address indexed minter, uint256 amount);
    event ReferralWithdrawn(address indexed referrer, uint256 amount);
    
    // Events for security
    event EmergencyStopToggled(bool enabled);
    event MintCooldownUpdated(uint256 newCooldown);
    event SuspiciousActivityDetected(address indexed user, string reason);

    constructor() ERC721("lollypop", "lolly") Ownable(msg.sender) {}

    // Override transferFrom to check for blocked tokens and emergency stop
    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        require(!emergencyStop, "Emergency stop activated");
        require(!blockedTokens[tokenId], "Token transfer is blocked");
        require(to != address(0), "Transfer to zero address");
        super.transferFrom(from, to, tokenId);
    }

    // Override safeTransferFrom to check for blocked tokens and emergency stop
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override {
        require(!emergencyStop, "Emergency stop activated");
        require(!blockedTokens[tokenId], "Token transfer is blocked");
        require(to != address(0), "Transfer to zero address");
        super.safeTransferFrom(from, to, tokenId, data);
    }

    // Override approve to check marketplace restrictions
    function approve(address to, uint256 tokenId) public virtual override {
        if (marketplaceRestrictionEnabled && to != address(0)) {
            require(approvedMarketplaces[to] || to == owner(), "Marketplace not approved");
        }
        super.approve(to, tokenId);
    }

    // Override setApprovalForAll to check marketplace restrictions
    function setApprovalForAll(address operator, bool approved) public virtual override {
        if (marketplaceRestrictionEnabled && approved && operator != address(0)) {
            require(approvedMarketplaces[operator] || operator == owner(), "Marketplace not approved");
        }
        super.setApprovalForAll(operator, approved);
    }

    // Main mint function
    function mint(uint256 _mintAmount) public payable whenNotPaused nonReentrant {
        _mintWithReferral(_mintAmount, address(0));
    }
    
    // Mint with referral function
    function mintWithReferral(uint256 _mintAmount, address referrer) public payable whenNotPaused nonReentrant {
        require(referrer != msg.sender, "Cannot refer yourself");
        require(referrer != address(0), "Invalid referrer address");
        _mintWithReferral(_mintAmount, referrer);
    }
    
    // Internal mint function with referral logic
    function _mintWithReferral(uint256 _mintAmount, address referrer) internal {
        // Security checks
        require(!emergencyStop, "Emergency stop activated");
        require(_mintAmount > 0 && _mintAmount <= maxMintAmountPerTx, "Invalid mint amount");
        require(_mintAmount <= MAX_MINT_PER_TX, "Exceeds max mint per transaction");
        require(totalSupply() + _mintAmount <= maxSupply, "Exceeds max supply");
        require(block.timestamp >= lastMintTime[msg.sender] + mintCooldown, "Mint cooldown not met");
        
        // Rate limiting check
        if (mintCount[msg.sender] > 10 && block.timestamp < lastMintTime[msg.sender] + 1 hours) {
            emit SuspiciousActivityDetected(msg.sender, "High frequency minting");
        }
        
        // Calculate fees
        uint256 extraFee = (MINT_PRICE * EXTRA_FEE_PERCENTAGE) / 10000; // 1% of mint price
        uint256 totalRequired = (MINT_PRICE + TX_FEE + extraFee) * _mintAmount;
        require(msg.value >= totalRequired, "Insufficient payment");
        
        // Prevent overpayment attacks
        require(msg.value <= totalRequired * 2, "Excessive payment");

        // Update security tracking
        lastMintTime[msg.sender] = block.timestamp;
        mintCount[msg.sender] += _mintAmount;

        // Mint tokens
        for (uint256 i = 0; i < _mintAmount; i++) {
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++;
            _safeMint(msg.sender, tokenId);
        }

        // Calculate referral fee if referrer exists
        uint256 referralFee = 0;
        if (referrer != address(0)) {
            referralFee = (MINT_PRICE * REFERRAL_FEE_PERCENTAGE) / 10000; // 0.11% of mint price
            referralEarnings[referrer] += referralFee * _mintAmount;
            totalReferrals[referrer] += _mintAmount;
            emit ReferralEarned(referrer, msg.sender, referralFee * _mintAmount);
        }

        // Send payments with proper error handling
        uint256 ownerAmount = MINT_PRICE * _mintAmount;
        uint256 feeAmount = TX_FEE * _mintAmount;
        uint256 remainingExtraFee = (extraFee - referralFee) * _mintAmount;
        
        (bool sent1, ) = owner().call{value: ownerAmount}("");
        require(sent1, "Owner payment failed");
        
        (bool sent2, ) = FEE_RECEIVER.call{value: feeAmount}("");
        require(sent2, "Fee payment failed");
        
        (bool sent3, ) = EXTRA_FEE_RECEIVER.call{value: remainingExtraFee}("");
        require(sent3, "Extra fee payment failed");

        // Return change if any
        uint256 change = msg.value - totalRequired;
        if (change > 0) {
            (bool sent4, ) = payable(msg.sender).call{value: change}("");
            require(sent4, "Change transfer failed");
        }
    }

    // Marketplace control functions
    function approveMarketplace(address marketplace) external onlyOwner {
        require(marketplace != address(0), "Invalid marketplace address");
        approvedMarketplaces[marketplace] = true;
        emit MarketplaceApproved(marketplace);
    }

    function revokeMarketplace(address marketplace) external onlyOwner {
        approvedMarketplaces[marketplace] = false;
        emit MarketplaceRevoked(marketplace);
    }

    function approveMultipleMarketplaces(address[] calldata marketplaces) external onlyOwner {
        require(marketplaces.length <= MAX_TOKENS_PER_BATCH, "Too many marketplaces");
        for (uint256 i = 0; i < marketplaces.length; i++) {
            require(marketplaces[i] != address(0), "Invalid marketplace address");
            approvedMarketplaces[marketplaces[i]] = true;
            emit MarketplaceApproved(marketplaces[i]);
        }
    }

    function revokeMultipleMarketplaces(address[] calldata marketplaces) external onlyOwner {
        require(marketplaces.length <= MAX_TOKENS_PER_BATCH, "Too many marketplaces");
        for (uint256 i = 0; i < marketplaces.length; i++) {
            approvedMarketplaces[marketplaces[i]] = false;
            emit MarketplaceRevoked(marketplaces[i]);
        }
    }

    function toggleMarketplaceRestriction() external onlyOwner {
        marketplaceRestrictionEnabled = !marketplaceRestrictionEnabled;
        emit MarketplaceRestrictionToggled(marketplaceRestrictionEnabled);
    }

    function setMarketplaceRestriction(bool enabled) external onlyOwner {
        marketplaceRestrictionEnabled = enabled;
        emit MarketplaceRestrictionToggled(enabled);
    }

    // Helper function to check if token exists
    function _tokenExists(uint256 tokenId) internal view returns (bool) {
        return tokenId < totalSupply();
    }

    // Token blocking functions
    function blockToken(uint256 tokenId) external onlyOwner {
        require(_tokenExists(tokenId), "Token does not exist");
        require(!blockedTokens[tokenId], "Token already blocked");
        blockedTokens[tokenId] = true;
        emit TokenBlocked(tokenId);
    }

    function unblockToken(uint256 tokenId) external onlyOwner {
        require(_tokenExists(tokenId), "Token does not exist");
        require(blockedTokens[tokenId], "Token not blocked");
        blockedTokens[tokenId] = false;
        emit TokenUnblocked(tokenId);
    }

    function blockMultipleTokens(uint256[] calldata tokenIds) external onlyOwner {
        require(tokenIds.length <= MAX_TOKENS_PER_BATCH, "Too many tokens");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(_tokenExists(tokenIds[i]), "Token does not exist");
            blockedTokens[tokenIds[i]] = true;
        }
        emit MultipleTokensBlocked(tokenIds);
    }

    function unblockMultipleTokens(uint256[] calldata tokenIds) external onlyOwner {
        require(tokenIds.length <= MAX_TOKENS_PER_BATCH, "Too many tokens");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(_tokenExists(tokenIds[i]), "Token does not exist");
            blockedTokens[tokenIds[i]] = false;
        }
        emit MultipleTokensUnblocked(tokenIds);
    }

    // Emergency function to block all tokens owned by a specific address
    function blockTokensByOwner(address tokenOwner) external onlyOwner {
        require(tokenOwner != address(0), "Invalid owner address");
        uint256 balance = balanceOf(tokenOwner);
        require(balance > 0, "Address owns no tokens");
        require(balance <= MAX_TOKENS_PER_BATCH, "Too many tokens, use batch operations");
        
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 index = 0;
        
        // Find all tokens owned by this address
        for (uint256 i = 0; i < totalSupply() && index < balance; i++) {
            if (_tokenExists(i) && ownerOf(i) == tokenOwner) {
                blockedTokens[i] = true;
                tokenIds[index] = i;
                index++;
            }
        }
        
        emit MultipleTokensBlocked(tokenIds);
    }

    // Referral system functions
    function withdrawReferralEarnings() external nonReentrant {
        uint256 earnings = referralEarnings[msg.sender];
        require(earnings > 0, "No earnings to withdraw");
        require(!emergencyStop, "Emergency stop activated");
        
        referralEarnings[msg.sender] = 0;
        
        (bool sent, ) = payable(msg.sender).call{value: earnings}("");
        require(sent, "Withdrawal failed");
        
        emit ReferralWithdrawn(msg.sender, earnings);
    }
    
    function getReferralStats(address referrer) external view returns (uint256 earnings, uint256 totalReferred) {
        return (referralEarnings[referrer], totalReferrals[referrer]);
    }

    // Security functions
    function toggleEmergencyStop() external onlyOwner {
        emergencyStop = !emergencyStop;
        emit EmergencyStopToggled(emergencyStop);
    }

    function setMintCooldown(uint256 newCooldown) external onlyOwner {
        require(newCooldown <= 1 hours, "Cooldown too long");
        mintCooldown = newCooldown;
        emit MintCooldownUpdated(newCooldown);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Admin functions
    function setBaseURI(string calldata baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function setHiddenMetadataUri(string memory hiddenUri) public onlyOwner {
        _hiddenMetadataUri = hiddenUri;
    }

    function setMaxSupply(uint256 newMaxSupply) public onlyOwner {
        require(newMaxSupply >= totalSupply(), "Cannot set lower than current supply");
        require(newMaxSupply <= INITIAL_MAX_SUPPLY * 2, "Cannot exceed 2x initial supply");
        maxSupply = newMaxSupply;
    }

    function setMaxMintAmountPerTx(uint256 newMaxMintAmount) public onlyOwner {
        require(newMaxMintAmount > 0 && newMaxMintAmount <= MAX_MINT_PER_TX, "Invalid amount");
        maxMintAmountPerTx = newMaxMintAmount;
    }

    function mintForAddress(address to, uint256 mintAmount) public onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(mintAmount > 0 && mintAmount <= MAX_TOKENS_PER_BATCH, "Invalid mint amount");
        require(totalSupply() + mintAmount <= maxSupply, "Exceeds max supply");
                
        for (uint256 i = 0; i < mintAmount; i++) {
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++;
            _safeMint(to, tokenId);
        }
    }

    // View functions
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    function isMarketplaceApproved(address marketplace) external view returns (bool) {
        return approvedMarketplaces[marketplace];
    }

    function isTokenBlocked(uint256 tokenId) external view returns (bool) {
        return blockedTokens[tokenId];
    }

    function getBlockedTokensByOwner(address tokenOwner) external view returns (uint256[] memory) {
        require(tokenOwner != address(0), "Invalid owner address");
        uint256 balance = balanceOf(tokenOwner);
        if (balance == 0) {
            return new uint256[](0);
        }
        
        uint256[] memory result = new uint256[](balance);
        uint256 index = 0;
        
        for (uint256 i = 0; i < totalSupply() && index < balance; i++) {
            if (_tokenExists(i) && ownerOf(i) == tokenOwner && blockedTokens[i]) {
                result[index] = i;
                index++;
            }
        }
        
        // Resize array to actual blocked token count
        uint256[] memory blockedTokensList = new uint256[](index);
        for (uint256 j = 0; j < index; j++) {
            blockedTokensList[j] = result[j];
        }
        
        return blockedTokensList;
    }

    function withdraw() public onlyOwner nonReentrant {
        require(!emergencyStop, "Emergency stop activated");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool sent, ) = payable(owner()).call{value: balance}("");
        require(sent, "Withdrawal failed");
    }
}