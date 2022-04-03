const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Function Modifiers", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("contracts/07_function_modifiers/MyContract.sol:MyContract");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variables", async function () {
    await contract.setName("John Doe");
    expect(await contract.getName()).to.equal("John Doe");

    const [owner, other] = await ethers.getSigners();
    await expect(contract.connect(other).setName("Failed")).to.be.revertedWith("Not owner");
  });
});
