var fs = require('fs');
var config = require('./config');
var util = require('util');
var EthereumTx = require('ethereumjs-tx');
var Web3 = require("web3");
var jsonFile = "./DexonToken.json";

var web3 = new Web3();
var parsed = JSON.parse(fs.readFileSync(jsonFile));
var abi = parsed.abi;
var bytecode = parsed.bytecode;
//web3.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
//web3.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
web3.setProvider(new Web3.providers.HttpProvider("https://api-testnet.dexscan.org/v1/network/rpc"));

var privateKey = new Buffer(config.gashPrivateKey, 'hex');
var address = config.gashWalletAddress;
var lastNonce = 0;

module.exports = {
    //若此function 是 view or pure, 使用call呼叫
    //反之使用send呼叫
    createNonFungibleToken: async function(_supply, _tokenName, _tokenSymbol) {
        const myContract = new web3.eth.Contract(abi);

        //打包合約建構子
        var transactiondata = myContract.deploy({
            data: bytecode,
            arguments: [_supply, _tokenName, _tokenSymbol]
        }).encodeABI();

        //估算手續費
        var estimateGas = await web3.eth.estimateGas({ data: bytecode });
        console.log("estimateGas = " + estimateGas);

        //取得nonce
        var nonce = await web3.eth.getTransactionCount(address);
        console.log("nonce = " + nonce);

        //打包交易資料
        var tx = new EthereumTx({
            chainId: 238,
            nonce: web3.utils.toHex(nonce),
            gasPrice: '0x3B9ACA00',
            gasLimit: estimateGas + 100000,
            data: transactiondata
        });
        tx.sign(privateKey);
        var serializedTx = tx.serialize();

        //送出交易
        return await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    },

    mintToken: async function(contractAddress, amount) {
        var contractData = new web3.eth.Contract(abi, contractAddress);

        //合約function
        var transactiondata = contractData.methods.batchMint(amount).encodeABI();

        //估算手續費
        var estimateGas = await web3.eth.estimateGas({ data: bytecode });
        console.log("estimateGas = " + estimateGas);

        //取得nonce
        var nonce = await web3.eth.getTransactionCount(address);
        console.log("nonce = " + nonce);

        //打包交易資料
        var rawTx = {
            chainId: 238,
            data: transactiondata,
            nonce: web3.utils.toHex(nonce),
            gasPrice: '0x3B9ACA00',
            gasLimit: estimateGas + 100000,
            from: address,
            to: contractAddress
        };
        var tx = new EthereumTx(rawTx);
        tx.sign(privateKey);
        var serializedTx = tx.serialize();

        //送出交易
        return await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    },

    newAccount: async function() {
        return await web3.eth.accounts.create();
    },

    getTokensByOwner: async function(contractAddress, walletAddress) {
        var contractData = new web3.eth.Contract(abi, contractAddress);

        return await contractData.methods.tokenOfOwner(walletAddress).call();
    },

    transferToken: async function(contractAddress, desAddress, tokenId) {
        var contractData = new web3.eth.Contract(abi, contractAddress);

        //合約function
        var transactiondata = contractData.methods.safeTransferFrom(address, desAddress, tokenId).encodeABI();

        //估算手續費
        var estimateGas = await web3.eth.estimateGas({ data: bytecode });
        console.log("estimateGas = " + estimateGas);

        //取得nonce
        var nonce = await web3.eth.getTransactionCount(address);
        console.log("nonce = " + nonce);

        //打包交易資料
        var rawTx = {
            chainId: 238,
            data: transactiondata,
            nonce: web3.utils.toHex(nonce),
            gasPrice: '0x3B9ACA00',
            gasLimit: estimateGas + 100000,
            from: address,
            to: desAddress
        };
        var tx = new EthereumTx(rawTx);
        tx.sign(privateKey);
        var serializedTx = tx.serialize();

        //送出交易
        return await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    }
};