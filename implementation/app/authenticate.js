/**
@author Michael Murphy
*/

var app = require('express')();
var passport = require('passport');
var LoginStrategy = require('passport-local').Strategy;
var Users = require.main.require('./model/admin/user');
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

var router = require('express').Router();

router.post('/login', function(req, res, next) {
   passport.authenticate('local', function(err, user) {
      if (err)
         return next(err);
      if (!user) {
         return res.json({
            login: false,
            message: "Invalid Username or Password."
         });
      }
      req.logIn(user, function(err) {
         if (err) {
            return next(err);
         }
         return res.json({
            login: true,
            user: user
         });
      });
   })(req, res, next);
});

router.get('/logout', function(req, res) {
   req.logout();
   res.json({});
});

passport.serializeUser(function (user, done) {
   done(null, user.username);
});

passport.deserializeUser(function(user, done) {
   co(function *() {
      try {
         var result = yield Users.findOne({username: user}).exec();
         console.log(result);
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

exports.routes = router;
exports.requireLogin = requireLogin;

