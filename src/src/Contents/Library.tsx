import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Container, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import Web3 from 'web3'
import defaultImage from "../static/Song.png"

const MusicContract = require('../contracts/MusicContract.json')
const UserContract = require('../contracts/UserContract.json')

interface songDetails{
    url: string,
    artist: string,
    name: string
}

interface LibraryProps {
    factory: any,
    web3: Web3,
    setSongData: React.Dispatch<React.SetStateAction<songDetails>>
}

const useStyles = makeStyles({
    root: {
        display: "flex"
    },
    card: {
        maxWidth: 345,
        margin: 10
    }
})

const Library = (props: LibraryProps) => {

    const classes = useStyles()
    const [renderMusic, setRenderMusic] = React.useState(<div><h1>No Music</h1></div>)
    const libraryDetails = React.useRef<any>(null)

    React.useEffect(() =>{
        loadMusic()
    })

    const handlePlay = async (index: number) => {

        try {
            const contract = libraryDetails.current[index].contract

            const accounts = await props.web3.eth.getAccounts()

            console.log(accounts)

            const owner = await contract.methods.owner().call()
            const userAddress = await props.factory.methods.users(owner).call()

            const userContract = new props.web3.eth.Contract(
                UserContract.abi,
                userAddress
            )

            const artist = await userContract.methods.name().call()

            const data = await contract.methods.getData().call()
            const hash = await contract.methods.getHash().call({from: accounts[0]})

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

    const loadMusic = async () => {
        try {
            let musicData = []
            if (props.factory === null) {
                throw Error("Connect to Wallet, or see if contracts are deployed on Network")
            }
            const accounts = await props.web3.eth.getAccounts()
            const userContractAddress = await props.factory.methods.users(accounts[0]).call()

            const userContract = new props.web3.eth.Contract(
                UserContract.abi,
                userContractAddress
            )
            const musicContracts = await userContract.methods.getOwnedMusic().call()

            for (let i = 0; i < musicContracts.length; i++) {

                const musicContract = new props.web3.eth.Contract(
                    MusicContract.abi,
                    musicContracts[i]
                )
                const data = await musicContract.methods.getData().call()
                const owner = await musicContract.methods.owner().call()

                const user = await props.factory.methods.users(owner).call()
                const music = new props.web3.eth.Contract(
                    UserContract.abi,
                    user
                )

                const artist = await music.methods.name().call()

                musicData.push({
                    contract: musicContract,
                    name: data['0'],
                    price: props.web3.utils.fromWei(data['1']),
                    artist: artist
                })
            }

            libraryDetails.current = musicData

            const comp = <Container className={classes.root}>
                {musicData.map((d, index) => (
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
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" color="primary" onClick={() => handlePlay(index)}>
                                Play
                        </Button>
                        </CardActions>
                    </Card>
                ))}
            </Container>

            setRenderMusic(comp)
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <Container className={classes.root}>
                {renderMusic}
            </Container>
        </div>
    )
}

export default Library
