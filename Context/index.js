import React, {useState, useContext, createContext, useEffect} from "react";
import { ethers } from "ethers";

import Web3Modal from "web3modal";
import toast from "react-hot-toast";

//INTERNAL IMPORT

import{
    ERC20Generator,
    ERC20Generator_BYTECODE,
    handleNetworkSwitch,
    shortenAddress,
    ICO_MARKETPLACE_ADDRESS,
    ICO_MARKETPLACE_CONTRACT,
    TOKEN_CONTRACT,
    PINATA_API_KEY,
    PINATA_SECREAT_KEY,
    ERC20Generator_ABI,
} from "./constants";



const StateContext = createContext();

export const StateContextProvider = ({children}) => {
    //STATE VARIABLE
    const [address, setAddress] = useState("");
    const [accountBalance, setAccountBalance] = useState(null);
    const [loader, setLoader] = useState(false);
    const[reCall, setReCall]=useState(false);
    const [currency, setCurrency]=useState("MATIC");

    //COMPONENT
    const [openBuyToken, setOpenBuyToken] = useState(false);
    const [openWithdrawToken, setOpenWithdrawToken] = useState(false);
    const [openTransferToken, setOpenTransferToken] = useState(false);
    const [openTokenCreator, setOpenTokenCreator] = useState(false);
    const [openCreateICO, setOpenCreateICO]= useState(false);

    //Notisifications

    const notifySuccess = (msg) => toast.success(msg, {duration: 200}); //2sec
    const notifyError = (msg) => toast.error(msg, {duration: 200});

    //FUNCTIONS
    const checkIfWalletConnected = async () => {
        try{
            if (!window.ethereum) return notifyError("No account found");
            await handleNetworkSwitch();
            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });

            if(accounts.length) {
                setAddress(accounts[0]);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const getbalance = await provider.getBalance(accounts[0]);
                const bal = ethers.utils.formatEther(getbalance);
                setAccountBalance(bal);
                return accounts[0];
            } else{
                notifyError("No account found");
            }
        }catch (error) {
            console.log(error);
           

        }
    };

    useEffect(() => {
        checkIfWalletConnected();

    }, [address]);


    const connectWallet = async () => {
        try{
            if (!window.ethereum) return notifyError("No account found");
            await handleNetworkSwitch();
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            if(accounts.length) {
                setAddress(accounts[0]);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const getbalance = await provider.getBalance(accounts[0]);
                const bal = ethers.utils.formatEther(getbalance);
                setAccountBalance(bal);
                return accounts[0];
            } else{
                
                notifyError("No account found");
            }
        }catch (error) {
            console.log(error);
            notifyError("No account found");

        }
    };

    //MAIN FUNCTIONS

    const _deployContract = async (signer, account, name, symbol, supply, imageURL) => {     //internal function so used _
        try{
            const factory = new ethers.ContractFactory(
                ERC20Generator_ABI,
                ERC20Generator_BYTECODE,
                signer
            );

            const totalSupply = Number(supply);
            const _initialSupply = ethers.utils.parseEther(
                totalSupply.toString(),
                "ether"
            );

            let contract = await factory.deploy(_initialSupply, name, symbol);

            const transaction = await contract.deployed();

            if(contract.address){
                const today = Date.now();
                let date = new Date(today);
                const _tokenCreatedDate = date.toLocaleDateString("en-US");

                const _token = {
                    account: account,
                    supply: supply.toString(),
                    name: name,
                    symbol:symbol,
                    tokenAddress: contract.address,
                    transactionHash: contract.deployTransaction.hash,
                    createdAt : _tokenCreatedDate,
                    logo : imageURL,

                };

                let tokenHistory = [];

                const history = localStorage.getItem("TOKEN_HISTORY");
                if(history){
                    tokenHistory = JSON.parse(localStorage.getItem("TOKEN_HISTORY"));
                    tokenHistory.push(_token);
                    localStorage.setItem("TOKEN_HISTORY", JSON.stringify(tokenHistory));
                    setLoader(false);
                    setReCall(reCall + 1);
                    setOpenTokenCreator(false);
    

                } else{
                    tokenHistory.push(_token);
                    localStorage.setItem("TOKEN_HISTORY", JSON.stringify(tokenHistory));
                    setLoader(false);
                    setReCall(reCall + 1);
                    setOpenTokenCreator(false);
                }
               
            }


        }catch(error){
            setLoader(false)
            notifyError("Something went wrong, try later");
            console.log(error);
        }
    };
    const createERC20 = async (token, account, imageURL) => { 
        const {name, symbol, supply} = token;
        try{
            setLoader(true)
            notifySuccess("Creating token...");
            if(!name || !symbol || !supply){
                notifyError("Data Missing");
                setLoader(false);
            } else {
                const web3Modal = new Web3Modal();
                const connection = await web3Modal.connect();
                const provider = new ethers.providers.Web3Provider(connection);
                const signer = provider.getSigner();

                _deployContract(signer, account, name, symbol, supply, imageURL);
            }

           
        }catch(error){
            setLoader(false)
            notifyError("Something went wrong, try later");
            console.log(error);
        }
    };
    const GET_ALL_ICOSALE_TOKENS= async () => {     
        try{
            setLoader(true);
            const address = await connectWallet();
            const contract = await ICO_MARKETPLACE_CONTRACT();

            if(address) {
                const allICOSaleToken = await contract.getAllTokens();

                const _tokenArray = Promise.all(
                    allICOSaleToken.map(async(token) => {
                        const tokenContract = await TOKEN_CONTRACT(token?.token);

                        const balance = await tokenContract.balanceOf(
                            ICO_MARKETPLACE_ADDRESS
                        );

                        return{
                            creator: token.creator,
                            token: token.token,
                            name: token.name,
                            symbol: token.symbol,
                            supported: token.supported,
                            price: ethers.utils.formatEther(token?.price.toString()),
                            icoSaleBal:ethers.utils.formatEther(balance.toString()),
                        }
                    })
                );

                setLoader(false);
                return _tokenArray;
            }

        }catch(error){
            notifyError("Something went wrong");
            console.log(error);
        }
    };
    const GET_ALL_USER_ICOSALE_TOKENS = async () => {     
        try{
            setLoader(true);
            const address = await connectWallet();
            const contract = await ICO_MARKETPLACE_CONTRACT();

            if(address) {
                const allICOSaleToken = await contract.getTokenCreatedBy(address);

                const _tokenArray = Promise.all(
                    allICOSaleToken.map(async(token) => {
                        const tokenContract = await TOKEN_CONTRACT(token?.token);

                        const balance = await tokenContract.balanceOf(
                            ICO_MARKETPLACE_ADDRESS
                        );

                        return{
                            creator: token.creator,
                            token: token.token,
                            name: token.name,
                            symbol: token.symbol,
                            supported: token.supported,
                            price: ethers.utils.formatEther(token?.price.toString()),
                            icoSaleBal:ethers.utils.formatEther(balance.toString()),
                        }
                    })
                );

                setLoader(false);
                return _tokenArray;
            }

        }catch(error){
            notifyError("Something went wrong");
            console.log(error);
        }
    };

    const createICOSale = async (icoSale) => {     
        try{
            const {address, price} = icoSale;
            if(!address | !price) return notifyError("Data Missing");

            setLoader(true);
            notifySuccess("Creating icoSale...")
            await connectWallet();

            const contract = await ICO_MARKETPLACE_CONTRACT();

            const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

            const transaction = await contract.createICOSale(address, payAmount, {
                gasLimit : ethers.utils.hexlify(8000000),
            });

            await transaction.wait();

            if(transaction.hash) {
                setLoader(false);
                setOpenCreateICO(false);
                setReCall(reCall + 1);
            }

        }catch(error){
            setLoader(false)
            setOpenCreateICO(false)
            notifyError("Something went wrong");
            console.log(error);
        }
    };

    const buyToken = async (tokenAddress, tokenQuantity) => {    
        try{
            setLoader(true);
            notifySuccess("Purchasing token...");

            if (!tokenQuantity || !tokenAddress) return notifyError("Data Missing");

            const address = await connectWallet();
            const contract = await ICO_MARKETPLACE_CONTRACT();

            const _tokenBal = await contract.getBalance(tokenAddress);
            const _tokenDetails = await contract.getTokenDetails(tokenAddress);

            const availableToken = ethers.utils.formatEther(_tokenBal.toString());

            if(availableToken > 0){
                const price = 
                       ethers.utils.formatEther(_tokenDetails.price.toString()) * Number(tokenQuantity);

                       const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

                       const transaction = await contract.buyToken(tokenAddress, Number(tokenQuantity), {
                        value: payAmount.toString(),
                        gasLimit: ethers.utils.hexlify(8000000),
                       });

                       await transaction.wait();
                       setLoader(false);
                       setReCall(reCall + 1);
                       setOpenBuyToken(false);
                       notifySuccess("Transaction completed succesfully");
            } else {
                setLoader(false);
                setOpenBuyToken(false);
                notifyError("Your token balance is 0");
            }

        }catch(error){
            setLoader(false);
            setOpenBuyToken(false);
            notifyError("Something went wrong");
            console.log(error);
        }
    };

    const transferTokens = async (transferTokenData) => {    
        try{
            if(
                !transferTokenData.address || !transferTokenData.amount || !transferTokenData.tokenAdd
            ) return notifyError("Data is Missing");

            setLoader(true);
            notifySuccess("Transaction is processing");
            const address = await connectWallet();

            const contract = await TOKEN_CONTRACT(transferTokenData.tokenAdd);
            const _avalibleBal = await contract.balanceOf(address);
            const availableToken = ethers.utils.formatEther(_avalibleBal.toString());

            if(availableToken > 1){
                const payAmount = ethers.utils.parseUnits(
                    transferTokenData.amount.toString(),
                    "ether"
                );
                const transaction = await contract.transfer(
                    transferTokenData.address, payAmount, {
                        gasLimit: ethers.utils.hexlify(8000000),
                    }
                );

                await transaction.wait();
                setLoader(false);
                setReCall(reCall + 1);
                setOpenTransferToken(false);
                notifySuccess("Transaction completed successfully");
            } else{
                setLoader(false);
                setReCall(reCall + 1);
                setOpenTransferToken(false);
                notifySuccess("Your balance is 0");
            
            }

        }catch(error){
            setLoader(false);
            setReCall(reCall + 1);
            setOpenTransferToken(false);
            notifySuccess("Something went wrong");
            console.log(error);
        }
    };

    const withdrawToken = async (withdrawQuantity) => { 
       try{
         if(!withdrawQuantity.amount || !withdrawQuantity.token) return notifyError("Data is Missing");

         setLoader(true)
         notifySuccess("Transaction is processing");

         const address = await connectWallet();
         const contract = await ICO_MARKETPLACE_CONTRACT();

         const payAmount = ethers.utils.parseUnits(
            withdrawQuantity.amount.toString(), "ether"
         );

         const transaction = await contract.withdrawToken(
            withdrawQuantity.token,
            payAmount,
            {
                gasLimit: ethers.utils.hexlify(8000000),
            }
         );

         await transaction.wait();
         setLoader(false);
         setReCall(reCall + 1);
         setOpenWithdrawToken(false);
         notifySuccess("Transaction completed successfully");


        }catch(error){
        setLoader(false);
         setReCall(reCall + 1);
         setOpenWithdrawToken(false);
         notifySuccess("Something went wrong");

            console.log(error);
        }
    };

    return <StateContext.Provider value={{
        GET_ALL_ICOSALE_TOKENS,
        GET_ALL_USER_ICOSALE_TOKENS,
        createERC20,
        connectWallet,
        shortenAddress,
        createICOSale,
        buyToken,
        transferTokens,
        withdrawToken,
        setAddress,
        openBuyToken,
        setOpenBuyToken,
        openWithdrawToken, 
        setOpenWithdrawToken,
        openTransferToken, 
        setOpenTransferToken,
        openTokenCreator,
        setOpenTokenCreator,
        openCreateICO, 
        setOpenCreateICO,
        setAccountBalance,
        address, 
        ICO_MARKETPLACE_ADDRESS,
        loader, 
        reCall,
        accountBalance, 
        currency, 
        setLoader,
        PINATA_API_KEY,
        PINATA_SECREAT_KEY,
        
       
       
       
    
    }}>{children}</StateContext.Provider>;

};

export const useStateContext = () => useContext(StateContext);
