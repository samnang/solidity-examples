const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Sample Apps / Address Book", function () {
  let contract;
  let owner, contact1, contact2;

  beforeEach(async () => {
    [owner, contact1, contact2] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("contracts/sample_apps/02_address_book/AddressBook.sol:AddressBook", owner);
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should be able to verify all variable values", async function () {
    await contract.addContact(contact1.address, "john");
    await contract.addContact(contact2.address, "ali");

    expect(await contract.getContacts()).to.eql([contact1.address, contact2.address]);
    expect(await contract.getAlias(contact1.address)).to.equal("john");
    expect(await contract.getAlias(contact2.address)).to.equal("ali");

    await contract.removeContact(contact1.address);
    expect(await contract.getContacts()).to.eql([contact2.address]);
    expect(await contract.getAlias(contact1.address)).to.equal("");
    expect(await contract.getAlias(contact2.address)).to.equal("ali");
  });
});
