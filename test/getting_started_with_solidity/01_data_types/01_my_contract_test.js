const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Data Types / MyContract", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("contracts/getting_started_with_solidity/01_data_types/01_MyContract.sol:MyContract");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variable values", async function () {
    expect(await contract.myString()).to.equal("hello");
    expect(await contract.myInt()).to.equal(1);
    expect(await contract.myUint()).to.equal(2);
    expect(await contract.myUint256()).to.equal(3);
    expect(await contract.myUint8()).to.equal(4);
    expect(await contract.myAddress()).to.equal("0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984");
    expect(await contract.getValue()).to.equal(6);
  });
});
