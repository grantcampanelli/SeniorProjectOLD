/**
@author Michael Murphy
*/
console.time("Database ready");
var _ = require('underscore');
var config = require('./config');
var util = require('./util');
var verboseLog = util.verboseLog;
var isEmbedded = process.argv.indexOf("--mongo") == -1;
if (isEmbedded) {
   verboseLog("Using an embedded database.");
   require('tungus');
   // Tungus uses this object to define the TingoDB configuration options.
   global.TUNGUS_DB_OPTIONS = {
      memStore: config.db.memStore,
      searchInArray: true,
      nativeObjectID: false
   };
}
var mongoose = require('mongoose');
var fs = require('fs');

try {
   if (!isEmbedded) {
      verboseLog("Using MongoDB for database.");
      mongoose.connect(config.db.mongoUrl);
   }
   else {
      var absPath = setupDatabaseDirectory();
      mongoose.connect('tingodb://'.concat(absPath));
   }

   mongoose.connection.on('error', onError);
   mongoose.connection.once('open', function() {
      console.timeEnd("Database ready");
   });
}
catch(e) {
   onError(e);
}


module.exports = mongoose;

/**
 * If the database directory doesn't exist and the flag to create missing
 * directories is on, then this function creates the database directory.
 */
function setupDatabaseDirectory() {
   var fs = require('fs');
   var path = require('path');
   var util = require('./util');

   var absPath = path.resolve(config.db.path);
   if (!config.db.memStore && !fs.existsSync(absPath)) {
      if (config.createMissingDirectories) {
         console.warn("Creating directory for database files: \"" + absPath + "\"");
         util.makeDirectoryPlusParents(absPath);
      }
      else {
         throw absPath;
      }
   }

   return absPath;
}

function onError(absPath) {
   throw new Error("Could not setup " + (isEmbedded ? "an embedded database in directory " + absPath : "a MongoDB connection to " + config.db.mongoUrl));
}