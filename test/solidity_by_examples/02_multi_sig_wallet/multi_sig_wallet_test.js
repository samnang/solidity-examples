const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidity By Examples / Multi Sig Wallet", function () {
  let contract;
  let owner1, owner2, owner3, otherSigner;

  beforeEach(async () => {
    [owner1, owner2, owner3, otherSigner] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory(
      "contracts/solidity_by_examples/02_multi_sig_wallet/MultiSigWallet.sol:MultiSigWallet",
      owner1
    );
    contract = await Contract.deploy([owner1.address, owner2.address, owner3.address], 2);
    await contract.deployed();
  });

  it("Should allow only owners to be able to submit transactions", async function () {
    await expect(
      contract
        .connect(otherSigner)
        .submitTransaction(otherSigner.address, 100, ethers.constants.HashZero)
    ).to.be.revertedWith("not owner");

    await expect(
      contract
        .connect(owner1)
        .submitTransaction(otherSigner.address, 100, ethers.constants.HashZero)
    )
      .to.emit(contract, "SubmitTransaction")
      .withArgs(owner1.address, 0, otherSigner.address, 100, ethers.constants.HashZero);

    let [to, value, data, executed, numConfirmations] = await contract.getTransaction(0);
    expect(to).to.eq(otherSigner.address);
    expect(value).to.eq(100);
    expect(data).to.eq(ethers.constants.HashZero);
    expect(executed).to.eq(false);
    expect(numConfirmations).to.eq(0);
  });

  it("Should allow only owners to be able to confirm transactions", async function () {
    await contract
      .connect(owner1)
      .submitTransaction(otherSigner.address, 100, ethers.constants.HashZero);

    await expect(contract.connect(otherSigner).confirmTransaction(0)).to.be.revertedWith(
      "not owner"
    );

    await expect(contract.connect(owner1).confirmTransaction(1)).to.be.revertedWith(
      "tx does not exist"
    );

    await contract.connect(owner1).confirmTransaction(0);

    await expect(contract.connect(owner1).confirmTransaction(0)).to.be.revertedWith(
      "tx already confirmed"
    );
  });

  it("Should be able to execute the transaction when it has enough confirmations", async function () {
    await expect(
      owner1.sendTransaction({
        to: contract.address,
        value: 100,
      })
    )
      .to.emit(contract, "Deposit")
      .withArgs(owner1.address, 100, 100);

    await contract
      .connect(owner1)
      .submitTransaction(otherSigner.address, 100, ethers.constants.HashZero);
    await contract.connect(owner1).confirmTransaction(0);

    await expect(contract.connect(owner1).executeTransaction(0)).to.be.revertedWith(
      "cannot execute tx"
    );

    await contract.connect(owner2).confirmTransaction(0);
    await expect(contract.connect(owner1).executeTransaction(0))
      .to.emit(contract, "ExecuteTransaction")
      .withArgs(owner1.address, 0);
  });
});
