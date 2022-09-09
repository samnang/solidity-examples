// SPDX-License-Identifier: MIT
//
// https://cryptomarketpool.com/pure-and-view

pragma solidity ^0.8.0;

contract MyContract {
    string private name = "John Doe";

    // View functions are read only functions and do not modify the state of the block chain. In other words if you want to read data from the block chain one can use view.
    function getName() public view returns (string memory) {
        return name;
    }

    // Pure functions are more restrictive then view functions and do not modify the state AND do not read the state of the block chain.
    function sum(int256 a, int256 b) public pure returns (int256) {
        return a + b;
    }
}
