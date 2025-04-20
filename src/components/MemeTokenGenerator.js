import React from 'react';
import styled from 'styled-components';
import TokenCreator from './TokenCreator';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  position: relative;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  font-size: 3rem;
  color: #333;
  font-weight: 800;
  background: linear-gradient(90deg, #673ab7 0%, #9c27b0 50%, #e91e63 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.h2`
  text-align: center;
  margin-bottom: 40px;
  font-size: 1.5rem;
  color: #666;
  font-weight: 400;
`;

const Description = styled.p`
  text-align: center;
  margin-bottom: 40px;
  font-size: 1.2rem;
  color: #555;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto 40px;
`;

const Features = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 60px;
`;

const Feature = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 16px;
  flex: 1;
  min-width: 250px;
  max-width: 300px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.accentColor || '#673ab7'};
  }
  
  h3 {
    margin-bottom: 16px;
    color: #333;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  p {
    color: #666;
    font-size: 1rem;
    line-height: 1.5;
  }
  
  svg {
    color: ${props => props.accentColor || '#673ab7'};
  }
`;

const Steps = styled.div`
  margin-bottom: 60px;
`;

const StepsTitle = styled.h2`
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
  color: #333;
`;

const StepsList = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Step = styled.div`
  display: flex;
  margin-bottom: 30px;
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:not(:last-child):after {
    content: '';
    position: absolute;
    top: 50px;
    left: 25px;
    width: 2px;
    height: calc(100% - 30px);
    background-color: #e0e0e0;
  }
`;

const StepNumber = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #673ab7;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
`;

const StepContent = styled.div`
  padding-left: 20px;
  
  h3 {
    margin-bottom: 10px;
    font-size: 1.3rem;
    color: #333;
  }
  
  p {
    color: #666;
    line-height: 1.5;
  }
`;

// Icons
const TokenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 6v12"></path>
    <path d="M8 12h8"></path>
  </svg>
);

const StorageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
    <path d="M18 14h-8"></path>
    <path d="M15 18h-5"></path>
    <path d="M10 6h8v4h-8z"></path>
  </svg>
);

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
    <path d="M18 12a2 2 0 0 0 0 4h2a2 2 0 0 0 0-4h-2z"></path>
  </svg>
);

const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18"></path>
    <path d="M18.7 8.7l-2.1-2.1"></path>
    <path d="M5.3 17.3l2.1 2.1"></path>
    <path d="M16.6 20.4l2.1-2.1"></path>
    <path d="M7.4 3.6L5.3 5.7"></path>
    <path d="M3 12h18"></path>
  </svg>
);

const MemeTokenGenerator = () => {
  return (
    <Container>
      <Title>Meme Token Generator</Title>
      <Subtitle>Create your own meme token in seconds 🚀</Subtitle>
      
      <Description>
        Launch your custom ERC20 token with a unique name, symbol, and meme image.
        Deploy directly to Arbitrum Sepolia testnet with just a few clicks - no coding required!
      </Description>
      
      <Features>
        <Feature accentColor="#673ab7">
          <h3><TokenIcon /> Custom ERC20 Token</h3>
          <p>Create a standard ERC20 token with your chosen name, symbol, and total supply deployed directly to Arbitrum Sepolia.</p>
        </Feature>
        
        <Feature accentColor="#e91e63">
          <h3><StorageIcon /> IPFS Image Hosting</h3>
          <p>Your token image is automatically uploaded to IPFS for permanent, decentralized storage.</p>
        </Feature>
        
        <Feature accentColor="#4caf50">
          <h3><WalletIcon /> MetaMask Integration</h3>
          <p>Simply connect your MetaMask wallet to deploy your token with no private key requirements.</p>
        </Feature>
      </Features>
      
      <Steps>
        <StepsTitle>How It Works</StepsTitle>
        <StepsList>
          <Step>
            <StepNumber>1</StepNumber>
            <StepContent>
              <h3>Connect Your Wallet</h3>
              <p>Click the "Connect Wallet" button to connect your MetaMask wallet. Make sure you're on the Arbitrum Sepolia network.</p>
            </StepContent>
          </Step>
          
          <Step>
            <StepNumber>2</StepNumber>
            <StepContent>
              <h3>Fill Token Details</h3>
              <p>Enter your token name, symbol, supply amount, and upload a meme image that represents your token.</p>
            </StepContent>
          </Step>
          
          <Step>
            <StepNumber>3</StepNumber>
            <StepContent>
              <h3>Create Your Token</h3>
              <p>Click "Create Token" and approve the transaction in your wallet. Your image will be uploaded to IPFS and your token contract will be deployed.</p>
            </StepContent>
          </Step>
          
          <Step>
            <StepNumber>4</StepNumber>
            <StepContent>
              <h3>Share Your Token</h3>
              <p>Once deployed, you'll be redirected to your token's details page where you can share it with the world!</p>
            </StepContent>
          </Step>
        </StepsList>
      </Steps>
      
      <TokenCreator />
    </Container>
  );
};

export default MemeTokenGenerator; 