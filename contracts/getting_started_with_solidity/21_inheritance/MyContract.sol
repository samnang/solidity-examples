// SPDX-License-Identifier: MIT
//
// https://cryptomarketpool.com/inheritance

pragma solidity ^0.8.0;

interface Regulator {
    function checkValue(uint256 amount) external returns (bool);

    function loan() external returns (bool);
}

contract Bank is Regulator {
    uint256 private value;
    address private owner;

    constructor(uint256 amount) {
        value = amount;
        owner = msg.sender;
    }

    function deposit(uint256 amount) public {
        value += amount;
    }

    function withdraw(uint256 amount) public {
        if (checkValue(amount)) {
            value -= amount;
        }
    }

    function balance() public view returns (uint256) {
        return value;
    }

    function checkValue(uint256 amount) public view returns (bool) {
        return amount >= value;
    }

    function loan() public view returns (bool) {
        return value > 0;
    }
}

contract MyContract is Bank(10) {
    string private name;
    uint256 private age;

    function setName(string memory newName) public {
        name = newName;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function setAge(uint256 newAge) public {
        age = newAge;
    }

    function getAge() public view returns (uint256) {
        return age;
    }
}
