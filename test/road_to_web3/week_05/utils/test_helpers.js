const { network } = require("hardhat");

async function moveTime(amount) {
  await network.provider.send("evm_increaseTime", [amount]);
}

async function moveBlocks(amount) {
  for (let index = 0; index < amount; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
}

async function getLatestBlockTs() {
  let latestBlock = await ethers.provider.getBlock("latest");
  return latestBlock.timestamp;
}

module.exports = {
  moveTime,
  moveBlocks,
  getLatestBlockTs,
};
