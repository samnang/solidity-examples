const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Functions / MyContract", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("contracts/04_functions/01_MyContract.sol:MyContract");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variables", async function () {
    expect(await contract.getName()).to.equal("");

    await contract.setName("Hello Functions");
    expect(await contract.getName()).to.equal("Hello Functions");
  });
});
