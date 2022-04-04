// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./OtherContract.sol";

contract MyContract {
  OtherContract public otherContract = new OtherContract();

  function callOtherContract(uint a, uint b) public view returns(uint) {
    return otherContract.sum(a, b);
  }
}
