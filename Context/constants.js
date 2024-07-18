import {ethers} from "ethers";
import Web3Modal from "web3modal";

import ERC20Generator from "./ERC20Generator.json";
import icoMarketplace from "./icoMarketplace.json";

export const ERC20Generator_ABI = ERC20Generator.abi;
export const ERC20Generator_BYTECODE = ERC20Generator.bytecode;

export const ICO_MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_ICO_MARKETPLACE_ADDRESS;
export const ICO_MARKETPLACE_ABI = icoMarketplace.abi;

//PINATA KEYS

export const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_AIP_KEY;
export const PINATA_SECREAT_KEY = process.env.NEXT_PUBLIC_PINATA_SECRECT_KEY; 

//NETWORKS

const networks = {
    polygon_amoy: {
        chainId: `0x${Number(80002).toString(16)}`,
        chainName: "Polygon Amoy",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,

        },
            rpcUrls : [" https://rpc-amoy.polygon.technology/"],
            blockExplorerUrls: ["https://ww.oklink.com/amoy"],
    },

    polygon: {
        chainId: `0x${Number(137).toString(16)}`,
        chainName: "Polygon Miannet",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,

        },
            rpcUrls : ["https://rpc.ankr.com/polygon"],
            blockExplorerUrls: ["https://polygonscan.com"],
    },

    bsc: {
        chainId: `0x${Number(56).toString(16)}`,
        chainName: "Binance Miannet",
        nativeCurrency: {
            name: "Binance Chain",
            symbol: "BNB",
            decimals: 18,

        },
            rpcUrls : ["https://rpc.ankr.com/bsc"],
            blockExplorerUrls: ["https://bscscan.com"],
    },

    base_mainnet: {
        chainId: `0x${Number(8453).toString(16)}`,
        chainName: "Base Miannet",
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,

        },
            rpcUrls : ["https://mainnet.base.org"],
            blockExplorerUrls: ["https://bscscan.com"],
    },
};
//WE ARE CONFIGURING WIHT POLYGON_AMOY IF USER DOING WITH OTHER NETWORKS LIKE BINANCE, BASE WE WANT TO WRTIE FUN TO CHANGE THAT

const ChangeNetwork = async ({ networkName }) => {
    try {
        if(!window.ethereum)throw new Error("No crypto wallet found");
        await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    ...networks[networkName],
                }
            ],
        });
    } catch (error) {
        console.log(error);

    }

};

export const handleNetworkSwitch = async() => {
    const networkName = "polygon_amoy"; 
    await  ChangeNetwork({ networkName });
};

export const shortenAddress = (address) =>
    `${address?.slice(0, 5)}...${address?.slice(address.length - 4)}`;

//CONTRACT

const fetchContract = (address, abi, signer) =>
    new ethers.Contract(address, abi, signer);

export const ICO_MARKETPLACE_CONTRACT = async () => {
    try{
        //web3 makes to intract with the wallet
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        const signer = provider.getSigner();

        const contract = fetchContract(ICO_MARKETPLACE_ADDRESS, ICO_MARKETPLACE_ABI, signer);
        return contract;
    
    }catch(error){
        console.log(error);
    }

};

//TOKEN CONTRACT

export const TOKEN_CONTRACT = async (TOKEN_ADDRESS) => {
    try{
        //web3 makes to intract with the wallet
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        const signer = provider.getSigner();

        const contract = fetchContract(TOKEN_ADDRESS, ERC20Generator_ABI, signer);
        return contract;
    
    }catch(error){
        console.log(error);
    }

};



