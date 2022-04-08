// SPDX-License-Identifier: MIT
//
// https://cryptomarketpool.com/how-to-write-an-if-statement-in-solidity/

pragma solidity ^0.8.0;

contract MyContract {
  string public symbol;

  function symbolNum(uint _symbolNum) public {
    if (_symbolNum == 1) {
      symbol = "BTC";
    } else if (_symbolNum == 2) {
      symbol = "ETH";
    } else {
      symbol = "CRAPCOIN";
    }
  }
}
