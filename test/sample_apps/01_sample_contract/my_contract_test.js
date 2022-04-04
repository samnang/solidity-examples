const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Sample Apps / Sample Contract", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("contracts/sample_apps/01_sample_contract/MyContract.sol:MyContract");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variables", async function () {
    await contract.setAge(40);
    await contract.setName("John Doe");

    expect(await contract.getAge()).to.equal(40);
    expect(await contract.getName()).to.equal("John Doe");
  });
});
