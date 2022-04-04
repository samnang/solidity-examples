const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Error Handling", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("contracts/solidity_by_examples/10_error_handling/MyContract.sol:MyContract");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variables", async function () {
    await contract.deposit(100);

    expect(await contract.balance()).to.equal(100);
  });
});
