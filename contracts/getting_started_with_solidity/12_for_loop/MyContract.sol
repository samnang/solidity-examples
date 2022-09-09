// SPDX-License-Identifier: MIT
//
// https://cryptomarketpool.com/for-loop

pragma solidity ^0.8.0;

contract MyContract {
    uint256 public loopCount;

    function doLoop(uint256 n) public {
        for (uint256 i = 0; i < n; i++) {
            loopCount += 1;
        }
    }
}
