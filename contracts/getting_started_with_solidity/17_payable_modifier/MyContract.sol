// SPDX-License-Identifier: MIT
//
// https://cryptomarketpool.com/payable-functions

pragma solidity ^0.8.0;

contract MyContract {
  address payable public owner;

  constructor() payable {
    owner = payable(msg.sender);
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
  }

  function withdraw(uint amount) public onlyOwner {
    owner.transfer(amount);
  }

  function transfer(address payable _to, uint amount) public onlyOwner {
    _to.transfer(amount);
  }
}
