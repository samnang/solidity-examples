// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract MyContract {
  enum Status {
    Pending,
    Shipped,
    Accepted,
    Rejected,
    Canceled
  }

  Status public status;

  function ship() public {
    require(status == Status.Pending);
    status = Status.Shipped;
  }
}
