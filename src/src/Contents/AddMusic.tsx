import { Container, Paper, Typography, Grid, TextField, Button, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import Web3 from 'web3'
import useIpfsFactory from '../ipfs'

interface AddMusicProps {
    userContract: any,
    web3: Web3
}

const useStyles = makeStyles({
    price:{
        marginTop: 10
    }
})


const AddMusic = (props: AddMusicProps) => {

    const [musicName, setMusicName] = useState("")
    const [price, setPrice] = useState(0)
    const [music, setMusic] = useState<any>(null)
    const { ipfs } = useIpfsFactory()

    const classes = useStyles()

    const handleMusicName = (event: any) => {
        setMusicName(event.target.value)
    }

    const handlePrice = (event: any) => {
        setPrice(event.target.value)
    }

    const uploadClick = (event: any) => {
        const file = event.target.files[0]
        console.log(file)
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = (encodedFile) => {
            console.log(encodedFile)
            setMusic(reader.result)
        }
    }

    const handleSubmit = async () => {
        try {

            if (props.web3 === null) {
                throw Error("Not connected to Wallet")
            }

            console.log("Music Uploading")
            const priceInWei = await props.web3.utils.toWei(`${price}`)
            const hash = await ipfs.add(music)

            if (hash === "") {
                console.log("Hash is null")
            }
            else {
                console.log(hash)

                const account = await props.web3.eth.getAccounts()
                await props.userContract.methods.addMusic(hash.path, musicName, priceInWei).send({
                    from: account[0]
                })
            }
        } catch (error) {
            alert(error.message)
        }
    }
    return (
        <Container>
            <Typography variant={"h4"} align="center"><b>Add Music</b></Typography>
            <Container>
                <form>
                    <Paper style={{ padding: 16 }}>
                        <Grid container alignItems="flex-start" spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    name="Music Name"
                                    label="Music Name"
                                    value={musicName}
                                    onChange={handleMusicName}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            fullWidth
                            className={classes.price}
                            name="Price"
                            label="Price(ETH)"
                            type="number"
                            value={price}
                            onChange={handlePrice}
                        />
                        <Button variant="contained" component="label" style={{ marginTop: "10px" }}>
                            Upload File
                            <input hidden type="file" onChange={uploadClick} accept=".mp3" />
                        </Button>
                        <Typography align="center">
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleSubmit}
                            >Add Music</Button>
                        </Typography>
                    </Paper>
                </form>
            </Container>
        </Container>
    )
}

export default AddMusic
