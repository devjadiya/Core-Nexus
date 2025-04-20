import { nanoid } from 'nanoid';

// Store mapping between token contract addresses and short IDs
const tokenIdMap = new Map();
const reverseTokenIdMap = new Map();

/**
 * Generate a short unique ID for a token contract address
 * @param {string} contractAddress - The token contract address
 * @returns {string} A short unique ID for the token
 */
export const generateTokenShortId = (contractAddress) => {
  // Check if this contract already has a short ID
  if (tokenIdMap.has(contractAddress)) {
    return tokenIdMap.get(contractAddress);
  }
  
  // Generate a new short ID (10 characters is sufficient)
  const shortId = nanoid(10);
  
  // Store the mapping in both directions
  tokenIdMap.set(contractAddress, shortId);
  reverseTokenIdMap.set(shortId, contractAddress);
  
  return shortId;
};

/**
 * Get the contract address from a short ID
 * @param {string} shortId - The short ID for a token
 * @returns {string|null} The contract address or null if not found
 */
export const getContractAddressFromShortId = (shortId) => {
  if (reverseTokenIdMap.has(shortId)) {
    return reverseTokenIdMap.get(shortId);
  }
  return null;
};

/**
 * In a real app, you would persist these mappings in a database
 * This function simulates storing token data with its shortId
 * @param {Object} tokenData - The token data including contract address
 * @returns {Object} The token data with added shortId
 */
export const saveTokenData = (tokenData) => {
  const shortId = generateTokenShortId(tokenData.contractAddress);
  
  // In a real application, this would save to a database
  // For this example, we're just adding the shortId to the object
  const enhancedTokenData = {
    ...tokenData,
    shortId
  };
  
  console.log('Token data saved:', enhancedTokenData);
  
  return enhancedTokenData;
};

/**
 * Get a shareable link for a token
 * @param {string} contractAddress - The token contract address
 * @returns {string} A shareable link with the short ID
 */
export const getShareableTokenLink = (contractAddress) => {
  const shortId = generateTokenShortId(contractAddress);
  return `/token/${shortId}`;
}; 