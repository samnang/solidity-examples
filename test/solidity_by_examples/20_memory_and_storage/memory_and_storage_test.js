const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Memory and Storage", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("contracts/solidity_by_examples/20_memory_and_storage/MyContract.sol:MyContract");
    contract = await Contract.deploy("Doe", "John");
    await contract.deployed();
  });

  it("Should be able to verify all variables", async function () {
    expect(await contract.fullname()).to.equal("John Doe");
  });
});
