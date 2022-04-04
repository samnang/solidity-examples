// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

interface Regulator {
  function checkValue(uint amount) external returns(bool);
  function loan() external returns(bool);
}

contract Bank is Regulator {
  uint private value;
  address private owner;

  constructor(uint amount) {
    value = amount;
    owner = msg.sender;
  }

  function deposit(uint amount) public {
    value += amount;
  }

  function withdraw(uint amount) public {
    if (checkValue(amount)) {
      value -= amount;
    }
  }

  function balance() public view returns (uint) {
    return value;
  }

  function checkValue(uint amount) public view returns (bool) {
    return amount >= value;
  }

  function loan() public view returns(bool) {
    return value > 0;
  }
}

contract MyContract is Bank(10) {
  string private name;
  uint private age;

  function setName(string memory newName) public {
    name = newName;
  }

  function getName() public view returns(string memory) {
    return name;
  }

  function setAge(uint newAge) public {
    age = newAge;
  }

  function getAge() public view returns(uint) {
    return age;
  }
}
