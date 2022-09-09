const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Array", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory(
      "contracts/getting_started_with_solidity/13_array/MyContract.sol:MyContract"
    );
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variable values", async function () {
    await contract.pushIsToAdd(1);
    await contract.pushIsToAdd(2);
    await contract.pushIsToAdd(3);
    await contract.pushIsToAdd(4); // Array [1, 2, 3, 4]

    expect(await contract.getItemInArray(1)).to.equal(2);

    await contract.updateTheArray(1, 5); // Array [1, 5, 3, 4]
    expect(await contract.getItemInArray(1)).to.equal(5);

    await contract.remove(1); // Array [1, 0, 3, 4]
    expect(await contract.getItemInArray(1)).to.equal(0);
    expect(await contract.getLength()).to.equal(4);

    await contract.removeAndCompact(1); // Array [1, 4, 3]
    expect(await contract.getItemInArray(1)).to.equal(4);
    expect(await contract.getItemInArray(2)).to.equal(3);
    expect(await contract.getLength()).to.equal(3);
  });
});
