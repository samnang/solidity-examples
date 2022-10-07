const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Libraries", function () {
  let contract;

  beforeEach(async () => {
    const MathLibrary = await ethers.getContractFactory(
      "contracts/getting_started_with_solidity/23_libraries/MathLibrary.sol:MathLibrary"
    );
    mathLibrary = await MathLibrary.deploy();
    await mathLibrary.deployed();

    const Contract = await ethers.getContractFactory(
      "contracts/getting_started_with_solidity/23_libraries/MyContract.sol:MyContract",
      {
        libraries: {
          MathLibrary: mathLibrary.address,
        },
      }
    );
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variable values", async function () {
    let [result, address] = await contract.callLibrary(2, 3);
    expect(result).to.equal(6);
    expect(address).to.equal(contract.address);

    [result, address] = await contract.callLibrary2(2, 3);
    expect(result).to.equal(6);
    expect(address).to.equal(contract.address);
  });
});
