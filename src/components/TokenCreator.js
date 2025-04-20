import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import WalletConnect from './WalletConnect';
import { uploadToIPFS, updateTokenImage, DEPLOYED_CONTRACT_ADDRESS } from '../utils/deployContract';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    color: #888;
    font-size: 16px;
  }
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(106, 90, 205, 0.3);
    border-color: #673ab7;
  }
`;

const Error = styled.p`
  color: #e53935;
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
  background-color: #673ab7;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  margin-top: 15px;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #5e35b1;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  svg {
    font-size: 20px;
  }
`;

const Status = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  ${props => props.isError 
    ? 'background-color: #ffebee; color: #c62828; border: 1px solid #ffcdd2;' 
    : 'background-color: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9;'
  }
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  svg {
    font-size: 20px;
  }
`;

const WalletContainer = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const PreviewCard = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  border: 1px dashed #ccc;
  display: ${props => props.show ? 'block' : 'none'};
`;

const PreviewTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 10px;
  color: #555;
`;

const PreviewImageContainer = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PreviewInfo = styled.div`
  margin-top: 15px;
  text-align: center;
  
  p {
    margin: 5px 0;
    font-size: 14px;
  }
  
  strong {
    font-weight: 600;
    color: #333;
  }
`;

// Icon components
const LoadingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spinner">
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
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const TokenCreator = () => {
  const [signer, setSigner] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [status, setStatus] = useState({ message: '', isError: false });
  const [preview, setPreview] = useState({
    show: false,
    imageUrl: null
  });
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit,
    watch,
    formState: { errors } 
  } = useForm();

  // Watch form values for preview
  const watchImage = watch('image');

  // Handle image preview
  React.useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(prev => ({
          ...prev,
          show: true,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  }, [watchImage]);

  const onWalletConnect = (signer) => {
    setSigner(signer);
  };

  const onSubmit = async (data) => {
    if (!signer) {
      setStatus({
        message: 'Please connect your wallet first',
        isError: true
      });
      return;
    }

    try {
      setIsDeploying(true);
      setStatus({ message: 'Uploading image to IPFS...', isError: false });

      // Upload image to IPFS
      const imageUrl = await uploadToIPFS(data.image[0]);
      
      setStatus({ message: 'Updating token image...', isError: false });
      
      // Update token image on already deployed contract
      const result = await updateTokenImage(imageUrl, signer);

      if (result.success) {
        setStatus({ 
          message: `Token image updated successfully!`, 
          isError: false 
        });
        
        // Redirect to token details page
        navigate(`/token/${DEPLOYED_CONTRACT_ADDRESS}`);
      } else {
        setStatus({ 
          message: `Update failed: ${result.error}`, 
          isError: true 
        });
      }
    } catch (error) {
      console.error('Error updating token:', error);
      setStatus({ 
        message: `Error: ${error.message}`, 
        isError: true 
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <FormContainer>
      <Title>Update Meme Token Image</Title>
      
      <WalletContainer>
        <WalletConnect onConnect={onWalletConnect} />
      </WalletContainer>
      
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <Label>
            Token Image <InfoIcon />
          </Label>
          <Input 
            type="file" 
            accept="image/*" 
            {...register('image', { required: 'Token image is required' })} 
          />
          {errors.image && <Error>{errors.image.message}</Error>}
        </InputGroup>
        
        {preview.show && (
          <PreviewCard show={preview.show}>
            <PreviewTitle>Image Preview</PreviewTitle>
            <PreviewImageContainer>
              {preview.imageUrl ? (
                <PreviewImage src={preview.imageUrl} alt="Token Preview" />
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              )}
            </PreviewImageContainer>
            <PreviewInfo>
              <p>This image will replace the current token image.</p>
            </PreviewInfo>
          </PreviewCard>
        )}
        
        <SubmitButton type="submit" disabled={isDeploying || !signer}>
          {isDeploying ? <><LoadingIcon /> Updating Token...</> : 'Update Token Image'}
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