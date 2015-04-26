/** @author Michael Murphy */

var mongoose = require('mongoose');
var schema = require('../admin/role-manager');

schema.add({
   classCode: String,
   classNumber: {
      type: String,
      match: /\d{3}/
   }
})

schema.set('autoIndex', false);;

module.exports = mongoose.model('Course', schema);