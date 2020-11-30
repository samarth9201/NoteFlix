import { Dispatch, SetStateAction } from "react";
import Web3 from "web3";


const connectToWallet = async(setAddress: Dispatch<SetStateAction<string>>) =>{
    if(window.ethereum){
        try{
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable()
            const web3 = window.web3

            return web3
            
        }catch(error){
            console.log(error)
        }
    }
}

export default connectToWallet