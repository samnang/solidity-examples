const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Fallback Function", function () {
  let contract;
  let owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("contracts/getting_started_with_solidity/11_fallback_function/MyContract.sol:MyContract", owner);
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variables", async function () {
    await owner.sendTransaction({to: contract.address, value: ethers.utils.parseEther("1.0")});

    expect(await contract.provider.getBalance(contract.address)).to.equal(ethers.utils.parseEther("1.0"));
  });
});
