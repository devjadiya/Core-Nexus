import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import styled from 'styled-components';
import Button from './Button';

const StyledButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const WalletStatus = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.1);
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:before {
    content: "⚠️";
    margin-right: 8px;
  }
`;

const ConnectedInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NetworkBadge = styled.div`
  background-color: #673ab7;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 10px;
  margin-top: 6px;
`;

const WalletConnect = ({ onConnect, buttonStyle = false }) => {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isArbitrumSepolia, setIsArbitrumSepolia] = useState(false);
  const [networkName, setNetworkName] = useState('');

  useEffect(() => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      // Check if already connected
      provider.listAccounts().then(accounts => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setSigner(provider.getSigner());
          checkNetwork(provider);
          
          if (onConnect) {
            onConnect(provider.getSigner());
          }
        }
      });

      // Handle account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setSigner(provider.getSigner());
          
          if (onConnect) {
            onConnect(provider.getSigner());
          }
        } else {
          setAccount('');
          setSigner(null);
        }
      });

      // Handle chain changes
      window.ethereum.on('chainChanged', () => {
        checkNetwork(provider);
      });
    }
    
    return () => {
      // Clean up event listeners
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, [onConnect]);

  const checkNetwork = async (provider) => {
    try {
      const network = await provider.getNetwork();
      setIsArbitrumSepolia(network.chainId === 421614);
      
      // Set network name for display
      if (network.chainId === 421614) {
        setNetworkName('Arbitrum Sepolia');
      } else if (network.chainId === 1) {
        setNetworkName('Ethereum Mainnet');
      } else if (network.chainId === 42161) {
        setNetworkName('Arbitrum One');
      } else {
        setNetworkName(network.name);
      }
    } catch (error) {
      console.error('Error checking network:', error);
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      if (window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Check if connected to Arbitrum Sepolia
        await checkNetwork(provider);
        
        // Switch to Arbitrum Sepolia if not on it
        if (!isArbitrumSepolia) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x66EEE', // 421614 in hex
                chainName: 'Arbitrum Sepolia',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
                blockExplorerUrls: ['https://sepolia.arbiscan.io/']
              }]
            });
            
            // Check network again after switch
            await checkNetwork(provider);
          } catch (switchError) {
            console.error('Failed to switch network:', switchError);
          }
        }
        
        // Set account and signer
        setAccount(accounts[0]);
        const signer = provider.getSigner();
        setSigner(signer);
        
        // Call the onConnect callback
        if (onConnect) {
          onConnect(signer);
        }
      } else {
        window.open('https://metamask.io/download/', '_blank');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Button style for the navbar
  if (buttonStyle) {
    if (!account) {
      return (
        <Button 
          text={isConnecting ? "Connecting..." : "Connect Wallet"} 
          onClick={connectWallet}
          disabled={isConnecting}
        />
      );
    } else {
      return (
        <ConnectedInfo>
          <Button 
            text={formatAddress(account)} 
            disabled={true}
          />
          {!isArbitrumSepolia && (
            <NetworkBadge>
              Switch to Arbitrum Sepolia
            </NetworkBadge>
          )}
        </ConnectedInfo>
      );
    }
  }

  // Standard style for forms
  return (
    <div>
      {!account ? (
        <StyledButton onClick={connectWallet} disabled={isConnecting}>
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </StyledButton>
      ) : (
        <div>
          <StyledButton disabled>Connected: {formatAddress(account)}</StyledButton>
          {networkName && (
            <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '12px' }}>
              Network: {networkName}
            </div>
          )}
          {!isArbitrumSepolia && (
            <WalletStatus>
              Please switch to Arbitrum Sepolia network
            </WalletStatus>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 