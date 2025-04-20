# Meme Token Generator

A simple platform for creating custom ERC20 tokens with meme images, similar to pump.fun. Deploy your own meme tokens on Arbitrum Sepolia testnet in seconds!

## Features

- **ERC20 Token Creation**: Create custom tokens with your chosen name, symbol, and supply
- **IPFS Image Storage**: Upload and store token images on IPFS
- **MetaMask Integration**: Connect with MetaMask to deploy tokens
- **Arbitrum Sepolia**: Deployed to Arbitrum Sepolia testnet for fast and cheap transactions
- **Token Details Page**: View your token details after creation

## Tech Stack

- **Frontend**: React.js with Next.js
- **Smart Contracts**: Solidity
- **Blockchain Interaction**: ethers.js
- **IPFS Storage**: NFT.Storage
- **Form Handling**: react-hook-form
- **Styling**: styled-components
- **Smart Contract Development**: Hardhat

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MetaMask extension installed in your browser
- Arbitrum Sepolia testnet ETH (available from faucets)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd meme-token-generator
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Add your NFT.Storage API key
   - Register at [nft.storage](https://nft.storage)
   - Get your API key
   - Update the key in `src/utils/deployContract.js`

4. Start the development server
   ```
   npm start
   ```

## How to Use

1. Navigate to `/create` to access the token creation page
2. Connect your MetaMask wallet (ensure you're on Arbitrum Sepolia testnet)
3. Fill in the token details:
   - Token Name
   - Token Symbol
   - Initial Supply
   - Upload a token image
4. Click "Create Token"
5. Confirm the transaction in MetaMask
6. Once deployed, you'll be redirected to your token's details page

## Smart Contract

The MemeToken contract is a simple ERC20 token with the following features:
- Standard ERC20 functionality (transfer, balanceOf, etc.)
- Token image stored as IPFS hash
- No ownership or pausing features to keep it simple

## Deployment

The contract is deployed to Arbitrum Sepolia testnet. The frontend automatically handles deployment through the connected MetaMask wallet.

## License

MIT
