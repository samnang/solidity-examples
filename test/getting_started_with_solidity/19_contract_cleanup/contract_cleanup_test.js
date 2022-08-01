const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Contract Cleanup", function () {
  let contract;
  let owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("contracts/getting_started_with_solidity/19_contract_cleanup/MyContract.sol:MyContract", owner);
    contract = await Contract.deploy({value: ethers.utils.parseEther("1")});
    await contract.deployed();
  });

  it("Should be able to verify all variable values", async function () {
    const oldBalance = await owner.getBalance();

    const tx = await contract.kill();
    const txReceipt = await tx.wait();
    const txFees = txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice);

    const newBalance = await owner.getBalance();
    expect(newBalance).to.eq(
      oldBalance
        .add(ethers.utils.parseEther("1"))
        .sub(txFees)
    );
  });
});
