pragma solidity ^0.5.1;

import "./ArtToken.sol";

contract ArtTokenSale {
    address admin;
    ArtToken public tokenContract;
    uint256 public tokenPrice;

    constructor(ArtToken _tokenContract, uint256 _tokenPrice) public {
        // Assign an admin
        admin = msg.sender;      
        // Add Token Constract
        tokenContract = _tokenContract;
        // Token Price
        tokenPrice = _tokenPrice;
    }
}

