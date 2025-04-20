import { ethers } from 'ethers';
import MemeTokenArtifact from '../artifacts/contracts/MemeToken.sol/MemeToken.json';

/**
 * Update token image on a specific contract
 * @param {string} imageUrl - The new image URL (ipfs:// format)
 * @param {string} contractAddress - The token contract address
 * @param {Object} signer - The ethers.js signer
 * @returns {Promise<Object>} - Result object
 */
export async function updateTokenImage(imageUrl, contractAddress, signer) {
  try {
    // Create contract instance
    const tokenContract = new ethers.Contract(
      contractAddress,
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
      contractAddress,
      imageUrl
    };
  } catch (error) {
    console.error('Token image update error:', error);
    
    // Check for ENS-related errors and provide a clearer message
    if (error.message && error.message.includes('resolver or addr is not configured for ENS name')) {
      return {
        success: false,
        error: 'Error with IPFS URL format. Please try again or use a different image.'
      };
    }
    
    return {
      success: false,
      error: error.message
    };
  }
} 