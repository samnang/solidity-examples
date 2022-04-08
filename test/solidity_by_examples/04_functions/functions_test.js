const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Functions", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("contracts/getting_started_with_solidity/04_functions/MyContract.sol:MyContract");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variables", async function () {
    expect(await contract.getName()).to.equal("");

    await contract.setName("Hello Functions");
    expect(await contract.getName()).to.equal("Hello Functions");
  });
});
