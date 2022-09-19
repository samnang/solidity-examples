const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const contractFactory = await ethers.getContractFactory(
    "contracts/road_to_web3/week_01/NFT_ERC721.sol:MyNFTToken",
    deployer
  );
  const contract = await contractFactory.deploy();
  await contract.deployed();

  console.log(`MyNFTToken is deployed to ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
