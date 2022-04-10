const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / If Statement", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("contracts/getting_started_with_solidity/22_if_statement/MyContract.sol:MyContract");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variable values", async function () {
    await contract.symbolNum(1);
    expect(await contract.symbol()).to.equal("BTC");

    await contract.symbolNum(2);
    expect(await contract.symbol()).to.equal("ETH");
  });
});
