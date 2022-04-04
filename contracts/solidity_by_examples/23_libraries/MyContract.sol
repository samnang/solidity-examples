// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// Option 1: Using import
import "./MathLibrary.sol";

// Option 2: Library code directly in the contract
library MathLibrary2 {
  function multiply(uint a, uint b) internal view returns (uint, address) {
      return (a * b, address(this));
  }
}

contract MyContract {
  using MathLibrary2 for uint;
  address owner = address(this);

  function callLibrary(uint a, uint b) public view returns(uint, address) {
    return MathLibrary.multiply(a, b);
  }

    function callLibrary2(uint a, uint b) public view returns(uint, address) {
    return a.multiply(b);
  }
}
