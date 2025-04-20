import axios from 'axios';

// Hardcoded token for production environment only - SECURITY RISK, replace with proper env vars
const PRODUCTION_PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0NWNlNWJjYi1lYTNkLTQzNTktYWIxNS01MDQ0NDE3OGY0MTYiLCJlbWFpbCI6InVuaXZlcnNlYm9zczc4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJlNjg3ZjM2NWMzZjY4NTM4ZjM5MSIsInNjb3BlZEtleVNlY3JldCI6IjU0MzNmZDIyOTExYzQ5NzE2OGIzMDAyZGE3M2VhNmFhODgwNWNiNTkyZDZmY2NjZTE0NzRmYzZiODJjMGY5MTMiLCJleHAiOjE3NzY2NzQzMjh9.VRkLH68grWdZnV1rCufVxxIQoTMByAgm2z8culRM9aM";

// Get JWT token from .env file or use production fallback
const PINATA_JWT = process.env.REACT_APP_PINATA_JWT || PRODUCTION_PINATA_JWT;

// Check if JWT is available
if (!PINATA_JWT) {
  console.error('PINATA_JWT is not defined in environment variables. IPFS uploads will fail.');
}

// Helper function to create error objects
function createError(message) {
  return { message };
}

/**
 * Upload file to IPFS using Pinata
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} - Object containing ipfsUrl and gatewayUrl
 */
export const uploadToPinata = async (file) => {
  try {
    // No need to check if PINATA_JWT exists since we have a fallback
    
    console.log('Starting file upload to Pinata, file details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    // Create form data with the file
    const formData = new FormData();
    formData.append('file', file);

    // Optional metadata
    const metadata = JSON.stringify({
      name: file.name || 'token-image',
    });
    formData.append('pinataMetadata', metadata);

    // Set pinata options (optional)
    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', pinataOptions);

    console.log('Uploading to Pinata...');
    
    // Upload to Pinata
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('Pinata upload response:', response.data);
    
    // Get the IPFS hash (CID) from the response
    const ipfsHash = response.data.IpfsHash;
    console.log('IPFS hash (CID):', ipfsHash);
    
    // Create normalized IPFS URL (just the CID, no path or query parameters)
    const ipfsUrl = `ipfs://${ipfsHash.trim()}`;
    
    // Create gateway URL for easy viewing
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    
    console.log('Generated IPFS URL:', ipfsUrl);
    console.log('Generated Gateway URL:', gatewayUrl);
    
    return { ipfsUrl, gatewayUrl };
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw createError(`Failed to upload to Pinata: ${error.message}`);
  }
};

/**
 * Check if a file exists on Pinata
 * @param {string} cid - The CID (hash) of the file
 * @returns {Promise<boolean>} - Whether the file exists
 */
export const checkIfFileExists = async (cid) => {
  try {
    // No need to check if PINATA_JWT exists since we have a fallback
    
    const response = await axios.get(
      `https://api.pinata.cloud/pinning/pinList?hashContains=${cid}`,
      {
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
      }
    );
    
    return response.data.count > 0;
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
}; 