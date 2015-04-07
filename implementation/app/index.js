/**
 * Initializes the application and exports an emitter. Users of this module can
 * listen on the following events:
 * <ul>
 *    <li>
 *       'database' triggered when the database is ready.
 *          functions get called with the db object and no other arguments.
 *    </li>
 *    <li>'routers' triggered when the application routers should be setup</li>
 *    <li>'ready' triggered after everything in this module is initialized.</li>
 * </ul>
 * @type {exports is an emitter.}
 */
console.time("Application ready");
console.time("Routes ready");
require('./harmony');
require('./database');
var http = require('http');
var express = require('express');
var logger = require('morgan');
var sessionLoader = require('./session');
var bodyParser = require('body-parser');
var passport = require('passport');
var error = require('./errors');
var events = require('events');
var config = require('./config');
var auth = require('./authenticate');
var expressLayouts = require('express-ejs-layouts')

var app = express();
var server = false;
app.set('trust proxy', 'loopback');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use('/', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(sessionLoader);
app.use(passport.initialize(), passport.session());
app.use(expressLayouts);
app.use("/", auth.routes);

app.ready = function() {
   if (!server) {
      server = true;
      setImmediate(function() {
         app.use(error["404"])
         app.use(error["500"]);
         console.timeEnd("Routes ready");
         server = http.createServer(app).listen(config.http.port);
         console.timeEnd("Application ready");
      });
   }
}

module.exports = app;
