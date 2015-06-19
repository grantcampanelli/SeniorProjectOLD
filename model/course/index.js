/** @author Michael Murphy */

var mongoose = require('mongoose');
var schema = require('../admin/role-manager');
var _ = require('underscore');
var gradeShema = require('./grade-schema');
var studentRecord = require('./student');
var COURSE_ABBREVIATION = require('./abbreviations');
var TERMS = ['Winter', 'Spring', 'Summer', 'Fall'];
var co = require('co');
var Category = require('./assignment/category');
var TermToMonth = [
   {'Winter': [12, 1, 2]},
   {'Spring': [3,4,5]},
   {'Summer': [6,7,8]},
   {'Fall': [9,10,11]}
];

schema.add({
   classNumber: {
      type: String,
      match: /[1-5]\d{2}/
   },
   classCode: {
      type: String,
      enum: COURSE_ABBREVIATION
   },
   section: {
      type: String,
      match: /\d+/
   },
   start: Date,
   end: Date,
   year: {
      type: String,
      required: true,
      "default": function(){
         return (new Date()).getFullYear().toString();
      },
      match: /\d{4}/
   },
   term: {
      type: String,
      enum: TERMS,
      required: true,
      "default": getTermByMonth
   },
   colloquialUrl: {
      type: String,
      index: {
         unique: true
      },
      required: true,
      select: true,
      match: /[A-Z][-A-Z0-9]*/
   },
   //categories: [Category],
   //students: [studentRecord]
   //students: []
});
schema.add(gradeShema.letterGrade);
schema.add(gradeShema.creditNoCredit);
schema.index({colloquialUrl: 1, term: 1, year: -1});

schema.set('autoIndex', false);
schema.set('toJSON', { virtuals: true })
schema.pre('save', gradeShema.preSave);

schema.statics.getTermByMonth = getTermByMonth;

function getTermByMonth(month) {
   var m = month || (new Date()).getMonth() + 1;
   var result = TermToMonth.filter(function(e) {
      return _.values(e)[0].indexOf(m) != -1;
   }).map(function(val){
      return _.keys(val)[0];
   });
   return result[0];
};

schema.statics.getRestOptions = function getRestOptions() {
   return {
      idProperty: "colloquialUrl"
   };
};

module.exports = mongoose.model('Course', schema);