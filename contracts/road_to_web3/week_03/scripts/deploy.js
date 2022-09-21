const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const contractFactory = await ethers.getContractFactory(
    "contracts/road_to_web3/week_03/ChainBattles.sol:ChainBattles",
    deployer
  );
  const contract = await contractFactory.deploy();
  await contract.deployed();

  console.log(`ChainBattles is deployed to ${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
