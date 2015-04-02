var events = require("events");
var mongo = require('mongodb');
var config = require('./config');
var assert = require('assert');

var EventEmitter = events.EventEmitter;
module.exports = new EventEmitter();


mongo.MongoClient.connect(config.db.url, function (err, database) {
   if (err !== null) {
      global.db = require('./embedded-database.js');
   }
   else {
      global.db = database;
   }
   DatabaseHelpers.call(global.db);
   module.exports.emit('ready');
});

function DatabaseHelpers() {
   var _that = this;
   this.createId = function(hexStr) {
      return mongo.ObjectID.createFromHexString(hexStr);
   };
   this.findById = function(type, mongoId, cb) {
      global.db.collection(type).find({ "_id": mongoId }, {}).toArray(function(err, result){
         if (err)
            cb(err, null);
         else if (result.length > 0)
            cb(null, result[0]);
         else
            cb(null, false);
      });
   };
}

function CollectionHelpers() {
   var _that = this;
   this.findId = function(hexStr, cb) {
      this.find({ "_id": mongo.ObjectID.createFromHexString(hexStr) }, {}).toArray(function(err, result){
         if (err)
            cb(err, null);
         else if (result.length > 0)
            cb(null, result[0]);
         else
            cb(null, false);
      });
   }

   this.findAll = function(){
      this.find({}, {}).toArray(function(err, result){
      if (err)
         cb(err, null);
      else if (result.length > 0)
         cb(null, result);
      else
         cb(null, false);
   })};
}