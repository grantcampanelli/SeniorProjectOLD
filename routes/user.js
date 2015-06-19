/** @author Michael Murphy */
var router = require('express').Router();
var co = require('co');
var mongoose = require('mongoose');
var Course = require.main.require('./model/course');
var Users = require.main.require('./model/admin/user');
var errorResponse = require.main.require('./app/errors')["500"];
var _ = require('underscore');

router.get('/Users/:username/courses', function(req, res, next) {
   co(function *() {
      try {
         var user = yield Users.findOne({username: req.params.username}).exec();
         if (!user) {
            res.status(404).end();
         }
         var data = yield Course.find({'roles.users':  user}).exec();
         res.json(data);
      }
      catch(err) {
         errorResponse(err, req, res, next);
      }
   });
});

module.exports = router;