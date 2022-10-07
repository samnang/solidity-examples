const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const contractFactory = await ethers.getContractFactory(
    "contracts/road_to_web3/week_05/BullnBear.sol:BullnBear",
    deployer
  );

  // https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#goerli-testnet
  const contract = await contractFactory.deploy(
    10, // 10 sec
    3709, // VRF's subscription id
    "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // Goerli keyhash
    "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D", // Coordinator address
    "0xA39434A63A52E749F02807ae27335515BA4b07F7" // Goerli Testnet Price Feed
  );
  await contract.deployed();

  console.log(`BullnBear is deployed to ${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
