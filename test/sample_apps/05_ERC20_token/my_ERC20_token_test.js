const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Sample Apps / My ERC20 Token", function () {
  let contract;
  let owner, signer1, signer2;

  beforeEach(async () => {
    [owner, signer1, signer2] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("contracts/sample_apps/05_ERC20_token/MyERC20Token.sol:MyERC20Token", owner);
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should have the max total supply", async function () {
    expect(await contract.totalSupply()).to.equal(ethers.utils.parseEther("1000000"));
  });

  it("Should have the max total supply to the owner when it first deployed", async function () {
    expect(await contract.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("1000000"));
  });

  it("Should be able to transfer when the account has enough balance", async function () {
    await expect(
      contract.transfer(signer1.address, ethers.utils.parseEther("1"))
    ).to.emit(contract, "Transfer").withArgs(owner.address, signer1.address, ethers.utils.parseEther("1"));
    expect(await contract.balanceOf(signer1.address)).to.equal(ethers.utils.parseEther("1"));

    // Failed to transfer because signer1 does not have enough balance
    await contract.connect(signer1).transfer(signer2.address, ethers.utils.parseEther("2"));
    expect(await contract.balanceOf(signer1.address)).to.equal(ethers.utils.parseEther("1"));
    expect(await contract.balanceOf(signer2.address)).to.equal(ethers.utils.parseEther("0"));

    await contract.connect(signer1).transfer(signer2.address, ethers.utils.parseEther("0.1"));
    expect(await contract.balanceOf(signer1.address)).to.equal(ethers.utils.parseEther("0.9"));
    expect(await contract.balanceOf(signer2.address)).to.equal(ethers.utils.parseEther("0.1"));
  });

  it("Should be able to allow third party to transfer on behalf", async function () {
    await contract.approve(signer1.address, ethers.utils.parseEther("1"));
    expect(await contract.allowance(owner.address, signer1.address)).to.equal(ethers.utils.parseEther("1"));

    await contract.connect(signer1).transferFrom(owner.address, signer2.address, ethers.utils.parseEther("1"));
    expect(await contract.balanceOf(signer2.address)).to.equal(ethers.utils.parseEther("1"));
  })
});
