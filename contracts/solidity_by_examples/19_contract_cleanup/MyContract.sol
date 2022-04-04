// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract MyContract {
  address payable owner;

  constructor() payable {
    owner = payable(msg.sender);
  }

  function kill() public {
    require(msg.sender == owner);
    selfdestruct(owner);
  }
}
