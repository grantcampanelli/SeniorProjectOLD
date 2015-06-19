/** @author Michael Murphy */
var _ = require('underscore');
var mongoose = require('mongoose');
var userFields = require.main.require('./model/admin/user-fields');
var config = require.main.require('./app/config');
var mimeType = require('mime');

var assignmentSubmissionSchema = mongoose.Schema({
   user: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   data: {
      type: Buffer,
      select: false,
      required: true
   },
   timestamp: {
      type: Date,
      default: function() {
         return new Date();
      },
      required: true
   },
   mime: {
      type: String
   },
   filename: {
      type: String,
      maxlength: 255,
      trim: true
   }
}, {capped: config.maxAllowedFileSubmissionData, save: {w: 1}});

assignmentSubmissionSchema.pre('save', function lookupMimeType(next) {
   if (!this.mime) {
      this.mime = mimeType.lookup(this.filename);
   }
   return next();
});

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);