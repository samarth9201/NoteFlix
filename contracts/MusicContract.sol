pragma solidity >= 0.4.0 < 0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Factory.sol";
import "./UserContract.sol";

contract MusicContract is Ownable {
    
    string private hash;
    string public name;
    uint256 public price;
    address payable account;
    Factory factory;
    
    mapping(address => bool) buyer;
    
    constructor(string memory _hash, string memory _name, uint _price, address _owner, Factory _factory) public{
        require(keccak256(abi.encodePacked(_hash)) != keccak256(abi.encodePacked("")), "Invalid hash");
        hash = _hash;
        name = _name;
        price = _price;
        factory = _factory;
        buyer[_owner] = true;
        transferOwnership(_owner);
        
    }
    
    function buyMusic() public payable{
        require(msg.value >= price, "Please Pay complete price");
        require(address(factory.users(msg.sender)) != address(0), "User Not Registered");
        require(buyer[msg.sender] == false, "Music already bought");
        
        if(msg.value > price){
            (msg.sender).transfer(msg.value - price);
        }
        buyer[msg.sender] = true;
        UserContract user;
        bool registered;
        (registered, user) = factory.isRegistered(msg.sender);
        user.updateOwnedMusic(this);
    }
    
    function getHash() public view returns(string memory){
        require(buyer[msg.sender] || msg.sender == owner(), "Please Buy the Music");
        return hash;
    }
    
    function getData() public view returns(string memory, uint){
        return (name, price);
    }
    
    function withdraw() public onlyOwner{
        (msg.sender).transfer(address(this).balance);
    }
}