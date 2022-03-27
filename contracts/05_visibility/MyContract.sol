// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract MyContract {
  // Private – A private function/state variable is only available inside the contract that defines it. It is generally good practice to keep functions private.
  // Internal – A internal function/state variable is only available inside the contract that defines it AND any contracts that inherit it
  // External – An external function can only be called by external contacts.  Not visible inside the contract that defines it.
  // Public – A public function/state variable is available to any contract or third party that wants to call it. Public is the default if visibility is not specified.

  // private state variable
  string private name;
  uint internal age = 35;
  string public id = "123";

  // public function
  function setName(string memory newName) public {
    name = newName;
  }

  // public function
  function getName() public view returns(string memory) {
    return name;
  }

  function getAge() public view returns(uint) {
    return privateFunction();
  }

  function privateFunction() private view returns(uint) {
    return age;
  }

  function externalFunction() external pure returns(string memory) {
    return "external-function";
  }
}
