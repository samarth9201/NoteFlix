const Factory = artifacts.require("Factory");
const UserContract = artifacts.require("UserContract")
const TestFactory = artifacts.require("TestFactory")

contract("Factory", accounts => {

    it("Should deploy user contracts", async () => {

        const name = "Name"
        const factoryContract = await Factory.new();

        await factoryContract.addUser(name)


        const userContractAddress = await factoryContract.users(accounts[0])

        const userContract = await UserContract.at(userContractAddress)
        const nameFetched = await userContract.name()

        assert.equal(name, nameFetched, "Should be equal")
    })

    it("Should create multiple UserContracts for different accounts", async () => {

        const name = ["Name1", "Name2", "Name3"]

        const factoryContract = await Factory.new();

        await factoryContract.addUser(name[0], { from: accounts[0] })
        await factoryContract.addUser(name[1], { from: accounts[1] })
        await factoryContract.addUser(name[2], { from: accounts[2] })


        for (i = 0; i < 3; i++) {

            const userContractAddress = await factoryContract.users(accounts[i])

            const userContract = await UserContract.at(userContractAddress)
            const nameFetched = await userContract.name()

            assert.equal(name[i], nameFetched, "Should be equal")
        }
    })

    it("Should fail while creating multiple accounts for same user", async () => {

        const PREFIX = "VM Exception while processing transaction: ";
        try {
            const name = "Name"
            const factoryContract = await Factory.new();

            await factoryContract.addUser(name)

            await factoryContract.addUser(name)

            throw null

        }
        catch (error) {
            assert(error != null)
        }
    })

    it("Should Update Music Library when user adds music", async () => {

        const name = ['name1', 'name2', 'name3']
        const hashes = ['hash1', 'hash2', 'hash3', 'hash4', 'hash5']
        const song = ['song1', 'song2', 'song3', 'song4', 'song5']
        const factoryContract = await Factory.new();
        var allMusic = []
        var myMusic, temp

        await factoryContract.addUser(name[0], { from: accounts[0] })
        await factoryContract.addUser(name[1], { from: accounts[1] })
        await factoryContract.addUser(name[2], { from: accounts[2] })

        var userContractAddress = await factoryContract.users(accounts[0])

        var userContract = await UserContract.at(userContractAddress)
        await userContract.addMusic(hashes[0], song[0], 10)
        await userContract.addMusic(hashes[1], song[1], 10)

        myMusic = await userContract.getMyMusic()

        userContractAddress = await factoryContract.users(accounts[1])
        userContract = await UserContract.at(userContractAddress)
        await userContract.addMusic(hashes[2], song[2], 10, {from: accounts[1]})

        temp = await userContract.getMyMusic()
        myMusic = myMusic.concat(temp)

        userContractAddress = await factoryContract.users(accounts[2])
        userContract = await UserContract.at(userContractAddress)
        await userContract.addMusic(hashes[3], song[3], 10, {from: accounts[2]})
        await userContract.addMusic(hashes[4], song[4], 10, {from: accounts[2]})

        temp = await userContract.getMyMusic()
        myMusic = myMusic.concat(temp)

        const musicLibrary = await factoryContract.getLibrary()

        assert.equal(myMusic.length, musicLibrary.length, "Length of MyMusic and MusicLibrary must be same")

        for (var i = 0; i < musicLibrary.length; i++) {
            assert.equal(myMusic[i], musicLibrary[i], `My Music : ${myMusic} and Music Library : ${musicLibrary} should match at index ${i}`)
        }
    })

    it("Should revert if an contract tries to call addUser", async () => {

        try {
            const factoryContract = await Factory.new();
            const testFactory = await TestFactory.new();

            await testFactory.addUser(factoryContract.address)

            throw null
        }
        catch(error){
            assert(error != null, "Should not be null")
        }
    })
});
