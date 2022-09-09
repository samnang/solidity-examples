// SPDX-License-Identifier: MIT
//
// https://cryptomarketpool.com/libraries-in-solidity/

pragma solidity ^0.8.0;

library MathLibrary {
    function multiply(uint256 a, uint256 b) public view returns (uint256, address) {
        return (a * b, address(this));
    }
}
