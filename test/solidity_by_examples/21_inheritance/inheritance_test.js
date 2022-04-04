const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Inheritance", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("contracts/solidity_by_examples/21_inheritance/MyContract.sol:MyContract");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variables", async function () {
    await contract.setName("John Doe");
    await contract.setAge(40);
    await contract.deposit(100);

    expect(await contract.getName()).to.equal("John Doe");
    expect(await contract.getAge()).to.equal(40);
    expect(await contract.balance()).to.equal(110);
    expect(await contract.loan()).to.equal(true);

    await contract.withdraw(110);
    expect(await contract.balance()).to.equal(0);
    expect(await contract.loan()).to.equal(false);
  });
});
