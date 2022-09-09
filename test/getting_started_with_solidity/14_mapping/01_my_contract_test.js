const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Mapping / MyContract", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory(
      "contracts/getting_started_with_solidity/14_mapping/01_MyContract.sol:MyContract"
    );
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variable values", async function () {
    let [singer1, singer2, singer3] = await ethers.getSigners();
    await contract.set(singer1.address, true);
    await contract.set(singer2.address, false);
    await contract.set(singer3.address, true);

    expect(await contract.get(singer1.address)).to.equal(true);
    expect(await contract.get(singer2.address)).to.equal(false);
    expect(await contract.get(singer3.address)).to.equal(true);

    await contract.remove(singer3.address);
    expect(await contract.get(singer3.address)).to.equal(false); // fallback to the default value
  });
});
