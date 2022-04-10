const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Variables", function () {
  let contract;
  let owner;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("contracts/getting_started_with_solidity/03_variables/SampleContract.sol:SampleContract");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variable values", async function () {
    expect(await contract.getResult()).to.equal(10);
    expect(await contract.storedData()).to.equal(0);

    [owner] = await ethers.getSigners();
    expect(await contract.getSenderOfTransaction()).to.equal(owner.address);
    expect(await contract.getChainId()).to.equal(31337);
  });
});
