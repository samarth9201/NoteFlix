const Factory = artifacts.require("Factory");
const UserContract = artifacts.require("UserContract")
const MusicContract = artifacts.require("MusicContract")
const TestFactory = artifacts.require("TestFactory")

contract("User Contract", accounts =>{

    let userContract;

    beforeEach('Setup contract for testing', async () => {
        const factoryContract = await Factory.new()
        await factoryContract.addUser("name")
        const userContractAddress = await factoryContract.users(accounts[0])
        userContract = await UserContract.at(userContractAddress)
    })

    it("Should deploy Music Contract", async () =>{

        const hash = ["Hash1", "Hash2", "Hash3", "Hash4", "Hash5", "Hash6", "Hash7"]
        const song = ["Song1", "Song2", "Song3", "Song4", "Song5", "Song6", "Song7"]

        for(var i = 0;i < hash.length; i++){
            await userContract.addMusic(hash[i], song[i], 10)
        }

        const myMusic  = await userContract.getMyMusic();

        assert.equal(myMusic.length, hash.length, `Length of myMusic[] should be equal to ${hash.length}`)

        for(var i = 0;i < hash.length; i++){
            var musicContract = await MusicContract.at(myMusic[i])
            const data = await musicContract.getData();

            assert.equal(data['0'], song[i], "Data is Incorrect")
            assert.equal(data['1'].toNumber(), 10, "Price is Incorrect")
        }
    })

    it("Should update music library on Addition of Music", async() =>{

        const hash = ["Hash1", "Hash2", "Hash3", "Hash4", "Hash5", "Hash6", "Hash7"]
        const song = ["Song1", "Song2", "Song3", "Song4", "Song5", "Song6", "Song7"]

        for(var i = 0;i < hash.length; i++){
            await userContract.addMusic(hash[i], song[i], 10)
        }

        const factoryContractAddress = await userContract.factory()
        const factoryContract = await Factory.at(factoryContractAddress)

        const musicLibrary = await factoryContract.getLibrary()
        const myMusic  = await userContract.getMyMusic();

        assert.equal(musicLibrary.length, myMusic.length, "Length of Library and Music should be equal")
        
        for (var i = 0; i < musicLibrary.length; i++) {
            assert.equal(myMusic[i], musicLibrary[i], `My Music : ${myMusic} and Music Library : ${musicLibrary} should match at index ${i}`)
        }
    })

    it("Should revert if account other than owner add Music", async() =>{
        try{
            await userContract.addMusic("hash", "song", 10, {from: accounts[1]})

            throw null
        }
        catch(error){
            assert(error.message, "Error is null")
        }
    })
    it("Should revert if updateOwnedMusic() is called externally", async () =>{
        try{
            await userContract.addMusic("hash", "song", 10, {from: accounts[0]})
            const myMusic = await userContract.getMyMusic()
            await userContract.updateOwnedMusic(myMusic[0], {from: accounts[0]})
            throw null
        }
        catch(error){
            assert(error != null, "Should not be null")
        }
    })
    it("Should update ownedMusic when user buy music", async () =>{

        const factoryContractAddress = await userContract.factory()
        const factoryContract = await Factory.at(factoryContractAddress)
        await userContract.addMusic("hash", "song", 10, {from: accounts[0]})
        await factoryContract.addUser("User2", {from: accounts[1]})
        const userContractAddress = await factoryContract.users(accounts[1])
        const userContract1 = await UserContract.at(userContractAddress)
        const myMusic = await userContract.getMyMusic()
        const musicContract = await MusicContract.at(myMusic[0])
        await musicContract.buyMusic({from: accounts[1], value: 10})
        const ownedMusic = await userContract1.getOwnedMusic()

        assert.equal(ownedMusic.length, 1, "Owned Music Not updated")
        assert.equal(ownedMusic[0], myMusic[0], "Owned Music not updated")
    })
})