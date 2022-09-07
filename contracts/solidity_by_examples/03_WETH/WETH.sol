// SPDX-License-Identifier: MIT
//
// https://www.youtube.com/watch?v=UqKQ1bTatUs

pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @notice Just a demo of Wrapped Ether implementation.
/// @author Inspired by solmate's WETH (https://github.com/transmissions11/solmate/blob/main/src/tokens/WETH.sol)
/// @author Inspired by WETH9 (https://github.com/dapphub/ds-weth/blob/master/src/weth9.sol)
contract WETH is ERC20 {
    event Deposit(address indexed from, uint256 amount);
    event Withdraw(address indexed to, uint256 amount);

    constructor() ERC20("Wrapped ETH", "WETH") {}

    /**
     * @dev `18` is already the default value, but just wanted to show it explicit.
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }

    //              send ETH
    //                 |
    //         is msg.data empty?
    //            /        \
    //           yes        no
    //          /             \
    //  receive() exists?    fallback()
    //      /  \
    //    yes   no
    //    /       \
    // receive()  fallback()

    receive() external payable {
        deposit();
    }

    fallback() external payable {
        deposit();
    }

    function deposit() public payable {
        _mint(msg.sender, msg.value);

        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        _burn(msg.sender, amount);

        emit Withdraw(msg.sender, amount);

        payable(msg.sender).transfer(amount);
    }
}
