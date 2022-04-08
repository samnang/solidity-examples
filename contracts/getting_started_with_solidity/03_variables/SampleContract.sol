// SPDX-License-Identifier: MIT
//
// https://cryptomarketpool.com/variables-in-solidity-smart-contracts/

pragma solidity ^0.8.0;

contract SampleContract {
  //state variable of data type unint declared called "storedData"
  //Data in this variable will be saved to the block chain
  uint public storedData;

  function getResult() public pure returns(uint) {
    //local variable
    uint a = 7;
    //local variable
    uint b = 3;
    uint result = a + b;
    //access the local variable
    return result;
  }

  function getSenderOfTransaction() public view returns(address) {
    //access global variables
    return msg.sender;
  }

  function getChainId() public view returns(uint) {
    //access global variables
    return block.chainid;
  }
}
