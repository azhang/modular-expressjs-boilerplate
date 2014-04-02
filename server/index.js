/**
 * Bootstrap the Nodejs app
 */

 // Set NODE_ENV if not set in order to load correct config
 var env = process.env.NODE_ENV = process.env.NODE_ENV || "development";

 /**
  * Module dependencies.
  */
require("colors");
var socketio = require("socket.io")
  , registerModules = require("./utilities/registerModules");

// Load Express config
var app = require("./config/express");

// Attach EventEmitter
var util = require('util');
var EventEmitter = require('events').EventEmitter;
util.inherits(app, EventEmitter);

// Start app server
var server = app.listen(app.get('port'), function(){
  console.log("Express server listening on port %d in %s mode".bold, app.get('port'), app.get('env'));
});

// Start Socket.io server
// TODO: consider changing to app.set("io", socketio.listen(server));
app.io = socketio.listen(server);

// Load app modules
registerModules(app, [
  'root'
]);

// Load Passport config
// require("./config/passport");

module.exports = app;