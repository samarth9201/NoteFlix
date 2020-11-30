const Factory = artifacts.require("Factory")
const UserContract = artifacts.require("UserContract")
const MusicContract = artifacts.require("MusicContract")

contract("Music", accounts => {

    let musicContract;
    let factoryContract;
    const SongName = "Song"
    const HashName = "Hash"
    const Price = 100

    beforeEach('Setup contract for testing', async () => {
        factoryContract = await Factory.new()
        await factoryContract.addUser("name")
        const userContractAddress = await factoryContract.users(accounts[0])
        const userContract = await UserContract.at(userContractAddress)
        await userContract.addMusic(HashName, SongName, Price);
        const musicContractAddress = await userContract.getMyMusic()
        musicContract = await MusicContract.at(musicContractAddress[0])
    })
    it("Should have correct name, price and hash", async () => {

        const data = await musicContract.getData()

        const hash = await musicContract.getHash();

        assert.equal(hash, HashName, "Hash and HashName must be equal")

        assert.equal(data['0'], SongName, "Song Name should be equal")
        assert.equal(data['1'].toNumber(), Price, "Song Price should be 10")
    })

    it("Should revert the transaction if msg.value < price of music", async () => {

        try {
            await musicContract.buyMusic({ from: accounts[0], value: Price / 2 })

            throw null
        }
        catch (error) {
            assert(error.message, "Error message is null")
        }
    })

    it("Should revert if a user not registered to Factory Buy Music", async () => {
        try {
            await musicContract.buyMusic({ from: accounts[1], value: Price })

            throw null;
        }
        catch (error) {
            assert(error.message, "Error message is null")
        }
    })

    it("Should revert if a user tries to buy same music multiple times", async () => {
        try {
            await musicContract.buyMusic({ from: accounts[0], value: Price })
            await musicContract.buyMusic({ from: accounts[0], value: Price })

            throw null
        }
        catch (error) {
            assert(error.message, "Error Message is null")
        }
    })

    it("Should revert if an account if getHash() is called by user who has not bought music", async () => {
        try {
            const hash = await musicContract.getHash({ from: accounts[1] })

            throw null
        }
        catch (error) {
            assert(error.message, "Error Message is Null")
        }
    })

    it("Should return the extra amount if msg.value > price", async () => {

        await factoryContract.addUser("Name1", { from: accounts[1] })

        await musicContract.buyMusic({ from: accounts[1], value: Price * 10 })
        const contractBalance = await web3.eth.getBalance(musicContract.address)

        assert.equal(contractBalance, Price, `Balance of contract shall be ${Price}`)
    })

    it("Should allow owner to withdraw balance from musicContract", async () => {

        for (var i = 1; i <= 5; i++) {
            await factoryContract.addUser("Name", { from: accounts[i] })
            await musicContract.buyMusic({ from: accounts[i], value: Price })
        }

        const contractBalance = await web3.eth.getBalance(musicContract.address)
        assert.equal(contractBalance, 5 * Price, "Balance is not updated")

        await musicContract.withdraw()
        const updatedBalance = await web3.eth.getBalance(musicContract.address)

        assert.equal(updatedBalance, 0, "Balance is not zero")

    })

    it("Should revert if other accounts call withdraw()", async () => {

        try {
            for (var i = 1; i <= 5; i++) {
                await factoryContract.addUser("Name", { from: accounts[i] })
                await musicContract.buyMusic({ from: accounts[i], value: Price })
            }

            const contractBalance = await web3.eth.getBalance(musicContract.address)
            assert.equal(contractBalance, 5 * Price, "Balance is not updated")

            await musicContract.withdraw({ from: accounts[1] })

            throw null
        }
        catch(error){
            assert(error.message, "Error message is null")
        }

    })
})