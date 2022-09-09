const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Wrapped ETH (WETH)", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory(
      "contracts/solidity_by_examples/03_WETH/WETH.sol:WETH"
    );
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to deposit ETH to mint WETH", async function () {
    let [account] = await ethers.getSigners();

    await contract.connect(account).deposit({ value: ethers.utils.parseEther("1") });

    // WETH balance
    expect(await contract.balanceOf(account.address)).to.eq(ethers.utils.parseEther("1"));

    // Total supply WETH
    expect(await contract.totalSupply()).to.equal(ethers.utils.parseEther("1"));

    // Total ETH balance is locked in the contract
    expect(await contract.provider.getBalance(contract.address)).to.equal(
      ethers.utils.parseEther("1")
    );
  });

  it("Should be able to send ETH directly to the contract", async function () {
    let [account] = await ethers.getSigners();

    await account.sendTransaction({
      to: contract.address,
      value: ethers.utils.parseEther("1"),
    });

    expect(await contract.balanceOf(account.address)).to.eq(ethers.utils.parseEther("1"));
  });

  it("Should be able to return WETH to withdraw ETH", async function () {
    let [account] = await ethers.getSigners();
    await account.sendTransaction({
      to: contract.address,
      value: ethers.utils.parseEther("10"),
    });

    let ethBalanceBeforeWithdrawal = await account.getBalance();
    const txn = await contract.connect(account).withdraw(ethers.utils.parseEther("6"));
    const txnReceipt = await txn.wait();
    const transactionFees = txnReceipt.gasUsed.mul(txnReceipt.effectiveGasPrice);

    expectedBalance = ethBalanceBeforeWithdrawal
      .sub(transactionFees)
      .add(ethers.utils.parseEther("6"));
    expect(await account.getBalance()).to.eq(expectedBalance);

    // Remaining account's WETH
    expect(await contract.balanceOf(account.address)).to.eq(ethers.utils.parseEther("4"));

    // Total supply WETH
    expect(await contract.totalSupply()).to.equal(ethers.utils.parseEther("4"));

    // Total ETH balance is locked in the contract
    expect(await contract.provider.getBalance(contract.address)).to.equal(
      ethers.utils.parseEther("4")
    );
  });
});
