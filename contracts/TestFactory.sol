pragma solidity >= 0.4.0 < 0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import './Factory.sol';

contract TestFactory is Ownable{

    function addUser(Factory _factory) public {

        _factory.addUser("Test Factory");
    }
}