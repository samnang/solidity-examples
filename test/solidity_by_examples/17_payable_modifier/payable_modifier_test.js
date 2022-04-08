const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Payable Modifier", function () {
  let contract;
  let owner, signer;

  beforeEach(async () => {
    [owner, signer] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("contracts/getting_started_with_solidity/17_payable_modifier/MyContract.sol:MyContract", owner);
    contract = await Contract.deploy({value: 100});
    await contract.deployed();
  });

  it("Should be able to verify all variables", async function () {
    expect(await contract.provider.getBalance(contract.address)).to.equal(100)

    await contract.withdraw(5);
    expect(await contract.provider.getBalance(contract.address)).to.equal(95)

    currentBalance = await contract.provider.getBalance(signer.address)
    await contract.transfer(signer.address, 10);
    expect(await contract.provider.getBalance(contract.address)).to.equal(85)
    expect(await contract.provider.getBalance(signer.address)).to.equal(BigInt(currentBalance) + BigInt(10))
  });
});
