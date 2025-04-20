import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import WalletConnect from './WalletConnect';
import { uploadToIPFS, deployMemeToken } from '../utils/deployContract';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background-color: #2a2a3b;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  color: white;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: white;
  font-weight: 700;
  font-size: 28px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #60a5fa; /* blue-400 */
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Input = styled.input`
  padding: 12px;
  background-color: #2a2a3b;
  border: 1px solid #e2e8f0; /* slate-200 */
  border-radius: 8px;
  font-size: 16px;
  color: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.5);
    border-color: #3b82f6; /* blue-500 */
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  background-color: #2a2a3b;
  border: 1px solid #e2e8f0; /* slate-200 */
  border-radius: 8px;
  font-size: 16px;
  height: 96px; /* h-24 */
  color: white;
  resize: vertical;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.5);
    border-color: #3b82f6; /* blue-500 */
  }
`;

const TickerInputContainer = styled.div`
  position: relative;
`;

const TickerPrefix = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 100%;
  border: 1px solid #e2e8f0;
  border-right: none;
  border-radius: 8px 0 0 8px;
  background-color: #2a2a3b;
  color: white;
  pointer-events: none;
  left: 0;
  top: 0;
  z-index: 1;
`;

const TickerInput = styled(Input)`
  padding-left: 48px;
`;

const Error = styled.p`
  color: #f87171; /* red-400 */
  font-size: 14px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  
  &:before {
    content: "⚠️";
    margin-right: 5px;
  }
`;

const SubmitButton = styled.button`
  background-color: #0d6efd;
  color: white;
  padding: 10px 16px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-top: 15px;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #0b5ed7;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const Status = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  ${props => props.isError 
    ? 'background-color: rgba(239, 68, 68, 0.2); color: #ef4444;' 
    : 'background-color: rgba(34, 197, 94, 0.2); color: #22c55e;'
  }
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const WalletContainer = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const FileUploadContainer = styled.div`
  position: relative;
  min-height: 150px;
  border: 2px dashed ${props => props.isDragActive ? '#60a5fa' : '#4b5563'};
  border-radius: 12px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  
  &:hover {
    border-color: #60a5fa;
    background-color: rgba(96, 165, 250, 0.05);
  }
`;

const FileInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const FileUploadText = styled.div`
  margin: 16px 0;
  text-align: center;
  color: ${props => props.isDragActive ? '#60a5fa' : '#d1d5db'};
  font-size: 14px;
`;

const FileUploadIcon = styled.div`
  color: ${props => props.isDragActive ? '#60a5fa' : '#d1d5db'};
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
`;

const FileUploadButton = styled.button`
  margin-top: 8px;
  padding: 8px 16px;
  background-color: #374151;
  border: 1px solid #4b5563;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #4b5563;
  }
`;

const PreviewContainer = styled.div`
  margin-top: 16px;
  display: ${props => props.isVisible ? 'block' : 'none'};
  animation: fadeIn 0.5s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const PreviewCard = styled.div`
  background-color: rgba(55, 65, 81, 0.5);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PreviewTitle = styled.h3`
  font-size: 16px;
  color: white;
  margin-bottom: 16px;
  font-weight: 500;
`;

const PreviewImageContainer = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.1);
  background-color: #1f2937;
  position: relative;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(239, 68, 68, 0.8);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(239, 68, 68, 1);
  }
`;

const PreviewInfo = styled.div`
  margin-top: 12px;
  text-align: center;
  
  p {
    margin: 5px 0;
    font-size: 14px;
    color: #9ca3af;
  }
`;

const AdvancedOptions = styled.div`
  color: #60a5fa;
  cursor: pointer;
  width: fit-content;
  margin-top: 5px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ChevronIcon = styled.span`
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.3s ease;
  display: inline-block;
`;

