const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Interface", function () {
  let contract;
  let owner, anotherAccount;

  beforeEach(async () => {
    [owner, anotherAccount] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("contracts/solidity_by_examples/24_interface/MyContract.sol:MyContract", owner);
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variables", async function () {
    expect(await contract.totalSupply()).to.equal(ethers.utils.parseEther("10"));
    expect(await contract.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("10"));
    expect(await contract.balanceOf(anotherAccount.address)).to.equal(0);

    await contract.transfer(anotherAccount.address, ethers.utils.parseEther("1"));

    expect(await contract.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("9"));
    expect(await contract.balanceOf(anotherAccount.address)).to.equal(ethers.utils.parseEther("1"));
  });
});
