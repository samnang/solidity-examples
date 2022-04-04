const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Libraries", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("contracts/solidity_by_examples/23_libraries/MyContract.sol:MyContract");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  xit("Should be able to verify all variables", async function () {
    expect(await contract.callLibrary(2, 3)).to.equal(6);
  });
});
