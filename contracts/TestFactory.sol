pragma solidity >= 0.4.0 < 0.7.0;

import './Factory.sol';

contract TestFactory{

    function addUser(Factory _factory) public {

        _factory.addUser("Test Factory");
    }
}