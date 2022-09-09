const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Visibility", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory(
      "contracts/getting_started_with_solidity/05_visibility/MyContract.sol:MyContract"
    );
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variable values", async function () {
    await contract.setName("John Doe");
    expect(await contract.getName()).to.equal("John Doe");

    expect(await contract.externalFunction()).to.equal("external-function");
    expect(await contract.id()).to.equal("123");
    expect(await contract.getAge()).to.equal(35);
  });
});
