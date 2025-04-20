# Meme Token Creator

A web application for creating and managing custom ERC20 tokens on the Ethereum blockchain. This project allows users to:

1. Create custom ERC20 tokens with a name, symbol, description, and image
2. Deploy these tokens to the Ethereum blockchain (via Arbitrum Sepolia testnet)
3. Generate shareable links with short IDs for easy token sharing
4. View token details and interact with tokens through a web interface

## Features

- **Token Creation**: Create custom ERC20 tokens with configurable parameters
- **IPFS Integration**: Token images are stored on IPFS using Pinata
- **Shareable Links**: Generate short, user-friendly links for sharing tokens
- **Blockchain Integration**: Deploy tokens to Ethereum and interact with them
- **Responsive UI**: Modern, responsive user interface for desktop and mobile

## Technical Implementation

### Dynamic Links with nanoid

The application uses [nanoid](https://github.com/ai/nanoid) to generate short, unique, URL-friendly IDs for each deployed token. This provides several benefits:

- Shorter, more user-friendly URLs compared to full contract addresses
- Easier sharing and memorability
- Maintains a mapping between short IDs and actual contract addresses

### Token Storage Flow

1. **Token Creation**:
   - User fills out the token creation form with name, symbol, description, initial supply, and uploads an image
   - The image is uploaded to IPFS via Pinata, generating an IPFS CID
   - The token contract is deployed to the blockchain with the provided parameters

2. **ID Generation**:
   - Upon successful deployment, a short ID is generated using nanoid
   - A mapping is maintained between the contract address and the short ID
   - The token metadata and mapping are stored (in a real production app, this would be in a database)

3. **Token Sharing**:
   - Users receive a shareable link with the format `/token/{shortId}`
   - When someone visits this link, the app looks up the contract address using the short ID
   - The token details are fetched from the blockchain using the contract address

### IPFS Integration

Token images are stored on IPFS using Pinata, providing:

- Decentralized, permanent storage for token imagery
- Content-addressable links that ensure image integrity
- Gateway URLs for easy viewing in standard browsers

## Development Setup

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MetaMask or another Ethereum wallet
- Pinata account and JWT token

### Environment Variables

Create a `.env` file with:

```
REACT_APP_PINATA_JWT=your_pinata_jwt_here
```

### Getting a Pinata JWT Token

1. Sign up for a free account at [Pinata](https://app.pinata.cloud/)
2. After login, go to the "API Keys" section in the left sidebar
3. Click "New Key" button
4. Give your key a name and select appropriate permissions (at minimum "pinFileToIPFS")
5. Copy the JWT token (not the API Key or Secret) and add it to your `.env` file

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

## Deployment Flow

1. User connects their wallet
2. User fills out token details and uploads an image
3. Upon submission:
   - Image is uploaded to IPFS
   - Token contract is deployed to blockchain
   - Short ID is generated and mapped to contract address
   - User is redirected to token details page with short ID URL

## Future Improvements

- Backend database for persistent storage of token mappings
- Social sharing features for token links
- Token analytics and tracking
- Multi-chain support for deploying to different networks

## Tech Stack

- **Frontend**: React.js with Next.js
- **Smart Contracts**: Solidity
- **Blockchain Interaction**: ethers.js
- **IPFS Storage**: Pinata
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

3. Add your Pinata JWT token
   - Register at [Pinata](https://app.pinata.cloud)
   - Get your JWT token from the API Keys section
   - Create a `.env` file in the root directory with the following content:
     ```
     REACT_APP_PINATA_JWT=your_jwt_token_here
     ```

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

## Security

- API keys and sensitive information are stored in environment variables and not committed to the repository
- The `.env` file is included in `.gitignore` to prevent accidental exposure of secrets

## License

MIT