// Icon components
const LoadingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spinner">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 6v6l4 2"></path>
    <style jsx>{`
      .spinner {
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </svg>
);

const SuccessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Create a function to wrap the Error constructor
function createError(message) {
  return {
    message: message
  };
}

const TokenCreator = () => {
  const [signer, setSigner] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [status, setStatus] = useState({ message: '', isError: false });
  const [preview, setPreview] = useState({
    show: false,
    imageUrl: null
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit,
    watch,
    setValue,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      initialSupply: "1000000"
    }
  });

  // Watch form values for preview
  const watchImage = watch('image');

  // Handle image preview
  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setPreview({
          show: true,
          imageUrl: reader.result,
          fileName: file.name,
          fileSize: formatFileSize(file.size)
        });
      };
      
      reader.readAsDataURL(file);
    } else {
      setPreview({
        show: false,
        imageUrl: null
      });
    }
  }, [watchImage]);
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const onWalletConnect = (newSigner) => {
    setSigner(newSigner);
  };
  
  const onSubmit = async (data) => {
    try {
      setIsDeploying(true);
      setStatus({ message: '', isError: false });
      
      if (!signer) {
        throw createError('Please connect your wallet first');
      }
      
      // Get the account address
      const address = await signer.getAddress();
      
      // Check if the image file is valid
      if (!data.image || !data.image[0]) {
        throw createError('Please select an image file for your token');
      }
      
      const imageFile = data.image[0];
      console.log('Image file details:', {
        name: imageFile.name,
        type: imageFile.type,
        size: imageFile.size
      });
      
      // Validate file type
      if (!imageFile.type.startsWith('image/')) {
        throw createError('Please select a valid image file (JPEG, PNG, GIF, etc.)');
      }
      
      // Validate file size (max 5MB)
      if (imageFile.size > 5 * 1024 * 1024) {
        throw createError('Image file is too large. Maximum size is 5MB');
      }
      
      // Upload image to IPFS
      console.log('Uploading image to IPFS...');
      setStatus({ message: 'Uploading image to IPFS...', isError: false });
      
      let imageUrl;
      try {
        imageUrl = await uploadToIPFS(imageFile);
        console.log('Image uploaded successfully:', imageUrl);
        setStatus({ message: 'Image uploaded successfully! Deploying token...', isError: false });
      } catch (uploadError) {
        console.error('IPFS upload error:', uploadError);
        throw createError(`Failed to upload image: ${uploadError.message}`);
      }
      
      // Verify that we got a valid IPFS URL
      if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('ipfs://')) {
        throw createError('Invalid IPFS URL returned from upload. Please try again with a different image.');
      }
      
      // Extract token data
      const tokenName = data.name;
      const tokenSymbol = data.ticker;
      const tokenDescription = data.description;
      const initialSupply = data.initialSupply || "1000000"; // Default to 1 million if not specified
      
      console.log('Deploying new token...');
      // Deploy new token contract
      const result = await deployMemeToken(
        tokenName,
        tokenSymbol,
        initialSupply,
        tokenDescription,
        imageUrl,
        signer
      );
      
      if (result.success) {
        // Save token metadata and generate shortId
        const tokenData = {
          name: tokenName,
          symbol: tokenSymbol,
          description: tokenDescription,
          totalSupply: initialSupply,
          maxSupply: initialSupply * 10, // Default max supply is 10x initial supply
          contractAddress: result.contractAddress,
          imageFile: imageFile,
          imageUrl: imageUrl,
          owner: address
        };
        
        // Import tokenDataService dynamically to avoid circular dependencies
        const { saveTokenMetadata } = await import('../utils/tokenDataService');
        const { getShareableTokenLink } = await import('../utils/tokenLinkService');
        
        // Save token metadata and get enhanced data with shortId
        const enhancedTokenData = await saveTokenMetadata(tokenData);
        
        // Generate shareable link using the shortId
        const shareableLink = getShareableTokenLink(result.contractAddress);
        
        setStatus({
          message: `Token deployed successfully! Contract address: ${result.contractAddress}`,
          isError: false
        });
        
        // Navigate to token details page using the shareable link
        setTimeout(() => {
          navigate(shareableLink);
        }, 2000);
      } else {
        throw createError(result.error || 'Failed to deploy token');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus({
        message: error.message || 'An error occurred during deployment',
        isError: true
      });
    } finally {
      setIsDeploying(false);
    }
  };
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setValue('image', e.dataTransfer.files);
    }
  };
  
  const removeImage = () => {
    setValue('image', null);
    setPreview({
      show: false,
      imageUrl: null
    });
  };

  return (
    <FormContainer>
      <Title>Create Meme Token</Title>
      
      <WalletContainer>
        <WalletConnect onConnect={onWalletConnect} />
      </WalletContainer>
      
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <Label htmlFor="name">name</Label>
          <Input 
            id="name"
            type="text" 
            placeholder=""
            {...register('name', { required: 'Token name is required' })}
          />
          {errors.name && <Error>{errors.name.message}</Error>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="ticker">ticker</Label>
          <TickerInputContainer>
            <TickerPrefix>$</TickerPrefix>
            <TickerInput
              id="ticker"
              type="text"
              placeholder=""
              {...register('ticker', { required: 'Token ticker/symbol is required' })}
            />
          </TickerInputContainer>
          {errors.ticker && <Error>{errors.ticker.message}</Error>}
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="description">description</Label>
          <TextArea
            id="description"
            placeholder=""
            {...register('description')}
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="image">image or video</Label>
          <FileUploadContainer 
            isDragActive={isDragActive}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <FileInput
              id="image"
              type="file"
              accept="image/*,video/*"
              {...register('image', { required: 'Token image is required' })}
            />
            <FileUploadIcon isDragActive={isDragActive}>
              <UploadIcon />
            </FileUploadIcon>
            <FileUploadText isDragActive={isDragActive}>
              {isDragActive 
                ? 'Drop file here' 
                : 'Drag and drop an image or video'}
            </FileUploadText>
            <FileUploadButton type="button">
              Select File
            </FileUploadButton>
          </FileUploadContainer>
          {errors.image && <Error>{errors.image.message}</Error>}
        </InputGroup>
        
        {preview.show && (
          <PreviewContainer isVisible={true}>
            <PreviewCard>
              <PreviewTitle>Image Preview</PreviewTitle>
              <PreviewImageContainer>
                <PreviewImage src={preview.imageUrl} alt="Token Preview" />
                <RemoveImageButton type="button" onClick={removeImage}>
                  <CloseIcon />
                </RemoveImageButton>
              </PreviewImageContainer>
              <PreviewInfo>
                <p>{preview.fileName}</p>
                <p>{preview.fileSize}</p>
              </PreviewInfo>
            </PreviewCard>
          </PreviewContainer>
        )}

        <AdvancedOptions onClick={() => setShowAdvanced(!showAdvanced)}>
          Show more options <ChevronIcon isOpen={showAdvanced}>↓</ChevronIcon>
        </AdvancedOptions>
        
        {showAdvanced && (
          <InputGroup>
            <Label htmlFor="initialSupply">initial supply</Label>
            <Input 
              id="initialSupply"
              type="number" 
              placeholder="1000000"
              {...register('initialSupply', { 
                min: { value: 1, message: 'Supply must be at least 1' },
                max: { value: 1000000000, message: 'Supply cannot exceed 1 billion' }
              })}
            />
            {errors.initialSupply && <Error>{errors.initialSupply.message}</Error>}
          </InputGroup>
        )}
        
        <SubmitButton type="submit" disabled={isDeploying || !signer}>
          {isDeploying ? <><LoadingIcon /> Creating token...</> : 'Create Coin'}
        </SubmitButton>
      </Form>
      
      {status.message && (
        <Status isError={status.isError}>
          {status.isError ? <ErrorIcon /> : <SuccessIcon />}
          {status.message}
        </Status>
      )}
    </FormContainer>
  );
};

export default TokenCreator; 
