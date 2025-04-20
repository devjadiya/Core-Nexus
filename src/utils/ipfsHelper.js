/**
 * IPFS Helper Utilities
 * A collection of helper functions for working with IPFS URLs and CIDs
 */

/**
 * Normalize an IPFS URL to a standard format
 * This helps prevent ENS resolution issues and ensures consistent format
 * 
 * @param {string} ipfsUrl - The IPFS URL to normalize
 * @returns {string} - Normalized IPFS URL
 */
export function normalizeIpfsUrl(ipfsUrl) {
  if (!ipfsUrl || typeof ipfsUrl !== 'string') {
    return ''; // Return empty string for invalid input
  }
  
  if (!ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl; // Return as-is if not an IPFS URL
  }
  
  try {
    // Extract just the CID part and remove any whitespace or path components
    let cid = ipfsUrl.replace('ipfs://', '').trim();
    
    // If there's a path after the CID, remove it
    if (cid.includes('/')) {
      cid = cid.split('/')[0];
    }
    
    // Construct a clean ipfs:// URL with just the CID
    return `ipfs://${cid}`;
  } catch (error) {
    console.error('Error normalizing IPFS URL:', error, ipfsUrl);
    return ipfsUrl; // Return original in case of error
  }
}

/**
 * Convert IPFS URL to HTTP gateway URL for display in browsers
 * 
 * @param {string} ipfsUrl - The IPFS URL (ipfs://...)
 * @returns {string} - HTTP gateway URL
 */
export function ipfsToHttpUrl(ipfsUrl) {
  if (!ipfsUrl || typeof ipfsUrl !== 'string') {
    return ''; // Return empty string if input is invalid
  }
  
  if (!ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl; // Return as is if not an IPFS URL
  }
  
  try {
    // Extract the CID (hash) from the IPFS URL and remove any whitespace
    let cid = ipfsUrl.replace('ipfs://', '').trim();
    
    // Handle paths in IPFS URLs if present
    let path = '';
    if (cid.includes('/')) {
      const parts = cid.split('/');
      cid = parts[0];
      path = '/' + parts.slice(1).join('/');
    }
    
    if (!cid) {
      console.error('Invalid IPFS URL (empty CID):', ipfsUrl);
      return '';
    }
    
    // Use Pinata gateway by default
    return `https://gateway.pinata.cloud/ipfs/${cid}${path}`;
  } catch (error) {
    console.error('Error converting IPFS URL to HTTP:', error, ipfsUrl);
    return '';
  }
}

/**
 * Validate if a string is a valid IPFS CID
 * Simple validation based on format - not comprehensive
 * 
 * @param {string} cid - The CID to validate
 * @returns {boolean} - Whether the CID appears valid
 */
export function isValidIpfsCid(cid) {
  if (!cid || typeof cid !== 'string') {
    return false;
  }
  
  // Basic validation - CIDs should be alphanumeric and fairly long
  // This is a simple check, not comprehensive validation
  return /^[a-zA-Z0-9]{7,}$/.test(cid);
}

/**
 * Extract the CID from an IPFS URL
 * 
 * @param {string} ipfsUrl - The IPFS URL
 * @returns {string} - The extracted CID or empty string
 */
export function extractCidFromIpfsUrl(ipfsUrl) {
  if (!ipfsUrl || typeof ipfsUrl !== 'string' || !ipfsUrl.startsWith('ipfs://')) {
    return '';
  }
  
  try {
    let cid = ipfsUrl.replace('ipfs://', '').trim();
    
    // Handle paths in IPFS URLs if present
    if (cid.includes('/')) {
      cid = cid.split('/')[0];
    }
    
    return cid;
  } catch (error) {
    console.error('Error extracting CID from IPFS URL:', error, ipfsUrl);
    return '';
  }
} 