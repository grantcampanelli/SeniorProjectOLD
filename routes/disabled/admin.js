/**
@author Michael Murphy
*/
var model = require.main.require('./model');
var admin = require('express')();

admin.on('mount', function(parent) {
   console.log('Admin Mounted');
});

require.main.require('./app').once('database', function(){

});



admin.get('/', function(req, res) {
   res.render('admin');
});

exports.router = admin;
