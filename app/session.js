/**
@author Michael Murphy
*/
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var config = require('./config');
var util = require('./util');
var verboseLog = util.verboseLog;
var session = require('express-session');
var SessionStore = null;
var storageOptions = null;
if (process.argv.indexOf("--mongo") == -1) {
   verboseLog('Using files for session storage.');
   SessionStore = require('session-file-store')(session);
   var absPath = path.resolve(config.session.path);
   if (config.createMissingDirectories && !fs.existsSync(absPath)) {
      console.warn("Creating directory for session files: \"" + absPath + "\"");
      util.makeDirectoryPlusParents(absPath);
   }
   storageOptions = {path: absPath};
}
else {
   verboseLog('Using MongoDB for session storage.');
   SessionStore  = require('connect-mongo')(session);
   storageOptions = config.session.mongoSettings;
}

function generateSecret(){
   var buf = crypto.randomBytes(256);
   var hash = crypto.createHash('sha256');
   hash.update(buf);
   return hash.digest('base64');
}



var secret = config.session.secret;
if (secret == null) {
   secret = generateSecret();
}

module.exports = session({
   store: new SessionStore(storageOptions),
   secret: secret,
   resave: false,
   saveUninitialized: false,
   name: 'sid'
});


