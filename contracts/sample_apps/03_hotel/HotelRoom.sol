// SPDX-License-Identifier: MIT
//
// https://cryptomarketpool.com/hotel-contract

pragma solidity ^0.8.0;

// The sample hotel and vending Solidity smart contract below allows one to rent a hotel room.
// It allows someone to make a payment for a room if the room is vacant. After payment is made to the contract the funds are sent to the owner.
// This smart contract can be expanded to unlock the door or dispense a key code after payment is made.
//
// Think of this contract like a vending machine. You input funds, validations pass, and you get something in return.
// It is the same concept as a gumball machine.

contract HotelRoom {
    //create an emun with 2 status so we can keep track of our hotel room
    enum Statuses {
        Vacant,
        Occupied
    }
    Statuses currentStatus;

    //create an event for others that want to subscribe to events like a smart lock to unlock the door
    event Occupy(address _occupant, uint256 _value);

    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
        currentStatus = Statuses.Vacant;
    }

    modifier onlyWhileVacant() {
        require(currentStatus == Statuses.Vacant, "Currently Occupied");
        _;
    }

    modifier costs(uint256 _amount) {
        require(msg.value >= _amount, "Not enough Ether provided");
        _;
    }

    receive() external payable onlyWhileVacant costs(2 ether) {
        currentStatus = Statuses.Occupied;
        owner.transfer(msg.value);
        emit Occupy(msg.sender, msg.value);
    }
}
