/** @author Michael Murphy */

var _ = require('underscore');
var userFields = require.main.require('./model/admin/user-fields');
var mongoose = require('mongoose');

function limitOne(val) {
   return val.length <= 1;
}

var studentRecordSchema = mongoose.Schema({
   user: String,
   course: String,
   comment: String,
   grades: String
}, { _id : true, strict: false });

userFields.username.required = false;
userFields.username = String;
userFields.emplId = String
studentRecordSchema.add(userFields);

studentRecordSchema.statics.getRestOptions = function getRestOptions() {
   return {};
};
module.exports = mongoose.model('Student', studentRecordSchema);