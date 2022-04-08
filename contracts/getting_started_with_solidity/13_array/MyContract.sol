// SPDX-License-Identifier: MIT
//
// https://cryptomarketpool.com/array

pragma solidity ^0.8.0;

contract MyContract {
  uint[] public myArray; //this is a dynamic array of type uint
  uint[] public myArray2 = [1, 2, 3, 4]; //this is a dynamic array with 1, 2 and 3 as default values
  uint[10] public myFixedSizeArray; //this is a fixed size array of type uint

  uint[] intergerArray;       //sample array of integers
  bool[] boolArray;           //sample array of booleans
  address[] addressArray;     //sample array of address

  function pushIsToAdd(uint i) public {
    myArray.push(i);
  }

  function getItemInArray(uint index) public view returns(uint) {
    return myArray[index];
  }

  function updateTheArray(uint locationInArray, uint valueToChange) public {
    myArray[locationInArray] = valueToChange;
  }

  function remove(uint index) public {
    delete myArray[index];
  }

  function removeAndCompact(uint index) public {
    myArray[index] = myArray[myArray.length - 1];
    myArray.pop();
  }

  function getLegth() public view returns(uint) {
    return myArray.length;
  }
}
