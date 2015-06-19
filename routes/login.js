/** @author Michael Murphy */
var router = require('express').Router();
var auth = require.main.require('./app/authenticate');

router.post('/login', auth.loginHttpHandler);
router.get('/logout', auth.logoutHttpHandler);

module.exports = router;
