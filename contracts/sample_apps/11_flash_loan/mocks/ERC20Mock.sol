// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @dev Give free tokens to anyone in the testing environment
contract ERC20Mock is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address receiver, uint256 amount) external {
        _mint(receiver, amount);
    }
}
