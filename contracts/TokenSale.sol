pragma solidity ^0.5.1;

import "./ArtToken.sol";

contract TokenSale {
    address payable admin;
    ArtToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address indexed _buyer, uint256 _amount);

    constructor(ArtToken _tokenContract, uint256 _tokenPrice) public {
        // Assign an admin
        admin = msg.sender;      
        // Add Token Constract
        tokenContract = _tokenContract;
        // Token Price
        tokenPrice = _tokenPrice;
    }
   
    /**
    * @dev Multiplies two numbers, throws on overflow.
    */
    function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
        if (a == 0) { return 0; }
        c = a * b;
        assert(c / a == b);
        return c;
    }

    // Buy Tokens func
    function buyTokens(uint256 _numberOfTokens) public payable {
        // Require that value is equal to tokens
        require(msg.value == mul(_numberOfTokens, tokenPrice));

        // Require that the contract has enough tokens
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);

        // Require that a transfer is successfull
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        // Keep track of tokenSale
        tokensSold += _numberOfTokens;

        // Trigger Sell Event
        emit Sell(msg.sender, _numberOfTokens);
    }

    // Ending Token Sale
    function endSale() public {
        // Require admin end sale
        require(msg.sender == admin, "Must be admin to end sale");

        // Transfer remaining art tokends to admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));

        // Destroy contract
        // selfdestruct(address(admin));
        
        // UPDATE: Let's not destroy the contract here
        // Just transfer the balance to the admin
        admin.transfer(address(this).balance);
    }
}

