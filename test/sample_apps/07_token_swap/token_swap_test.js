const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Sample Apps / Token Swap", function () {
  let contract, abcContract, xyzContract;
  let owner, signer1, signer2;

  beforeEach(async () => {
    [owner, signer1, signer2] = await ethers.getSigners();
    const ABCContract = await ethers.getContractFactory(
      "contracts/sample_apps/07_token_swap/MyTokenBob.sol:MyTokenBob",
      signer1
    );
    const XYZContract = await ethers.getContractFactory(
      "contracts/sample_apps/07_token_swap/MyTokenBob.sol:MyTokenBob",
      signer2
    );

    abcContract = await ABCContract.deploy("ABC Token", "ABC");
    xyzContract = await XYZContract.deploy("XYZ Token", "XYZ");
    await abcContract.deployed();
    await xyzContract.deployed();

    const Contract = await ethers.getContractFactory(
      "contracts/sample_apps/07_token_swap/TokenSwap.sol:TokenSwap",
      owner
    );
    contract = await Contract.deploy(
      abcContract.address,
      signer1.address,
      xyzContract.address,
      signer2.address
    );
    await contract.deployed();
  });

  it("Should be able to swap between two tokens", async function () {
    await abcContract.approve(contract.address, ethers.utils.parseEther("100"));
    await xyzContract.approve(contract.address, ethers.utils.parseEther("100"));

    await contract.connect(signer1).swap(
      ethers.utils.parseEther("1"), // amount in ABC token
      ethers.utils.parseEther("2") // amount in XYZ token
    );

    expect(await abcContract.balanceOf(signer1.address)).to.equal(ethers.utils.parseEther("99"));
    expect(await abcContract.balanceOf(signer2.address)).to.equal(ethers.utils.parseEther("1"));

    expect(await xyzContract.balanceOf(signer2.address)).to.equal(ethers.utils.parseEther("98"));
    expect(await xyzContract.balanceOf(signer1.address)).to.equal(ethers.utils.parseEther("2"));
  });
});
