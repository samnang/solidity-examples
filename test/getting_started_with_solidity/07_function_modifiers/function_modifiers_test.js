const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Function Modifiers", function () {
  let contract;
  let owner, signer;

  beforeEach(async () => {
    [owner, signer] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory(
      "contracts/getting_started_with_solidity/07_function_modifiers/MyContract.sol:MyContract",
      owner
    );
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variable values", async function () {
    await contract.setName("John Doe");
    expect(await contract.getName()).to.equal("John Doe");

    await expect(contract.connect(signer).setName("Failed")).to.be.revertedWith("Not owner");
  });
});
