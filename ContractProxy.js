var fs = require('fs');
var jsonFile = "./NonfungibleToken.json";
var Web3 = require("web3");
var web3 = new Web3();

var parsed = JSON.parse(fs.readFileSync(jsonFile));
var abi = parsed.abi;
web3.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
//var contractData = new web3.eth.Contract(abi, '0x9e143c94898c44748176bbdc01cdf45d0c626051');
var contractTooLongData = new web3.eth.Contract(abi, '0x9e143c94898c44748176bbdc01cdf45d0c626051');
var contractEtenData = new web3.eth.Contract(abi, '0xfd5bacf8046fa4be8125b5c9e0c1a5b80744c9c1');
var tokenType = ["eten", "toolong"];

module.exports = {
    //若此function 是 view or pure, 使用call呼叫
    //反之使用send呼叫
    createTokenWithTotalSupply: function(_type, _owner, _amount, callback) {
        if (_type == tokenType[0]) {
            contractEtenData.methods.create(_amount).send({ from: _owner, gas: 1500000 })
                .then(function(receipt) {
                    console.log(receipt);
                    callback(receipt);
                });
        } else if (_type == tokenType[1]) {
            contractTooLongData.methods.create(_amount).send({ from: _owner, gas: 1500000 })
                .then(function(receipt) {
                    console.log(receipt);
                    callback(receipt);
                });
        }

    },

    transferToken: function(tokenId, _from, _to) {

    },

    getAllTokensByOwner: function(_owner, callback) {
        contractTooLongData.methods.getAllTokens(_owner).call({ from: _owner })
            .then(function(result) {
                var tokenInfoList = [];
                var tokenTooLongInfo = JSON.parse(JSON.stringify(result));
                var info1 = {
                    "TokenName": tokenTooLongInfo["0"],
                    "TokenSymbol": tokenTooLongInfo["1"],
                    "TokenIds": tokenTooLongInfo["2"]
                };
                tokenInfoList.push(info1);

                contractEtenData.methods.getAllTokens(_owner).call({ from: _owner })
                    .then(function(result) {
                        var tokenEtenInfo = JSON.parse(JSON.stringify(result));

                        var info2 = {
                            "TokenName": tokenEtenInfo["0"],
                            "TokenSymbol": tokenEtenInfo["1"],
                            "TokenIds": tokenEtenInfo["2"]
                        };
                        tokenInfoList.push(info2);

                        callback(tokenInfoList);
                    });
            });
    },

    getTotalSupplyToken: function(_owner) {
        contractData.methods.totalSupply().call({ from: _owner }, function(error, result) {
            if (!error) {
                console.log(result);
            }
        });
    },

    getTokenName: function() {
        contractData.methods.name().call(function(error, result) {
            if (!error) {
                console.log(result);
            }
        });
    },

    getSymbol: function() {
        contractData.methods.symbol().call(function(error, result) {
            if (!error) {
                console.log(result);
            }
        });
    }
};