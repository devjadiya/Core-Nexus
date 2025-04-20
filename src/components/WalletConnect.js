import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

const Button = styled.button`
  background-color: ${props => props.buttonStyle ? '#0d6efd' : 'transparent'};
  color: ${props => props.buttonStyle ? 'white' : '#0d6efd'};
  border: ${props => props.buttonStyle ? 'none' : '1px solid #0d6efd'};
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background-color: ${props => props.buttonStyle ? '#0b5ed7' : 'rgba(13, 110, 253, 0.1)'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Address = styled.span`
  border-radius: 16px;
  padding: 8px 12px;
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NetworkBadge = styled.div`
  display: inline-flex;
  align-items: center;
  margin-left: 10px;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 12px;
  color: white;
  background-color: ${props => props.isCorrectNetwork ? '#22c55e' : '#ef4444'};

  &:before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.isCorrectNetwork ? '#22c55e' : '#ef4444'};
    margin-right: 5px;
    box-shadow: 0 0 5px ${props => props.isCorrectNetwork ? '#22c55e' : '#ef4444'};
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-top: 8px;
`;

const WalletConnect = ({ onConnect, buttonStyle }) => {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [networkName, setNetworkName] = useState('');
  const [error, setError] = useState('');
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  // Check if the network is Arbitrum Sepolia
  const checkNetwork = async (provider) => {
    try {
      const network = await provider.getNetwork();
      const chainId = network.chainId;
      
      // Arbitrum Sepolia chainId is 421614
      const isArbSepoliaNetwork = chainId === 421614;
      setIsCorrectNetwork(isArbSepoliaNetwork);
      
      // Set network name for display
      if (isArbSepoliaNetwork) {
        setNetworkName('Arbitrum Sepolia');
      } else {
        setNetworkName(network.name === 'unknown' ? `Chain ID: ${chainId}` : network.name);
      }
      
      return isArbSepoliaNetwork;
    } catch (error) {
      console.error('Error checking network:', error);
      return false;
    }
  };

  // Handle network change
  const handleNetworkChange = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x66EEE' }] // 421614 in hex
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
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
        } catch (addError) {
          console.error('Error adding network:', addError);
          setError('Failed to add Arbitrum Sepolia network. Please add it manually.');
        }
      } else {
        console.error('Failed to switch network:', switchError);
        setError('Failed to switch to Arbitrum Sepolia network.');
      }
    }
  };

  // Connect wallet with heavy rate limit protection
  const connectWallet = async () => {
    if (connectionAttempts > 3) {
      setError('Too many connection attempts. Please refresh the page and try again.');
      setConnectionAttempts(0);
      return;
    }

    setIsConnecting(true);
    setError('');
    
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask not detected. Please install MetaMask to continue.');
      }
      
      try {
        // Simple direct connection attempt with no retries
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts'
        });
        
        if (accounts && accounts.length > 0) {
          // Get the provider and signer
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await checkNetwork(provider);
          
          // Set account
          const address = accounts[0];
          setAccount(address);
          
          // Get signer
          const signer = provider.getSigner();
          
          // Call the onConnect callback with the signer
          if (onConnect) {
            onConnect(signer);
          }
          
          // Set up event listeners after successful connection
          setupEventListeners(provider);
          
          return;
        }
      } catch (error) {
        // Handle rate limiting errors
        if (error.message && (error.message.includes('rate limit') || error.message.includes('request limit exceeded'))) {
          console.log('Rate limited during wallet connection');
          setError('MetaMask is rate limited. Please wait a minute before trying again, or refresh the page.');
          setConnectionAttempts(prev => prev + 1);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Connection error:', error);
      setError(error.message || 'Failed to connect wallet');
      setConnectionAttempts(prev => prev + 1);
    } finally {
      setIsConnecting(false);
    }
  };

  // Setup event listeners - only called after successful connection
  const setupEventListeners = (provider) => {
    // Setup listeners for account and chain changes
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        
        if (onConnect) {
          onConnect(provider.getSigner());
        }
      } else {
        setAccount(null);
      }
    });
    
    window.ethereum.on('chainChanged', () => {
      // Refresh on chain change
      window.location.reload();
    });
  };

  // Cleanup listeners
  useEffect(() => {
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  return (
    <div>
      {account ? (
        <div>
          <Address>
            {account.substring(0, 6)}...{account.substring(account.length - 4)}
            <NetworkBadge isCorrectNetwork={isCorrectNetwork}>
              {isCorrectNetwork ? 'Arbitrum Sepolia' : networkName}
            </NetworkBadge>
          </Address>
          
          {!isCorrectNetwork && (
            <Button 
              onClick={handleNetworkChange} 
              style={{ marginTop: '8px' }}
              buttonStyle={buttonStyle}
            >
              Switch to Arbitrum Sepolia
            </Button>
          )}
        </div>
      ) : (
        <Button 
          onClick={connectWallet} 
          disabled={isConnecting} 
          buttonStyle={buttonStyle}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default WalletConnect; 