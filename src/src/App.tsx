import { AppBar, Backdrop, Button, CssBaseline, Divider, Drawer, Fade, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles, Modal, TextField, Toolbar, Tooltip, Typography } from '@material-ui/core'
import { ChevronLeft } from '@material-ui/icons'
import MenuIcon from '@material-ui/icons/Menu'
import HomeIcon from '@material-ui/icons/Home';
import QueueIcon from '@material-ui/icons/Queue';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import clsx from 'clsx'
import React, { useState } from 'react'
import Home from './Contents/Home';
import MyMusic from './Contents/MyMusic';
import Library from './Contents/Library';
import AddMusic from './Contents/AddMusic';
import MusicPlayer from './Contents/MusicPlayer';
import Web3 from 'web3';
import connectToWallet from './Contents/loadWeb3';
import SearchUser from './Contents/SearchUser';

const Factory = require('./contracts/Factory.json')
const UserContract = require('./contracts/UserContract.json')

declare global {
    interface Window {
        ethereum: any,
        web3: Web3
    }
}

interface songDetails{
    url: string,
    artist: string,
    name: string
}

const drawerWidth = 240

const DrawerData = [
    {
        text: "Home",
        IconComponent: <HomeIcon />,
    },
    {
        text: "Library",
        IconComponent: <LibraryMusicIcon />,
    },
    {
        text: "My Music",
        IconComponent: <PlayCircleFilledIcon />,
    },
    {
        text: "Add Music",
        IconComponent: <QueueIcon />
    },
    {
        text: "Search User",
        IconComponent: <AccountCircleIcon/>
    }
]

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginRight: 36
    },
    hide: {
        display: 'none'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap'
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        height: "100vh",
        marginBottom: "200px"
    },
    active: {
        borderRight: `5px solid ${theme.palette.primary.main}`,
        transition: theme.transitions.create(['border'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    Address: {
        marginLeft: 'auto',
        color: '#FFFFFF'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}))



const App = () => {

    const classes = useStyles()
    const [open, setOpen] = useState(true)
    const [openModal, setOpenModal] = useState(false)
    const [content, selectContent] = useState("Home")
    const [address, setAddress] = useState("Connect to Wallet")
    const [displayName, setDisplayName] = useState("Connect To Wallet")
    const [web3, setWeb3] = useState<any>(null)
    const [factory, setFactory] = useState<any>(null)
    const [userContract, setUserContract] = useState<any>(null)
    const [username, setUsername] = useState("")
    const [songData, setSongData] = useState<songDetails>({name:"", artist: "", url: ""})
    
    const component = (content: string) => {

        switch (content) {
            case "Home":
                return <Home factory={factory} web3={web3} setSongData={setSongData} />
            case "Library":
                return <Library factory={factory} web3={web3} setSongData={setSongData}/>
            case "Add Music":
                return <AddMusic userContract={userContract} web3={web3}/>
            case "My Music":
                return <MyMusic factory={factory} web3={web3} setSongData={setSongData}/>
            case "Search User":
                return <SearchUser factory={factory} web3={web3} setSongData={setSongData}/>
            default:
                return <div>Undefined</div>
        }
    }

    const changeOpen = () => {
        setOpen(!open)
    }

    const changeContent = async (data: string) => {
        selectContent(data)
    }

    const handleUsername = (event: any) => {
        setUsername(event.target.value)
    }

    const getWeb3 = async () => {

        const web3instance = await connectToWallet(setAddress)
        await setWeb3(web3instance)

        if (web3instance) {

            const networkId = await web3instance.eth.net.getId();
            const deployedNetwork = Factory.networks[networkId]

            const factoryInstance = new web3instance.eth.Contract(
                Factory.abi,
                deployedNetwork && deployedNetwork.address,
            );

            const accounts = await web3instance.eth.getAccounts()

            const registered = await factoryInstance.methods.isRegistered(accounts[0]).call()

            console.log(registered['0'])
            const userContractAddress = registered['1']

            await setAddress(accounts[0])
            await setFactory(factoryInstance)

            if (!registered['0']) {
                setOpenModal(true)
            }
            else {
                const userContractInstance = new web3instance.eth.Contract(
                    UserContract.abi,
                    userContractAddress,
                );

                const Name = await userContractInstance.methods.name().call()

                setUserContract(userContractInstance)
                setDisplayName(Name)

                alert("Successfully Connected to Wallet")
                setSongData({name:"", artist: "", url: ""})

            }

        }
    }

    const addUser = async () => {

        if (factory) {
            await factory.methods.addUser(username).send({ from: address })
            setOpenModal(false)
        }
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={changeOpen}
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open
                        })}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        music-stream
                    </Typography>
                    <Tooltip title={<h3>{address}</h3>} aria-label="Address" arrow>
                        <Button className={classes.Address} onClick={getWeb3}>{displayName}</Button>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open
                    })
                }}>
                <div className={classes.toolbar}>
                    <IconButton onClick={changeOpen}>
                        <ChevronLeft />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {
                        DrawerData.map((data, index) => (
                            <ListItem button className={clsx((content === data.text) && classes.active)} key={data.text} onClick={() => changeContent(data.text)}>
                                <ListItemIcon>{data.IconComponent}</ListItemIcon>
                                <ListItemText primary={data.text} />
                            </ListItem>
                        ))
                    }
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {
                    component(content)
                }
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={openModal}>
                        <div className={classes.paper}>
                            <h2 id="transition-modal-title">Register User</h2>
                            <form>
                                <TextField
                                    fullWidth
                                    required
                                    name="User Name"
                                    value={username}
                                    onChange={handleUsername}
                                    label="User Name" />
                                <br />
                                <Typography align="center" style={{ paddingTop: 15 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        onClick={addUser}>Register</Button>
                                </Typography>
                            </form>
                        </div>
                    </Fade>
                </Modal>
                <MusicPlayer songData={songData}/>
            </main>
        </div>
    )
}

export default App