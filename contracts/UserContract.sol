pragma solidity >= 0.4.0 < 0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Factory.sol";
import "./MusicContract.sol";

contract UserContract is Ownable{
    
    using SafeMath for uint;
    
    string public name;
    Factory public factory;
    MusicContract[] myMusic;
    MusicContract[] ownedMusic;
    
    constructor(string memory _name, address _owner) public{
        
        factory = Factory(msg.sender);
        name = _name;
        transferOwnership(_owner);
    }

    function getMyMusic() public view returns(MusicContract[] memory){
        return myMusic;
    }

    function getOwnedMusic() public view returns(MusicContract[] memory){
        return ownedMusic;
    }
    
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