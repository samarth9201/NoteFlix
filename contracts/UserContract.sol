pragma solidity >= 0.4.0 < 0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Factory.sol";
import "./MusicContract.sol";

/**
 * @title UserContract
 * @author Samarth Bhadane
 * @notice UserContract contains user data, his name, songs added by user and songs which the user bought.
 */
contract UserContract is Ownable{
        
    string public name;
    Factory public factory;
    MusicContract[] myMusic;
    MusicContract[] ownedMusic;
    
    /**
     * @notice constructor for UserContract.
     * @param _name of user.
     * @param _owner address of owner of Contract.
     */
    constructor(string memory _name, address _owner) public{
        
        factory = Factory(msg.sender);
        name = _name;
        transferOwnership(_owner);
    }
    
    /**
     * @notice The following function is used to get music added by user.
     */
    function getMyMusic() public view returns(MusicContract[] memory){
        return myMusic;
    }
    
    /**
     * @notice The following function is used to get music owned by user.
     */
    function getOwnedMusic() public view returns(MusicContract[] memory){
        return ownedMusic;
    }
    
    /**
     * @notice The following function is used by owner to add music i.e deploy new music contract.
     * @dev only Owner must call this function.
     */
    function addMusic(string memory _hash, string memory _name, uint _price) public onlyOwner{
        
        MusicContract musicContract = new MusicContract(_hash, _name, _price, owner(), factory);
        myMusic.push(musicContract);
        factory.addMusicToLibrary(musicContract);
    }

    function updateOwnedMusic(MusicContract _contract) public{
        require(MusicContract(msg.sender) == _contract, "Invalid Operatior");
        ownedMusic.push(_contract);
    }
}