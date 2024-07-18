import React, {useState, useEffect } from "react";
import toast from "react-hot-toast";

//INTERNAL IMPORT
import { useStateContext } from "../Context/index";
import Header from "../Components/Header";
import Input from "../Components/Input";
import Button from "../Components/Button";
import Table from "../Components/Table";
import PreSaleList from "../Components/PreSaleList";
import UploadLogo from "../Components/UploadLogo";
import Loader from "../Components/Loader";
import Footer from "../Components/Footer";
import ICOMarket from "../Components/ICOMarket";
import TokenCreator from "../Components/TokenCreator";
import TokenHistory from "../Components/TokenHistory";
import Marketplace from "../Components/Marketplace";
import CreateICO from "../Components/CreateICO";
import Card from "../Components/Card";
import BuyToken from "../Components/BuyToken";
import WithdrawToken from "../Components/WidthdrawToken";
import TokenTransfer from "../Components/TokenTransfer";




const index = () => {
    const {  GET_ALL_ICOSALE_TOKENS,
        GET_ALL_USER_ICOSALE_TOKENS,
        createERC20,
        connectWallet,
        shortenAddress,
        createICOSale,
        buyToken,
        openBuyToken,
        transferTokens,
        withdrawToken,
        setAddress,
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
        PINATA_SECREAT_KEY,} = useStateContext();

        const notifySuccess = (msg) => toast.success(msg, {duration: 2000}); 
        const notifyError = (msg) => toast.error(msg, {duration: 2000});

        const [allICOs, setAllICOs] = useState();
        const [allUserIcos, setAllUserIcos]=useState();

        //COMPONENT OPEN
        const [openAllICO, setOpenAllICO] = useState(false);
        const [openTokenHistory, setOpenTokenHistory] = useState(false);
        const [openICOMarketplace, setOpenICOMarketplace]=useState(false);
       
        //BUY ICO TOKEN

        const [buyIco, setBuyIco] = useState();

        const copyAddress = () => {
            navigator.clipboard.writeText(ICO_MARKETPLACE_ADDRESS);
            notifySuccess("Copied successfully");
        };

        useEffect(()=>{

            if (address) {
                GET_ALL_ICOSALE_TOKENS().then((token) => {
                    console.log("ALL", token);
                    setAllICOs(token);
                });
                GET_ALL_USER_ICOSALE_TOKENS().then((token) => {
                    console.log("USER", token);
                    setAllUserIcos(token);
                });
            }


        },[address, reCall]);


    return(
        <div>
            <Header 
              accountBalance={accountBalance}
              setAddress={setAddress}
              address={address}
              connectWallet={connectWallet}
              ICO_MARKETPLACE_ADDRESS={ICO_MARKETPLACE_ADDRESS}
              shortenAddress={shortenAddress}
              setOpenAllICO={setOpenAllICO}
              openAllICO={openAllICO}
              setOpenTokenCreator={setOpenTokenCreator}
              openTokenCreator={openTokenCreator}
              setOpenTokenHistory={setOpenTokenHistory}
              openTokenHistory={openTokenHistory}
              setOpenICOMarketplace={setOpenICOMarketplace}
              openICOMarketplace={openICOMarketplace}

               />

               <div className="create">
                <h1 style={{ fontSize: "2rem"}}>All ICOs MarketPlace</h1>

                {allICOs?.length != 0 && (
                    <Marketplace
                       array={allICOs}
                       shortenAddress={shortenAddress}
                       setBuyIco={setBuyIco}
                       setOpenBuyToken={setOpenBuyToken}
                       currency={currency}
                       
                       />
                )}

                <Card
                 setOpenAllICO={setOpenAllICO}
                 setOpenTokenCreator={setOpenTokenCreator}
                 setOpenTokenHistory={setOpenTokenHistory}
                 setOpenTransferToken={setOpenTransferToken}
                 setOpenWithdrawToken={setOpenWithdrawToken}
                 setOpenICOMarketplace={setOpenICOMarketplace}
                 copyAddress={copyAddress}
                 setOpenCreateICO={setOpenCreateICO}/>
               </div>

              {openAllICO && <ICOMarket 

               array={allICOs}
               shortenAddress={shortenAddress}
               handleClick={setOpenAllICO}
               currency={currency}


              />}
              {openTokenCreator && <TokenCreator 
              
                 createERC20={createERC20}
                 shortenAddress={shortenAddress}
                 setOpenTokenCreator={setOpenTokenCreator}
                 setLoader={setLoader}
                 address={address}
                 connectWallet={connectWallet}
                 PINATA_API_KEY={PINATA_API_KEY}
                 PINATA_SECREAT_KEY={PINATA_SECREAT_KEY}
                 />}
              {openTokenHistory && <TokenHistory 

                shortenAddress={shortenAddress}
                setOpenTokenHistory={setOpenTokenHistory}
                 
                 />}
              {openCreateICO && <CreateICO

               shortenAddress={shortenAddress}
               setOpenCreateICO={setOpenCreateICO}
               connectWallet={connectWallet}
               address={address}
               createICOSale={createICOSale}
              />}
              {openICOMarketplace && <ICOMarket

                 array={allUserIcos}
                 shortenAddress={shortenAddress}
                 handleClick={setOpenICOMarketplace}
                 currency={currency}
              
              
              />}
              {openBuyToken && <BuyToken 
                address={address}
                buyToken={buyToken}
                connectWallet={connectWallet}
                setOpenBuyToken={setOpenBuyToken}
                buyIco={buyIco}
                currency={currency}
              
              />}
              {openTransferToken && <TokenTransfer

                 address={address}
                 transferTokens={transferTokens}
                 connectWallet={connectWallet}
                 setOpenTransferToken={setOpenTransferToken}

              
              />}
              {openWithdrawToken && <WithdrawToken 
                
                address={address}
                withdrawToken={withdrawToken}
                connectWallet={connectWallet}
                setOpenWithdrawToken={setOpenWithdrawToken}
              
              />}
            <Footer />
            {loader && <Loader />} 
         
        </div>
    );
}


export default index;