/**
@author Michael Murphy
*/
module.exports = function() {
   var router = require('express').Router();
   var passport = require('passport');

   router.get('/:username', function (req, res) {
      console.log(req.params.id);
      db.users.find({username: req.params.username}, function (err, user) {
         console.log(user);
         res.render('user', {user: user});
      })

   });

   return router;
}