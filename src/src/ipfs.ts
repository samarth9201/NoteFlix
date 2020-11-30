import IPFS from 'ipfs'
import { useEffect, useState } from 'react'

declare global{
    interface Window{
        ipfs: any
    }
}

let ipfs: any = null

const useIpfsFactory = () =>{
    const [isIpfsReady, setIpfsReady] = useState(Boolean(ipfs))
    const [ipfsInitError, setIpfsInitError] = useState(null)

    useEffect(() =>{
        const startIpfs = async () =>{
            if(ipfs){
                console.log("IPFS already started")
            }else if(window.ipfs && window.ipfs.enable){
                console.log("Found IPFS in Browser")
                ipfs = await window.ipfs.enable({commands: ['id']})
            }else{
                try{
                    console.time('IPFS started')
                    ipfs = await IPFS.create()
                    console.timeEnd('IPFS Started')
                }catch(error){
                    console.error("IPFS Init erroe : ", error)
                    ipfs = null
                    setIpfsInitError(error)
                }
            }
            setIpfsReady(Boolean(ipfs))
        }

        startIpfs()

        return function cleanup() {
            if (ipfs && ipfs.stop) {
                console.log('Stopping IPFS')
                ipfs.stop().catch((err: any) => console.error(err))
                ipfs = null
                setIpfsReady(false)
              }
        }
    }, [])

    return { ipfs, isIpfsReady, ipfsInitError }
}

export default useIpfsFactory