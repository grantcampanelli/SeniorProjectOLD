/**
@author Michael Murphy
*/
var crypto = require('crypto');
var path = require('path');
var fs = require('fs');
var config = require('./config');
var MissingPathRootError = Error;
var CannotMakeDirectoryError = Error;

exports.randomString = function randomString(alphabet, len) {
   var result = "";
   while (len--) {
      result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
   }
   return result;
};

exports.hashPasswordString = function(str) {
   var hash = crypto.createHash('sha256');
   hash.update(new Buffer(str.toString()));
   return hash.digest('hex');
};

exports.makeDirectoryPlusParents = function makeDirectoryPlusParents(somePath) {
   var absPath = path.resolve(somePath);
   if (!fs.existsSync(absPath)) {
      try {
         make(absPath);
      }
      catch (err) {
         if (err.rootMissing) {
            throw new MissingPathRootError(err.rootMissing);
         }
         else if (err.mkdirError) {
            throw new CannotMakeDirectoryError(err.mkdirError);
         }
         throw err;
      }
   }

   function make(dir) {
      try {
         if (!fs.existsSync(dir)) {
            var parentDir = path.dirname(dir);
            if (parentDir !== dir) {
               make(parentDir);
            }
            else {
               throw {"rootMissing": rootMissingMessage(absPath, parentDir)};
            }
            exports.verboseLog('\tmkdir', dir);
            fs.mkdirSync(dir);
         }
      }
      catch (err) {
         if (!err.rootMissing) {
            throw {"mkdirError": cannotMakeDirectoryMessage(err)};
         }
         else {
            throw err;
         }
      }
   }

   function rootMissingMessage(absPath, pathRoot) {
      return [
         "Cannot create '",
         absPath,
         "' because the path root '",
         pathRoot,
         "' doesn't exists."
      ].join('');
   }

   function cannotMakeDirectoryMessage(err) {
      return err.toString().replace('Error: ', '');
   }
};

exports.strcmp = function(a, b) {
   return a.localeCompare(b);
};

exports.strcmpIgnoreCase = function(a, b) {
   return exports.strcmp(a.toUpperCase(), b.toUpperCase());
};

exports.verboseLog = (function() {
   if (config.verboseLog) {
      return console.log.bind(console);
   }
   else {
      return function(){};
   }
})();
