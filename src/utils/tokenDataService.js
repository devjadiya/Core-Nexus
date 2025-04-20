import { saveTokenData, getContractAddressFromShortId } from './tokenLinkService';
import { uploadToPinata } from './pinataService';

/**
 * Upload image to IPFS using Pinata
 * @param {File} file - The image file to upload
 * @returns {Promise<Object>} - Object containing ipfsUrl and gatewayUrl
 */
export const uploadImageToIPFS = async (file) => {
  try {
    return await uploadToPinata(file);
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error(`Failed to upload image to IPFS: ${error.message}`);
  }
};

/**
 * Convert IPFS URL to HTTP gateway URL
 * @param {string} ipfsUrl - The IPFS URL (ipfs://...)
 * @returns {string} - HTTP gateway URL
 */
export const ipfsToHttpUrl = (ipfsUrl) => {
  if (!ipfsUrl || !ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl; // Return as is if not an IPFS URL
  }
  
  // Extract the CID (hash) from the IPFS URL
  const cid = ipfsUrl.replace('ipfs://', '');
  
  // Return the Pinata gateway URL
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
};

/**
 * Save complete token metadata
 * @param {Object} tokenData - Token data including contractAddress, name, symbol, etc.
 * @returns {Promise<Object>} - Enhanced token data with shortId and metadata
 */
export const saveTokenMetadata = async (tokenData) => {
  try {
    // If we have an image file, upload it to IPFS
    let imageUrls = {};
    if (tokenData.imageFile) {
      imageUrls = await uploadImageToIPFS(tokenData.imageFile);
      tokenData.imageUrl = imageUrls.ipfsUrl;
      tokenData.imageGatewayUrl = imageUrls.gatewayUrl;
    }
    
    // Create metadata object
    const metadata = {
      name: tokenData.name,
      symbol: tokenData.symbol,
      description: tokenData.description || '',
      image: tokenData.imageUrl,
      properties: {
        totalSupply: tokenData.totalSupply,
        maxSupply: tokenData.maxSupply,
        contractAddress: tokenData.contractAddress,
        creationDate: new Date().toISOString(),
      }
    };
    
    // In a real app, you might store this metadata on IPFS as well
    
    // Save token data with shortId
    const enhancedTokenData = saveTokenData({
      ...tokenData,
      metadata
    });
    
    return enhancedTokenData;
  } catch (error) {
    console.error('Error saving token metadata:', error);
    throw new Error('Failed to save token metadata');
  }
};

/**
 * Fetch token data by shortId
 * @param {string} shortId - The short ID for the token
 * @returns {Promise<Object|null>} - Token data or null if not found
 */
export const getTokenDataByShortId = async (shortId) => {
  // Get the contract address from the shortId
  const contractAddress = getContractAddressFromShortId(shortId);
  
  if (!contractAddress) {
    console.error('Contract address not found for shortId:', shortId);
    return null;
  }
  
  try {
    console.log('Found contract address for shortId:', shortId, contractAddress);
    
    // In a production app, you would fetch from your database
    // The contract address is the key data we need to pass to the TokenDetails component
    // which will then use the address to get real-time data from the blockchain
    const tokenData = {
      name: "Loading...",       // Will be replaced with blockchain data
      symbol: "...",            // Will be replaced with blockchain data
      totalSupply: "0",         // Will be replaced with blockchain data
      maxSupply: "0",           // Will be replaced with blockchain data
      imageUrl: "",             // Will be replaced with blockchain data
      imageGatewayUrl: "",      // Will be replaced with blockchain data
      contractAddress,          // The most important piece of information
      shortId
    };
    
    return tokenData;
  } catch (error) {
    console.error('Error fetching token data:', error);
    throw new Error('Failed to fetch token data');
  }
}; 