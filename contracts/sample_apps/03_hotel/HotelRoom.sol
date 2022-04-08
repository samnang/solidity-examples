// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract HotelRoom {
  //create an emun with 2 status so we can keep track of our hotel room
  enum Statuses { Vacant, Occupied }
  Statuses currentStatus;

  //create an event for others that want to subscribe to events like a smart lock to unlock the door
  event Occupy(address _occupant, uint _value);

  address payable public owner;

  constructor() {
    owner = payable(msg.sender);
    currentStatus = Statuses.Vacant;
  }

  modifier onlyWhileVacant {
    require(currentStatus == Statuses.Vacant, "Currently Occupied");
    _;
  }

  modifier costs(uint _amount) {
    require(msg.value >= _amount, "Not enough Ether provided");
    _;
  }

  receive() external payable onlyWhileVacant costs(2 ether) {
    currentStatus = Statuses.Occupied;
    owner.transfer(msg.value);
    emit Occupy(msg.sender, msg.value);
  }
}
