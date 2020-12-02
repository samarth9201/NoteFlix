pragma solidity >= 0.4.0 < 0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Factory.sol";
import "./UserContract.sol";

/**
 * @title Music contract
 * @author Samarth Bhadane
 * @notice This is a contract to interact with song details.
 */
contract MusicContract is Ownable {
    
    string private hash;
    string public name;
    uint256 public price;
    address payable account;
    Factory factory;
    
    mapping(address => bool) buyer;
    
    /**
     * @notice constructor for Music Contract
     * @param _hash IPFS Hash of the song.
     * @param _name name of the song.
     * @param _owner address of owner of the contract.
     * @param _factory instance of Factory contract.
     */
    constructor(string memory _hash, string memory _name, uint _price, address _owner, Factory _factory) public{
        require(keccak256(abi.encodePacked(_hash)) != keccak256(abi.encodePacked("")), "Invalid hash");
        require(_factory.users(UserContract(msg.sender).owner())== UserContract(msg.sender), "Only Registered users can invoke the function");
        hash = _hash;
        name = _name;
        price = _price;
        factory = _factory;
        buyer[_owner] = true;
        transferOwnership(_owner);
        
    }
    
    /**
     * @notice This is the function where a Registered User can buy music.
     * @dev The value sent by user should be >= price of music. If the value sent > price,
     *      Appropriate value must be returned to user.
     *      An User must be Registered through factory contract in order to call this function.
     */
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
    
    /**
     * @notice The following function is used to get hash of song.
     * @dev In order to get hash, the user must buy the music.
     */
    
    function getHash() public view returns(string memory){
        require(buyer[msg.sender] || msg.sender == owner(), "Please Buy the Music");
        return hash;
    }
    
    /**
     * @notice The following function is used to get Data i.e name and price of song.
     */
    function getData() public view returns(string memory, uint){
        return (name, price);
    }
    
    /**
     * @notice The following function is used by owner to withdraw funds from smart contract
     */
    function withdraw() public onlyOwner{
        (msg.sender).transfer(address(this).balance);
    }
}