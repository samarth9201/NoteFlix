pragma solidity >= 0.4.0 < 0.7.0;

import "./UserContract.sol";
import "./MusicContract.sol";

contract Factory{
    
    mapping (address => UserContract) public users;
    MusicContract[] musicLibrary;
    
    function isContract(address _addr) private view returns (bool){
        uint32 size;
        assembly {
            size := extcodesize(_addr)
        }
        return (size > 0);
    }

    function isRegistered(address _address) public view returns(bool, UserContract){
        return ((address(users[_address]) != address(0)), users[_address]);
    }

    
    function addUser(string memory _name) public returns(UserContract){
        require(!isContract(msg.sender), "Contract can't be a User");
        require(users[msg.sender] == UserContract(address(0)), "User already exists");
        
        UserContract userContract = new UserContract(_name, msg.sender);
        
        users[msg.sender] = userContract;
        return userContract;
    }
    
    function addMusicToLibrary(MusicContract _musicContract) public{
        musicLibrary.push(_musicContract);
    }

    function getLibrary() public view returns(MusicContract[] memory){
        return musicLibrary;
    }
}