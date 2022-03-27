const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Functions / MyContract", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("contracts/09_events/MyContract.sol:MyContract");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variables", async function () {
    await expect(contract.setName("John Doe")).to.emit(contract, "nameEvent").withArgs("John Doe");
  });
});
