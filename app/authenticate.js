/**
@author Michael Murphy
*/

var passport = require('passport');
var LoginStrategy = require('passport-local').Strategy;
var Users = require.main.require('./model/admin/user');
var verboseLog = require('./util').verboseLog;
var co = require('co');

function requireLogin(req, res, next) {
   if (req.isAuthenticated()){
      return next();
   }
   else {
      res.sendStatus(401);
      res.json({
         error: "nologin",
         login: false
      });
   }
}

function loginHttpHandler(req, res, next) {
   passport.authenticate('local', function(err, user) {
      if (err)
         return next(err);
      if (!user) {
         return res.json({
            logout: true,
            login: false,
            message: "Invalid Username or Password.",
            user: null
         });
      }
      req.logIn(user, function(err) {
         if (err) {
            return next(err);
         }
         return res.json({
            logout: false,
            login: true,
            message: '',
            user: user
         });
      });
   })(req, res, next);
}

function logoutHttpHandler(req, res) {
   req.logout();
   req.session.destroy(function(err) {
      res.json({logout: true, login: false, message: '', user: null});
   })
}

passport.serializeUser(function (user, done) {
   done(null, user.username);
});

passport.deserializeUser(function(user, done) {
   co(function *() {
      try {
         verboseLog("Checking database for passport session");
         var result = yield Users.findOne({username: user}).exec();
         verboseLog("Found passport session: " + result);
         done(null, result);
      }
      catch (err) {
         done(err);
      }
   })
});

passport.use(new LoginStrategy(function(user, pass, done) {
   co(function *() {
      var query = Users.findLogin(user, pass);
      try {
         var result = yield query.exec();
         done(null, result);
      }
      catch (err) {
         console.log(err)
         console.log(err.stack)
         done(err);
      }
   }).catch(function(e){
      console.log(e);
   })
}));

exports.loginHttpHandler = loginHttpHandler;
exports.logoutHttpHandler = logoutHttpHandler;
exports.requireLogin = requireLogin;

