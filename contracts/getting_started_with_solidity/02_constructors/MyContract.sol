//SPDX-License-Identifier: MIT
//
// https://cryptomarketpool.com/constructor-in-solidity-smart-contracts/

pragma solidity ^0.8.0;

contract MyContract {
    uint256 public x;
    uint256 public y;
    address public owner;
    uint256 public createdAt;

    constructor(uint256 _x, uint256 _y) {
        x = _x;
        y = _y;
        owner = msg.sender;
        createdAt = block.timestamp;
    }
}
