pragma solidity ^0.5.1;

contract ArtToken {
    // Name of the Token
    string public name = "Art Token";
    // Symbol of the Token
    string public symbol = "ART";
    string public standard = "Art Token v1.0";
    // Total token supply
    uint256 public totalSupply;
    
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Contructor
    // Set the total number of tokens
    // Read the total number of tokens
    constructor(uint256 _initialSupply) public {   
        // allocat the initial supply
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    // Transfer
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Not enough funds.");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    // approve
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    // transfer from
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value, "Not enough funds.");
        require(allowance[_from][msg.sender] >= _value, "Cannot transfer value larger than approved amount.");
        // Change balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;    
        // Update the allowance
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }
}
