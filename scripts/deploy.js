const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // These values are placeholders and will be replaced by frontend values
  // during actual deployment from the frontend
  const tokenName = "MemeToken";
  const tokenSymbol = "MEME";
  const initialSupply = 1000000; // 1 million tokens
  const maxSupply = 10000000; // 10 million max supply
  const tokenImage = "ipfs://placeholder";
  
  const MemeToken = await hre.ethers.getContractFactory("MemeToken");
  const memeToken = await MemeToken.deploy(
    tokenName, 
    tokenSymbol, 
    initialSupply,
    maxSupply,
    tokenImage,
    deployer.address
  );
  
  await memeToken.deployed();
  
  console.log("MemeToken deployed to:", memeToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 