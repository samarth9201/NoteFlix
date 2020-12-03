pragma solidity >= 0.4.0 < 0.7.0;

import "./UserContract.sol";
import "./MusicContract.sol";

/**
 * @title Factory Contract
 * @author Samarth Bhadane
 * @notice This contract is used as a factory for user contract and for storing address of all music contracts deployed.
 */

contract Factory{
    
    mapping (address => UserContract) public users;
    mapping (string => UserContract) public userNames;
    MusicContract[] musicLibrary;
    
    /**
     * @notice Check if an address provided is a contract. If yes, return true else return false.
     * @dev This function will return true if an address is a smart contract, else return false.
     * @param _address is address for which check is to be done.
     * @return boolean value (true or false).
     */
    function isContract(address _address) private view returns (bool){
        uint32 size;
        assembly {
            size := extcodesize(_address)
        }
        return (size > 0);
    }
    
    /**
     * @notice Check if an address provided has Registered. If yes, return true, else false.
     * @dev This function will return true if an address has registered using addUser(), else return false.
     * @param _address is for which check is to be done.
     * @return boolean value (true or false).
     */
    function isRegistered(address _address) public view returns(bool, UserContract){
        return ((address(users[_address]) != address(0)), users[_address]);
    }

    /**
     * @notice This function is used to Register new user.
     * @dev This function will add a new user. The transaction will be revoked if a Smart Contract invokes this function.
     *      After successful execution, the value of users[msg.sender] is set to true which shows successful registration
     *      of user. If an user who has already registered invokes this function, the transaction will be revoked.
     * @param _name is string. This name is assigned to UserContract.
     * @return Returns address of deployed UserContract.
     */
    function addUser(string memory _name) public returns(UserContract){
        require(!isContract(msg.sender), "Contract can't be a User");
        require(users[msg.sender] == UserContract(address(0)), "User already exists");
        require(userNames[_name] == UserContract(address(0)), "Name already in Use");
        
        UserContract userContract = new UserContract(_name, msg.sender);
        userNames[_name] = userContract;
        users[msg.sender] = userContract;
        return userContract;
    }
    
    /**
     * @notice This function adds address to musicLibrary[] on addition of new music by user.
     * @param _musicContract is instance of MusicContract which is to be added.
     */
    function addMusicToLibrary(MusicContract _musicContract) public{
        require(UserContract(msg.sender) == users[_musicContract.owner()], "Invalid Function Call");
        musicLibrary.push(_musicContract);
    }
    
    /**
     * @return Returns the array musicLibrary[] which is collection musics.
     */
    function getLibrary() public view returns(MusicContract[] memory){
        return musicLibrary;
    }
}