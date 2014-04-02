/**
 * Module dependencies.
 */

var express = require("express")
  , os = require("os")
  , errorHandler = require('errorhandler')
  , favicon = require('static-favicon')
  , logger = require('morgan')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
//  , db = require("./mongodb")
//  , MongoStore = require("connect-mongo")(session)
//  , passport = require("passport")
  , flash = require("connect-flash")
  , colors = require("colors")
  , config = require("./config");

var app = express();

/*
 * Environment specific configuration
 */

// Use CDN for production
var envConfig = {
  development: function() {
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
    app.locals.cdnUrl = "/assets";
  },
  test: function(){
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
    app.locals.cdnUrl = "/assets";
  },
  production: function(){
    app.use(errorHandler());
    app.locals.cdnUrl = "//cdn.domain.com";
  }
};
envConfig[process.env.NODE_ENV]();

// Configuration, Middleware
app.set('port', config.port);
app.set('views', __dirname + "/../");
app.locals.basedir = __dirname + "/../";
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/../../build/favicon.ico'));
app.use(logger({ immediate: true, format: 'dev' }));
app.use(bodyParser({
  limit: 1024 * 1024 * 10
}));
app.use(methodOverride());
app.use(cookieParser());
/*app.use(session({
  store: new MongoStore({
    db: db.connection.db,
    auto_reconnect: true
  }),
  secret: config.app.sessions_secret,
  cookie: {
    httpOnly: false
  }
}));*/
//app.use(passport.initialize());
//app.use(passport.session());
app.use(flash());

// Global view vars
app.use(function(req, res, next) {
  res.locals.appName = config.app.name;

  // TODO: move this to user module
  /*res.locals.user = req.user;
  if (req.user)
    res.locals.admin = req.user.isRole("admin") || req.user.isRole("superuser");
  */
  next();
});

var oneDay = 86400000;
app.use("/assets", express.static(__dirname + '/../../build'), {maxAge: oneDay});
app.use("/tests", express.static(__dirname + "/../../build/tests"));
app.use("/tmp", express.static(os.tmpdir()+"th/"), {maxAge: oneDay});

module.exports = app;
