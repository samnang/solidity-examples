const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Contract Cleanup", function () {
  let contract;
  let owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("contracts/solidity_by_examples/19_contract_cleanup/MyContract.sol:MyContract", owner);
    contract = await Contract.deploy({value: ethers.utils.parseEther("1")});
    await contract.deployed();
  });

  it("Should be able to verify all variables", async function () {
    const oldBalance = await contract.provider.getBalance(owner.address)

    await contract.kill();

    const newBalance = await contract.provider.getBalance(owner.address)
    const result = BigInt(newBalance) > BigInt(oldBalance);
    expect(result).to.be.true;
  });
});
