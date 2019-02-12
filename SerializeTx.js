var EthereumTx = require('ethereumjs-tx');
var Web3 = require("web3");
var web3 = new Web3();
var config = require('./config');
var privateKey = new Buffer(config.gashPrivateKey, 'hex');

class BaseSerializeTx {
    constructor(chainId, nonce, gasPrice, gasLimit, data) {
        this._chainId = chainId;
        this._nonce = nonce;
        this._gasPrice = gasPrice;
        this._gasLimit = gasLimit;
        this._data = data;
    }

    getTx() {
        //打包交易資料
        var tx = new EthereumTx({
            chainId: this._chainId,
            nonce: web3.utils.toHex(this._nonce),
            gasPrice: this._gasPrice,
            gasLimit: this._gasLimit,
            data: this._data
        });

        tx.sign(privateKey);
        var serializedTx = tx.serialize();

        return serializedTx;
    }
}

class TransSerializeTx extends BaseSerializeTx {
    constructor(chainId, data, nonce, gasPrice, gasLimit, to) {
        super(chainId, nonce, gasPrice, gasLimit, data)
        this._to = to;
    }

    getTx() {
        var tx = new EthereumTx({
            chainId: this._chainId,
            nonce: web3.utils.toHex(this._nonce),
            gasPrice: this._gasPrice,
            gasLimit: this._gasLimit,
            data: this._data,
            to: this._to
        });

        tx.sign(privateKey);
        var serializedTx = tx.serialize();

        return serializedTx;
    }
}

module.exports = {
    BaseSerializeTx,
    TransSerializeTx
};