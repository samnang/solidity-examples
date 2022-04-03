// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract MyContract {
  mapping (address => bool) public myMap;

  function set(address _addr, bool i) public {
    myMap[_addr] = i;
  }

  function get(address _addr) public view returns(bool) {
    return myMap[_addr];
  }

  function remove(address _addr) public {
    delete myMap[_addr];
  }
}
