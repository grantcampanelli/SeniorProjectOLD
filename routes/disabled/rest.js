/**
@author Michael Murphy
*/
var router = require('express').Router();
var assert = require('assert');

function sendAll(db, type, res) {
   db.collection(type).find({}).toArray(function(err, data) {
      assert.equal(null, err);
      res.json(data);
   });
}

function sendOne(db, type, id, res) {
   db.collection(type).find({ "_id": id }, {}).toArray(function(err, result){
      assert.equal(null, err);
      if (result.length > 0)
         res.json(result[0]);

      res.end();
   });
}

function addRestHeaders(req, res) {
   res.setHeader('content-type', 'text/javascript');

}
var x = [
   {
      path: '/:type/:id',
      funcFactory: function(app) {
         function result(req, res) {
            addRestHeaders(req, res);
            var id = app.mkId(req.params.id);
            sendOne(app.db, req.params.type, id, res);
         }
         return result;
      }
   },
   {
      path: '/:type',
      funcFactory: function(app) {
         function result(req, res) {
            addRestHeaders(req, res);
            sendAll(app.db, req.params.type, res);
         }
         return result;
      }
   }
];
module.exports = router;