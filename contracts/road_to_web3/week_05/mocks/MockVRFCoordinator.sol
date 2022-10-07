// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol";

/**
 *  Constructor for the mock takes two arguments: _baseFee and _gasPriceLink (gas unit price in link)
 * for _baseFee pass in  100000000000000000; i.e 0.1 LINK
 * for _gasPriceLink pass in 1000000000 ; i.e 0.000000001 LINK per gas
 */

// STEPS TO USE THIS MOCK
// [1] Call createSubscription(). The subscript IDs returned is a uint64 and starts from 1. You can see the returned
// value in Remix's Logs under "Decoded Output"
// [2] fund your mock subscription and pass in the subscription ID (usually starts from 1 in the mocks) and 1000000000000000000 (10 LINK) as the params. You can check your funding
// is completed by calling `getSubscription()` - it should return the correct details as per the LINK you've added etc.
// Funding docs here: https://docs.chain.link/docs/get-a-random-number/#create-and-fund-a-subscription)

// [3] Back in the Bull&Bear Deployed contract, don't forget to call setSubscriptionId() so the calls to getRandomWords() will succeed!
// Also, ensure that the COORDINATOR field points to this mock Coordinator. Check the tokenUri
// or the currentMarketTrend (it's an enum in the Bull&Bear.sol file) to see what the last recorded trend was.

// [4] reverse the trend by calling updateAnswer() in your mock price feed aggregator.

// [5] Back in the Bull&Bear, check that currentPrice reflects the old price.  Then manually trigger `performUpkeep` and pass in `[]` as the param. Take
// a look in the Remix logs window and you should see the Request ID (usually it's 1 in the mocks) for random words logged. If you cant
// find it in the logs, you can also check the `s_requestID` field and it will tell you your latest request ID. Make a note of that request Id.

// [6] Check that currentMarketTrend has updated its value and is the opposite of what you previously checked.

// [7] At this stage your NFT smart contract's `fulfillRandomWords()` callback has not yet been called.  When not using mocks, this will be automatically called by the
// VRF coordinator.  But when using a mock,  this needs to be manually called.
// If you're still using the mock VRF Coordinator, awitch to the mock VRF Coordinator and call `fulfillRandomWords()` and pass in the requestID (make sure its the latest one! ) you just noted and
// the contract address for the consumer - i.e. your Bull&Bear contract.

// [8] This should trigger the  `fulfillRandomWords()` callback in your Bull&Bear contract - and if you check the `s_randomWords` field (pass in 0 as the index to check)  in the that contract
// you will see your random number there.  Call `tokenURI()` and it should now be pointing to a different JSON, reflecting the latest
// market trend decided by the latest price.

// [9] If it's working, grab a cookie and dance! If it's not working, don't panic -- there is a small error somewhere. Just retrace the steps above :-D

// NOTE: [1] the console.log() statements do not work on live networks, so look for them only on your local in-browser Remix logs.
// NOTE:  [2] when using a VRF Coordinator on livenet, the `fulfillRandomWords()` callback can take some time to be called as generatating a cryptographically provable random
// number and delivering it to your NFT smart contract on-chain can take some time.
