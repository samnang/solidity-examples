// SPDX-License-Identifier: MIT
//
// https://cryptomarketpool.com/data-types-in-solidity-smart-contracts/

pragma solidity ^0.8.7;

contract SolidityOperatorExample {
  uint public variable_add = 70;
  uint public variable_sub = 50;
  uint public variable_mul = 25;
  uint public variable_div = 80;
  uint public variable_mod = 68;

  function getResults() public {
    variable_add += 25;
		variable_sub -= 30;
		variable_mul *= 25;
		variable_div /= 5;
		variable_mod %= 60;
		return ;
  }
}
