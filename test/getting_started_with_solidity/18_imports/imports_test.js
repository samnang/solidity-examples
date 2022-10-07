const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Getting Started with Solidity / Imports", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory(
      "contracts/getting_started_with_solidity/18_imports/MyContract.sol:MyContract"
    );
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variable values", async function () {
    expect(await contract.callOtherContract(2, 3)).to.equal(5);
  });
});
