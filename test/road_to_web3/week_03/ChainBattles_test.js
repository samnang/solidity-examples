const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Road to Web3 / Week 02 / Buy Me A Coffee", function () {
  let contract;
  let deployer, minter;

  beforeEach(async () => {
    [deployer, minter] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory(
      "contracts/road_to_web3/week_03/ChainBattles.sol:ChainBattles"
    );
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should mint a new NFT token", async function () {
    await contract.connect(minter).mint();

    newMintedTokenId = 1;
    expect(await contract.ownerOf(newMintedTokenId)).to.eq(minter.address);
    expect(await contract.getLevels(newMintedTokenId)).to.eq("0");
    expect(await contract.getTokenURI(newMintedTokenId)).not.to.be.empty;
  });

  it("Should be able to train", async function () {
    await contract.connect(minter).mint();

    newMintedTokenId = 1;
    await contract.connect(minter).train(newMintedTokenId);

    expect(await contract.getLevels(newMintedTokenId)).to.not.eq("0");
  });
});
