const { expect } = require("chai");
const { ethers } = require("hardhat");

const { moveTime, moveBlocks, getLatestBlockTs } = require("./utils/test_helpers");

const TOKEN_ID_0 = 0;
const TOKEN_ID_1 = 1;

const UPDATE_INTERVAL_SEC = 60;
const DECIMALS = 8;
const INITIAL_PRICE = 3000000000000;
const CHECK_DATA = ethers.constants.HashZero;

const KEYHASH = ethers.constants.HashZero; // We don't need keyhash because we are using mock
const VRF_FUND_AMOUNT = "1000000000000000000000";
const BASE_FEE = "100000000000000000"; // i.e 0.1 LINK
const GAS_PRICE_LINK = 1000000000; // i.e 0.000000001 LINK per gas

describe("Road to Web3 / Week 05 / Dynamic NFTs", function () {
  let contract, priceFeedContract, vrfCoordinatorContract;
  let deployer, accountOwner;

  beforeEach(async () => {
    [deployer, accountOwner] = await ethers.getSigners();
    const PriceFeedMock = await ethers.getContractFactory("MockV3Aggregator");
    priceFeedContract = await PriceFeedMock.deploy(DECIMALS, INITIAL_PRICE);
    await priceFeedContract.deployed();

    const VRFCoordinatorMock = await ethers.getContractFactory("VRFCoordinatorV2Mock");
    vrfCoordinatorContract = await VRFCoordinatorMock.deploy(BASE_FEE, GAS_PRICE_LINK);
    await vrfCoordinatorContract.deployed();
    const subscriptionTxn = await vrfCoordinatorContract.createSubscription();
    const subscriptionTxnReceipt = await subscriptionTxn.wait();
    const subscriptionId = subscriptionTxnReceipt.events[0].args.subId;

    const Contract = await ethers.getContractFactory(
      "contracts/road_to_web3/week_05/BullnBear.sol:BullnBear",
      deployer
    );
    contract = await Contract.deploy(
      UPDATE_INTERVAL_SEC,
      subscriptionId,
      KEYHASH,
      vrfCoordinatorContract.address,
      priceFeedContract.address
    );
    await contract.deployed();

    // Fund the subscription
    // Our mock makes it so we don't actually have to worry about sending fund
    await vrfCoordinatorContract.fundSubscription(subscriptionId, VRF_FUND_AMOUNT);

    // Allow to the consumer contract uses the subscription to request random words.
    await vrfCoordinatorContract.addConsumer(subscriptionId, contract.address);
  });

  it("Should deploy Bull & Bear token contract", async () => {
    expect(await contract.totalSupply()).to.eq(0);
    expect(await contract.owner()).to.eq(deployer.address);
    expect(await contract.balanceOf(deployer.address)).to.equal(0);

    await expect(contract.ownerOf(TOKEN_ID_0)).to.be.revertedWith("ERC721: invalid token ID");
  });

  it("Should mint a new NFT token", async function () {
    await contract.safeMint(accountOwner.address);

    expect(await contract.totalSupply()).to.eq(1);
    expect(await contract.ownerOf(TOKEN_ID_0)).to.equal(accountOwner.address);
    expect(await contract.tokenURI(TOKEN_ID_0)).to.include("filename=gamer_bull.json");
    expect(await contract.balanceOf(accountOwner.address)).to.equal(1);
  });

  it("Should retrieve latest price from price feed", async function () {
    expect(await contract.getLatestPrice()).to.eq(INITIAL_PRICE);

    // Update price feed with new increased price.
    const increasedPrice = INITIAL_PRICE + 10000;
    let increasedPriceTx = await priceFeedContract.updateAnswer(increasedPrice);
    await increasedPriceTx.wait();
    expect(await contract.getLatestPrice()).to.eq(increasedPrice);

    // Update price feed with new decreased price.
    const decreasedPrice = INITIAL_PRICE - 10000;
    const decreasedPriceTx = await priceFeedContract.updateAnswer(decreasedPrice);
    await decreasedPriceTx.wait();
    expect(await contract.getLatestPrice()).to.eq(decreasedPrice);

    expect(await contract.currentPrice()).to.equal(INITIAL_PRICE);
  });

  describe("Keeper", async function () {
    it("should verify the checkUpkeep", async function () {
      let [upkeepNeeded] = await contract.checkUpkeep(CHECK_DATA);
      expect(upkeepNeeded).to.be.false;

      // Fast forward less than update interval.
      await moveTime(10);
      await moveBlocks(1);
      [upkeepNeeded] = await contract.checkUpkeep(CHECK_DATA);
      expect(upkeepNeeded).to.be.false;

      // Fast forward by more than Update Interval.
      await moveTime(UPDATE_INTERVAL_SEC + 1);
      await moveBlocks(1);
      [upkeepNeeded] = await contract.checkUpkeep(CHECK_DATA);
      expect(upkeepNeeded).to.be.true;
    });

    it("Should not run performUpkeep", async function () {
      await contract.safeMint(accountOwner.address);
      const currentUri = await contract.tokenURI(TOKEN_ID_0);

      // No change in price.
      let upkeepTx = await contract.performUpkeep(CHECK_DATA);
      await upkeepTx.wait();
      expect(await contract.tokenURI(TOKEN_ID_0)).to.equal(currentUri);

      // Change in price but no Upkeep interval not past.
      let newPrice = INITIAL_PRICE + 10000;
      let newPriceTx = await priceFeedContract.updateAnswer(newPrice);
      await newPriceTx.wait();

      upkeepTx = await contract.performUpkeep(CHECK_DATA);
      upkeepTx.wait();
      expect(await contract.tokenURI(TOKEN_ID_0)).to.equal(currentUri);
    });

    it("Should run performUpkeep", async function () {
      await contract.safeMint(accountOwner.address);
      let lastUpkeepTs = (await contract.lastTimeStamp()).toNumber();

      await moveTime(UPDATE_INTERVAL_SEC + 1);
      await moveBlocks(1);

      // Perform upkeep to update last upkeep timestamp in Token contract.
      let upkeepTx = await contract.performUpkeep(CHECK_DATA);
      await upkeepTx.wait();
      const updatedUpkeepTs = (await contract.lastTimeStamp()).toNumber();

      expect(updatedUpkeepTs).to.not.equal(lastUpkeepTs);
      expect(updatedUpkeepTs).to.be.greaterThan(lastUpkeepTs);
    });
  });

  it("Should update Token URIs on price changes", async function () {
    await contract.safeMint(accountOwner.address);

    // price decreases
    let newPrice = INITIAL_PRICE - 10000;
    let newPriceTx = await priceFeedContract.updateAnswer(newPrice);
    await newPriceTx.wait();

    // Move forward time to go past interval.
    await moveTime(UPDATE_INTERVAL_SEC + 1);
    await moveBlocks(1);

    let upkeepTx = await contract.performUpkeep(CHECK_DATA);
    await upkeepTx.wait();
    await vrfCoordinatorContract.fulfillRandomWords(1 /* request id */, contract.address);

    expect(await contract.tokenURI(TOKEN_ID_0)).to.include("_bear.json");

    // price increases
    newPrice = INITIAL_PRICE + 10000;
    newPriceTx = await priceFeedContract.updateAnswer(newPrice);
    await newPriceTx.wait();

    // Move forward time to go past interval.
    await moveTime(UPDATE_INTERVAL_SEC + 1);
    await moveBlocks(1);

    upkeepTx = await contract.performUpkeep(CHECK_DATA);
    await upkeepTx.wait();
    await vrfCoordinatorContract.fulfillRandomWords(2 /* request id */, contract.address);

    expect(await contract.tokenURI(TOKEN_ID_0)).to.include("_bull.json");
  });
});
