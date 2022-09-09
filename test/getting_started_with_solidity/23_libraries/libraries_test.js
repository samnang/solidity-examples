const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Libraries", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory(
      "contracts/getting_started_with_solidity/23_libraries/MyContract.sol:MyContract"
    );
    contract = await Contract.deploy();
    await contract.deployed();
  });

  xit("Should be able to verify all variable values", async function () {
    expect(await contract.callLibrary(2, 3)).to.equal(6);
  });
});
