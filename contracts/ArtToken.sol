pragma solidity ^0.5.1;

contract ArtToken {
    // Name of the Token
    string public name = "Art Token";
    // Symbol of the Token
    string public symbol = "ART";
    string public standart = "Art Token v1.0";
    // Total token supply
    uint256 public totalSupply;
    
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    mapping(address => uint256) public balanceOf;

    // Contructor
    // Set the total number of tokens
    constructor(uint256 _initialSupply) public {   
        // allocat the initial supply
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }
    // Read the total number of tokens

    // Transfer
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Not enough funds.");
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}