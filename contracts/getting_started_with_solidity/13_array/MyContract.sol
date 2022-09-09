// SPDX-License-Identifier: MIT
//
// https://cryptomarketpool.com/array

pragma solidity ^0.8.0;

contract MyContract {
    uint256[] public myArray; //this is a dynamic array of type uint
    uint256[] public myArray2 = [1, 2, 3, 4]; //this is a dynamic array with 1, 2 and 3 as default values
    uint256[10] public myFixedSizeArray; //this is a fixed size array of type uint

    uint256[] intergerArray; //sample array of integers
    bool[] boolArray; //sample array of booleans
    address[] addressArray; //sample array of address

    function pushIsToAdd(uint256 i) public {
        myArray.push(i);
    }

    function getItemInArray(uint256 index) public view returns (uint256) {
        return myArray[index];
    }

    function updateTheArray(uint256 locationInArray, uint256 valueToChange) public {
        myArray[locationInArray] = valueToChange;
    }

    function remove(uint256 index) public {
        delete myArray[index];
    }

    function removeAndCompact(uint256 index) public {
        myArray[index] = myArray[myArray.length - 1];
        myArray.pop();
    }

    function getLength() public view returns (uint256) {
        return myArray.length;
    }
}
