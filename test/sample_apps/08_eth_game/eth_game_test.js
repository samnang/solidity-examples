const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Sample Apps / ETH Game", function () {
  let contract;
  let signers;

  beforeEach(async () => {
    signers = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("contracts/sample_apps/08_eth_game/EthGame.sol:EthGame");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to deposit in the game", async function () {
    await contract.connect(signers[0]).deposit({value: ethers.utils.parseEther("1")});
    await contract.connect(signers[1]).deposit({value: ethers.utils.parseEther("1")});

    expect(await contract.getBalance()).to.equal(ethers.utils.parseEther("2"));
  });

  it("Should prevent forcefully sending eth the balance", async function () {
    await expect(contract.deposit({value: ethers.utils.parseEther("1.5")})).to.be.revertedWith("You can only send 1 Ether");
  });

  it("Should prevent forcefully sending eth when the game is over", async function () {
    for (let i = 0; i < 14; i++) {
      await contract.deposit({value: ethers.utils.parseEther("1")});
    }

    await expect(contract.deposit({value: ethers.utils.parseEther("1")})).to.be.revertedWith("Game is over");
  });

  it("Should be able to claim by the winner", async function () {
    let participant = signers[0];
    let winner = signers[1];
    for (let i = 0; i < 13; i++) {
      await contract.connect(participant).deposit({value: ethers.utils.parseEther("1")});
    }
    await contract.connect(winner).deposit({value: ethers.utils.parseEther("1")});

    await expect(contract.connect(participant).claimReward()).to.be.revertedWith("Not winner");
    await expect(contract.connect(winner).claimReward())
  });
});
