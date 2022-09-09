// SPDX-License-Identifier: MIT
//
// https://cryptomarketpool.com/struct

pragma solidity ^0.8.0;

contract MyContract {
    struct Todo {
        string text;
        bool completed;
    }

    Todo[] public todos;

    function create(string memory _text) public {
        todos.push(Todo(_text, false));
    }

    function get(uint256 _index) public view returns (string memory, bool) {
        Todo storage todo = todos[_index];
        return (todo.text, todo.completed);
    }
}
