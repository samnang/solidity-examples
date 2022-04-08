// SPDX-License-Identifier: MIT
//
// https://cryptomarketpool.com/memory-vs-storage

pragma solidity ^0.8.0;

contract MyContract {
  // Storage
  string firstName;
  string lastName;

  constructor(string memory _firstName, string memory _lastName) {
    firstName = _firstName;
    lastName = _lastName;
  }

  function fullname() public view returns(string memory) {
    return string(abi.encodePacked(lastName, " ", firstName));
  }

}
