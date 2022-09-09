const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Sample Apps / Hotel", function () {
  let contract;
  let owner, signer1, signer2;

  beforeEach(async () => {
    [owner, signer1, signer2] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory(
      "contracts/sample_apps/03_hotel/HotelRoom.sol:HotelRoom",
      owner
    );
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variable values", async function () {
    await expect(
      signer1.sendTransaction({
        to: contract.address,
        value: ethers.utils.parseEther("1"),
      })
    ).to.be.revertedWith("Not enough Ether provided");

    await signer1.sendTransaction({
      to: contract.address,
      value: ethers.utils.parseEther("2"),
    });

    await expect(
      signer1.sendTransaction({
        to: contract.address,
        value: ethers.utils.parseEther("2"),
      })
    ).to.be.revertedWith("Currently Occupied");
  });
});
