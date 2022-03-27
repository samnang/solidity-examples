// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract MyContract {
    string public myString = "hello";
    bytes32 public myBytes32 = "hello";
    int public myInt = 1;
    uint public myUint = 2;
    uint256 public myUint256 = 3;
    uint8 public myUint8 = 4;
    address public myAddress = 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984;

    //function with local variable are stored in memory.
    //variables within functions have a declared data type
    function getValue() public pure returns(uint) {
        uint value = 6;
        return value;
    }
}
