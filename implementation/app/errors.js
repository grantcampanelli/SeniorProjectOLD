/**
@author Michael Murphy
*/
var config = require("./config");

function handle404(req, res, next){
   var err = new Error();
   err.status = 404;
   err.name = "Not Found";
   err.message = "We couldn't find the page you requested.";
   res.status(404);
   next(err);
}

function devHandler(err, req, res, next) {
   var arr = err.stack.split('\n').map(function(e) {
      return e.replace(process.cwd(), '').replace(/\(/g, '<span class="file">').replace(/\)/g, '</span>')
   });
   var errData = {
      name: err.name,
      message: err.message,

      stack: arr.join('\n')
   }
   res.status(err.status || 500);
   res.json(errData);
}

function prodHandler(err, req, res, next) {
   res.status(err.status || 500);
   res.json({
      error: {
         name: err.name,
         message: err.message
      }
   });
}

module.exports = {
   "404": handle404,
   "500": config.showVerboseErrors ? devHandler :  prodHandler
};
