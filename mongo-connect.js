var express = require('express');
var app = express();
var mongoose = require('mongoose');
var config = require('config');

if (app.get('env') == "production") {
    console.log("env is prod");
    mongoose.connect(config.get('production.DBConfig.Host'), { useNewUrlParser: true });
} else if (app.get('env') == "development") {
    console.log('env is dev');
    mongoose.connect(config.get('development.DBConfig.Host'), { useNewUrlParser: true });
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('we are connected!');
});

module.exports = mongoose;