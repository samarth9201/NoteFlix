1. Reentrancy
    When an external contract is called, the contracts take over control flow. This may cause the different invocations of the function to interact in destructive ways. In my contracts, whenever external calls
    are made, it is made sure that the calling contracts are not malicious. Also, if it is required that
    a contract cannot call a function, it is checked if calling address is a contract or not.

    For Example,
    
    1. Using proper require statement to make sure calling contract is the only contract supposed to call
        that function.
        For example, an MusicContract when created using UserContract, the UserContract shall call 
        addMusicToLibrary() function of factory. It shall be made sure that UserContract is the only contract that has deployed Music Contract. The following require statement confirms this.

        ```
        function addMusicToLibrary(MusicContract _musicContract) public{
            require(UserContract(msg.sender) == users[_musicContract.owner()], "Invalid Function Call");
            musicLibrary.push(_musicContract);
        }
        ```

    2. In Factory contract, it is required that only an Externally Owned account must be able to add user.
    To do this, it must be checked that msg.sender is not a contract.
    The following function returns if an address is a contract or externally owned account:

    ```
    function isContract(address _address) private view returns (bool){
        uint32 size;
        assembly {
            size := extcodesize(_address)
        }
        return (size > 0);
    }
    ```

    Using require in addUser() prevents calling this function from a contract.

    ```
    function addUser(string memory _name) public returns(UserContract){
        require(!isContract(msg.sender), "Contract can't be a User");
        
        ...
    }
    ```

2. Denial of Service: 
    Each Block has a limit on amount of gas it can pay and computation that can be performed. This is known as Block Gas Limit. For example, if you have to loop in an array and perform computation, if the array is very large, it may result in exceeding the Block Gas Limit. In my contracts, none of the contracts uses loops. Hence, DoS with Block Gas Limit is unlikely to occur. Also, all functions are computationally cheap hence flooding of transactions may not result in Block Stuffing.

3. Integer Overflow and Underflow:
    Integer Overflow and Underflow is a major issue. If integer overflow or underflow occurs, they are reset to minimum and maximum values. My Contracts does not involve computations, so the integer overflow or underflow does not occur.