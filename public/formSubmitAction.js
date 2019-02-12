var express = require('express');
var router = express.Router();
var util = require('util');
var joi = require('joi');
var contractProxy = require('../ContractProxy');
var contractModel = require('../models/ContractSchemaModel');

/** 
 * 部署合約
 */
router.post('/deploy', async function(req, res) {

    const validateSchema = joi.object().keys({
        tokenName: joi.string().required(),
        tokenSymbol: joi.string().required(),
        tokenAmount: joi.number().integer().required()
    });

    // deploy(req.body.tokenAmount, req.body.tokenName, req.body.tokenSymbol, 1, function(callback) {
    //     res.send("完成");
    // });

    if (joi.validate(req.body, validateSchema).error === null) {

        var createDate = Date.now();
        try {
            //1. 部署智能合約
            var transReceipt = await contractProxy.createNonFungibleToken(req.body.tokenAmount, req.body.tokenName, req.body.tokenSymbol);
            console.log(util.inspect(transReceipt, false, null));

            //deploy 資料入 DB
            var info = JSON.parse(JSON.stringify(transReceipt));
            //contractModel.saveTransRecord(info.contractAddress, createDate, Date.now(), info.gasUsed, "deploy", "dexon");

            //2. Mint token
            var mintReceipt = await contractProxy.mintToken(info.contractAddress, req.body.tokenAmount);
            console.log("mint result = " + util.inspect(mintReceipt, false, null));
            var resView = `<h2>完成，合約位址：${info.contractAddress}</h2>`;
            res.send(resView);

        } catch (err) {
            res.json({ "result": "data invalid" });
        }

    } else {
        console.log("request invalid");
        res.json({ "result": "data invalid" });
    }
});

/**
 * 創帳號
 */
router.post('/newAccount', async function(req, res) {

    var accountObj = await contractProxy.newAccount();
    var accountInfo = JSON.parse(JSON.stringify(accountObj));
    var resultView = `<h3>完成，帳號：${accountInfo.address}, 私鑰:${accountInfo.privateKey}</h3>`;
    res.send(resultView);

});

/**
 * 檢查持有者TOKEN
 */
router.post('/checkToken', async function(req, res) {
    const validateSchema = joi.object().keys({
        contractAddress: joi.string().required(),
        walletAddress: joi.string().required()
    });

    if (joi.validate(req.body, validateSchema).error === null) {

        var tokens = await contractProxy.getTokensByOwner(req.body.contractAddress, req.body.walletAddress);
        var tokenIds = JSON.parse(JSON.stringify(tokens));
        console.log('tokenIds = ' + util.inspect(tokenIds, false, null));
        var resultView = `<h2>完成，TokenIds：${tokenIds}</h2>`;
        res.send(resultView);

    } else {
        res.json({ "result": "data invalid" });
    }
});

/** 
 * 轉移TOKEN
 */
router.post('/transToken', async function(req, res) {
    const validateSchema = joi.object().keys({
        contractAddress: joi.string().required(),
        walletAddress: joi.string().required(),
        tokenId: joi.number().required()
    });

    //transToken(req.body.contractAddress, req.body.walletAddress, 1, 1);

    if (joi.validate(req.body, validateSchema).error === null) {

        var transResult = await contractProxy.transferToken(req.body.contractAddress, req.body.walletAddress, req.body.tokenId);
        var result = JSON.parse(JSON.stringify(transResult));
        console.log('result = ' + util.inspect(result, false, null));
        var resultView = `<h2>完成</h2>`;
        res.send(resultView);

    } else {
        res.json({ "result": "data invalid" });
    }
});

async function deploy(amount, name, symbol, currentCount) {
    if (currentCount <= 30) {
        var createDate = Date.now();

        var receipt = await contractProxy.createNonFungibleToken(amount, name, symbol);
        var info = JSON.parse(JSON.stringify(receipt));
        //部署資料塞入DB
        contractModel.saveTransRecord(info.contractAddress, createDate, Date.now(), info.gasUsed, "deploy",
            "dexon").then(() => {
            currentCount++;
            deploy(amount, name, symbol, currentCount);
        });
    }
}

function transToken(contractAddress, destAddress, tokenId, currentCount) {
    if (currentCount <= 30) {
        var createDate = Date.now();
        contractProxy.transferToken(contractAddress, destAddress, currentCount)
            .then(transResult => {
                var info = JSON.parse(JSON.stringify(transResult));
                console.log('data = ' + util.inspect(transResult, false, null));
                //部署資料塞入DB
                contractModel.saveTransRecord(contractAddress, createDate, Date.now(), info.gasUsed, "transfer",
                    "dexon").then(() => {
                    currentCount++;
                    transToken(contractAddress, destAddress, currentCount, currentCount);
                });
            });
    }
}

module.exports = router;