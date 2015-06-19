/** @author Michael Murphy */
var mongoose = require('mongoose')

var Assignment = mongoose.Schema({
   dueDate: Date,
   name: String,
   rawPoints: {
      type: Number,
      min: 0,
      required: true,
      default: 100
   },
   weight: {
      type: Number,
      min: 0,
      max: 1,
      default: 1
   },
   course: {
      type: String,
      index: true
   }
},{ _id : true, save: {w:1}});
Assignment.set('autoIndex', true);
Assignment.set('strict', false);
Assignment.statics.getRestOptions = function() {
   return {
      lowercase: true,
      name: 'assignments',
   };
};
module.exports = mongoose.model('Assignment', Assignment);