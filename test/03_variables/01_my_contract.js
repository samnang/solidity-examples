const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Variables / SampleContract", function () {
  let contract;
  let owner;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("contracts/03_variables/SampleContract.sol:SampleContract");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variables", async function () {
    expect(await contract.getResult()).to.equal(10);
    expect(await contract.storedData()).to.equal(0);

    [owner] = await ethers.getSigners();
    expect(await contract.getSenderOfTransaction()).to.equal(owner.address);
    expect(await contract.getChainId()).to.equal(31337);
  });
});
