// SPDX-License-Identifier: MIT
//
// https://cryptomarketpool.com/importing-into-a-contract

pragma solidity ^0.8.0;

import "./OtherContract.sol";

contract MyContract {
    OtherContract public otherContract = new OtherContract();

    function callOtherContract(uint256 a, uint256 b) public view returns (uint256) {
        return otherContract.sum(a, b);
    }
}
