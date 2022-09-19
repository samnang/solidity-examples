const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Road to Web3 / Week 01 / NFT Tokens", function () {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory(
      "contracts/road_to_web3/week_01/NFT_ERC721.sol:MyNFTToken"
    );
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to mint NFT tokens", async function () {
    let [account1, account2] = await ethers.getSigners();

    await contract.safeMint(account1.address, "http://example.com/metadata1.json");
    await contract.safeMint(account2.address, "http://example.com/metadata2.json");

    expect(await contract.ownerOf(0)).to.equal(account1.address);
    expect(await contract.tokenURI(0)).to.equal("http://example.com/metadata1.json");
    expect(await contract.ownerOf(1)).to.equal(account2.address);
    expect(await contract.tokenURI(1)).to.equal("http://example.com/metadata2.json");
  });

  it("Should allow only max 5 NFTs per user", async function () {
    let [account1, account2] = await ethers.getSigners();

    for (let step = 1; step <= 5; step++) {
      await contract.safeMint(account1.address, `http://example.com/metadata${step}.json`);
    }

    await expect(
      contract.safeMint(account1.address, `http://example.com/metadata6.json`)
    ).to.be.revertedWith("Allow only max 5 NFTs per user");

    await contract.safeMint(account2.address, `http://example.com/metadata6.json`);

    expect(await contract.balanceOf(account1.address)).to.equal(5);
    expect(await contract.balanceOf(account2.address)).to.equal(1);
  });
});
