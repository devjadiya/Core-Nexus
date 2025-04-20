import axios from 'axios';

// Get JWT token from .env file
const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;

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
    if (!PINATA_JWT) {
      throw createError('Pinata JWT is missing. Check your .env file.');
    }

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

    // Get the IPFS hash (CID) from the response
    const ipfsHash = response.data.IpfsHash;
    
    // Create IPFS URL
    const ipfsUrl = `ipfs://${ipfsHash}`;
    
    // Create gateway URL for easy viewing
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    
    console.log('File uploaded to Pinata:', ipfsUrl);
    
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
    if (!PINATA_JWT) {
      throw createError('Pinata JWT is missing.');
    }
    
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