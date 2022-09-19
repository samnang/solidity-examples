const { ethers } = require("hardhat");

async function getBalance(address) {
  const balanceBigtInt = await ethers.provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigtInt);
}

async function printBalances(addresses) {
  for (let index = 0; index < addresses.length; index++) {
    const element = addresses[index];
    console.log(`Address ${index} balance: `, await getBalance(element));
  }
}

async function printMemos(memos) {
  memos.forEach((memo) => {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  });
}

async function main() {
  const [owner, tipper, tipper2, tipper3] = await ethers.getSigners();

  const contractFactory = await ethers.getContractFactory(
    "contracts/road_to_web3/week_02/BuyMeACoffee.sol:BuyMeACoffee",
    owner
  );
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log("BuyMeACoffee deployed to:", contract.address);

  // Check balances before the coffee purchase.
  const addresses = [owner.address, tipper.address, contract.address];
  console.log("== start ==");
  await printBalances(addresses);

  // Buy the owner a few coffees.
  const tip = { value: ethers.utils.parseEther("1") };
  await contract.connect(tipper).buyCoffee("Carolina", "You're the best!", tip);
  await contract.connect(tipper2).buyCoffee("Vitto", "Amazing teacher", tip);
  await contract.connect(tipper3).buyCoffee("Kay", "I love my Proof of Knowledge", tip);

  // Check balances after the coffee purchase.
  console.log("== bought coffee ==");
  await printBalances(addresses);

  // Withdraw.
  await contract.connect(owner).withdrawTips();

  // Check balances after withdrawal.
  console.log("== withdrawTips ==");
  await printBalances(addresses);

  // Check out the memos.
  console.log("== memos ==");
  const memos = await contract.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
