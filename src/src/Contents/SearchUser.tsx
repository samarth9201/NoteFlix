import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Container, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import React from 'react'
import Web3 from 'web3'
import defaultImage from "../static/Song.png"

const MusicContract = require('../contracts/MusicContract.json')
const UserContract = require('../contracts/UserContract.json')

const useStyles = makeStyles({
    root: {
        display: "flex"
    },
    card: {
        maxWidth: 345,
        margin: 10
    },
    comp:{
        marginBottom: 150,
    }
})

interface songDetails {
    url: string,
    artist: string,
    name: string
}

interface SearchUserProps {
    factory: any,
    web3: Web3,
    setSongData: React.Dispatch<React.SetStateAction<songDetails>>
}

const SearchUser = (props: SearchUserProps) => {
    const classes = useStyles()
    const [renderMusic, setRenderMusic] = React.useState(<div></div>)
    const [username, setUserName] = React.useState("")

    const handleUserName = (event: any) => {
        setUserName(event.target.value)
    }

    const handleBuy = async (contractData: any) => {
        try {
            const contract = contractData.contract
            const accounts = await props.web3.eth.getAccounts()

            await contract.methods.buyMusic().send({
                from: accounts[0],
                value: props.web3.utils.toWei(contractData.price)
            })
        }
        catch (error) {
            console.log(error.message)
        }
    }

    const handlePlay = async (contractData: any) => {

        try {
            console.log("Contract Data", contractData)
            const contract = contractData.contract

            const accounts = await props.web3.eth.getAccounts()

            const owner = await contract.methods.owner().call()
            const userAddress = await props.factory.methods.users(owner).call()

            const userContract = new props.web3.eth.Contract(
                UserContract.abi,
                userAddress
            )

            const artist = await userContract.methods.name().call()

            const data = await contract.methods.getData().call()
            const hash = await contract.methods.getHash().call({ from: accounts[0] })

            console.log(hash)

            props.setSongData({
                artist: artist,
                name: data['0'],
                url: `https://ipfs.io/ipfs/${hash}`
            })
        }

        catch (error) {
            console.log(error.message)
            alert("Please Buy Music to Play it")
        }
    }

    const handleSubmit = async () => {
        loadMusic()
    }

    const loadMusic = async () => {
        try {
            let addedMusicData: any = []
            let ownedMusicData: any = []
            if (props.factory === null) {
                throw Error("Connect to Wallet, or see if contracts are deployed on Network")
            }
            const userContractAddress = await props.factory.methods.userNames(username).call()

            const userContract = new props.web3.eth.Contract(
                UserContract.abi,
                userContractAddress
            )
            const addedMusicContracts = await userContract.methods.getMyMusic().call()
            const ownedMusicContracts = await userContract.methods.getOwnedMusic().call()

            for (let i = 0; i < addedMusicContracts.length; i++) {

                const musicContract = new props.web3.eth.Contract(
                    MusicContract.abi,
                    addedMusicContracts[i]
                )
                const bal = await props.web3.eth.getBalance(addedMusicContracts[i])

                const data = await musicContract.methods.getData().call()
                const owner = await musicContract.methods.owner().call()

                const user = await props.factory.methods.users(owner).call()
                const music = new props.web3.eth.Contract(
                    UserContract.abi,
                    user
                )

                const artist = await music.methods.name().call()

                addedMusicData.push({
                    contract: musicContract,
                    name: data['0'],
                    price: props.web3.utils.fromWei(data['1']),
                    artist: artist,
                    balance: props.web3.utils.fromWei(bal)
                })
            }

            for (let i = 0; i < ownedMusicContracts.length; i++) {

                const musicContract = new props.web3.eth.Contract(
                    MusicContract.abi,
                    ownedMusicContracts[i]
                )
                const bal = await props.web3.eth.getBalance(addedMusicContracts[i])

                const data = await musicContract.methods.getData().call()
                const owner = await musicContract.methods.owner().call()

                const user = await props.factory.methods.users(owner).call()
                const music = new props.web3.eth.Contract(
                    UserContract.abi,
                    user
                )

                const artist = await music.methods.name().call()

                ownedMusicData.push({
                    contract: musicContract,
                    name: data['0'],
                    price: props.web3.utils.fromWei(data['1']),
                    artist: artist,
                    balance: props.web3.utils.fromWei(bal)
                })
            }

            const comp = <Container className = {classes.comp}>
                <Typography variant="h5" component="h5">
                    Added Music : 
                </Typography>
                <Container className={classes.root}>
                    {addedMusicData.map((d: any, index: number) => (
                        <Card key={index} className={classes.card}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    alt="Music"
                                    height="140"
                                    image={defaultImage}
                                    title={`${d.name}`}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {d.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        <i>{d.artist}</i>
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        Price : <b>{d.price}</b> ETH
                                </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        Balance : <b>{d.balance}</b> ETH
                                </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small" color="primary" onClick={() => handlePlay(addedMusicData[index])}>
                                    Play
                        </Button>
                                <Button size="small" color="primary" onClick={() => handleBuy(addedMusicData[index])}>
                                    Buy
                        </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Container>
                <Typography variant="h5" component="h5">
                    Buyed Music : 
                </Typography>
                <Container className={classes.root}>
                {ownedMusicData.map((d: any, index: number) => (
                    <Card key={index} className={classes.card}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                alt="Music"
                                height="140"
                                image={defaultImage}
                                title={`${d.name}`}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {d.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    <i>{d.artist}</i>
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Price : <b>{d.price}</b> ETH
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Balance : <b>{d.balance}</b> ETH
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" color="primary" onClick={() => handlePlay(ownedMusicData[index])}>
                                Play
                        </Button>
                            <Button size="small" color="primary" onClick={() => handleBuy(ownedMusicData[index])}>
                                Buy
                        </Button>
                        </CardActions>
                    </Card>
                ))}
            </Container>
            </Container>

            setRenderMusic(comp)
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <Container>
            <Typography variant={"h4"} align="center"><b>Search User</b></Typography>
            <Container>
                <form>
                    <Paper style={{ padding: 16 }}>
                        <Grid container alignItems="flex-start" spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    name="Username"
                                    label="Username"
                                    value={username}
                                    onChange={handleUserName} />

                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={handleSubmit}
                                    style={{ marginTop: 10 }}
                                >Search</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </form>
            </Container>
            {renderMusic}
        </Container>
    )
}

export default SearchUser


