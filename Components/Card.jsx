import React from "react";

const Card = ({
  setOpenAllICO,
  setOpenTokenCreator,
  setOpenTokenHistory,
  setOpenTransferToken,
  setOpenWithdrawToken,
  setOpenICOMarketplace,
  copyAddress,
  setOpenCreateICO,
}) => {
  const features = [
    {
      title: "ICO ADDRESS",
      description:
        "Get details of the ICO contract and copy the ICO contract address to transfer the token to the ICO contract.",
      btnName: "Copy Address",
    },
    {
      title: "Create ICO",
      description:
        "Create your own ICO by providing necessary details and defining the terms of the offering.",
      btnName: "Create ICO",
    },
    {
      title: "Your Created ICO",
      description:
        "Get all your created ICOs in one place, making it easy to manage and track your Initial Coin Offerings.",
      btnName: "Get All Created ICOs",
    },
    {
      title: "ICO Marketplace",
      description:
        "Browse and explore various ICOs listed on our comprehensive marketplace platform.",
      btnName: "Listed ICOs",
    },
    {
      title: "Create Token",
      description:
        "Define and create your token on a blockchain platform, supporting smart contracts such as Ethereum or Binance Smart Chain.",
      btnName: "Create Token",
    },
    {
      title: "History",
      description:
        "View the history of token creation by a single user, with logs for each instance a user mints new tokens.",
      btnName: "Get Token History",
    },
    {
      title: "Transfer Token",
      description:
        "Enable the transfer of tokens between users within your smart contract, allowing token holders to send tokens to others.",
      btnName: "Transfer Token",
    },
    {
      title: "Withdraw Token",
      description:
        "Withdraw tokens from your account to another address, enabling secure and efficient token transfers.",
      btnName: "Withdraw Token",
    },
  ];

  return (
    <div className="wrapper">
      {features.map((feature, index) => (
        <div key={index} className="card">
          <p className="card-content" style={{ marginTop: "1rem" }}>
            {feature.description}
          </p>
          <button
            className="card-btn"
            style={{ marginTop: "1rem" }}
            onClick={() =>
              feature.title === "Your Created ICO"
                ? setOpenAllICO(true)
                : feature.title === "ICO Marketplace"
                ? setOpenICOMarketplace(true)
                : feature.title === "Create Token"
                ? setOpenTokenCreator(true)
                : feature.title === "History"
                ? setOpenTokenHistory(true)
                : feature.title === "Transfer Token"
                ? setOpenTransferToken(true)
                : feature.title === "Withdraw Token"
                ? setOpenWithdrawToken(true)
                : feature.title === "ICO ADDRESS"
                ? copyAddress()
                : feature.title === "Create ICO"
                ? setOpenCreateICO(true)
                : ""
            }
          >
            {feature.btnName}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Card;
