const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / For Loop", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("contracts/getting_started_with_solidity/12_for_loop/MyContract.sol:MyContract");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variables", async function () {
    await contract.doLoop(2);
    expect(await contract.loopCount()).to.equal(2);

    await contract.doLoop(3);
    expect(await contract.loopCount()).to.equal(5);
  });
});
