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
    return null;
  }
  
  try {
    // In a real app, you would fetch this from your database or blockchain
    // For this example, we'll simulate fetching from the blockchain
    
    // This is where you would use ethers.js to query the blockchain
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const contract = new ethers.Contract(contractAddress, MemeTokenABI, provider);
    // const tokenInfo = await contract.getTokenInfo();
    
    // Simulate token data for demo purposes
    const tokenData = {
      name: "Example Token",
      symbol: "EXT",
      totalSupply: "1000000",
      maxSupply: "10000000",
      imageUrl: "ipfs://example",
      imageGatewayUrl: "https://nftstorage.link/ipfs/example",
      contractAddress,
      shortId
    };
    
    return tokenData;
  } catch (error) {
    console.error('Error fetching token data:', error);
    throw new Error('Failed to fetch token data');
  }
}; 