import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import WalletConnect from './WalletConnect';
import { ethers } from 'ethers';
import { getTokenInfo, mintTokens, DEPLOYED_CONTRACT_ADDRESS } from '../utils/deployContract';
import MemeTokenArtifact from '../artifacts/contracts/MemeToken.sol/MemeToken.json';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #673ab7, #9c27b0, #e91e63);
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-weight: 700;
  
  span {
    color: #673ab7;
  }
`;

const TokenImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 16px;
  margin: 0 auto 30px;
  display: block;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const InfoCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #555;
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    color: #888;
    font-size: 16px;
  }
`;

const InfoValue = styled.span`
  color: #333;
  word-break: break-all;
  font-family: monospace;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
`;

const ValueText = styled.span`
  font-weight: ${props => props.bold ? '600' : 'normal'};
  color: ${props => props.color || '#333'};
`;

const ArbitrumLink = styled.a`
  display: inline-block;
  color: #673ab7;
  text-decoration: none;
  padding: 8px 16px;
  background-color: rgba(103, 58, 183, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: rgba(103, 58, 183, 0.2);
    transform: translateY(-2px);
  }
  
  svg {
    font-size: 16px;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 60px;
  font-size: 18px;
  color: #555;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Error = styled.div`
  text-align: center;
  padding: 25px;
  color: #d32f2f;
  background-color: #ffebee;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  svg {
    font-size: 24px;
  }
`;

const TokenStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  flex: 1;
  min-width: 120px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  h3 {
    font-size: 16px;
    color: #666;
    margin-bottom: 10px;
    font-weight: 500;
  }
  
  p {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin: 0;
  }
  
  small {
    color: #888;
    font-size: 14px;
  }
`;

const ActionButton = styled.a`
  display: inline-block;
  background-color: #673ab7;
  color: white;
  font-weight: 600;
  text-align: center;
  padding: 12px 25px;
  border-radius: 8px;
  text-decoration: none;
  margin-top: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #5e35b1;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ShareSection = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const ShareButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;
`;

const ShareButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${props => props.bg || '#333'};
  color: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

// Icons
const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const LoadingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#673ab7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spinner">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 6v6l4 2"></path>
    <style jsx>{`
      .spinner {
        animation: spin 1.5s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </svg>
);

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
  </svg>
);

const OwnerSection = styled.div`
  margin-top: 20px;
`;

const MintForm = styled.form`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  display: ${props => props.show ? 'block' : 'none'};
`;

const MintRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const MintInputGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const MintInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

const MintButton = styled.button`
  background-color: #673ab7;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #5e35b1;
  }
  
  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }
`;

const MintStatus = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: ${props => props.error ? '#d32f2f' : '#4caf50'};
`;

const TokenSupplyBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin: 15px 0;
  overflow: hidden;
  position: relative;
`;

const SupplyFill = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background: linear-gradient(90deg, #673ab7, #9c27b0);
  border-radius: 5px;
`;

const SupplyText = styled.div`
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-top: 5px;
`;

const Status = styled.div`
  color: ${props => props.isError ? '#d32f2f' : '#4caf50'};
  font-size: 14px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    font-size: 20px;
  }
`;

const SuccessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 0-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const LoadingMessage = styled.div`
  text-align: center;
  padding: 30px;
  font-size: 18px;
  color: #555;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #d32f2f;
  background-color: #ffebee;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  color: #673ab7;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Header = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const WalletContainer = styled.div`
  margin: 20px auto;
  max-width: 300px;
`;

const TokenCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  background-color: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const TokenImageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f5f5f5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
`;

const TokenInfo = styled.div`
  flex: 2;
`;

const TokenName = styled.h2`
  font-size: 28px;
  margin: 0 0 5px 0;
  color: #333;
`;

const TokenSymbol = styled.h3`
  font-size: 18px;
  color: #673ab7;
  margin: 0 0 20px 0;
  font-weight: 500;
`;

const DetailItem = styled.div`
  margin-bottom: 15px;
`;

const DetailLabel = styled.div`
  font-weight: 600;
  margin-bottom: 5px;
  color: #555;
`;

const DetailValue = styled.div`
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  font-family: monospace;
  word-break: break-all;
`;

const MintContainer = styled.div`
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const MintTitle = styled.h4`
  margin: 0 0 15px 0;
  color: #333;
