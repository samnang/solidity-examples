const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Ether Wallet", function () {
  let contract;
  let owner, otherSigner;

  beforeEach(async () => {
    [owner, otherSigner] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("contracts/solidity_by_examples/01_ether_wallet/EtherWallet.sol:EtherWallet", owner);
    contract = await Contract.deploy({value: ethers.utils.parseEther("1")});
    await contract.deployed();
  });

  it("Should be able to verify all variable values", async function () {
    await expect(contract.connect(otherSigner).withdraw(ethers.utils.parseEther("0.5"))).to.be.revertedWith("caller is not owner");

    await contract.withdraw(ethers.utils.parseEther("0.5"))
    expect(await contract.getBalance()).to.equal(ethers.utils.parseEther("0.5"))
  });
});
