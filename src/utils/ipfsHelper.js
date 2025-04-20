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
    console.error('Invalid IPFS URL provided:', ipfsUrl);
    return ''; // Return empty string for invalid input
  }
  
  try {
    console.log('Normalizing IPFS URL:', ipfsUrl);
    
    // Special handling for various IPFS URL formats
    if (ipfsUrl.startsWith('ipfs://ipfs/')) {
      // Convert ipfs://ipfs/Qm... to ipfs://Qm...
      ipfsUrl = ipfsUrl.replace('ipfs://ipfs/', 'ipfs://');
      console.log('Converted ipfs://ipfs/ format to ipfs://', ipfsUrl);
    } else if (ipfsUrl.includes('gateway.pinata.cloud/ipfs/')) {
      // Convert https://gateway.pinata.cloud/ipfs/Qm... to ipfs://Qm...
      const cid = ipfsUrl.split('/ipfs/')[1];
      ipfsUrl = `ipfs://${cid}`;
      console.log('Converted Pinata gateway URL to ipfs://', ipfsUrl);
    } else if (ipfsUrl.includes('/ipfs/') && !ipfsUrl.startsWith('ipfs://')) {
      // Convert any gateway URL with /ipfs/ to ipfs://
      const cid = ipfsUrl.split('/ipfs/')[1];
      ipfsUrl = `ipfs://${cid}`;
      console.log('Converted generic gateway URL to ipfs://', ipfsUrl);
    }
    
    // If not an IPFS URL after conversions, return as-is
    if (!ipfsUrl.startsWith('ipfs://')) {
      console.log('Not an IPFS URL after conversions, returning as-is:', ipfsUrl);
      return ipfsUrl;
    }
    
    // Extract just the CID part and remove any whitespace or path components
    let cid = ipfsUrl.replace('ipfs://', '').trim();
    
    // If there's a path after the CID, remove it
    if (cid.includes('/')) {
      const originalCid = cid;
      cid = cid.split('/')[0];
      console.log(`Removed path from CID: "${originalCid}" -> "${cid}"`);
    }
    
    // Validate the CID looks reasonable (very basic check)
    if (!isValidIpfsCid(cid)) {
      console.warn('Generated CID may not be valid:', cid);
    }
    
    // Construct a clean ipfs:// URL with just the CID
    const normalizedUrl = `ipfs://${cid}`;
    console.log('Final normalized IPFS URL:', normalizedUrl);
    return normalizedUrl;
  } catch (error) {
    console.error('Error normalizing IPFS URL:', error, ipfsUrl);
    return ''; // Return empty string in case of error for safety
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