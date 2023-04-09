const express = require("express");
const { Network, Alchemy, Wallet, Utils } = require("alchemy-sdk");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = 8080;
const { PRIVATE_KEY, API_KEY } = process.env;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Alchemy Settings

const getAlchemy = () => {
    const settings = {
        apiKey: API_KEY,
        network: Network.ETH_GOERLI,
    };
    return new Alchemy(settings);
};

app.get("/", async(req, res) => {
    const alchemy = getAlchemy();
    const latestBlock = await alchemy.core.getBlock("latest");
    res.json({ latestBlock: latestBlock });
});

app.post("/send", async(req, res) => {
    const alchemy = getAlchemy();
    const wallet = new Wallet(PRIVATE_KEY);
    const { to, value } = req.body;

    const transaction = {
        to: "0x0B53E89cFD388f54A3683AAfc5974db4593B6641",
        value: Utils.parseEther("0.001"),
        gasLimit: "21000",
        maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
        maxFeePerGas: Utils.parseUnits("20", "gwei"),
        nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
        type: 2,
        chainId: 5, // Corresponds to ETH_GOERLI
    };

    try {
        const rawTransaction = await wallet.signTransaction(transaction);
        const response = await alchemy.transact.sendTransaction(rawTransaction);

        res.status(200).json({ receipt: response });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});