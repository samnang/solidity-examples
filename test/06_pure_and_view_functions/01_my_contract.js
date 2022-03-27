const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Functions / MyContract", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("contracts/06_pure_and_view_functions/MyContract.sol:MyContract");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variables", async function () {
    expect(await contract.getName()).to.equal("John Doe");
    expect(await contract.sum(1, 2)).to.equal(3);
  });
});
