var util = require('util');
var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var contractProxy = require('./ContractProxy');
var render = require('./server-render');
var routes = require('./router');
var model = require('./models/ContractSchemaModel');
var Dates = require('date-math');

app.use(express.static('public'));
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

app.get('/index.html', function(req, res) {
    res.sendFile(__dirname + "/" + index.html);
});

app.get('/deploy', function(req, res) {
    res.send(render.deployContract());
})

var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;

    console.log("App now running on port: ", port);
});