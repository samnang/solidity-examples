const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Sample Apps / FlashLender", async function () {
  let deployer, account1;
  let lenderContract;
  let borrowerContract;
  let WETHContract;
  let USDTContract;
  let DAIContract;
  const fee = 10; // 10 == 0.10 %

  beforeEach(async () => {
    [deployer, account1] = await ethers.getSigners();

    WETHContract = await deployContract("ERC20Mock", "Wrapped ETH", "WETH");
    DAIContract = await deployContract("ERC20Mock", "DAI", "DIA");
    USDTContract = await deployContract("ERC20Mock", "USD Tether", "USDT");

    lenderContract = await deployContract(
      "FlashLender",
      [WETHContract.address, DAIContract.address],
      fee
    );
    borrowerContract = await deployContract("FlashBorrower", lenderContract.address);
  });

  it("creates a flash loan", async () => {
    const loanAmount = 10000;
    const poolBalance = 50000;
    const fee = await lenderContract.flashFee(WETHContract.address, loanAmount);
    await WETHContract.mint(borrowerContract.address, fee);
    await WETHContract.mint(lenderContract.address, poolBalance);

    await borrowerContract.connect(account1).flashBorrow(WETHContract.address, loanAmount);

    expect(await WETHContract.balanceOf(borrowerContract.address)).to.eq(0);
    expect(await WETHContract.balanceOf(lenderContract.address)).to.eq(poolBalance + Number(fee));
  });

  it("does not have enough balance to pay fees", async () => {
    const loanAmount = 10000;

    await expect(
      borrowerContract.connect(account1).flashBorrow(WETHContract.address, loanAmount)
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

  it("denies a flash loan from an unsupported token", async () => {
    const loanAmount = 10000;

    await expect(
      borrowerContract.connect(account1).flashBorrow(USDTContract.address, loanAmount)
    ).to.revertedWith("FlashLender: Unsupported currency");
  });

  async function deployContract(contractName, ...args) {
    const contractFactory = await ethers.getContractFactory(contractName, deployer);
    const contract = await contractFactory.deploy(...args);
    await contract.deployed();

    return contract;
  }
});
