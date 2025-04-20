import { ethers } from 'ethers';
import MemeTokenArtifact from '../artifacts/contracts/MemeToken.sol/MemeToken.json';
import { NFTStorage } from 'nft.storage';

// This is a demo API key. In production, use environment variables or a more secure method
const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEQzODM0MkVCM2MzZjJmYkE2NjU4NTEwMEREOEJhMzg4NzJBMzRDN2EiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcxMzgxMjcwMzg0MywibmFtZSI6Im1lbWV0b2tlbiJ9.g1a2ZdpZJxQ4M1-fCUzLLr2L_VFE0n9JhZ_VdbvnZpQ';

// Already deployed contract address on Arbitrum Sepolia
export const DEPLOYED_CONTRACT_ADDRESS = '0xbb221cc04fd19dc695350aadd3367816ec49aea0';

// Function to upload image to IPFS
export async function uploadToIPFS(file) {
  try {
    const client = new NFTStorage({ token: NFT_STORAGE_KEY });
    
    // Upload the image
    const imageBlob = new Blob([file]);
    const cid = await client.storeBlob(imageBlob);
    
    return `ipfs://${cid}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload image to IPFS. Please try again.');
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

// Function to mint tokens on the already deployed contract
export async function mintTokens(amount, recipientAddress, signer) {
  try {
    // Create contract instance
    const tokenContract = new ethers.Contract(
      DEPLOYED_CONTRACT_ADDRESS,
      MemeTokenArtifact.abi,
      signer
    );
    
    console.log(`Minting ${amount} tokens to ${recipientAddress}`);
    // Mint tokens
    const tx = await tokenContract.mint(recipientAddress, amount);
    
    // Wait for transaction to be mined
    console.log('Waiting for transaction to be mined...');
    await tx.wait();
    console.log('Tokens minted successfully!');
    
    return {
      success: true,
      contractAddress: DEPLOYED_CONTRACT_ADDRESS,
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

// Get token info from deployed contract
export async function getTokenInfo(provider) {
  try {
    // Create contract instance
    const tokenContract = new ethers.Contract(
      DEPLOYED_CONTRACT_ADDRESS,
      MemeTokenArtifact.abi,
      provider
    );
    
    // Get token information
    const info = await tokenContract.getTokenInfo();
    
    // Format token information
    return {
      success: true,
      tokenName: info[0],
      tokenSymbol: info[1],
      totalSupply: ethers.utils.formatUnits(info[2], 18),
      maxSupply: ethers.utils.formatUnits(info[3], 18),
      imageUrl: info[4],
      isMintable: info[5],
      contractAddress: DEPLOYED_CONTRACT_ADDRESS
    };
  } catch (error) {
    console.error('Error getting token info:', error);
    return {
      success: false,
      error: error.message
    };
  }
} 