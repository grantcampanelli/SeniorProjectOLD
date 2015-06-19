/** @author Michael Murphy */
var mongoose = require('mongoose');
var userFields = require('./user-fields');
var _ = require('underscore');
var sha = require.main.require('./app/util').hashPasswordString;

var schema = mongoose.Schema(userFields, {save: {w:1}});
schema.set('autoIndex', true);

schema.statics.findLogin = function findLogin(user, pass) {
   return this.findOne({username: user, password: sha(pass)});
};

schema.statics.getRestOptions = function getRestOptions() {
   return {
      idProperty: "username"
   };
};

module.exports = mongoose.model('User', schema);