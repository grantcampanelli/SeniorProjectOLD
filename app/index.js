var config = require("./config");

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var passport = require('passport');


var http = require('http');
var assert = require('assert');
var socketIo = require('socket.io');

var events = require("events");
var EventEmitter = events.EventEmitter;
module.exports = new EventEmitter();

var app = express();
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./database').on('ready', function() {
   var session = require('express-session');
   var MongoStore = require('connect-mongo')(session);
   var auth = require('./auth');


   app.use(session({
      store: new MongoStore({ db: db }),
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false
   }));
   app.use(passport.initialize());
   app.use(passport.session());
   app.use(express.static('public'));
   module.exports.emit('routers');
   var error = require('./errors');
   app.use(error.error404);
   app.use(error.errorHandler);

   passport.use(auth.localFactory());
   passport.serializeUser(serializeUser);
   passport.deserializeUser(deserializeUser);

   global.server = http.createServer(app).listen(config.http.port);
   module.exports.emit('ready');
})

global.config = config;
global.app = app;

function serializeUser(user, done) {
   done(null, user._id);
}

function deserializeUser(id, done) {
   db.collection('users').find({_id: id }).toArray(function(err, user) {
      done(err, user);
   });
}