const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Getting Started with Solidity / Constructors", function () {
  let contract;
  let owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory(
      "contracts/getting_started_with_solidity/02_constructors/MyContract.sol:MyContract",
      owner
    );
    contract = await Contract.deploy(5, 10);
    await contract.deployed();
  });

  it("Should be able to verify all variable values", async function () {
    expect(await contract.x()).to.equal(5);
    expect(await contract.y()).to.equal(10);
    expect(await contract.owner()).to.equal(owner.address);
    expect(await contract.createdAt()).not.to.be.null;
  });
});
