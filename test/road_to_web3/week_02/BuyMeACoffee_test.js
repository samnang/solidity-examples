const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Road to Web3 / Week 02 / Buy Me A Coffee", function () {
  let contract;
  let deployer, tipper;

  beforeEach(async () => {
    [deployer, tipper] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory(
      "contracts/road_to_web3/week_02/BuyMeACoffee.sol:BuyMeACoffee"
    );
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to give a tip to the owner", async function () {
    const tip = { value: ethers.utils.parseEther("1") };
    await contract.connect(tipper).buyCoffee("John Doe", "You're the best!", tip);

    expect(await contract.provider.getBalance(contract.address)).to.equal(
      ethers.utils.parseEther("1")
    );
  });

  it("Should be able to withdraw", async function () {
    const tip = { value: ethers.utils.parseEther("1") };
    await contract.connect(tipper).buyCoffee("John Doe", "You're the best!", tip);

    await contract.withdrawTips();

    expect(await contract.provider.getBalance(contract.address)).to.equal(0);
  });

  it("Should be able to change the owner", async function () {
    const newOwner = (await ethers.getSigners())[2];

    expect(await contract.owner()).to.equal(deployer.address);

    await expect(contract.connect(tipper).changeOwner(newOwner.address)).to.be.revertedWith(
      "Not the owner"
    );
    await contract.changeOwner(newOwner.address);

    expect(await contract.owner()).to.equal(newOwner.address);
  });
});
