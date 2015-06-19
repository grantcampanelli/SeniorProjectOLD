/** @author Michael Murphy */

module.exports = function(req, res, next) {
   res.setHeader('X-Powered-By', 'Team Node');
   next();
}