`;

const TokenDetails = () => {
  const [signer, setSigner] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mintAmount, setMintAmount] = useState(100);
  const [mintStatus, setMintStatus] = useState('');
  const { address } = useParams();

  const onWalletConnect = (newSigner) => {
    setSigner(newSigner);
  };

  useEffect(() => {
    const fetchTokenDetails = async () => {
      setLoading(true);
      try {
        // Import the token data service
        const { getTokenDataByShortId } = await import('../utils/tokenDataService');
        
        // Use the shortId from the URL params to get the token data
        const tokenData = await getTokenDataByShortId(address);
        
        if (!tokenData) {
          throw new Error('Token not found. The link might be invalid or the token does not exist.');
        }
        
        // Get token data from the blockchain for the most up-to-date information
        const contractAddress = tokenData.contractAddress;
        let tokenInfo;
        
        try {
          // Try to get the blockchain data
          tokenInfo = await getTokenInfo(signer?.provider || window.ethereum);
        } catch (error) {
          console.warn('Could not fetch blockchain data, using stored data', error);
          // Fallback to our stored data if blockchain is unavailable
          tokenInfo = {
            success: true,
            tokenName: tokenData.name,
            tokenSymbol: tokenData.symbol,
            totalSupply: tokenData.totalSupply,
            maxSupply: tokenData.maxSupply,
            imageUrl: tokenData.imageUrl,
            imageGatewayUrl: tokenData.imageGatewayUrl,
            isMintable: true,
            contractAddress: contractAddress
          };
        }
        
        if (tokenInfo.success) {
          // Transform the tokenInfo format to be consistent
          setToken({
            name: tokenInfo.tokenName,
            symbol: tokenInfo.tokenSymbol,
            totalSupply: tokenInfo.totalSupply,
            maxSupply: tokenInfo.maxSupply,
            image: tokenInfo.imageGatewayUrl || tokenData.imageGatewayUrl, // Prefer HTTP URL for display
            contractAddress: contractAddress,
            isMintable: tokenInfo.isMintable,
            shortId: address
          });
        } else {
          throw new Error('Failed to fetch token information from the blockchain');
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching token details:', err);
        setError(err.message || 'Failed to load token details. Please check the token ID.');
      } finally {
        setLoading(false);
      }
    };

    fetchTokenDetails();
  }, [address, signer]);

  const handleMint = async () => {
    if (!signer) {
      setMintStatus('Please connect your wallet first');
      return;
    }

    try {
      setMintStatus('Minting tokens...');
      // Get the actual contract address from our stored mapping
      const { getContractAddressFromShortId } = await import('../utils/tokenLinkService');
      const contractAddress = getContractAddressFromShortId(address);
      
      if (!contractAddress) {
        throw new Error('Invalid token ID');
      }
      
      const result = await mintTokens(mintAmount, contractAddress, signer);
      
      if (result.success) {
        setMintStatus(`Successfully minted ${mintAmount} tokens!`);
        // Refresh token data
        const tokenInfo = await getTokenInfo(signer.provider);
        if (tokenInfo.success) {
          setToken(prevToken => ({
            ...prevToken,
            totalSupply: tokenInfo.totalSupply
          }));
        }
      } else {
        setMintStatus(`Minting failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error minting tokens:', error);
      setMintStatus(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading token details...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <BackLink to="/">← Back to token creator</BackLink>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Token Details</Title>
        <WalletContainer>
          <WalletConnect onConnect={onWalletConnect} />
        </WalletContainer>
      </Header>

      {token && (
        <TokenCard>
          <TokenImageContainer>
            {token.image ? (
              <TokenImage src={token.image} alt={token.name} />
            ) : (
              <NoImage>No image available</NoImage>
            )}
          </TokenImageContainer>
          
          <TokenInfo>
            <TokenName>{token.name}</TokenName>
            <TokenSymbol>{token.symbol}</TokenSymbol>
            
            <DetailItem>
              <DetailLabel>Contract Address:</DetailLabel>
              <DetailValue>
                <a href={`https://goerli.etherscan.io/address/${token.contractAddress}`} 
                   target="_blank" 
                   rel="noopener noreferrer">
                  {token.contractAddress.substring(0, 6)}...{token.contractAddress.substring(38)}
                </a>
              </DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Total Supply:</DetailLabel>
              <DetailValue>{token.totalSupply} {token.symbol}</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Max Supply:</DetailLabel>
              <DetailValue>{token.maxSupply} {token.symbol}</DetailValue>
            </DetailItem>
            
            <MintContainer>
              <MintTitle>Mint Tokens</MintTitle>
              <MintInputGroup>
                <MintInput 
                  type="number" 
                  value={mintAmount} 
                  onChange={(e) => setMintAmount(Math.max(1, parseInt(e.target.value) || 0))}
                  min="1"
                />
                <MintButton onClick={handleMint} disabled={!signer}>
                  Mint Tokens
                </MintButton>
              </MintInputGroup>
              {mintStatus && <MintStatus>{mintStatus}</MintStatus>}
            </MintContainer>
          </TokenInfo>
        </TokenCard>
      )}
      
      <BackLink to="/">← Back to token updater</BackLink>
    </Container>
  );
};

export default TokenDetails; 