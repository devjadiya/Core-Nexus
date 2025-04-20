// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MemeToken is ERC20, Ownable {
    string public tokenImage; // IPFS hash for token image
    uint256 public maxSupply;
    bool public isMintable;
    
    // Events for tracking token activities
    event TokenImageUpdated(string newTokenImage);
    event TokensMinted(address to, uint256 amount);
    
    constructor(
        string memory name, 
        string memory symbol, 
        uint256 initialSupply,
        uint256 _maxSupply,
        string memory _tokenImage,
        address recipient
    ) ERC20(name, symbol) Ownable(recipient) {
        require(_maxSupply >= initialSupply, "Max supply must be greater than or equal to initial supply");
        
        maxSupply = _maxSupply * 10 ** decimals();
        tokenImage = _tokenImage;
        isMintable = true;
        
        // Mint initial supply to recipient
        _mint(recipient, initialSupply * 10 ** decimals());
        
        emit TokenImageUpdated(_tokenImage);
    }
    
    // Function to mint additional tokens (only owner)
    function mint(address to, uint256 amount) external onlyOwner {
        require(isMintable, "Minting is disabled");
        uint256 amountWithDecimals = amount * 10 ** decimals();
        require(totalSupply() + amountWithDecimals <= maxSupply, "Exceeds maximum supply");
        
        _mint(to, amountWithDecimals);
        emit TokensMinted(to, amountWithDecimals);
    }
    
    // Disable minting permanently
    function disableMinting() external onlyOwner {
        isMintable = false;
    }
    
    // Update token image (only owner)
    function updateTokenImage(string memory _newTokenImage) external onlyOwner {
        tokenImage = _newTokenImage;
        emit TokenImageUpdated(_newTokenImage);
    }
    
    // Function to get token information
    function getTokenInfo() public view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint256 tokenSupply,
        uint256 tokenMaxSupply,
        string memory image,
        bool canMint
    ) {
        return (
            name(),
            symbol(),
            totalSupply(),
            maxSupply,
            tokenImage,
            isMintable
        );
    }
} 