const { ethers } = require("hardhat");
const abi = require("../../../../artifacts/contracts/road_to_web3/week_02/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigInt);
}

async function main() {
  const [signer] = await ethers.getSigners();

  const contractAddress = "0x5a6447596284Aed8926c06af16d996799cafb314";
  const contractABI = abi.abi;

  const provider = ethers.provider;
  const contract = new hre.ethers.Contract(contractAddress, contractABI, signer);

  // Check starting balances.
  console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
  const contractBalance = await getBalance(provider, contract.address);
  console.log("current balance of contract: ", await getBalance(provider, contract.address), "ETH");

  // Withdraw funds if there are funds to withdraw.
  if (contractBalance !== "0.0") {
    console.log("withdrawing funds...");
    const withdrawTxn = await contract.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log("no funds to withdraw");
  }

  console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
