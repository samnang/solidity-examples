// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract RandomNumbers {
    function getRandomNumber() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % 10;
    }
}
