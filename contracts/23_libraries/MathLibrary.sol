// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

library MathLibrary {
  function multiply(uint a, uint b) public view returns(uint, address) {
    return (a * b, address(this));
  }
}
