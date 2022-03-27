// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract MyContract {
  string private name;

  event nameEvent(string newName);

  function setName(string memory newName) public {
    name = newName;
    emit nameEvent(newName);
  }
}
