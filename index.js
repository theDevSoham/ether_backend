const express = require('express');
const { Network, Alchemy } = require('alchemy-sdk');
const port = 8080;

const app = express();

const settings = {
    apiKey: "sqzilZlnbccL5yIcVN-k9rR1hF37QwNR",
    network: Network.ARB_GOERLI,
};

app.get('/', async(req, res) => {
    const alchemy = new Alchemy(settings);
    const latestBlock = await alchemy.core.getBlock("latest");
    res.json({ latestBlock: latestBlock });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});