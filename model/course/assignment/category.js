/** @author Michael Murphy */
var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
   name: {
      type: String,
      trim: true
   },
   weight: {
      type: Number,
      min: 0,
      max: 1,
      default: 1
   },
   path: {
      type:  String,
      select: true
   },
   assignments: String,
   course: String
},{ _id : true, save: {w:1}});
categorySchema.set('autoIndex', true);
categorySchema.set('strict', false);

categorySchema.statics.getRestOptions = function() {
   return {};
};
module.exports = mongoose.model('Category', categorySchema);