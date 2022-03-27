// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract MyContract {
  string private name;

  //Functions that create transaction on block chain
  function setName(string memory newName) public {
    name = newName;
  }

  //Functions that do not create transaction on block chain (view and pure)
  function getName() public view returns(string memory) {
    return name;
  }
}
