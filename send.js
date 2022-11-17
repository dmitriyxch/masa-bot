const { time } = require('console');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

const {
    INFURA_ID,
    PRIVATE_KEY
} = process.env;

const Web3 = require('web3');
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
const https = require('https');
const { exit } = require('process');
const ethers = require('ethers');
const { uniqueNamesGenerator, Config, adjectives, colors, animals } = require('unique-names-generator');
const { randomBytes,randomInt } = require('crypto');

const {

    toUtf8Bytes,
    toUtf8CodePoints,
    toUtf8String,

    formatBytes32String,
    parseBytes32String,

    nameprep
} = require("@ethersproject/strings");

const web3 = new Web3(new Web3.providers.HttpProvider('https://alfajores-forno.celo-testnet.org'));

async function sendTransactions() {

    //const { abi } = require('./abi.json');
    //let smart_contract_interface = new web3.eth.Contract(abi, '0xfAe39eC09730CA0F14262A636D2d7C5539353752')
    let finished_wallets = fs.readFileSync('minted.txt', 'utf8').toString().split("\n");
    const wallets = fs.readFileSync('wallets.txt', 'utf8').toString().split("\n");
    let nft_addresses = Array();
    for (const [index, wal] of wallets.entries()) {
        if (wal.length > 0) {

            let wallet_address = wal.split(":")[0];
            let wallet_key = wal.split(":")[1];
            if (!finished_wallets.includes(wallet_address)) {


                let hashedAddress = ethers.utils.solidityKeccak256(
                    ['address'],
                    [wallet_address],
                )

                const randomName = uniqueNamesGenerator({
                    dictionaries: [colors, animals],
                    separator : "-",
                    seed: randomInt(9999)
                });

                console.log(randomName +" index:" +index)

                let signed = await web3.eth.accounts.sign(hashedAddress, wallet_key)
                //console.log(signed.signature)
                let content = await fetch("https://beta.middleware.masa.finance/contracts/mint", {
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                        "authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjBNSzJMYkJoRkJieEs3SnU3YkE0QSJ9.eyJpc3MiOiJodHRwczovL21hc2EtZGV2ZWxvcG1lbnQudXMuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDYzMDkzMjQzMWNkMjE2ZWZmMzBhZDllOSIsImF1ZCI6WyJodHRwczovL2F1dGgubWFzYS5maW5hbmNlL2RldiIsImh0dHBzOi8vbWFzYS1kZXZlbG9wbWVudC51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjYxNzE2NDg5LCJleHAiOjE2NjE4MDI4ODksImF6cCI6InRnZE1HM2VjeExFd25YUGNiUjdDTUY4U3ZKbmR0eVdVIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBvZmZsaW5lX2FjY2VzcyJ9.MbYceBRvXpQBmV_Rn1HeIMVqTlcmoN3fRTCVr7k9JKAaFnoo7aOi5Msp4e5lulEIyE9M_ebWJSHDrgv-g_Jq82I2D2yQXNQ2lfUTTlc8xn-r3QHbPBV2hTqkwU5WmRvV3L3fTZLwJazq6fbp3MpHIYhuz0JQGPMjGtnDYiB4kvXc6cQaCnv6UNMaW--IQJ81gTgLvgaZEK3qyY2c3mGdOJLTHje4zwY267DJo22NV8qsjlL094xd5k_05Jn0jqUHpICTWVVL-ehjH7eyWMlsBIvLISOvlBMtgNDwSvLJ4PgPr5Pv9YvxGO_htpwTvUVhijScCw1q982u56Cp6AQ3bQ",
                        "cache-control": "no-cache",
                        "content-type": "application/json",
                        "pragma": "no-cache",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site",
                        "sec-gpc": "1",
                        "Referer": "https://beta.claimyoursoul.masa.finance/",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    "body": "{\"operation\":\"Identity\",\"name\":\"" + randomName + randomInt(100) + ".soul\",\"address\":\"" + wallet_address.toLowerCase() + "\",\"signature\":\"" + signed.signature + "\"}",
                    "method": "POST"
                });
                if (content.ok) {
                    console.log(await content.json())
                    fs.appendFileSync('minted.txt', wallet_address + '\n', "utf8");
                } else {
                    console.log(content.statusText)
                }
                //console.log(content)

                //let signed = web3.eth.accounts.signTransaction(tx, wallet_key)
                //console.log(signed)


                /* async
                .then(signed => {
                    web3.eth.sendSignedTransaction(signed.rawTransaction)
                        .on('transactionHash', function(hash){
                            console.log(wallet_address+" hash: "+hash + " 1number: "+index)
                        })
                });
                await web3.eth.accounts.signTransaction(tx, wallet_key).then(signed => {
                    web3.eth.sendSignedTransaction(signed.rawTransaction)
                    .on('transactionHash', function(hash){
                        console.log(hash)
                    })
                    .on('receipt', function(receipt){
                        //...
                    })
                    .on('confirmation', function(confirmationNumber, receipt){
                        fs.appendFileSync('minted.txt', wallet_address+'\n', "utf8");
                        //console.log(receipt)
                        console.info(minted.length)
                    })
                    .on('error', console.error)
                });
                */
            }
        }

    }
    /*const transfer = fs.readFileSync('../../transfer2.txt', 'utf8').toString().split("\n");
    let res = [];
    console.log(nft_addresses.length);
    console.log(transfer.length);
    res = transfer.filter(el => {
        return !nft_addresses.find(element => {
            return element == el;
        });
    });
    console.log(res.length);
    let text = res.join('\n');

    fs.writeFileSync('../../transfer2.txt', text, "utf8");
    console.info(nft_addresses)*/

}

sendTransactions()