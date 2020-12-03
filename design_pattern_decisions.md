# Design Pattern Decisions

The contracts used in the project do not follow any major design pattern except Factory pattern but most functions have restricted access. Some functions are only accessible to Owner of contract
while some functions can be called by some specific contracts only.

For example, 

In User Contract, only owner can call the addMusic() function.

```
    function addMusic(string memory _hash, string memory _name, uint _price) public onlyOwner{
        
        MusicContract musicContract = new MusicContract(_hash, _name, _price, owner(), factory);
        myMusic.push(musicContract);
        factory.addMusicToLibrary(musicContract);
    }
```
onlyOwner is a modifier implemented on OpenZeppelin's Ownable.sol.

### Factory Pattern :

In this pattern, a Factory contract deploys new "child" contracts. The Factory is used to store addresses of Child contracts so that they can be used when required.

The project follows the Factory Pattern as Factory Contract is used to deploy new User Contracts when new user registers. The User Contract also acts as a Factory contract 
for Music Contracts to deploy new Music Contracts.

![Factory Pattern](https://github.com/samarth9201/music-stream-decentralized/blob/master/images/FactoryPattern.png)

