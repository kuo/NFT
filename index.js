var express = require('express');
var app = express();
var contractProxy = require('./ContractProxy');

function createToken() {
    //contractProxy.createTokenWithTotalSupply(3, '0x1F09a3649996AF8a277FF39613ffcF36b324b789');
    contractProxy.createTokenWithTotalSupply("eten", "0x1F09a3649996AF8a277FF39613ffcF36b324b789", 3, function(callback) {

    });
}



app.use(express.static('public'));
app.use(require('body-parser')());
app.get('/index.html', function(req, res) {
    res.sendFile(__dirname + "/" + index.html);
});

app.post('/', function(req, res) {
    contractProxy.createTokenWithTotalSupply(req.body.tokenType, req.body.tokenOwnerAddress,
        req.body.tokenAmount,
        function(callback) {
            res.send(callback);
        });
});

app.post('/checkToken', function(req, res) {
    contractProxy.getAllTokensByOwner(req.body.tokenOwnerAddress, function(callback) {
        console.log("checkToken = " + res.json(callback));
    });
});

app.post('/transferToken', function(req, res) {
    console.log("trans to =" + req.body.destinationAddress + " tokenID = " + req.body.tokenID);
    //contractProxy.transferToken(req.body.tokenID, '', req.body.destinationAddress);

    //contractProxy.getLastTokenId(req.body.destinationAddress);
    //contractProxy.getLastTokenIndex(req.body.destinationAddress);

    contractProxy.transferTokenTo(req.body.destinationAddress, req.body.tokenID);
});

var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;

    console.log("App now running on port: ", port);
});