var fs = require('fs');
var jsonFile = "./NonfungibleToken.json";

var Web3 = require("web3");
var web3 = new Web3();

var parsed = JSON.parse(fs.readFileSync(jsonFile));
var abi = parsed.abi;
web3.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var contractTooLongData = new web3.eth.Contract(abi, '0xc2db1b338b243d1c4a878132cc6554d6e8824fef');
var contractEtenData = new web3.eth.Contract(abi, '0xb83f81dd6f2dedf508db74d26a618502e076b1c3');
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

        contractTooLongData.methods.transfer(_to, tokenId)
            .call({ from: '0x7EE785289153fe9720e2aC7CD641b6C6E75E44da', gas: 1500000 })
            .then(function(receipt) {
                console.log(receipt);
            });

        // contractEtenData.methods.transferFrom('0x7EE785289153fe9720e2aC7CD641b6C6E75E44da', '0xcd1859780ea0e380312cFf51D34d8316983A6866', 2018071201)
        //     .send({ from: '0x7EE785289153fe9720e2aC7CD641b6C6E75E44da', gas: 1500000 })
        //     .then(function(receipt) {
        //         console.log(receipt);
        //     });

        // contractEtenData.methods.transfer('0x4d5c5Fac5dD3812df35d82178F7619F61f051E20', 6054213604)
        //     .send({ from: '0x7EE785289153fe9720e2aC7CD641b6C6E75E44da', gas: 1500000 })
        //     .then(function(receipt) {
        //         console.log(receipt);
        //     });
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
    },

    getTokenIndexById: function(tokenId) {
        contractTooLongData.methods.getIndexByTokenId(tokenId).call(function(error, result) {
            if (!error) {
                console.log(result);
            }
        });
    },

    getLastTokenIndex: function(_owner) {
        contractTooLongData.methods.getLastOneTokenIndex(_owner).call(function(error, result) {
            if (!error) {
                console.log(result);
            } else {
                console.log(error);
            }
        });
    },

    getLastTokenId: function(_owner) {
        // contractTooLongData.methods.getLastTokenId(_owner).call(function(error, result) {
        //     if (!error) {
        //         console.log(result);
        //     } else {
        //         console.log(error);
        //     }
        // });

        contractTooLongData.methods.getLastTokenId(_owner).call({ from: _owner })
            .then(function(result) {
                console.log(result)
            });
    }
};