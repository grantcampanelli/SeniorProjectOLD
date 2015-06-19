/** @author Michael Murphy */
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
console.time("Angoose ready");
require('./database');
var http = require('http');
var express = require('express');
var logger = require('morgan');
var sessionLoader = require('./session');
var bodyParser = require('body-parser');
var passport = require('passport');
var error = require('./errors');
var events = require('events');
var config = require('./config').http;
var headers = require('./http-headers');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var methodOverride = require('method-override');

var app = express();
var server = false;
app.set('trust proxy', 'loopback');

app.use(logger('dev'));
app.use(headers);
app.use('/', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(sessionLoader);
app.use(passport.initialize(), passport.session());
app.use(expressLayouts);

app.ready = function() {
   if (!server) {
      server = true;
      setImmediate(function() {
         app.use(error["404"])
         app.use(error["500"]);
         console.timeEnd("Routes ready");
         if (process.env.PORT && process.env.IP) {
            server = http.createServer(app).listen(process.env.PORT, process.env.IP);
         }
         else {
            server = http.createServer(app).listen(config.port);
         }
         console.timeEnd("Application ready");
      });
   }
}

module.exports = app;
