import { CardMedia, Grid, IconButton, makeStyles, Slider, Typography } from '@material-ui/core'
import { PlayArrowRounded, SkipNext, SkipPrevious } from '@material-ui/icons'
import PauseIcon from '@material-ui/icons/Pause';
import React, { useState } from 'react'
import defaultImage from '../static/Song.png'

interface songDetails {
    url: string,
    artist: string,
    name: string
}

interface PlayerProps {
    songData: songDetails
}

const useStyles = makeStyles(theme => ({
    root: {
        right: 0,
        left: 0,
        bottom: 0,
        position: 'fixed',
        height: 150,
        width: "60%",
        boxShadow: "0 4px 5px 6px rgba(0, 0, 0, 0.2)",
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: '#fff',
        display: 'flex',
        padding: 10,
        alignItems: 'stretch',
        marginLeft: 'auto',
        marginRight: 'auto',
        justifyContent: 'center',
        [theme.breakpoints.down('xs')]: {
            width: "100%"
        }
    },
    media: {
        height: "75%",
        width: "15%",
        boxShadow: "0 5px 10px -1px rgba(0, 0, 0, 0.2)",
        marginRight: "5%"
    },
    songController: {
        display: 'flex',
        flexDirection: 'row'
    },
    controlButtons: {
        marginLeft: "30px"
    },
    container: {
        display: 'flex',
        flexDirection: 'column'
    },
    sliderContainer: {
        display: "flex"
    },
    slider: {
        marginRight: "15px",
        marginLeft: "15px"
    },
    appBar: {
        top: 'auto',
        bottom: 0,
        height: 150
    }
}))

const MusicPlayer = (props: PlayerProps) => {

    const classes = useStyles()
    const [play, setPlay] = useState(false)
    const [duration, setDuration] = useState(0)
    const audioRef = React.useRef<HTMLAudioElement>(null)


    const getTime = (time: number): string => {
        if (!isNaN(time)) {
            return Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2)
        }
        else {
            return "00:00"
        }
    }

    React.useEffect(() => {
        if (audioRef && audioRef.current) {
            audioRef.current.ontimeupdate = (event) => {
                if (audioRef.current) {
                    setDuration(audioRef.current.currentTime)
                }
            }
        }
    })

    React.useEffect(() => {
        if (audioRef && audioRef.current) {
            if (play) {

                audioRef.current.play();
            }
            else {
                audioRef.current.pause();
            }
        }
    }, [play])

    const changeStatus = () => {
        setPlay(!play)
    }

    const handleChange = (event: any, newValue: number | number[]) => {
        setDuration(newValue as number);
        if (audioRef && audioRef.current) {
            console.log(audioRef)
        }
    };
    return (
        <Grid container className={classes.root}>
            <audio src={props.songData.url} ref={audioRef} />
            <CardMedia
                title="Song"
                image={defaultImage}
                className={classes.media} />
            <div className={classes.container}>
                <div className={classes.songController}>
                    <div>
                        <Typography variant="h6">
                            <b>
                                {props.songData.name}
                            </b>
                        </Typography>
                        <Typography variant="subtitle1">
                            <i>{props.songData.artist}</i>
                        </Typography>
                    </div>
                    <div className={classes.controlButtons}>
                        <IconButton>
                            <SkipPrevious />
                        </IconButton>
                        <IconButton onClick={changeStatus}>
                            {
                                (play) ? <PauseIcon /> : <PlayArrowRounded />
                            }
                        </IconButton>
                        <IconButton>
                            <SkipNext />
                        </IconButton>
                    </div>
                </div>
                <div className={classes.sliderContainer}>
                    {getTime(duration)}
                    <Slider max={audioRef.current ? audioRef.current.duration : 100} className={classes.slider} value={duration} onChange={handleChange} aria-labelledby="continuous-slider" />
                    {
                        (audioRef.current) ? <span>{getTime(audioRef.current.duration)}</span> : <span>{getTime(0)}</span>
                    }
                </div>
            </div>
        </Grid>
    )
}

export default MusicPlayer
