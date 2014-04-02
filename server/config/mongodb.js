/*
 * MongoDB Configuration
 */

var mongoose = require('mongoose')
  , config = require("./config");

var options = {
  server: {}
};
options.server.socketOptions = { keepAlive: 1 };
var db = mongoose.connect(config.db, options);

var db_connection = mongoose.connection;
db_connection.on('error', console.error.bind(console, 'connection error:'));
db_connection.once('open', function callback () {
  console.log("Mongodb connection successful".green);
});

module.exports = db;