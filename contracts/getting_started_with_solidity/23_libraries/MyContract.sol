// SPDX-License-Identifier: MIT
//
// https://cryptomarketpool.com/libraries-in-solidity/

pragma solidity ^0.8.0;

// Option 1: Using import
import "./MathLibrary.sol";

// Option 2: Library code directly in the contract
library MathLibrary2 {
    function multiply(uint256 a, uint256 b) internal view returns (uint256, address) {
        return (a * b, address(this));
    }
}

contract MyContract {
    using MathLibrary2 for uint256;
    address owner = address(this);

    function callLibrary(uint256 a, uint256 b) public view returns (uint256, address) {
        return MathLibrary.multiply(a, b);
    }

    function callLibrary2(uint256 a, uint256 b) public view returns (uint256, address) {
        return a.multiply(b);
    }
}
