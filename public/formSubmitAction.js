var express = require('express');
var router = express.Router();
var util = require('util');
var joi = require('joi');
var contractProxy = require('../ContractProxy');

router.post('/deploy', function(req, res) {

    const validateSchema = joi.object().keys({
        tokenName: joi.string().required(),
        tokenSymbol: joi.string().required(),
        tokenAmount: joi.number().integer().required()
    });

    if (joi.validate(req.body, validateSchema).error === null) {
        //1. 部署智能合約
        contractProxy.createNonFungibleToken(req.body.tokenAmount, req.body.tokenName, req.body.tokenSymbol)
            .then(receipt => {
                var info = JSON.parse(JSON.stringify(receipt));
                console.log("contract receipt = " + util.inspect(info, false, null));

                //2. mint token
                contractProxy.mintToken(info.contractAddress, req.body.tokenAmount)
                    .then(mintReceipt => {
                        var tokenInfo = JSON.parse(JSON.stringify(mintReceipt));
                        console.log("mint result = " + util.inspect(tokenInfo, false, null));
                        var resView = `<h3>完成，合約位址：${info.contractAddress}</h3>`;
                        res.send(resView);
                    })
                    .catch(err => {
                        console.log("err = " + err);
                        res.json({ "result": err });
                    })

            })
            .catch(err => {
                console.log("err = " + err);
                res.json({ "result": err });
            })
    } else {
        console.log("request invalid");
        res.json({ "result": "data invalid" });
    }
});

router.post('/newAccount', function(req, res) {
    contractProxy.newAccount().then(accountObj => {
        var accountInfo = JSON.parse(JSON.stringify(accountObj));
        console.log('account = ' + util.inspect(accountInfo, false, null));
        var resultView = `<h3>完成，帳號：${accountInfo.address}, 私鑰:${accountInfo.privateKey}</h3>`;
        res.send(resultView);
    })
});

router.post('/checkToken', function(req, res) {
    const validateSchema = joi.object().keys({
        contractAddress: joi.string().required(),
        walletAddress: joi.string().required()
    });

    if (joi.validate(req.body, validateSchema).error === null) {
        contractProxy.getTokensByOwner(req.body.contractAddress, req.body.walletAddress).then(tokens => {
            var tokenIds = JSON.parse(JSON.stringify(tokens));
            console.log('account = ' + util.inspect(tokenIds, false, null));
            var resultView = `<h3>完成，TokenIds：${tokenIds}</h3>`;
            res.send(resultView);
        });
    } else {
        res.json({ "result": "data invalid" });
    }
});

router.post('/transToken', function(req, res) {
    const validateSchema = joi.object().keys({
        contractAddress: joi.string().required(),
        walletAddress: joi.string().required(),
        tokenId: joi.number().required()
    });

    if (joi.validate(req.body, validateSchema).error === null) {
        contractProxy.transferToken(req.body.contractAddress, req.body.walletAddress, req.body.tokenId)
            .then(transResult => {
                var result = JSON.parse(JSON.stringify(transResult));
                console.log('account = ' + util.inspect(result, false, null));
                var resultView = `<h3>完成</h3>`;
                res.send(resultView);
            });
    } else {
        res.json({ "result": "data invalid" });
    }
});

module.exports = router;