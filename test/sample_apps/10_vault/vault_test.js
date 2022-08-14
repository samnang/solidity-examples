const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Sample Apps / Vault", async function () {
  const [deployer, signer1, signer2, _] = await ethers.getSigners();

  const TokenContract = await ethers.getContractFactory("contracts/sample_apps/10_vault/Vault.sol:AssetToken", deployer);
  const tokenContract = await TokenContract.deploy();
  await tokenContract.deployed();

  const VaultContract = await ethers.getContractFactory("contracts/sample_apps/10_vault/Vault.sol:Vault", deployer);
  const vaultContract = await VaultContract.deploy(tokenContract.address);
  await vaultContract.deployed();

  await tokenContract.connect(deployer).mint(signer1.address, ethers.utils.parseEther("100"));
  await tokenContract.connect(signer1).approve(vaultContract.address, ethers.utils.parseEther("100"));
  await tokenContract.connect(deployer).mint(signer2.address, ethers.utils.parseEther("100"));
    await tokenContract.connect(signer2).approve(vaultContract.address, ethers.utils.parseEther("100"));

  it("is initialed deposit into the blank pool", async function () {
    await vaultContract.connect(signer1).deposit(ethers.utils.parseEther("10"));

    expect(await tokenContract.balanceOf(vaultContract.address)).to.eq(ethers.utils.parseEther("10"));
    expect(await tokenContract.balanceOf(signer1.address)).to.eq(ethers.utils.parseEther("90"));

    expect(await vaultContract.balanceOf(signer1.address)).to.eq(ethers.utils.parseEther("10"));
    expect(await vaultContract.totalSupply()).to.eq(ethers.utils.parseEther("10"));

    expect(await sharePercentageInPool(signer1)).to.eq(100);
  });

  it("deposits from liquidity provider", async function () {
    await vaultContract.connect(signer2).deposit(ethers.utils.parseEther("20"));

    expect(await tokenContract.balanceOf(vaultContract.address)).to.eq(ethers.utils.parseEther("30"));
    expect(await tokenContract.balanceOf(signer2.address)).to.eq(ethers.utils.parseEther("80"));

    expect(await vaultContract.balanceOf(signer2.address)).to.eq(ethers.utils.parseEther("20"));
    expect(await vaultContract.totalSupply()).to.eq(ethers.utils.parseEther("30"));

    expect(await sharePercentageInPool(signer1)).to.eq(33.333);
    expect(await sharePercentageInPool(signer2)).to.eq(66.667);
  });

  it("withdraws from the pool", async function () {
    await vaultContract.connect(signer1).withdraw(ethers.utils.parseEther("10"));

    expect(await tokenContract.balanceOf(vaultContract.address)).to.eq(ethers.utils.parseEther("20"));
    expect(await tokenContract.balanceOf(signer1.address)).to.eq(ethers.utils.parseEther("100"));

    expect(await vaultContract.balanceOf(signer1.address)).to.eq(0);
    expect(await vaultContract.totalSupply()).to.eq(ethers.utils.parseEther("20"));

    expect(await sharePercentageInPool(signer1)).to.eq(0);
    expect(await sharePercentageInPool(signer2)).to.eq(100);

    await vaultContract.connect(signer2).withdraw(ethers.utils.parseEther("20"));

    expect(await tokenContract.balanceOf(vaultContract.address)).to.eq(0);
    expect(await tokenContract.balanceOf(signer2.address)).to.eq(ethers.utils.parseEther("100"));

    expect(await vaultContract.balanceOf(signer2.address)).to.eq(0);
    expect(await vaultContract.totalSupply()).to.eq(0);

    expect(await sharePercentageInPool(signer1)).to.eq(0);
    expect(await sharePercentageInPool(signer2)).to.eq(0);
  });

  async function sharePercentageInPool(signer) {
    const lpTokenBalance = await vaultContract.balanceOf(signer.address);
    const lpTokenTotalSupply = await vaultContract.totalSupply();
    return lpTokenBalance.div(lpTokenTotalSupply).mul(100);
  }
});
