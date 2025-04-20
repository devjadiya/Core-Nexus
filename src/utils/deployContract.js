import { ethers } from 'ethers';
import MemeTokenArtifact from '../artifacts/contracts/MemeToken.sol/MemeToken.json';
import { uploadToPinata } from './pinataService';

// Already deployed contract address on Arbitrum Sepolia
export const DEPLOYED_CONTRACT_ADDRESS = '0xbb221cc04fd19dc695350aadd3367816ec49aea0';

// Helper function to create error objects
function createError(message) {
  return { message };
}

// Convert IPFS URL to HTTP gateway URL
function ipfsToHttpUrl(ipfsUrl) {
  if (!ipfsUrl || !ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl; // Return as is if not an IPFS URL
  }
  
  // Extract the CID (hash) from the IPFS URL
  const cid = ipfsUrl.replace('ipfs://', '');
  
  // Return the Pinata gateway URL
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}

// Function to upload image to IPFS using Pinata
export async function uploadToIPFS(file) {
  try {
    const result = await uploadToPinata(file);
    return result.ipfsUrl; // Return the ipfs:// URL
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw createError(`Failed to upload image to IPFS: ${error.message}`);
  }
}

// Function to deploy a new meme token
export async function deployMemeToken(name, symbol, initialSupply, description, imageUrl, signer) {
  try {
    // Get the signer's address (token owner)
    const owner = await signer.getAddress();
    
    console.log(`Deploying new token: ${name} (${symbol})`);
    console.log(`Initial supply: ${initialSupply}, Image: ${imageUrl}`);
    console.log(`Description: ${description}`);
    
    // Store description in metadata if needed later
    // For now we're not using it in the contract directly
    
    // Create contract factory
    const tokenFactory = new ethers.ContractFactory(
      MemeTokenArtifact.abi,
      MemeTokenArtifact.bytecode,
      signer
    );
    
    // Default max supply is 10x initial supply
    const maxSupply = initialSupply * 10;
    
    // Deploy contract with constructor arguments
    const tokenContract = await tokenFactory.deploy(
      name,                  // Token name
      symbol,                // Token symbol
      initialSupply,         // Initial supply
      maxSupply,             // Max supply
      imageUrl,              // Token image IPFS URL
      owner                  // Token recipient/owner
    );
    
    // Wait for contract to be mined
    console.log('Waiting for transaction to be mined...');
    await tokenContract.deployTransaction.wait();
    
    console.log(`Token deployed at: ${tokenContract.address}`);
    
    return {
      success: true,
      contractAddress: tokenContract.address,
      tokenName: name,
      tokenSymbol: symbol,
      initialSupply: initialSupply,
      maxSupply: maxSupply,
      imageUrl: imageUrl,
      description: description,
      owner: owner
    };
  } catch (error) {
    console.error('Token deployment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to update token image on the already deployed contract
export async function updateTokenImage(imageUrl, signer) {
  try {
    // Create contract instance
    const tokenContract = new ethers.Contract(
      DEPLOYED_CONTRACT_ADDRESS,
      MemeTokenArtifact.abi,
      signer
    );
    
    console.log(`Updating token image to: ${imageUrl}`);
    // Update token image
    const tx = await tokenContract.updateTokenImage(imageUrl);
    
    // Wait for transaction to be mined
    console.log('Waiting for transaction to be mined...');
    await tx.wait();
    console.log('Token image updated successfully!');
    
    return {
      success: true,
      contractAddress: DEPLOYED_CONTRACT_ADDRESS,
      imageUrl
    };
  } catch (error) {
    console.error('Token image update error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to mint tokens on a specific contract
export async function mintTokens(amount, contractAddress, signer) {
  try {
    // Create contract instance
    const tokenContract = new ethers.Contract(
      contractAddress,
      MemeTokenArtifact.abi,
      signer
    );
    
    // Get recipient address (the signer's address)
    const recipientAddress = await signer.getAddress();
    
    console.log(`Minting ${amount} tokens to ${recipientAddress} on contract ${contractAddress}`);
    // Mint tokens
    const tx = await tokenContract.mint(recipientAddress, amount);
    
    // Wait for transaction to be mined
    console.log('Waiting for transaction to be mined...');
    await tx.wait();
    console.log('Tokens minted successfully!');
    
    return {
      success: true,
      contractAddress,
      amount,
      recipient: recipientAddress
    };
  } catch (error) {
    console.error('Token minting error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get token info from a specific contract
export async function getTokenInfo(contractAddress, provider) {
  try {
    // Create contract instance
    const tokenContract = new ethers.Contract(
      contractAddress,
      MemeTokenArtifact.abi,
      provider
    );
    
    // Get token information
    const info = await tokenContract.getTokenInfo();
    
    // Convert IPFS URL to HTTP URL for frontend display
    const imageUrl = info[4]; // Original IPFS URL
    const gatewayUrl = ipfsToHttpUrl(imageUrl); // HTTP URL
    
    // Format token information
    return {
      success: true,
      tokenName: info[0],
      tokenSymbol: info[1],
      totalSupply: ethers.utils.formatUnits(info[2], 18),
      maxSupply: ethers.utils.formatUnits(info[3], 18),
      imageUrl: imageUrl,
      imageGatewayUrl: gatewayUrl, // Add gateway URL for display
      isMintable: info[5],
      contractAddress: contractAddress
    };
  } catch (error) {
    console.error('Error getting token info:', error);
    return {
      success: false,
      error: error.message
    };
  }
} 