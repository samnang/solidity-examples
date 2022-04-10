const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Data Types / SolidityOperatorExample", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("contracts/getting_started_with_solidity/01_data_types/02_SolidityOperatorExample.sol:SolidityOperatorExample");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variable values", async function () {
    await contract.getResults();

    expect(await contract.variable_add()).to.equal(95);
    expect(await contract.variable_sub()).to.equal(20);
    expect(await contract.variable_mul()).to.equal(625);
    expect(await contract.variable_div()).to.equal(16);
    expect(await contract.variable_mod()).to.equal(8);
  });
});
