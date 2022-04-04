// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract MyContract {
  uint public loopCount;

  function doLoop(uint n) public {
    for (uint i = 0; i < n; i++) {
      loopCount += 1;
    }
  }
}
