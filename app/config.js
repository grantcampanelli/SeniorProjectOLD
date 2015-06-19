/**
 * App configuration settings
 * @author Michael Murphy
 */

/* HTTP SETTINGS */
exports.http = {};

/* Testing change and rerunning server*/

/**
 * The server port to listen on.
 */
 exports.http.port = 8082;

/**
 * Creates missing directories.
 *
 * The database and session modules need directories to store their files in.
 * Set this option to true to have the app create these directories plus any
 * parent directories if they don't exist.
 */
exports.createMissingDirectories = true;

/* DEBUG SETTINGS */
/**
 * If <code>true</code> then errors caused during an HTTP request result in a
 * detailed error response. If false then a generic HTTP error response is used.
 */
exports.showVerboseErrors = true;

/**
 * If true then the <code>verboseLog</code> function in app/util.js is bound to
 * <code>console.log</code>. If false then <code>verboseLog</code> is bound to
 * a function that does nothing.
 */
exports.verboseLog = false;

/* DATABASE SETTINGS */
exports.db = {};

/**
 * Deletes all model documents from the database on startup.
 * Use with care!
 */
exports.db.clearOnStartup = true;

/**
 * Will create mock model documents on startup.
 */
exports.db.generateMockData = true;

/* if embedded database then these settings */
/**
 * Use in memory database only.
 * When this is true the <code>exports.db.path</code> value is ignored.
 */
exports.db.memStore = false;

/**
 * The directory where the database files will be stored. This path may be
 * absolute or its assumed relative to the working directory.
 */
exports.db.path = "data/documents";

/* if mongo database then these settings */
exports.db.mongoUrl = 'mongodb://127.0.0.1/seniorproject'

/* SESSION STORAGE SETTINGS */
exports.session = {};
/* if session data is saved in files */
/**
 * The directory where the session files will be stored. This path may be
 * absolute or its assumed relative to the working directory.
 */
exports.session.path = "data/sessions";

/* if session data is saved in mongo database */
exports.session.mongoSettings = {}
/**
 * connect-mongo will create a connection to this mongo database.
 * @type {string}
 */
exports.session.mongoSettings.url = exports.db.mongoUrl;

/**
 * When the session cookie has an expiration date, connect-mongo will use it.
 * Otherwise, it will create a new one, using ttl option.
 * The default value is 14 days.
 * @type {number}
 */
exports.session.mongoSettings.ttl = 3 * 24 * 60 * 60; // = 3 days.

/**
 * The server uses this string to sign the session ID cookie. When this
 * variable is null, a random secret is generated.
 *
 * The express-session readme explains:
 *
 * This can be either a string for a single secret, or an array of multiple
 * secrets. If an array of secrets is provided, only the first element will be
 * used to sign the session ID cookie, while all the elements will be
 * considered when verifying the signature in requests.
 *
 */
exports.session.secret = null;

/**
 * The maximum number of bytes to allow for all file submissions.
 * @type {number}
 */
exports.maxAllowedFileSubmissionData = 256*Math.pow(2,20); // 256 MB
