// SPDX-License-Identifier: MIT

/*
https://solidity-by-example.org/app/ether-wallet

An example of a basic wallet.

  Anyone can send ETH.
  Only the owner can withdraw.
*/

pragma solidity ^0.8.9;

contract EtherWallet {
  address payable public owner;

  constructor() payable {
    owner = payable(msg.sender);
  }

  function withdraw(uint amount) external {
    require(msg.sender == owner, "caller is not owner");
    payable(owner).transfer(amount);
  }

  function getBalance() external view returns(uint) {
    return address(this).balance;
  }
}
